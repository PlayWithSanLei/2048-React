/**
 * Theme configuration for the 2048 game
 * Defines all available themes with their display names and metadata
 */
export const THEMES = [
  { id: 'candy', name: '🍬 Candy', description: 'Soft pastel colors' },
  { id: 'mint', name: '🌿 Mint', description: 'Fresh green palette' },
  { id: 'apple', name: '🍎 Apple', description: 'Minimalist flat design' },
  { id: 'bamboo', name: '🎋 Bamboo', description: 'Chinese bamboo forest' },
  { id: 'festive', name: '🧧 Festive', description: 'Chinese celebration' },
  { id: 'ink', name: '🖌️ Ink', description: 'Traditional ink wash' },
  { id: 'cyberpunk', name: '🤖 Cyberpunk', description: 'Neon future vibes' },
  { id: 'steampunk', name: '⚙️ Steampunk', description: 'Victorian retro tech' },
  { id: 'witcher', name: '🐺 Witcher', description: 'Dark medieval fantasy' },
  { id: 'zelda', name: '🗡️ Zelda', description: 'Sheikah slate design' },
  { id: 'mario', name: '🍄 Mario', description: 'Classic Nintendo colors' },
  { id: 'microsoft', name: '💻 Microsoft', description: 'Metro/Fluent design' },
] as const;

export type ThemeId = typeof THEMES[number]['id'];

export const DEFAULT_THEME: ThemeId = 'candy';

/**
 * Check if a string is a valid theme ID
 */
export const isValidTheme = (theme: string): theme is ThemeId => {
  return THEMES.some(t => t.id === theme);
};

/**
 * Get theme metadata by ID
 */
export const getThemeById = (id: string): typeof THEMES[number] | undefined => {
  return THEMES.find(t => t.id === id);
};
