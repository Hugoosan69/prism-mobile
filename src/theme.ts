/**
 * Tokens espelhando o dark mode do Prism web (src/app/globals.css).
 * Os valores originais são oklch; aqui vão convertidos para hex porque
 * React Native não interpreta oklch.
 */

export const colors = {
  background: '#16171b',
  foreground: '#f4f4f5',

  card: '#1e1f24',
  cardForeground: '#f4f4f5',

  popover: '#212227',
  popoverForeground: '#f4f4f5',

  primary: '#ebebec',
  primaryForeground: '#1d1e22',

  secondary: '#2b2c33',
  secondaryForeground: '#f4f4f5',

  muted: '#292a30',
  mutedForeground: '#a1a1aa',

  accent: '#2e2f36',
  accentForeground: '#f4f4f5',

  destructive: '#f87171',

  border: 'rgba(250, 250, 255, 0.11)',
  input: 'rgba(250, 250, 255, 0.14)',
  ring: '#7aa2e3',
} as const;

/** Uma faixa do espectro por módulo, dessaturada para não competir com o conteúdo. */
export const spectrum = {
  chat: '#e08ac4',
  dashboard: '#85a5dd',
  kanban: '#eda86b',
  sql: '#62b4c4',
  arquivos: '#5cbf9b',
  notas: '#b995dd',
  favoritos: '#e8918a',
} as const;

/** Saturação cai conforme a tarefa sai do radar. */
export const statusColors = {
  todo: '#f0736a',
  doing: '#eba55c',
  waiting: '#74a2e0',
  done: '#8d94a3',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 5,
  md: 6,
  lg: 8,
  xl: 11,
  full: 999,
} as const;

export const typography = {
  title: { fontSize: 22, fontWeight: '600' },
  heading: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 15, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '500' },
  caption: { fontSize: 12, fontWeight: '400' },
} as const;
