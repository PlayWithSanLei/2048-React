# Theme Contrast & Visibility Fixes

## Problem Analysis
In themes like **Ink**, **Bamboo**, and **Festive**, the board background (`--bg-board`) is **dark**, but the text color used for Score Labels ("SCORE", "BEST") and the Theme Switcher button (`--text-primary`) is also **dark**. This makes the text invisible.

Currently:
*   `ScorePanel` labels use `--text-primary`.
*   `ThemeSwitcher` button uses `--text-primary` on top of `--bg-board`.

## Solution Strategy
1.  Introduce a new CSS variable: `--text-board`.
2.  Default it to `--text-primary` (for light themes).
3.  Override it to a **light color** for dark-board themes.
4.  Update components to use `--text-board`.

## Detailed Directives

### 1. Update `src/styles/themes.css`

#### Add Default Variable
In `:root`:
```css
:root {
  /* ... existing vars ... */
  --text-primary: #776E65;
  
  /* NEW: Text color specifically for elements on top of the board (Score labels, Buttons) */
  --text-board: var(--text-primary); 
  
  /* ... */
}
```

#### Override for Dark Themes

**Bamboo Theme (`[data-theme='bamboo']`)**
```css
[data-theme='bamboo'] {
  /* ... */
  --bg-board: #3C6E47; /* Dark Green */
  --text-primary: #1A3A21; /* Dark Text (for page) */
  
  /* FIX: Use light color for board elements */
  --text-board: #F0F9F0; /* Pale Green/White */
}
```

**Festive Theme (`[data-theme='festive']`)**
```css
[data-theme='festive'] {
  /* ... */
  --bg-board: #C41E3A; /* Red */
  --text-primary: #5D0A0A; /* Dark Red */
  
  /* FIX: Use Gold for board elements */
  --text-board: #FFD700; 
}
```

**Ink Theme (`[data-theme='ink']`)**
```css
[data-theme='ink'] {
  /* ... */
  --bg-board: #2C2C2C; /* Dark Grey */
  --text-primary: #0A0A0A; /* Black */
  
  /* FIX: Use Light Grey/Beige for board elements */
  --text-board: #D0CCC0;
}
```

**Cyberpunk Theme (`[data-theme='cyberpunk']`)**
```css
[data-theme='cyberpunk'] {
  /* ... */
  --text-primary: #F3E600; 
  /* Cyberpunk already uses light text (Yellow) on dark bg, so it might be fine.
     But explicitly setting it ensures consistency. */
  --text-board: #F3E600;
}
```

**Steampunk / Witcher / Zelda**
*   Check if `--text-primary` provides enough contrast against `--bg-board`. If not, override `--text-board`.
*   **Steampunk**: Board `#4A3728` (Dark), Text `#D4A574` (Light Gold). **OK**.
*   **Witcher**: Board `#2D2D35` (Dark), Text `#C5A059` (Gold). **OK**.
*   **Zelda**: Board `#2D4A35` (Dark), Text `#FFD700` (Gold). **OK**.

### 2. Update Components

#### `src/components/ScorePanel/ScorePanel.module.css`
Change `.label` color:
```css
.label {
  color: var(--text-board); /* Was var(--text-primary) */
  /* ... */
}
```

#### `src/components/ThemeSwitcher/ThemeSwitcher.module.css`
Change `.triggerButton` color:
```css
.triggerButton {
  background: var(--bg-board);
  color: var(--text-board); /* Was var(--text-primary) */
  /* ... */
}
```

## Summary for AI Developer
1.  Define `--text-board` in `:root` of `themes.css`.
2.  Set specific high-contrast values for `--text-board` in `bamboo`, `festive`, and `ink` themes.
3.  Refactor `ScorePanel.module.css` and `ThemeSwitcher.module.css` to consume `--text-board`.
