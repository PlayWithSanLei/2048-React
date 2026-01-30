# 2048 Candy Edition 🍬

一款基于 **React 18** 和 **TypeScript** 重构的现代化 2048 游戏。本项目专注于极致的交互体验、丝滑的动画效果以及清新的“糖果色”视觉风格。

## ✨ 核心特性

-   **丝滑流畅的动画**：完全由 CSS `transform` 驱动的位移与合并动画，拒绝卡顿。
-   **清新糖果 UI**：默认采用低饱和度的糖果配色，护眼且美观。
-   **多主题切换**：内置“糖果(Candy)”与“薄荷(Mint)”双主题，支持一键热切换。
-   **全端适配**：完美支持桌面端键盘操作（方向键）与移动端手势滑动（Touch）。
-   **数据持久化**：自动保存游戏进度、最高分及主题设置，刷新不丢失。

## 🛠 技术栈

-   **核心框架**: React 18, TypeScript
-   **构建工具**: Vite
-   **样式方案**: CSS Modules + CSS Variables (Theming)
-   **手势库**: @use-gesture/react
-   **辅助库**: uuid (唯一标识生成), classnames (样式合并)

---

## 📂 目录结构与模块说明

项目源码位于 `src/` 目录下，采用功能模块化的组织方式。

### 1. 组件模块 (`src/components/`)

UI 展示层，负责界面渲染与交互响应。

-   **Board/** (`Board.tsx`)
    -   **功能**: 游戏的主棋盘容器。
    -   **职责**:
        -   渲染 4x4 的背景网格。
        -   作为手势监听的挂载点（集成 `@use-gesture/react`），处理用户的滑动操作。
        -   监听键盘事件（ArrowUp, ArrowDown 等）。
        -   通过绝对定位渲染所有的 `Tile` 组件。
-   **Tile/** (`Tile.tsx`)
    -   **功能**: 独立的数字方块。
    -   **职责**:
        -   根据 `position` (x, y) 动态计算 CSS `transform` 坐标，实现平滑移动。
        -   根据数值渲染不同的背景色与文字颜色。
        -   处理“新生成(Pop)”与“合并(Merge)”的 CSS 动画效果。
-   **ScorePanel/** (`ScorePanel.tsx`)
    -   **功能**: 顶部仪表盘。
    -   **职责**:
        -   展示当前分数与历史最高分。
        -   实现分数增加时的 `+N` 漂浮动画。
-   **ThemeSwitcher/** (`ThemeSwitcher.tsx`)
    -   **功能**: 主题切换器。
    -   **职责**:
        -   切换全局 CSS 变量（通过修改 `html` 标签的 `data-theme` 属性）。
        -   持久化存储用户的主题偏好。

### 2. 状态管理 (`src/hooks/`)

-   **useGame.ts**
    -   **功能**: 游戏的核心状态机 Hook。
    -   **职责**:
        -   管理核心状态：`tiles` (方块列表), `score` (分数), `bestScore` (最高分), `over` (游戏结束), `won` (胜利)。
        -   提供 `moveTiles(direction)` 方法：响应用户输入，调用算法层计算下一帧状态。
        -   提供 `startNewGame()` 方法：重置游戏。
        -   负责与 `localStorage` 同步状态。

### 3. 核心逻辑 (`src/utils/`)

纯函数工具库，不依赖 React，负责具体的算法实现。

-   **gameLogic.ts**
    -   **核心算法**:
        -   `move(tiles, direction)`: 计算移动后的方块位置与合并结果。
        -   **矩阵旋转技巧**: 为了简化逻辑，无论用户向哪个方向滑动，我们都先将矩阵旋转，使其统一视为“向左移动”处理，处理完毕后再旋转回原方向。这极大地简化了合并代码的复杂度。
    -   **数据结构**: 定义了 `Tile` 接口，包含 `id` (UUID)、`position`、`value` 以及 `mergedFrom` (用于追踪合并来源，实现合并动画)。
-   **storage.ts**
    -   **功能**: `localStorage` 的封装。
    -   **职责**: 存取最高分、游戏进度快照及主题设置。

### 4. 样式系统 (`src/styles/`)

-   **themes.css**: 定义了所有的 CSS Variables（颜色、尺寸、动画曲线）。
    -   包含 `:root` (默认糖果主题) 和 `[data-theme='mint']` (薄荷主题) 的变量定义。
-   **globals.css**: 全局重置样式与基础布局。

---

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 `http://localhost:5173` 即可开始游戏。

### 构建生产版本

```bash
npm run build
```

## 🎮 操作说明

-   **桌面端**: 使用键盘 `↑` `↓` `←` `→` 方向键移动方块。
-   **移动端**: 在棋盘区域单指滑动即可。
-   **目标**: 合并相同的数字，直到拼出 **2048**！

---

## 🎨 设计细节

-   **动画策略**: 为了保证 60fps 的流畅度，所有移动动画均仅改变 `transform` 属性，避免触发浏览器的重排 (Reflow)。
-   **ID 追踪**: 每个方块生成时都会分配唯一的 UUID。React 通过 `key={tile.id}` 追踪组件，确保 DOM 节点复用，从而正确触发 CSS Transition 移动动画，而不是销毁重建。
