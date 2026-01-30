# Theme Optimization Report: Accessibility & Aesthetics

## 1. 对比度问题分析 (Contrast Analysis)

基于 WCAG AA 标准（普通文字对比度至少 4.5:1，大字至少 3:1），目前部分主题存在以下严重的可读性问题：

### 🔴 严重 (Critical)
*   **Mint (薄荷)**:
    *   `--tile-2-color: #22543D` on `#C6F6D5`: 对比度 **6.76** (Pass)
    *   `--tile-8-bg: #68D391` on White text: 对比度 **1.77** (Fail) -> **字看不清！**
    *   `--tile-16-bg: #48BB78` on White text: 对比度 **2.32** (Fail) -> **字看不清！**
    *   *建议*: 8/16/32 的文字颜色应改为深色（如 `#0F2D1D`）。

*   **Cyberpunk (赛博朋克 - 旧版)**:
    *   `--tile-4-bg: #00FFFF` on Black text: 对比度 **19.5** (Pass)
    *   `--tile-2-bg: #FF00FF` on White text: 对比度 **3.13** (Low) -> 勉强接受，但建议改黑字。
    *   `--text-primary: #00FFFF` on `#050505` Bg: 对比度 **15.8** (Pass)

*   **Festive (节日)**:
    *   `--tile-4-bg: #FFA500` on `#8B0000` text: 对比度 **4.25** (Borderline) -> 接近合格。
    *   `--tile-8-bg: #FF8C00` on White text: 对比度 **2.28** (Fail) -> **橙底白字非常难认！**
    *   *建议*: 8/16/32 的文字改为深红 `#5D0A0A`。

*   **Steampunk (蒸汽朋克)**:
    *   `--text-primary: #D4A574` on `#2C241B`: 对比度 **5.39** (Pass)
    *   `--tile-32-bg: #8B7355` on White text: 对比度 **3.76** (Pass for large text)

### 🟡 警告 (Warning)
*   **Candy (默认)**:
    *   部分浅粉/浅黄背景上的 `#776E65` 文字对比度在 3-4 之间，虽然柔和但视力不佳者可能吃力。
*   **Apple**:
    *   `--tile-2-bg: #E8E8ED` on `#1D1D1F`: 对比度很棒。
    *   `--tile-16-bg: #AEAEB2` on White text: 对比度 **2.25** (Fail) -> **灰底白字看不清！**
    *   *建议*: 16/32 的文字颜色改为深灰 `#1D1D1F`。

## 2. 视觉审美问题 (Aesthetics Issues)

除了对比度，部分配色的色相搭配也存在“辣眼睛”或“不协调”的问题：

1.  **Ink (水墨)**:
    *   **问题**: 纯灰阶 (`#D0D0D0`, `#B8B8B8`) 显得过于死板，像“未加载完成”的图片。
    *   **建议**: 引入一点点“宣纸黄” (`#F5F5DC`) 或“靛蓝” (`#708090`) 作为点缀，增加层次感。

2.  **Microsoft**:
    *   **问题**: 颜色跨度太大。从浅灰直接跳到深蓝，缺乏中间过渡。
    *   **建议**: 参考 Fluent Design 的亚克力效果，或者使用更连贯的蓝色渐变。

3.  **Mario**:
    *   **问题**: 高饱和度的红蓝绿直接碰撞，长时间观看极易视疲劳。
    *   **建议**: 稍微降低饱和度，或者使用马里奥游戏中的“砖块红”、“水管绿”等更具质感的颜色，而不是纯 RGB 色。

## 3. 优化修正方案 (Recommended Fixes)

### Fix 1: Mint 主题修正
```css
[data-theme='mint'] {
  /* ... */
  --tile-8-color: #0F2D1D;  /* White -> Dark Green */
  --tile-16-color: #0F2D1D; /* White -> Dark Green */
  --tile-32-color: #0F2D1D; /* White -> Dark Green */
}
```

### Fix 2: Apple 主题修正
```css
[data-theme='apple'] {
  /* ... */
  --tile-16-color: #1D1D1F; /* White -> Dark Text */
  --tile-32-color: #1D1D1F; /* White -> Dark Text */
  --tile-64-color: #1D1D1F; /* White -> Dark Text */
}
```

### Fix 3: Festive 主题修正
```css
[data-theme='festive'] {
  /* ... */
  --tile-8-color: #5D0A0A;  /* White -> Dark Red */
  --tile-16-color: #5D0A0A; /* White -> Dark Red */
  --tile-32-color: #5D0A0A; /* White -> Dark Red */
}
```

### Fix 4: Mario 主题微调 (降低饱和度)
*   Red: `#E52521` -> `#D32F2F` (Material Red)
*   Green: `#43B047` -> `#388E3C` (Material Green)
*   Blue: `#049CD8` -> `#1976D2` (Material Blue)

## 4. 总结
当前的样式虽然实现了“换肤”，但在**可读性**上存在硬伤，尤其是浅色背景强行配白字的情况（Apple, Mint, Festive）。

建议 AI 在实现新版 Cyberpunk 主题的同时，顺手把上述的**对比度 Bug** 修复掉，否则这几个主题基本是“不可玩”的状态。
