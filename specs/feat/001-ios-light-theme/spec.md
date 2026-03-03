# Feature Specification: iOS-Style Light Theme with Glass Effects

**Feature Branch**: `001-ios-light-theme`
**Created**: 2026-03-02
**Status**: Draft
**Input**: User description: "Dostosowanie motywu aplikacji, powinno przypominać bardziej najnowszy iOS. Jaśniejszy theme, więcej glass effect."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Light Theme Base (Priority: P1)

Użytkownik widzi aplikację w jasnym, czystym motywie inspirowanym iOS 18 — białe/jasne tła, systemowy font SF Pro-like (Inter), subtelne szare bordy i delikatne cienie zamiast ciemnego kosmicznego tła.

**Why this priority**: Fundamentalna zmiana wizualna — bez jasnego tła reszta efektów nie ma sensu.

**Independent Test**: Otwarcie strony głównej i /todos — tło jest jasne (#F2F2F7 jak iOS), tekst jest ciemny, nawigacja jest czytelna.

**Acceptance Scenarios**:

1. **Given** użytkownik otwiera stronę główną, **When** strona się ładuje, **Then** tło jest jasne (light gray ~#F2F2F7), tekst jest ciemny, nawigacja jest czytelna
2. **Given** użytkownik przechodzi na /todos, **When** strona się renderuje, **Then** kontener z todosami ma białe/mleczne tło z glass effect, bez ciemnego kosmicznego gradientu

---

### User Story 2 - Glass Morphism Effects (Priority: P1)

Karty, Paper, AppBar i kontenery mają efekt glass morphism w stylu iOS — semi-transparentne białe tło z backdrop-filter blur, subtelne bordy i delikatne cienie. Efekt "frosted glass" znany z iOS Control Center.

**Why this priority**: Core visual feature — to jest główna prośba użytkownika obok jasnego theme.

**Independent Test**: Kliknięcie na kartę tech stacku — widoczny efekt glass z rozmyciem tła, subtelny border i cień.

**Acceptance Scenarios**:

1. **Given** strona główna z kartami tech stack, **When** użytkownik widzi karty, **Then** karty mają semi-transparentne białe tło (~rgba(255,255,255,0.7)), blur backdrop, subtelny border 1px rgba(0,0,0,0.04)
2. **Given** AppBar nawigacji, **When** użytkownik scrolluje, **Then** navbar ma efekt frosted glass — semi-transparentne tło z blur
3. **Given** kontener Paper na stronie /todos, **When** użytkownik widzi formularz i listę, **Then** Paper ma glass effect z białym/mlecznym tłem

---

### User Story 3 - iOS-Style UI Details (Priority: P2)

Komponenty UI naśladują estetykę iOS — zaokrąglone rogi (borderRadius ~12-16px), systemowe kolory akcji (iOS blue #007AFF), przejścia hover/focus, inputs z lekkim szarym tłem, checkboxy w stylu iOS.

**Why this priority**: Dopełnienie doświadczenia — detale sprawiają że theme wygląda spójnie z iOS.

**Independent Test**: Interakcja z formularzem dodawania todo — input z zaokrąglonymi rogami, szarym tłem, przycisk w iOS blue.

**Acceptance Scenarios**:

1. **Given** formularz dodawania todo, **When** użytkownik widzi input, **Then** input ma zaokrąglone rogi, lekko szare tło (#F2F2F7), bez wyraźnego outline
2. **Given** przycisk "dodaj", **When** użytkownik widzi przycisk, **Then** przycisk ma iOS blue (#007AFF), zaokrąglone rogi, bez gradientu
3. **Given** lista todo items, **When** użytkownik hover nad item, **Then** subtelne podświetlenie tła, checkbox w iOS style

---

### Edge Cases

- Jak wygląda aplikacja na urządzeniach które nie wspierają `backdrop-filter`? Fallback na solidne białe tło.
- Jak wygląda scrollbar w jasnym theme? Szary, subtelny, spójny z iOS.
- Czy gradient tekstu (text-gradient) jest nadal czytelny na jasnym tle? Dostosować do ciemnych kolorów.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUSI wyświetlać jasne tło strony (#F2F2F7 lub zbliżony iOS system gray)
- **FR-002**: System MUSI stosować glass morphism (backdrop-filter: blur + semi-transparent bg) na Paper, Card, AppBar
- **FR-003**: System MUSI używać ciemnego tekstu na jasnym tle (primary: rgba(0,0,0,0.87), secondary: rgba(0,0,0,0.55))
- **FR-004**: System MUSI zachować responsywność i czytelność na mobile i desktop
- **FR-005**: Komponenty MUI MUSZĄ być dostosowane przez theme overrides (nie inline styles per component)
- **FR-006**: System MUSI zapewnić fallback dla przeglądarek bez wsparcia backdrop-filter
- **FR-007**: Kolor primary MUSI być iOS blue (#007AFF) zamiast indigo (#818cf8)
- **FR-008**: Font family POWINIEN być Inter/SF Pro-like zamiast DM Sans/Outfit

### Key Entities

Brak nowych encji — zmiana dotyczy wyłącznie warstwy prezentacji (theme, CSS, component overrides).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Wszystkie strony (/, /todos) renderują się z jasnym tłem i ciemnym tekstem
- **SC-002**: Efekt glass morphism widoczny na Card, Paper i AppBar (backdrop-filter blur)
- **SC-003**: Kontrast tekstu spełnia WCAG AA (min. 4.5:1 ratio)
- **SC-004**: `npm test` i `npm run lint` przechodzą bez błędów
- **SC-005**: Aplikacja wygląda spójnie na Chrome, Safari i Firefox
