# Feature Design: Undo Functionality

## 1. 概述
在 2048 游戏中增加“撤回 (Undo)”功能，允许用户在移动后如果对结果不满意，可以撤销到上一步状态。这将显著提升用户体验，增加游戏的容错率。

## 2. 核心需求
*   **撤回操作**：点击“Undo”按钮或使用快捷键（如 `Ctrl+Z`）可回退到上一步。
*   **状态恢复**：撤回不仅要恢复棋盘上的方块位置和数值，还要恢复当时候的分数、游戏结束状态等。
*   **历史记录限制**：为了防止内存溢出，建议保留最近 50 步的操作记录（或者无限制，视性能而定，MVP 阶段可暂定无限制或 100 步）。
*   **交互限制**：
    *   当没有历史记录时（如刚开始游戏），Undo 按钮应为禁用状态。
    *   游戏结束 (Game Over) 后也应允许 Undo，以便用户挽救战局。
    *   胜利 (Win) 后也允许 Undo。

## 3. UI/UX 设计
*   **Undo 按钮位置**：
    *   建议放置在 `Game Controls` 区域，即 "New Game" 按钮旁边，或者顶部 ScorePanel 附近。
    *   考虑到移动端体验，建议放在棋盘下方控制区，与 ThemeSwitcher 和 New Game 并在。
    *   样式建议：使用图标（如 `↩️` 或 Material Design 的 Undo 图标）或文字 "Undo"。
*   **快捷键**：
    *   桌面端支持 `Ctrl+Z` (Windows) 或 `Cmd+Z` (Mac) 触发撤回。

## 4. 技术方案

### 4.1 数据结构更新

在 `src/utils/gameLogic.ts` 中，`GameState` 接口已经定义了游戏状态的核心要素：
```typescript
export interface GameState {
  tiles: Tile[];
  score: number;
  bestScore: number;
  over: boolean;
  won: boolean;
}
```
我们需要在 `useGame` Hook 中维护一个历史记录栈。

### 4.2 State Management (`src/hooks/useGame.ts`)

新增状态：
```typescript
const [history, setHistory] = useState<GameState[]>([]);
```

逻辑变更：
1.  **保存历史 (push)**：
    *   在每次 `moveTiles` 成功执行移动逻辑**之前**，将当前的 `GameState`（tiles, score, over, won 等）深拷贝并 push 到 `history` 栈中。
    *   注意：`bestScore` 不需要回退，最高分应当保留历史最高值。但为了简单起见，如果 `GameState` 包含 `bestScore`，回退时可以忽略它，或者重新从 localStorage 读取。建议仅记录 `tiles`, `score`, `over`, `won`。

2.  **执行撤回 (pop)**：
    *   `undo` 函数：
        *   检查 `history` 是否为空。若为空，直接返回。
        *   弹出栈顶元素 `previousState`。
        *   使用 `previousState` 的数据调用 `setTiles`, `setScore`, `setOver`, `setWon`。
        *   更新 `history` 状态（移除栈顶）。

3.  **重置游戏 (New Game)**：
    *   调用 `startNewGame` 时，清空 `history` 栈。

### 4.3 存储持久化 (`src/utils/storage.ts`)

为了防止刷新页面后丢失 Undo 历史，我们需要将 `history` 也保存到 `localStorage`。
*   更新 `saveGameState`：除了保存当前状态，也可以选择保存 `history`。
*   **注意**：`history` 可能会很大。如果 `localStorage` 空间有限，可以只保存最近 10 步，或者 MVP 阶段**暂不持久化 History**，只持久化当前状态。刷新后 History 清空是可接受的默认行为。
*   **决策**：MVP 阶段暂不持久化 History，刷新页面后 Undo 栈清空。

### 4.4 组件修改

1.  **`useGame.ts`**
    *   导出 `undo` 方法。
    *   导出 `canUndo` 布尔值 (即 `history.length > 0`)。

2.  **`App.tsx`**
    *   从 `useGame` 获取 `undo` 和 `canUndo`。
    *   在控制区域渲染 Undo 按钮。
    *   绑定键盘事件监听 `Cmd+Z` / `Ctrl+Z`。

## 5. 详细实现步骤

### Step 1: 修改 `useGame.ts`
1.  引入 `history` state。
2.  实现 `undo` 函数。
3.  修改 `moveTiles`，在移动前记录状态。
    *   **关键点**：必须深拷贝 `tiles` 数组及其对象，防止引用被修改。`Tile` 对象本身是简单的 JSON 对象，可以使用 `JSON.parse(JSON.stringify(tiles))` 或手动 map 复制。

### Step 2: 修改 `App.tsx`
1.  在 `controls` div 中添加 Undo 按钮。
2.  样式调整：确保按钮风格与 "New Game" 一致，但在禁用状态下有明显区别（灰色、不可点击）。
3.  添加 `useEffect` 监听键盘事件。

### Step 3: 测试用例
1.  **Unit Test (`useGame.test.ts`)**:
    *   测试移动后 `history` 长度增加。
    *   测试 `undo` 后状态恢复（tiles 位置、分数）。
    *   测试连续多次 `undo`。
    *   测试 `startNewGame` 后 `history` 清空。
2.  **Integration Test**:
    *   手动测试游戏流程。

## 6. 代码参考片段

### 深拷贝 Helper
```typescript
const cloneTiles = (tiles: Tile[]): Tile[] => {
  return tiles.map(tile => ({
    ...tile,
    position: { ...tile.position },
    mergedFrom: tile.mergedFrom ? cloneTiles(tile.mergedFrom) : undefined
  }));
};
```

### useGame 修改
```typescript
const undo = useCallback(() => {
  if (history.length === 0) return;

  const previousState = history[history.length - 1];
  const newHistory = history.slice(0, -1);

  setTiles(previousState.tiles);
  setScore(previousState.score);
  setOver(previousState.over);
  setWon(previousState.won);
  setHistory(newHistory);
}, [history]);

// 在 moveTiles 中
if (result.moved) {
  setHistory(prev => [...prev, { tiles: cloneTiles(tiles), score, over, won, bestScore }]); // 记录当前状态
  // ... 执行移动更新
}
```

## 7. 验收标准
1.  界面出现 "Undo" 按钮。
2.  移动一步后，"Undo" 按钮变亮（可用）。
3.  点击 "Undo" 后，棋盘和分数完全恢复到上一步状态。
4.  Game Over 后点击 "Undo" 可以恢复到死局前的状态，并继续游戏。
5.  按 `Ctrl+Z` / `Cmd+Z` 也能触发 Undo。
