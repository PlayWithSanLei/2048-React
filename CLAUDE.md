# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 **React 18 + TypeScript + Vite** 构建的现代化 2048 游戏，专注于流畅的动画体验和糖果色视觉风格。

## 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器 (http://localhost:5173)

# 构建
npm run build        # TypeScript 编译 + Vite 生产构建
npm run preview      # 预览生产构建

# 代码检查
npm run lint         # ESLint 检查
```

## 核心架构

### 架构分层

```
src/
├── components/      # UI 组件层（无状态或轻状态）
├── hooks/           # 状态管理层（React Hooks）
├── utils/           # 纯函数逻辑层（游戏算法、存储）
└── styles/          # CSS 主题与全局样式
```

### 关键设计模式

**1. UUID 追踪 + 位置驱动的动画系统**

- 每个 Tile 都有唯一的 `id` (UUID)，React 通过 `key={tile.id}` 追踪组件生命周期
- 方块渲染不基于网格位置，而是直接遍历 `tiles` 数组，通过 `position` 计算 CSS `transform` 坐标
- 这样 `position` 变化时，CSS transition 自动处理移动动画，无需手动 DOM 操作
- **严禁使用简单的 `number[][]` 二维数组结构**，否则无法正确追踪移动动画

**2. 矩阵旋转技巧简化移动逻辑** ([gameLogic.ts:68-86](src/utils/gameLogic.ts#L68-L86))

- 核心算法 `move(tiles, direction)` 通过矩阵旋转，将任意方向统一为"向左移动"处理
- UP: 左旋 90° → 处理 → 右旋还原
- DOWN: 右旋 90° → 处理 → 左旋还原
- RIGHT: 旋转 180° → 处理 → 旋转还原
- 这使得合并逻辑只需要写一遍（向左压缩-合并-压缩）

**3. 合并动画追踪** ([gameLogic.ts:170-175](src/utils/gameLogic.ts#L170-L175))

- 当两个方块合并时，生成的新 Tile 包含 `mergedFrom: [tile1, tile2]` 属性
- Board 组件渲染时会临时展开 `mergedFrom` 的方块，让它们滑动到合并位置
- 合并后的新方块叠加在上方，通过 CSS 动画"弹出"（pop 效果）

**4. 主题切换系统** ([styles/themes.css](src/styles/themes.css))

- 通过 CSS Variables 定义所有颜色
- 切换主题仅修改 `<html data-theme="mint">` 属性，无需重新渲染组件
- 支持热切换，无闪烁

### 数据流

```
用户输入 (键盘/手势)
    ↓
Board 组件捕获 (ArrowUp/ swipe)
    ↓
useGame.moveTiles(direction)
    ↓
gameLogic.move(tiles, direction)  # 纯函数计算
    ↓
setTiles(result.tiles)            # 更新状态
    ↓
Tile 组件根据 position 重新定位  # CSS transition 自动动画
```

### 状态管理 ([hooks/useGame.ts](src/hooks/useGame.ts))

- `useGame` 是游戏的核心状态机，管理 `tiles`, `score`, `bestScore`, `over`, `won`
- 自动同步到 localStorage
- 每次有效移动后生成新方块，检测游戏结束

### 关键类型定义 ([utils/gameLogic.ts](src/utils/gameLogic.ts#L3-L22))

```typescript
interface Tile {
  id: string;              // UUID，用于 React key 追踪
  value: number;           // 2, 4, 8, ...
  position: Position;      // {x, y} 坐标
  mergedFrom?: Tile[];     // 合并来源（动画用）
  isNew?: boolean;         // 新生成标记（弹出动画）
}

interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  over: boolean;
  won: boolean;
}
```

## 重要技术细节

### 动画性能

- **仅使用 transform** 进行位移，避免触发 Reflow
- 移动动画: `100ms ease-in-out`
- 弹出动画: `cubic-bezier(0.175, 0.885, 0.32, 1.275)` 带回弹
- 合并动画: 轻微缩放 `scale(1.2)`

### 手势处理 ([components/Board/Board.tsx](src/components/Board/Board.tsx#L16-L30))

- 使用 `@use-gesture/react` 处理触摸滑动
- `touch-action: none` 阻止页面滚动
- `threshold: 20` 像素触发阈值，避免误触

### 游戏逻辑注意事项

- 单次移动中，每个方块只能合并一次
- 新方块生成位置为 `Math.random() < 0.9 ? 2 : 4`
- 胜利条件：出现 2048 方块
- 失败条件：无空格且无可合并方块

## 添加新功能时

1. **游戏逻辑改动**: 在 [src/utils/gameLogic.ts](src/utils/gameLogic.ts) 添加纯函数
2. **UI 改动**: 在 [src/components/](src/components/) 创建组件
3. **状态管理**: 在 [src/hooks/useGame.ts](src/hooks/useGame.ts) 扩展状态
4. **样式修改**: 在 [src/styles/](src/styles/) 调整 CSS 变量或模块样式
