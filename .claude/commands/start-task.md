---
description: "Orkiestrator pełnego workflow Spec-Driven Development — prowadzi od opisu do implementacji"
---

# /start-task $ARGUMENTS

Przeprowadź użytkownika przez pełny workflow spec-kit, faza po fazie.

## User Input

```text
$ARGUMENTS
```

Dane wejściowe to opis zadania LUB URL GitHub Issue.

## FAZA 0: ROZPOZNANIE

### Krok 0.1: Parsowanie danych wejściowych

Sprawdź co użytkownik podał w `$ARGUMENTS`:

- **Jeśli URL GitHub Issue** (pasuje do `https://github.com/.*/issues/[0-9]+`):
  Pobierz kontekst:
  ```bash
  gh issue view <number> --json title,body,labels
  ```
  Użyj tytułu i opisu jako feature description.
  Jeśli issue ma label `bug` → traktuj jako bug fix (patrz Krok 0.3).

- **Jeśli tekstowy opis**: Użyj go bezpośrednio jako feature description.

- **Jeśli puste**: Zapytaj użytkownika o opis funkcjonalności.

### Krok 0.2: Wykrywanie istniejących artefaktów

Sprawdź czy jest aktywna feature branch:

```bash
git rev-parse --abbrev-ref HEAD
```

Jeśli branch pasuje do `[0-9]{3}-*` (feature) lub `fix/*` (bug fix), sprawdź istniejące artefakty:

```bash
.specify/scripts/bash/check-prerequisites.sh --paths-only --json
```

Jeśli artefakty istnieją, pokaż status i zapytaj od której fazy wznowić:

```
Wykryto istniejące artefakty dla [branch]:
  ✅ spec.md (istnieje)
  ✅ plan.md (istnieje)
  ⏳ tasks.md (3/7 ukończone)

Od której fazy wznowić?
1. Od początku (nowy spec)
2. Od planowania (nowy plan)
3. Od implementacji (kontynuuj tasks)
```

Jeśli na `main` — kontynuuj do Fazy 1.

### Krok 0.3: Klasyfikacja typu zadania (feature vs fix)

Określ typ na podstawie opisu:
- **Bug fix** — opis zawiera słowa: "fix", "bug", "napraw", "nie działa", "broken", "błąd", "problem", "regression" lub issue ma label `bug`
- **Feature** — wszystko inne

**Dla bug fix**:
- Branch: `fix/NN-short-name` (np. `fix/01-fix-boards-fetch`)
- Spec dir: `specs/fix/NN-short-name/`
- Numer NN: kolejny w `specs/fix/` (01, 02, 03...)
- Utwórz ręcznie (bez `create-new-feature.sh`):
  ```bash
  git checkout -b fix/NN-short-name
  mkdir -p specs/fix/NN-short-name
  ```

**Dla feature**:
- Branch: `NNN-short-name` (np. `010-kanban-board`)
- Spec dir: `specs/feat/NNN-short-name/`
- Użyj `create-new-feature.sh` jak dotychczas (tworzy w `specs/feat/`)

## FAZA 1: SPECYFIKACJA

Poinformuj użytkownika:

```
═══ FAZA 1/4: SPECYFIKACJA ═══
Tworzę specyfikację na podstawie opisu...
```

Wykonaj pełny workflow z `/speckit.specify`:

1. Wygeneruj short-name z opisu (2-4 słowa)
2. Sprawdź istniejące branche i numery
3. Utwórz branch i spec dir:
   - **Feature**: `create-new-feature.sh --json --short-name "<short-name>" --number <N> "<description>"`
   - **Bug fix**: Ręcznie `git checkout -b fix/NN-short-name && mkdir -p specs/fix/NN-short-name/`
4. Załaduj `.specify/templates/spec-template.md`
5. Przeanalizuj istniejący kod projektu:
   - `apps/api/src/` — moduły NestJS
   - `apps/web/src/components/` — komponenty React
   - `apps/web/src/store/` — slice'y Redux
6. Wypełnij spec.md na podstawie opisu i analizy
7. Waliduj jakość specyfikacji (max 3 NEEDS CLARIFICATION)
8. Pokaż spec.md użytkownikowi

**STOP — Czekaj na akceptację:**

```
Specyfikacja gotowa: specs/feat/[branch]/spec.md (lub specs/fix/[branch]/ dla bug fix)

Chcesz:
1. Zaakceptować i przejść do planowania
2. Wyjaśnić niejasności (/speckit.clarify)
3. Poprawić coś w specyfikacji
```

Po akceptacji → Faza 2.

## FAZA 2: PLANOWANIE

```
═══ FAZA 2/4: PLANOWANIE ═══
Tworzę plan techniczny i listę zadań...
```

### Krok 2.1: Plan techniczny

Wykonaj workflow z `/speckit.plan`:

