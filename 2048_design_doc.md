# 2048 小游戏详细设计与实施文档

## 1. 项目概述
**目标**：在当前目录下实现一款高质量 2048 小游戏，采用最新前端技术栈，视觉风格清新糖果色系，支持主题切换，操作丝滑流畅，交互友好且无割裂闪屏等问题。  
**适配**：桌面与移动端浏览器，兼容现代主流内核。

---

## 2. 设计文档

### 2.1 体验目标
- **流畅性**：滑动与按键响应 < 50ms，动画不卡顿
- **一致性**：主题切换无闪屏、无样式割裂
- **易用性**：操作直觉、提示明确、交互可预期
- **美观性**：糖果色清新、轻盈通透、层次明确

### 2.2 用户故事
- 作为玩家，我能通过键盘或手势滑动来合并方块
- 作为玩家，我能随时切换主题且界面不闪烁
- 作为玩家，我能清楚看到当前分数与最高分
- 作为玩家，我能在失败后快速重新开始游戏

### 2.3 视觉规范

#### 2.3.1 糖果主题（默认）
- 背景：极浅柔和色（如 #F9F7FF）
- 方块配色：渐变或柔和纯色（粉、蓝、薄荷、奶油黄）
- 文字色：深色灰或饱和度稍高的糖果色

#### 2.3.2 主题建议
- **清新糖果**（默认）
- **薄荷冷色**
- **暖阳果茶**

#### 2.3.3 UI 结构
- 顶部：标题 + 分数 + 最高分
- 主区：4x4 网格
- 底部：操作按钮（重新开始、主题切换）

### 2.4 交互与动效规范
- **方块移动**：平滑过渡，优先使用 `transform`
- **新方块出现**：缩放 + 透明度渐入
- **合并反馈**：轻微弹跳
- **提示弹窗**：淡入淡出，不遮挡核心视线

---

## 3. 技术选型

### 3.1 框架与构建
- **框架**：React 18
- **构建工具**：Vite
- **语言**：TypeScript

### 3.2 样式体系
- **方案**：CSS Modules + CSS Variables
- 原因：
  - CSS Variables 便于主题切换
  - CSS Modules 便于隔离与维护

### 3.3 状态与逻辑
- **状态管理**：React 内部状态 + 自定义 hooks
- **本地存储**：localStorage 用于最高分与主题偏好

### 3.4 动画技术
- 关键动画使用 CSS transitions
- 关键移动使用 `transform: translate3d` 提升性能

---

## 4. 实施细节

### 4.1 目录结构建议
```
src/
  components/
    Board/
    Tile/
    ScorePanel/
    ThemeSwitcher/
  hooks/
    useGame.ts
    useSwipe.ts
  styles/
    themes.css
    globals.css
  utils/
    gameLogic.ts
    storage.ts
```

### 4.2 组件设计

#### 4.2.1 Board
- 负责渲染 4x4 网格与方块
- 根据状态计算每个方块的位置

#### 4.2.2 Tile
- 单个方块组件
- 根据数值匹配颜色与样式
- 实现合并与出现动效

#### 4.2.3 ScorePanel
- 展示当前分数与最高分
- 分数变化时提供轻量动画

#### 4.2.4 ThemeSwitcher
- 提供主题切换按钮
- 切换后更新 CSS Variables

---

## 5. 游戏逻辑实现

### 5.1 核心数据结构
- 使用二维数组表示棋盘
- 方块为数字值
- 每次移动：
  1. 压缩（去零）
  2. 合并
  3. 再次压缩
  4. 随机生成新方块

### 5.2 合并规则
- 相同数字相邻则合并为双倍
- 单次移动中同一方块只合并一次

### 5.3 胜负判断
- **胜利**：出现 2048 方块
- **失败**：无空位且无可合并方块

---

## 6. 动效与性能优化

### 6.1 动画策略
- 使用 transform 避免布局抖动
- 合并动画与移动动画区分
- 合并后延迟渲染新方块，避免突兀

### 6.2 性能要点
- 避免频繁 DOM 重绘
- 游戏状态更新减少冗余渲染
- 使用 memo 化减少无效渲染

---

## 7. 主题系统设计

### 7.1 主题定义方式
- 采用 CSS Variables
- 主题文件 `themes.css` 统一管理颜色

### 7.2 切换流程
1. 用户点击主题按钮
2. 更新 `data-theme` 属性
3. CSS Variables 自动切换
4. localStorage 记录主题

---

## 8. 交互测试要点
- 键盘方向键是否稳定
- 触摸滑动是否识别准确
- 连续滑动是否卡顿
- 主题切换是否闪屏
- 游戏结束与重新开始是否顺畅

---

## 9. 验收标准
- 主题切换无闪屏
- 动画不卡顿
- 操作响应及时
- 胜负判定正确
- 数据持久化正常

---

## 10. 风险与解决方案
- **风险：动画卡顿**  
  解决：确保 transform 驱动、减少布局计算  
- **风险：主题切换闪屏**  
  解决：主题切换只改 CSS Variables，避免重新渲染  
- **风险：移动端触摸冲突**  
  解决：阻止默认滚动，采用统一手势识别  

---

