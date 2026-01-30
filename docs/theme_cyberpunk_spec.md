# Cyberpunk Theme Redesign Specification

## 1. 核心视觉风格 (Visual Identity)
基于《赛博朋克 2077 (Cyberpunk 2077)》的 UI 风格，核心关键词：
*   **高对比度 (High Contrast)**: 纯黑底色搭配高饱和度霓虹色。
*   **标志性配色 (Signature Colors)**: 
    *   **Cyber Yellow**: `#FCEE0A` (主色调)
    *   **Hologram Blue**: `#00F0FF` (全息投影蓝)
    *   **Glitch Red**: `#FF003C` (错误/警告红)
*   **硬朗几何 (Hard Geometry)**: 直角、斜切角 (Chamfered corners)、网格线。
*   **故障艺术 (Glitch Art)**: 色差偏移 (Chromatic Aberration)、扫描线。

## 2. 详细配色表 (Color Palette)

| 用途 | 色值 (Hex) | 描述 |
| :--- | :--- | :--- |
| **Page Background** | `#020202` | 近乎纯黑，深邃感 |
| **Board Background** | `#1A1A1A` | 深灰，带有点阵纹理感 |
| **Slot Background** | `#0D0D0D` | 更深的槽位颜色 |
| **Text Primary** | `#FCEE0A` | 赛博黄，用于标题和重要文字 |
| **Text Secondary** | `#00F0FF` | 霓虹蓝，用于辅助信息 |
| **Border Color** | `#FCEE0A` | 细边框，强调机械感 |

### 方块颜色阶梯 (Tile Progression)
从冷色调（低级植入体）过渡到暖色调（高级义体），最后是传说级（黑金）。

*   **2**: `#00F0FF` (Cyan - Common) - 黑字
*   **4**: `#05D9E8` (Cyan Dim) - 黑字
*   **8**: `#00FF9F` (Matrix Green) - 黑字
*   **16**: `#D1F7FF` (Ice White) - 黑字
*   **32**: `#FCEE0A` (Cyber Yellow) - **黑字** (高亮)
*   **64**: `#FF003C` (Glitch Red) - 白字
*   **128**: `#FF2A68` (Neon Pink) - 白字
*   **256**: `#7127FF` (Electric Purple) - 白字
*   **512**: `#B026FF` (Neon Violet) - 白字
*   **1024**: `#F0F0F0` (Chrome Silver) - 黑字 + 阴影
*   **2048**: `#FFD700` (Legendary Gold) - 黑字 + 黄色光晕

## 3. CSS 样式规范 (CSS Specification)

### 3.1 字体与排版
*   **Font**: 使用等宽字体或机械感字体。
    *   `font-family: "Courier New", Courier, monospace;` (基础)
    *   如果引入 Google Fonts，推荐 **"Rajdhani"** 或 **"Orbitron"**。
*   **Text Transform**: `uppercase` (全大写)。

### 3.2 形状与边框
*   **Border Radius**: `0px` (直角)。
*   **Clip Path (可选)**: 右下角斜切。
    *   `clip-path: polygon(0 0, 100% 0, 100% 85%, 85% 100%, 0 100%);`
    *   *注意：这可能会切掉部分数字，需调整 padding。若为了稳妥，仅使用直角。*

### 3.3 特效 (Effects)
*   **Neon Glow (发光)**:
    *   `box-shadow: 0 0 5px var(--tile-bg), 0 0 10px var(--tile-bg);`
    *   让方块看起来像在发光。
*   **Grid Background (网格背景)**:
    *   为 Page 或 Board 增加网格线背景。
    *   `background-image: linear-gradient(rgba(252, 238, 10, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(252, 238, 10, 0.1) 1px, transparent 1px);`
    *   `background-size: 20px 20px;`

## 4. 推荐 CSS 代码片段

```css
[data-theme='cyberpunk'] {
  /* 基础环境 */
  --bg-page: #050505;
  --bg-board: #111111;
  --bg-slot: #000000;
  --text-primary: #FCEE0A; /* Cyber Yellow */
  --text-light: #000000;   /* 深色背景上的浅色字? 不，这里反转了，亮色块用黑字 */

  /* 几何 */
  --tile-border-radius: 0px;
  --border-radius: 0px;
  --font-family-base: "Courier New", monospace;

  /* 特效 */
  --tile-shadow: 0 0 8px currentColor; /* 核心发光逻辑 */
  --tile-border: 1px solid rgba(252, 238, 10, 0.3); /* 细微边框 */

  /* 方块颜色定义 */
  --tile-2-bg: #00F0FF; --tile-2-color: #000000;
  --tile-4-bg: #00FF9F; --tile-4-color: #000000;
  --tile-8-bg: #FCEE0A; --tile-8-color: #000000;
  --tile-16-bg: #FF003C; --tile-16-color: #FFFFFF;
  --tile-32-bg: #7127FF; --tile-32-color: #FFFFFF;
  /* ... 更多阶梯 ... */
  
  /* 覆盖 Board 样式以增加网格背景 */
  --bg-image-page: 
    linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px);
}
```

## 5. 交互动效建议
*   **Undo 按钮**: 鼠标悬停时出现 "Glitch" 抖动效果。
*   **New Game 按钮**: 纯黄色背景，黑色文字，硬朗直角。
