/**
 * Tokens espelhando o dark mode do Prism web (src/app/globals.css).
 * Os valores originais são oklch; aqui vão em hex porque React Native não
 * interpreta oklch.
 */

export const colors = {
  background: '#16171b',
  foreground: '#f4f4f5',

  card: '#1e1f24',
  cardElevado: '#232429',
  popover: '#212227',

  primary: '#ebebec',
  primaryForeground: '#1d1e22',

  secondary: '#2b2c33',
  muted: '#292a30',
  mutedForeground: '#a1a1aa',
  sutil: '#71717a',

  accent: '#2e2f36',
  destructive: '#f87171',

  border: 'rgba(250, 250, 255, 0.10)',
  borderForte: 'rgba(250, 250, 255, 0.16)',
  input: 'rgba(250, 250, 255, 0.14)',
  ring: '#7aa2e3',

  /** Do logo: o gradiente que atravessa o P. */
  marcaInicio: '#2563eb',
  marcaFim: '#22d3ee',
  marcaRoxo: '#8b5cf6',
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
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 22,
  full: 999,
} as const;

export const typography = {
  display: { fontSize: 28, fontWeight: '700', letterSpacing: -0.5 },
  title: { fontSize: 21, fontWeight: '700', letterSpacing: -0.3 },
  heading: { fontSize: 16, fontWeight: '600', letterSpacing: -0.1 },
  body: { fontSize: 15, fontWeight: '400' },
  label: { fontSize: 13, fontWeight: '600' },
  caption: { fontSize: 12, fontWeight: '400' },
  micro: { fontSize: 11, fontWeight: '500', letterSpacing: 0.4 },
} as const;

/** Sombras discretas: dão profundidade sem virar material design. */
export const elevacao = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  flutuante: {
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
} as const;