1. Setup:
   ```bash
   .specify/scripts/bash/setup-plan.sh --json
   ```
2. Załaduj spec.md i `.specify/memory/constitution.md`
3. Wypełnij plan.md z kontekstem technicznym Spark:
   - Stack: Next.js 15 / NestJS 11 / TypeORM / MariaDB 11 / TypeScript 5.7
   - State: Redux Toolkit
   - UI: MUI 6 + Tailwind CSS 4
   - Testy: Jest + Testing Library + Supertest
4. Weryfikacja z konstytucją (Art. I-IX)
5. Wygeneruj research.md, data-model.md, contracts/ (jeśli potrzebne)
6. Aktualizuj kontekst agenta:
   ```bash
   .specify/scripts/bash/update-agent-context.sh claude
   ```

### Krok 2.2: Lista zadań

Wykonaj workflow z `/speckit.tasks`:

1. Prereq:
   ```bash
   .specify/scripts/bash/check-prerequisites.sh --json
   ```
2. Załaduj plan.md, spec.md, data-model.md
3. Wygeneruj tasks.md:
   - Phase 1: Setup (entity, moduł NestJS)
   - Phase 2: Foundational (jeśli blocking prereq)
   - Phase 3+: Per user story (modele → serwisy → kontrolery → frontend → testy)
   - Final: Polish (dokumentacja, czyszczenie)
4. Format: `- [ ] T### [P?] [US?] Opis z file path`

**STOP — Pokaż plan i zadania:**

```
Plan: specs/{feat|fix}/[branch]/plan.md
Zadania: specs/{feat|fix}/[branch]/tasks.md

Podsumowanie:
- [N] zadań w [M] fazach
- Szacowane user stories: [lista]

Chcesz:
1. Zaakceptować i przejść do implementacji
2. Zmienić coś w planie
3. Przeanalizować spójność (/speckit.analyze)
```

Po akceptacji → Faza 3.

## FAZA 3: IMPLEMENTACJA

```
═══ FAZA 3/4: IMPLEMENTACJA ═══
Implementuję zadania z tasks.md...
```

Wykonaj workflow z `/speckit.implement`:

1. Prereq:
   ```bash
   .specify/scripts/bash/check-prerequisites.sh --json --require-tasks --include-tasks
   ```
2. Załaduj pełen kontekst (tasks.md, plan.md, spec.md, constitution.md)
3. Implementuj zadania faza po fazie:
   - Po każdym zadaniu zaznacz `[X]` w tasks.md
   - Raportuj postęp
4. **WAŻNE — Docker rebuild**: Jeśli instalowałeś/usuwałeś zależności (npm install/uninstall) lub zmieniałeś package.json/package-lock.json, przebuduj odpowiedni kontener Docker:
   ```bash
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build web   # po zmianach w apps/web
   docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d --build api   # po zmianach w apps/api
   ```
5. Po implementacji uruchom testy:
   ```bash
   npm test
   npm run lint --workspaces --if-present
   ```
6. Napraw ewentualne błędy

Jeśli testy nie przechodzą — napraw i powtórz.

## FAZA 4: FINALIZACJA

```
═══ FAZA 4/4: FINALIZACJA ═══
Finalizuję: dokumentacja, commit, PR...
```

### Krok 4.1: Lint i Typecheck

Uruchom ESLint i sprawdzenie typów dla backendu i frontendu:

```bash
npm run lint -w apps/api
npm run typecheck -w apps/api
npm run lint -w apps/web
```

Jeśli są błędy — napraw je przed kontynuacją.

### Krok 4.2: Sprawdź dokumentację (/check-docs)

Uruchom `/check-docs` — sprawdza aktualność DZIENNIK_ZMIAN.md, CLAUDE.md i README.md względem zmian w kodzie. Napraw wszystkie wykryte rozbieżności:
- DZIENNIK_ZMIAN.md: dodaj wpis sesji z opisem zmian
- CLAUDE.md: zaktualizuj "Struktura projektu" i "API Endpoints"
- README.md: zaktualizuj "API Endpoints" i inne zmienione sekcje

### Krok 4.3: Podsumowanie

Pokaż podsumowanie:

```
═══ ZAKOŃCZONO ═══

Branch: [branch-name]
Spec:   specs/{feat|fix}/[branch]/spec.md
Plan:   specs/{feat|fix}/[branch]/plan.md
Tasks:  specs/{feat|fix}/[branch]/tasks.md ([done]/[total] ukończone)

Testy:  ✅ npm test — PASS
Lint:   ✅ npm run lint — PASS

Następne kroki:
1. git add -A && git commit -m "feat(scope): opis"
2. git push -u origin [branch]
3. gh pr create (jeśli gh zainstalowany)
```

**NIE commituj automatycznie** — zostaw decyzję użytkownikowi.
