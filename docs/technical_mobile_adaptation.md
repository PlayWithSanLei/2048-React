# Mobile Adaptation Technical Proposal

## 1. 现状分析
当前游戏在移动端体验不佳，主要原因如下：
1.  **固定尺寸**: `src/styles/themes.css` 中定义了固定的 `--tile-size: 100px` 和 `--grid-gap: 15px`。这导致棋盘总宽度约为 `(100 * 4) + (15 * 5) ≈ 475px`。
2.  **溢出屏幕**: 大多数手机竖屏宽度在 360px - 430px 之间，导致棋盘被截断或需要横向滚动。
3.  **交互问题**: 缺乏对 Touch 事件的优化（虽然使用了 `@use-gesture/react`，但布局问题可能影响手势判定）。

## 2. 响应式布局方案 (Responsive Strategy)

我们将采用 **CSS 媒体查询 (Media Queries)** 结合 **CSS 变量重写** 的方式，实现一套“流式缩放”的棋盘布局。

### 2.1 核心断点 (Breakpoints)
*   **Desktop**: `min-width: 520px` (保持现状，大尺寸)
*   **Mobile**: `max-width: 520px` (自适应布局)

### 2.2 CSS 变量重写 (`src/styles/themes.css`)

在小屏幕下，我们将尺寸单位从 `px` 改为相对单位（如 `vmin` 或百分比计算出的较小 `px`），或者简单地缩小像素值。

**方案 A：固定的小尺寸 (简单可靠)**
针对移动端，将方块缩小到能放下为止。
```css
@media (max-width: 520px) {
  :root {
    --tile-size: 65px;
    --grid-gap: 10px;
    --board-padding: 10px;
    /* 总宽: 65*4 + 10*3 + 10*2 = 260 + 30 + 20 = 310px (适配 iPhone SE) */
  }
}
```

**方案 B：流式布局 (推荐)**
利用视口单位 `vmin` (取 vw 和 vh 中较小者)，确保横竖屏都能完美填充。
```css
@media (max-width: 520px) {
  :root {
    /* 棋盘大约占屏幕宽度的 90% */
    /* (90vw - padding*2 - gap*3) / 4 = tile-size */
    --board-padding: 2vmin;
    --grid-gap: 2vmin;
    --tile-size: 21vmin; /* (100 - 4 - 6) / 4 ≈ 22.5, 留点余量取 21 */
  }
}
```

### 2.3 布局容器调整 (`src/App.module.css`)
*   确保 `.container` 和 `.gameContainer` 使用 Flexbox 居中。
*   防止页面整体滚动（`overflow: hidden` on body），只允许棋盘区域响应手势。
*   **Prevent Overscroll**: 禁用浏览器的橡皮筋效果。

## 3. 具体修改计划

### Step 1: 修改 `src/styles/themes.css`
在文件末尾添加响应式媒体查询：

```css
@media screen and (max-width: 520px) {
  :root {
    --tile-size: 18.5vmin; /* 动态计算方块大小 */
    --grid-gap: 2.5vmin;
    --board-padding: 2.5vmin;
    --border-radius: 4px;
    --tile-border-radius: 4px; /* 小屏幕下圆角也应缩小 */
  }
  
  /* 针对 Apple/Microsoft 等特殊主题的圆角适配 */
  [data-theme='apple'] {
    --tile-border-radius: 8px;
    --border-radius: 8px;
  }
}
```

### Step 2: 调整 `src/components/Board/Board.module.css`
目前的 `width` 计算方式是硬编码的 `calc`，依赖于变量。
```css
.boardContainer {
  /* ...保持不变，因为它依赖 CSS 变量，变量变了它自动变 */
  /* 但建议增加 max-width 防止意外 */
  max-width: 100vw;
  max-height: 100vw; /* 保持正方形 */
}
```

### Step 3: 优化 `src/App.module.css`
确保主容器在移动端全屏铺满，去除多余的 margin。
```css
@media (max-width: 520px) {
  .container {
    padding: 10px;
    justify-content: flex-start; /* 移动端靠上对齐，防止被软键盘或底部栏遮挡 */
    padding-top: 20px;
  }
  
  .title {
    font-size: 48px; /* 标题缩小 */
    margin-bottom: 10px;
  }
  
  .controls {
    flex-wrap: wrap; /* 按钮换行 */
    gap: 10px;
  }
}
```

### Step 4: 视口元标签 (index.html)
确保 `viewport` 设置正确，禁止用户缩放。
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

## 4. 预期效果
1.  **iPhone SE (320px)**: 棋盘自动缩小，完整显示，无横向滚动。
2.  **iPhone 14 Pro (393px)**: 棋盘适度变大，占据约 90% 宽度。
3.  **iPad/Desktop**: 保持原有的 500px+ 大棋盘。
4.  **手势**: 滑动屏幕任意位置（不仅是棋盘）都能触发移动（需要确认 `@use-gesture` 绑定在 body 或大容器上）。当前是绑定在 `Board` 上，建议保持，但要确保 Board 够大或容易触控。

## 5. 给 AI 的指令
请将上述方案整合为具体的代码修改任务。重点是 `src/styles/themes.css` 的媒体查询添加。
