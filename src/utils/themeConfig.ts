/**
 * Theme configuration for the 2048 game
 * Defines all available themes with their display names and metadata
 */
export const THEMES = [
  { id: 'candy', emoji: '🍬', name: 'Candy', shortName: 'Candy', description: 'Soft pastel colors' },
  { id: 'mint', emoji: '🌿', name: 'Mint', shortName: 'Mint', description: 'Fresh green palette' },
  { id: 'apple', emoji: '🍎', name: 'Apple', shortName: 'Apple', description: 'Minimalist flat design' },
  { id: 'bamboo', emoji: '🎋', name: 'Bamboo', shortName: 'Bamboo', description: 'Chinese bamboo forest' },
  { id: 'festive', emoji: '🧧', name: 'Festive', shortName: 'Festive', description: 'Chinese celebration' },
  { id: 'ink', emoji: '🖌️', name: 'Ink', shortName: 'Ink', description: 'Traditional ink wash' },
  { id: 'cyberpunk', emoji: '🤖', name: 'Cyberpunk', shortName: 'Cyber', description: 'Neon future vibes' },
  { id: 'steampunk', emoji: '⚙️', name: 'Steampunk', shortName: 'Steam', description: 'Victorian retro tech' },
  { id: 'witcher', emoji: '🐺', name: 'Witcher', shortName: 'Witcher', description: 'Dark medieval fantasy' },
  { id: 'zelda', emoji: '🗡️', name: 'Zelda', shortName: 'Zelda', description: 'Sheikah slate design' },
  { id: 'mario', emoji: '🍄', name: 'Mario', shortName: 'Mario', description: 'Classic Nintendo colors' },
  { id: 'microsoft', emoji: '💻', name: 'Microsoft', shortName: 'MS', description: 'Metro/Fluent design' },
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
