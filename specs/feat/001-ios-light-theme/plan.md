# Implementation Plan: iOS-Style Light Theme

**Branch**: `001-ios-light-theme` | **Date**: 2026-03-02 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-ios-light-theme/spec.md`

## Summary

Zmiana motywu aplikacji z ciemnego (cosmic dark) na jasny, inspirowany iOS 18. Obejmuje: light palette, glass morphism effects (frosted glass), iOS blue accent color (#007AFF), font Inter, oraz dostosowanie wszystkich komponentów (theme overrides, globals.css, inline styles w komponentach).

## Technical Context

**Language/Version**: TypeScript 5.7 / Node.js 22
**Primary Dependencies**: Next.js 15 (frontend), MUI 6 + Tailwind CSS 4 (UI), Emotion (CSS-in-JS)
**Testing**: Jest + Testing Library (frontend)
**Scope**: Frontend-only — `apps/web/src/` — brak zmian w backend

**Constraints**:
- Zmiana dotyczy TYLKO warstwy prezentacji
- Zachować istniejącą strukturę komponentów (nie refaktoryzować)
- Zachować responsywność
- Fallback dla przeglądarek bez backdrop-filter

## Constitution Check

| Article | Status | Notes |
|---------|--------|-------|
| Art. I (Monorepo) | OK | Zmiany tylko w apps/web |
| Art. III (Frontend) | OK | MUI theme overrides + Tailwind utilities |
| Art. IV (TypeScript) | OK | Brak `any`, pełne typowanie |
| Art. V (Testowanie) | OK | Istniejące testy muszą przechodzić |

## Project Structure

### Documentation (this feature)

```text
specs/001-ios-light-theme/
├── plan.md              # This file
├── spec.md              # Feature specification
└── tasks.md             # Task list
```

### Source Code (files to modify)

```text
apps/web/src/
├── theme/theme.ts              # GŁÓWNA ZMIANA — nowa paleta, font, overrides
├── app/globals.css             # Tło, glass utilities, scrollbar, animacje
├── app/HomeContent.tsx         # Inline gradient/color values
├── app/todos/page.tsx          # Inline gradient/color values
├── components/layout/AppLayout.tsx  # Navbar colors
└── components/todos/TodoItem.tsx    # Item colors
```

**Structure Decision**: Brak nowych plików — modyfikacja istniejących. Theme jako single source of truth.

## Design Decisions

### 1. Color Palette (iOS 18-inspired)

| Token | Dark (current) | Light (new) |
|-------|---------------|-------------|
| background.default | #050510 | #F2F2F7 |
| background.paper | rgba(255,255,255,0.04) | rgba(255,255,255,0.72) |
| text.primary | rgba(255,255,255,0.92) | rgba(0,0,0,0.87) |
| text.secondary | rgba(255,255,255,0.55) | rgba(0,0,0,0.55) |
| primary.main | #818cf8 | #007AFF |
| secondary.main | #22d3ee | #34C759 |
| divider | rgba(255,255,255,0.08) | rgba(0,0,0,0.06) |

### 2. Glass Morphism Tokens

```typescript
const GLASS = {
  bg: 'rgba(255, 255, 255, 0.72)',
  bgHover: 'rgba(255, 255, 255, 0.82)',
  bgActive: 'rgba(255, 255, 255, 0.88)',
  border: 'rgba(0, 0, 0, 0.06)',
  borderHover: 'rgba(0, 0, 0, 0.1)',
  blur: 'blur(20px)',
  blurHeavy: 'blur(40px)',
  shadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
  shadowElevated: '0 8px 32px rgba(0, 0, 0, 0.12)',
};
```

### 3. Typography

- Font family: `"Inter", -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif`
- Headings: Inter (weight 600-700)
- Body: Inter (weight 400-500)

### 4. Background

Zamiast cosmic gradient (radial-gradient z indigo/cyan):
- Solid `#F2F2F7` jako base
- Opcjonalny subtelny gradient z pastelowymi kolorami (bardzo delikatny)
- Brak animacji drift (zbyt agresywne dla light theme)

## Complexity Tracking

Brak violations — zmiana jest czysto frontendowa, w ramach istniejącej architektury.
