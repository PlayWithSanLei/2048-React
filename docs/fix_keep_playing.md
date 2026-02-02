# Feature Adjustment: Fix "Keep Playing" Logic

## 1. 问题描述 (Problem Description)
当前用户在达成 2048 胜利条件后，点击 "Keep Playing" 按钮，游戏反而触发了重置（New Game），导致无法继续挑战更高分数（如 4096, 8192）。

## 2. 原因分析 (Root Cause Analysis)
在 `src/App.tsx` 中，"Keep Playing" 按钮绑定的事件处理函数是 `startNewGame`：

```tsx
<button className={styles.restartButton} onClick={startNewGame}>
  {won ? 'Keep Playing' : 'Try Again'}
</button>
```

这意味着无论用户是赢了想继续，还是输了想重开，点击该按钮都会导致游戏状态清零。

## 3. 技术调整方案 (Technical Solution)

需要引入一个新状态 `keepPlaying` 来标记用户是否选择继续游戏。

### 3.1 修改 `src/utils/gameLogic.ts`
更新 `GameState` 接口，增加 `keepPlaying` 字段。

```typescript
export interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  over: boolean;
  won: boolean;
  keepPlaying?: boolean; // 新增字段
}
```

### 3.2 修改 `src/hooks/useGame.ts`
1.  **新增状态**: `const [keepPlaying, setKeepPlaying] = useState(false);`
2.  **初始化**: 在从 localStorage 加载状态时，读取 `keepPlaying`。
3.  **重置逻辑**: 在 `startNewGame` 中，重置 `setKeepPlaying(false)`。
4.  **保存逻辑**: 在 `saveGameState` 时，包含 `keepPlaying`。
5.  **新增方法**: `continueGame`，用于将 `keepPlaying` 设为 `true`。
6.  **Undo 逻辑**: 历史记录 `HistoryState` 也需要包含 `keepPlaying` 吗？建议包含，或者简化处理。如果不包含，Undo 回到胜利那一刻可能会再次弹出窗口，这是合理的。

```typescript
  const continueGame = useCallback(() => {
    setKeepPlaying(true);
  }, []);
```

### 3.3 修改 `src/App.module.css`
(无需修改，复用现有样式)

### 3.4 修改 `src/App.tsx`
1.  从 `useGame` 获取 `keepPlaying` 和 `continueGame`。
2.  修改 Overlay 的显示条件：仅当 `(over || (won && !keepPlaying))` 时显示。
3.  修改按钮点击事件：

```tsx
{(over || (won && !keepPlaying)) && (
  <div className={styles.overlay}>
    <div className={styles.message}>
      {won ? 'You Win!' : 'Game Over!'}
    </div>
    {won ? (
      <button className={styles.restartButton} onClick={continueGame}>
        Keep Playing
      </button>
    ) : (
      <button className={styles.restartButton} onClick={startNewGame}>
        Try Again
      </button>
    )}
  </div>
)}
```

## 4. 实施步骤
1.  修改 `src/utils/gameLogic.ts` 定义。
2.  修改 `src/hooks/useGame.ts` 实现逻辑。
3.  修改 `src/App.tsx` 实现 UI 交互。