## 11. 后续可扩展功能
- 更多棋盘尺寸（5x5、6x6）
- 成就系统
- 排行榜（需后端）

---

## 12. 实施交付物清单
- UI 设计稿与主题色板
- 游戏逻辑实现文件
- 组件结构与样式
- 性能测试报告
- 交互测试记录

---

## 13. 附录：技术实施细则（开发者必读）

此附录定义了确保“糖果色”视觉落地和“丝滑”交互体验的具体参数。

### 13.1 糖果色系色值表 (Candy Theme Palette)

请在 CSS Variables 中严格使用以下色值，避免使用默认的高饱和度颜色。

**基础环境色**
- 页面背景 (`--bg-page`): `#FFF9F9` (极淡的樱花白，比纯白更护眼)
- 棋盘背景 (`--bg-board`): `#E6D8D8` (低饱和度的灰粉色)
- 空插槽背景 (`--bg-slot`): `#F4EAEA` (比棋盘稍亮的占位色)
- 文字主色 (`--text-primary`): `#776E65` (深灰褐，柔和不刺眼)
- 文字反色 (`--text-light`): `#FFFFFF` (用于深色方块上的文字)

**方块色值 (Tile Colors)**
*采用马卡龙色系渐变，随着数字增大，颜色从暖色向冷色过渡*

| 数字 | 色值 (HEX) | 描述 | 文字颜色 |
| :--- | :--- | :--- | :--- |
| **2** | `#FFD1DC` | 淡粉红 (Cotton Candy) | #776E65 |
| **4** | `#FFDFBA` | 奶油橘 (Peach Cream) | #776E65 |
| **8** | `#FFFFBA` | 柠檬黄 (Lemon Chiffon) | #776E65 |
| **16** | `#BAFFC9` | 薄荷绿 (Minty Fresh) | #776E65 |
| **32** | `#BAE1FF` | 冰川蓝 (Ice Blue) | #776E65 |
| **64** | `#A0C4FF` | 矢车菊蓝 (Cornflower) | #FFFFFF |
| **128** | `#BDB2FF` | 香芋紫 (Lavender) | #FFFFFF |
| **256** | `#FFC6FF` | 兰花紫 (Orchid) | #FFFFFF |
| **512** | `#FF9AA2` | 鲑鱼红 (Salmon) | #FFFFFF |
| **1024** | `#FFDAC1` | 杏色 (Apricot) | #FFFFFF |
| **2048** | `#FFB7B2` | 珊瑚粉 (Coral) | #FFFFFF |

---

### 13.2 核心数据结构 (TypeScript Interface)

为解决 React 列表渲染中的动画追踪问题，**严禁**使用简单的 `number[][]` 结构。必须采用带 ID 的扁平化对象或对象数组。

```typescript
// 推荐使用一维数组 + 坐标计算，或者带 ID 的对象矩阵
// 这里推荐“对象列表”模式，最适合处理移动动画

export interface Position {
  x: number; // 列索引 (0-3)
  y: number; // 行索引 (0-3)
}

export interface Tile {
  id: string;      // 关键！使用 UUID 或递增计数器，React key 必须绑定它
  value: number;   // 2, 4, 8...
  position: Position; // 当前位置
  mergedFrom?: Tile[]; // 如果是本次合并产生的，记录来源 ID（用于渲染合并动画）
  isNew?: boolean;     // 标记是否是本轮新增（用于渲染弹出动画）
}

// 游戏状态
export interface GameState {
  tiles: Tile[];   // 所有的方块集合
  score: number;
  bestScore: number;
  over: boolean;
  won: boolean;
}
```

**动画渲染逻辑关键点：**
1. 渲染时，不要根据网格位置 `map` 渲染。
2. 而是直接遍历 `tiles` 数组渲染所有方块。
3. 每个方块的 `top/left` 样式通过 `position.x * (TILE_SIZE + GAP)` 动态计算。
4. 这样当 `position` 变化时，CSS `transition` 会自动处理移动效果，无需手动操作 DOM。

---

### 13.3 动画参数规范 (Animation Specs)

为了达到“丝滑”手感，请配置以下 CSS Transition 参数：

```css
:root {
  /* 基础尺寸 */
  --tile-size: 100px; /* 移动端需使用 rem 自适应 */
  --grid-gap: 15px;
  
  /* 动画曲线 */
  /* 移动：快速响应，带极其微小的缓动 */
  --transition-move: transform 100ms ease-in-out;
  
  /* 出现：带回弹效果 (Pop) */
  --animation-pop: pop 200ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  /* 合并：高光闪烁或轻微缩放 */
  --animation-merge: merge 150ms ease-in-out;
}

@keyframes pop {
  0% { transform: scale(0); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes merge {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); } /* 稍微放大 */
  100% { transform: scale(1); }
}
```

### 13.4 交互手势库建议

- **PC 端**：监听 `keydown` (ArrowUp, ArrowDown...)
- **移动端**：**强烈建议**使用 `react-use-gesture` 或类似库，不要自己写 `touchstart/touchend` 计算。
  - 原因：需要处理滑动阈值（避免误触）、防抖、以及阻止默认的页面滚动行为（`touch-action: none`）。
  - 参数：设置 `threshold: 20` (像素)，确保轻轻一滑就能触发，提升响应速度。

---
