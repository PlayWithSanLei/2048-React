# Theme Adjustment Directives (Final)

请根据以下指令对 `src/styles/themes.css` 进行最终调整。本指令集成了对比度修复及审美优化需求。

## 1. 微软风格优化 (Windows 10/11 Fluent Design)
**目标**：打造纯正的 Windows 10/11 系统风格 (Fluent Design / Metro)。

*   **核心理念**: 
    *   **Windows Blue**: 经典的系统蓝。
    *   **Acrylic**: 亚克力半透明感（通过颜色模拟）。
    *   **Sharp/Rounded**: Windows 10 为直角，Windows 11 为微圆角。建议采用 **Windows 10 Metro 直角**风格以区别于 Apple 主题。
*   **色板调整**:
    *   **背景**: 使用浅灰白 `#F3F3F3` (Mica 材质感)。
    *   **方块阶梯 (Blue Progressions)**: 统一使用蓝色系，模拟系统从浅色模式到深色模式或不同层级的蓝色。
        *   2/4/8: 浅灰/白阶梯 `#FFFFFF` -> `#E5E5E5` -> `#CCCCCC` (黑字)
        *   16: `#99EBFF` (Light Blue) (黑字)
        *   32: `#66D9FF` (Sky Blue) (黑字)
        *   64: `#33C7FF` (Vivid Blue) (黑字)
        *   128: `#0078D7` (Windows 10 Blue - Standard) (白字)
        *   256: `#0063B1` (Darker Blue) (白字)
        *   512: `#005A9E` (Deep Blue) (白字)
        *   1024: `#004578` (Navy Blue) (白字)
        *   2048: `#0078D4` (Brand Blue) (白字，带黄色边框或光晕强调)

## 2. 水墨风格微调 (Ink Refinement)
**目标**：去除死板的纯灰，增加“宣纸”质感。

*   **样式变更**:
    *   `--bg-page`: `#F5F5DC` (Beige/宣纸色) 替代 `#F5F5F5`
    *   `--bg-board`: `#1A1A1A` (浓墨)
    *   `--bg-slot`: `#2C2C2C` (淡墨)
*   **方块调整**:
    *   低数字方块背景带一点点暖色倾向 (`#FAF9F6`) 而不是纯白。
    *   高数字方块保持深色水墨感。

## 3. 可读性修复 (Accessibility Fixes)
**目标**：修复浅色背景配白字导致的文字不可见问题。

*   **Mint (薄荷)**:
    *   `--tile-8-color`: 改为 `#0F2D1D` (深绿)
    *   `--tile-16-color`: 改为 `#0F2D1D`
    *   `--tile-32-color`: 改为 `#0F2D1D`
*   **Apple (苹果)**:
    *   `--tile-16-color`: 改为 `#1D1D1F` (深灰)
    *   `--tile-32-color`: 改为 `#1D1D1F`
    *   `--tile-64-color`: 改为 `#1D1D1F`
*   **Festive (节日)**:
    *   `--tile-8-color`: 改为 `#5D0A0A` (深红)
    *   `--tile-16-color`: 改为 `#5D0A0A`
    *   `--tile-32-color`: 改为 `#5D0A0A`

## 4. 保持原样 (No Changes)
*   **Mario**: 保持高饱和度原色风格。
*   **Cyberpunk**: 保持现有样式，暂不调整。
