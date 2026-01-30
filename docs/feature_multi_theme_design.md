# Feature Design: Multi-Theme System

## 1. 概述
在现有“糖果”和“薄荷”双主题基础上，扩展支持 10+ 种风格迥异的主题（包括苹果风、中国风系列、赛博朋克、塞尔达等）。需要重构现有的主题切换机制，从简单的 Toggle 按钮改为下拉菜单 (Select) 或主题选择面板。

## 2. 新增主题列表
| ID | 名称 (Display Name) | 风格描述 | 核心色调参考 |
| :--- | :--- | :--- | :--- |
| `candy` | 🍬 Candy (默认) | 现有的糖果色 | 低饱和度粉/蓝/黄 |
| `mint` | 🌿 Mint | 现有的薄荷色 | 清新绿/青 |
| `apple` | 🍎 Apple | 极简、扁平、圆润 | 纯白背景、浅灰棋盘、深灰文字 (San Francisco 风格) |
| `bamboo` | 🎋 Bamboo | 中国风-竹林 | 竹青、墨绿、米白 |
| `festive` | 🧧 Festive | 中国风-节日 | 喜庆红、金、祥云纹理 |
| `ink` | 🖌️ Ink | 中国风-水墨 | 黑白灰阶、宣纸底色 |
| `cyberpunk` | 🤖 Cyberpunk | 赛博朋克 | 霓虹蓝/粉、深黑背景、发光特效 |
| `steampunk` | ⚙️ Steampunk | 蒸汽朋克 | 黄铜、齿轮、复古棕、皮革质感 |
| `witcher` | 🐺 Witcher | 中世纪巫师 | 深褐、银白、魔法符文色 (参考《巫师3》UI) |
| `zelda` | 🗡️ Zelda | 塞尔达传说 | 希卡石板蓝、海拉鲁绿、金黄三角力量 |
| `mario` | 🍄 Mario | 马里奥 | 红帽子、蓝背带裤、金币黄、砖块纹理 |
| `microsoft` | 💻 Microsoft | 微软科技风 | Metro/Fluent Design, 亚克力半透明, 科技蓝 |

## 3. 技术规范

### 3.1 CSS 变量扩展 (`src/styles/themes.css`)

目前 `themes.css` 仅定义了基础变量。为了支持复杂主题（如赛博朋克的发光字、蒸汽朋克的纹理背景），需要扩展 CSS 变量系统：

```css
:root {
  /* ...原有变量... */
  
  /* 新增字体变量 */
  --font-family-base: "Segoe UI", "Roboto", "Helvetica Neue", sans-serif;
  
  /* 新增特效变量 */
  --tile-shadow: none;        /* 用于赛博朋克发光 */
  --tile-border: none;        /* 用于蒸汽朋克边框 */
  --tile-border-radius: 6px;  /* 用于区分圆角(Apple)和直角(Microsoft) */
  
  /* 背景纹理支持 (可选) */
  --bg-image-page: none;
  --bg-image-board: none;
}
```

### 3.2 变量映射规范
每个主题必须覆盖以下核心变量：
*   `--bg-page`: 页面背景
*   `--bg-board`: 棋盘背景
*   `--bg-slot`: 空插槽背景
*   `--text-primary`: 主要文字颜色
*   `--text-light`: 浅色文字颜色（用于深色方块）
*   `--tile-[2-2048]-bg`: 各数字方块背景
*   `--tile-[2-2048]-color`: 各数字方块文字颜色

**特殊主题额外要求**：
*   **Cyberpunk**: 使用 `text-shadow` 和 `box-shadow` 模拟霓虹灯。
*   **Steampunk/Ink**: 可能需要设置 `--bg-image` 来增加纹理感（如果仅用 CSS 颜色无法达成）。
*   **Apple**: `--tile-border-radius` 设为较大值（如 12px），字体设为系统字体。
*   **Microsoft**: `--tile-border-radius` 设为 0px (Metro 风格)。

### 3.3 组件重构 (`src/components/ThemeSwitcher/`)

现有的 `ThemeSwitcher` 只是一个 Button。需要重构为下拉选择器。

**修改建议**：
1.  创建一个 `themeConfig.ts` 文件，定义所有主题的元数据（ID, Name）。
2.  修改 `ThemeSwitcher.tsx`：
    *   使用 HTML `<select>` 元素实现最基础的切换。
    *   或者使用自定义 UI（如图标列表）提升体验。鉴于主题较多，推荐使用 `<select>` 或侧边抽屉。

```typescript
// themeConfig.ts
export const THEMES = [
  { id: 'candy', name: '🍬 Candy' },
  { id: 'mint', name: '🌿 Mint' },
  { id: 'apple', name: '🍎 Apple' },
  // ...
] as const;

export type ThemeId = typeof THEMES[number]['id'];
```

## 4. 详细样式指南 (Style Guide)

### 4.1 Apple 风格
*   Colors: White/Light Gray background. Tiles are soft pastels or shades of gray.
*   Shape: Large border-radius.
*   Font: San Francisco (system-ui).

### 4.2 Bamboo (竹林)
*   Colors: Page=#F0F9F0, Board=#3C6E47 (Deep Green).
*   Tiles: Various shades of bamboo green and wood yellow.
*   Font: Serif / KaiTi (楷体) if possible.

### 4.3 Festive (春节/节日)
*   Colors: Page=#8E0000 (Red), Board=#FFD700 (Gold).
*   Tiles: Red/Gold gradients.
*   Font: Bold Serif.

### 4.4 Ink (水墨)
*   Colors: Grayscale. Page=#F5F5F5 (Rice paper), Board=#000000.
*   Tiles: White with black strokes (simulated by border) or different shades of ink wash.

### 4.5 Cyberpunk
*   Colors: Page=#050505, Board=#1A1A1A.
*   Tiles: Neon Pink (#FF00FF), Neon Cyan (#00FFFF), Neon Green (#39FF14).
*   Effect: `box-shadow: 0 0 10px var(--tile-bg)`.

### 4.6 Steampunk
*   Colors: Bronze (#CD7F32), Brass (#B5A642), Leather Brown (#8B4513).
*   Style: Borders are important here (2px solid #5C4033).

### 4.7 Witcher
*   Colors: Dark UI. Slate Gray, Silver, Muted Red.
*   Font: Serif (Trajan Pro style).

### 4.8 Zelda
*   Colors: Gold (#FFD700), Forest Green (#228B22), Sheikah Blue (#00BFFF).
*   Style: Triforce motifs (colors).

### 4.9 Mario
*   Colors: Primary colors. Red, Blue, Yellow, Green.
*   Style: Pixel art feel (disable border-radius).

### 4.10 Microsoft
*   Colors: Windows blue (#0078D7), White, Dark Gray.
*   Style: Sharp corners (border-radius: 0). Flat design.

## 5. 实现步骤
1.  **准备数据**: 创建 `src/utils/themeConfig.ts`。
2.  **重构组件**: 修改 `ThemeSwitcher.tsx` 为下拉菜单。
3.  **编写 CSS**: 在 `src/styles/themes.css` 中追加所有新主题的 CSS 变量定义。这是工作量最大的一部分。
4.  **验证**: 逐个切换主题，确保颜色对比度正常，文字清晰可见。

## 6. 验收标准
1.  点击 Theme Switcher 能看到所有 12 个主题选项。
2.  切换任意主题后，页面背景、棋盘、方块颜色立即更新且无视觉 Bug。
3.  刷新页面后，当前选择的主题依然保留。
