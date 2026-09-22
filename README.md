# Prism Mobile

App Android do Prism — organizador pessoal de usuário único.
Expo SDK 57 + expo-router + React Native 0.86.

Projeto independente do Prism web: compartilha tema, estrutura e (em breve) o mesmo Supabase,
mas vive e evolui por conta própria.

## Rodar

```bash
npm start          # QR code para o Expo Go
npm run android    # emulador ou device conectado por USB
npm run web        # conferir layout rápido no navegador
```

## Estrutura

- `app/` — rotas (expo-router). `(tabs)/index.tsx` é o chat, a tela inicial.
- `src/theme.ts` — tokens do dark mode do Prism web, convertidos de oklch para hex.
- `src/components/ui.tsx` — Screen, Card, Button, Input, Badge.
- `src/mock.ts` — dados de exemplo enquanto as telas não falam com o Supabase.

## Estado

Interface das cinco abas navegável com dados falsos. Nada conectado ao Supabase ainda.

Falta: sessão e dados reais, chat com streaming, arrastar cartão no Kanban, arquivos, offline.

## Verificar sem device

```bash
npx expo export --platform android   # falha se houver erro de import
npx tsc --noEmit
```
