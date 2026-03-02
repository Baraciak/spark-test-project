# Spec-Kit — Wdrożenie dla Spark Test Project

> **Przeznaczenie**: Przewodnik wdrożenia oficjalnego [github/spec-kit](https://github.com/github/spec-kit)
> w monorepo Spark Test Project (Next.js 15 / NestJS 11 / MariaDB).
>
> **Wymagania**: Python 3.11+, Claude Code CLI, Git, bash/zsh
>
> **Opcjonalnie**: `gh` CLI (do `/speckit.taskstoissues`)

---

## Spis treści

1. [Przegląd systemu](#1-przegląd-systemu)
2. [Instalacja spec-kit](#2-instalacja-spec-kit)
3. [Struktura po inicjalizacji](#3-struktura-po-inicjalizacji)
4. [Dostosowanie do projektu Spark](#4-dostosowanie-do-projektu-spark)
5. [Opcjonalnie: GitHub Issues](#5-opcjonalnie-github-issues)
6. [Weryfikacja instalacji](#6-weryfikacja-instalacji)
7. [Użycie](#7-użycie)

---

## 1. Przegląd systemu

Spec-Kit to oficjalny toolkit GitHub do **Spec-Driven Development**. Workflow:

```
/speckit.constitution  → Zasady projektu (jednorazowo)
/speckit.specify       → Specyfikacja funkcjonalności (spec.md)
/speckit.clarify       → Wyjaśnienie niejasności (opcjonalnie)
/speckit.plan          → Plan techniczny (plan.md, data-model.md)
/speckit.tasks         → Lista zadań (tasks.md)
/speckit.implement     → Implementacja kodu + testy
```

**Filozofia**: `tasks.md` jest źródłem prawdy. Lokalne pliki markdown — nie GitHub Projects, nie Jira — kierują workflow. GitHub Issues to opcjonalny, jednokierunkowy eksport dla widoczności zespołowej.

**Oficjalne repo**: https://github.com/github/spec-kit

---

## 2. Instalacja spec-kit

### 2.1 Instalacja CLI

```bash
# Wymagany Python 3.11+
python3 --version

# Instalacja specify CLI
uv tool install specify-cli --from git+https://github.com/github/spec-kit.git

# Weryfikacja
specify --version
```

> Jeśli nie masz `uv`: `pip install uv` lub `brew install uv`

### 2.2 Inicjalizacja w projekcie

```bash
cd /Users/aleksandernowicki/Desktop/PROJECTS/spark_test_project

# Inicjalizacja z Claude Code jako agentem AI i bash jako shell
specify init --here --force --ai claude --script sh
```

To utworzy:
- `.specify/` — skrypty, szablony, pamięć
- `.claude/commands/` — slash commands dla Claude Code
- Zaktualizuje `CLAUDE.md`

### 2.3 Alternatywa: ręczna instalacja

Jeśli nie chcesz instalować Python CLI, możesz ręcznie utworzyć strukturę.
Wszystkie pliki opisane w [sekcji 3](#3-struktura-po-inicjalizacji).

---

## 3. Struktura po inicjalizacji

```
spark_test_project/
├── .specify/
│   ├── scripts/bash/
│   │   ├── common.sh                 # Wspólne funkcje
│   │   ├── create-new-feature.sh     # Tworzenie brancha i spec dir
│   │   ├── check-prerequisites.sh    # Walidacja prereq
│   │   ├── setup-plan.sh             # Inicjalizacja plan.md
│   │   └── update-agent-context.sh   # Aktualizacja CLAUDE.md
│   ├── templates/
│   │   ├── spec-template.md          # Szablon specyfikacji
│   │   ├── plan-template.md          # Szablon planu technicznego
│   │   ├── tasks-template.md         # Szablon listy zadań
│   │   └── constitution-template.md  # Szablon konstytucji
│   ├── memory/
│   │   └── constitution.md           # Konstytucja projektu
│   └── specs/                        # Artefakty per feature (tworzone w runtime)
│       └── 001-feature-name/
│           ├── spec.md
│           ├── plan.md
│           ├── data-model.md
│           ├── tasks.md
│           └── contracts/
│
├── .claude/
│   ├── commands/                     # Slash commands (z specify init)
│   │   ├── speckit.constitution.md
│   │   ├── speckit.specify.md
│   │   ├── speckit.clarify.md
│   │   ├── speckit.plan.md
│   │   ├── speckit.tasks.md
│   │   ├── speckit.implement.md
│   │   ├── speckit.checklist.md      # Opcjonalny — dodany ręcznie
│   │   ├── speckit.analyze.md        # Opcjonalny — dodany ręcznie
│   │   └── speckit.taskstoissues.md  # Opcjonalny — eksport do GitHub Issues
│   ├── settings.json
│   └── settings.local.json
│
├── CLAUDE.md                          # Kontekst projektu (aktualizowany)
├── DZIENNIK_ZMIAN.md                  # Historia sesji
├── apps/
│   ├── api/                           # NestJS 11
│   └── web/                           # Next.js 15
└── packages/
```

---

## 4. Dostosowanie do projektu Spark

Po `specify init`, dostosuj 3 pliki:

### 4.1 Konstytucja (`.specify/memory/constitution.md`)

Zastąp wygenerowaną konstytucję wersją dopasowaną do Spark:

```markdown
# Konstytucja: Spark Test Project

> Wersja: 1.0.0 | Marzec 2026

## Artykuł I — Architektura monorepo

Projekt MUSI zachować strukturę monorepo z npm workspaces:
- `apps/web` — Next.js 15 (App Router, port 3000)
- `apps/api` — NestJS 11 (REST API, port 3001)
- `packages/` — Współdzielone biblioteki
- NIE importuj bezpośrednio między apps/api i apps/web

## Artykuł II — Backend (NestJS)

- Logika biznesowa MUSI być w serwisach, NIE w kontrolerach
- Walidacja MUSI używać class-validator w DTO
- Każdy endpoint MUSI mieć Swagger dekoratory (@ApiOperation, @ApiResponse)
- Entity: UUID PK + CreateDateColumn + UpdateDateColumn
- Wyjątki: wbudowane NestJS (NotFoundException, BadRequestException)
- NIE używaj `synchronize: true` na produkcji — migracje TypeORM

## Artykuł III — Frontend (Next.js)

- State management: Redux Toolkit z createAsyncThunk
- API calls: Axios przez services/api.ts (next.config.ts rewrites)
- UI: MUI 6 + Tailwind CSS 4 + Emotion
- `'use client'` TYLKO gdy potrzebne (hooks, events, Redux)

## Artykuł IV — TypeScript

- NIE używaj `any` — pełne typowanie
- NIE hardcoduj konfiguracji — process.env / ConfigModule
- Path alias `@/` w frontend

## Artykuł V — Testowanie

Wszystkie nowe funkcjonalności MUSZĄ mieć testy:
- Backend unit: mockowany repository, test serwisów (Jest)
- Backend E2E: Supertest na kontrolerach
- Frontend: Testing Library na komponentach
- `npm test` MUSI przechodzić przed merge
- `npm run lint --workspaces --if-present` bez błędów

## Artykuł VI — Docker

- Dev: `docker compose -f docker-compose.dev.yml up -d`
- Prod: `docker compose up -d` (multi-stage builds)
- Baza danych ZAWSZE przez Docker (MariaDB 11)

## Artykuł VII — Dokumentacja

- DZIENNIK_ZMIAN.md: wpis po KAŻDEJ sesji
- CLAUDE.md: aktualizuj gdy dodajesz moduły/endpointy
- Swagger: http://localhost:3001/docs

## Artykuł VIII — Komendy

```bash
npm run dev              # Oba serwisy
npm test                 # Wszystkie testy
npm run lint --workspaces --if-present
npm run build
npm run docker:dev       # Docker z hot-reload
```

## Artykuł IX — Workflow

Spec-Driven Development z oficjalnym spec-kit:
1. `/speckit.constitution` — zasady (ten plik)
2. `/speckit.specify` — specyfikacja
3. `/speckit.clarify` — wyjaśnienia
4. `/speckit.plan` — plan techniczny
5. `/speckit.tasks` — lista zadań
6. `/speckit.implement` — implementacja

**Wersja**: 1.0.0 | **Ratyfikowana**: Marzec 2026
```

### 4.2 Plan template (`.specify/templates/plan-template.md`)

Dodaj kontekst techniczny Spark do szablonu planu:

```markdown
# Plan techniczny: [FUNKCJONALNOŚĆ]

**Branch**: `[###-feature]` | **Data**: [DATA] | **Spec**: [link]

## Podsumowanie

[Główne wymaganie + podejście techniczne]

## Kontekst techniczny

**Stack**: Next.js 15 / NestJS 11 / TypeORM / MariaDB 11 / TypeScript 5.7
**State**: Redux Toolkit (async thunks)
**UI**: MUI 6 + Tailwind CSS 4
**Testy**: Jest + Testing Library (FE), Jest + Supertest (BE)
**Konteneryzacja**: Docker Compose

## Weryfikacja z Konstytucją

- [ ] Logika biznesowa w serwisach (Art. II)
- [ ] DTO z class-validator (Art. II)
- [ ] Swagger dekoratory (Art. II)
- [ ] Brak `any` (Art. IV)
- [ ] Testy unit + E2E (Art. V)

## Struktura kodu

### Dokumentacja

\`\`\`text
.specify/specs/[###-feature]/
├── spec.md
├── plan.md
├── data-model.md
├── tasks.md
└── contracts/
\`\`\`

### Backend (zmiany)

\`\`\`text
apps/api/src/[modul]/
├── [modul].module.ts
├── [modul].controller.ts
├── [modul].service.ts
├── entities/[modul].entity.ts
└── dto/
    ├── create-[modul].dto.ts
    └── update-[modul].dto.ts
\`\`\`

### Frontend (zmiany)

\`\`\`text
apps/web/src/
├── components/[modul]/
├── store/[modul]Slice.ts
├── services/api.ts (update)
└── types/[modul].ts
\`\`\`

## Śledzenie złożoności

| Naruszenie | Dlaczego | Alternatywa odrzucona |
|------------|----------|-----------------------|
```

### 4.3 CLAUDE.md — dodaj sekcję workflow

Dodaj na końcu istniejącego `CLAUDE.md`:

```markdown
---

## Workflow rozwoju (Spec-Driven Development)

**Oficjalny spec-kit**: https://github.com/github/spec-kit

Komendy:
- `/speckit.constitution` — zasady projektu
- `/speckit.specify "opis"` — specyfikacja funkcjonalności
- `/speckit.clarify` — wyjaśnienie niejasności
- `/speckit.plan` — plan techniczny
- `/speckit.tasks` — lista zadań
- `/speckit.implement` — implementacja

Artefakty: `.specify/specs/{###-feature}/`
Konstytucja: `.specify/memory/constitution.md`
```

---

## 5. Opcjonalnie: GitHub Issues

Spec-kit oficjalnie traktuje `tasks.md` jako źródło prawdy. GitHub Issues to **opcjonalny, jednokierunkowy eksport** — przydatny dla widoczności zespołowej.

### 5.1 Wymagania

```bash
# GitHub CLI
brew install gh
gh auth login

# Remote musi być skonfigurowany
git remote -v
# Jeśli brak:
gh repo create spark-test-project --private --source=. --remote=origin --push
```

### 5.2 Komenda `/speckit.taskstoissues`

Utwórz `.claude/commands/speckit.taskstoissues.md`:

```markdown
---
description: "Eksport tasks.md do GitHub Issues (jednokierunkowy)"
---

# /speckit.taskstoissues

Konwertuj lokalne zadania z tasks.md na GitHub Issues.
To jest **jednokierunkowy push** — tasks.md pozostaje źródłem prawdy.

## 1. Znajdź tasks.md

Przeczytaj bieżący feature directory:

```bash
.specify/scripts/bash/check-prerequisites.sh --paths-only --json
```

Przeczytaj tasks.md z tego katalogu.

## 2. Parsuj zadania

Wyodrębnij zadania w formacie:
- `- [ ] Z001 Opis`  → issue do utworzenia (open)
- `- [x] Z002 Opis`  → pomiń (ukończone)

## 3. Utwórz GitHub Issues

Dla każdego nieukończonego zadania:

```bash
gh issue create --title "[Z001] Opis zadania" --body "Part of feature branch \`###-feature\`." --label "spec-kit"
```

Upewnij się, że label `spec-kit` istnieje:

```bash
gh label create "spec-kit" --color "0075ca" --description "Task from spec-kit" 2>/dev/null || true
```

## 4. Pokaż wynik

| Task ID | GitHub Issue | Tytuł |
|---------|-------------|-------|
| Z001    | #12         | Opis  |
| Z003    | #13         | Opis  |

Pomiń zadania już oznaczone [x] w tasks.md.

## Ważne

- To jest **jednorazowy push**, nie sync
- Zmiany na GitHub NIE propagują się z powrotem do tasks.md
- tasks.md pozostaje źródłem prawdy
- Aby zamknąć issues — zamykaj ręcznie lub przez PR z `Closes #12`
```

### 5.3 Zamykanie issues przez PR

Najlepszy sposób na zamknięcie issues — użyj keyword w PR:

```bash
gh pr create --title "feat(modul): opis" --body "## Summary
- Opis zmian

Closes #12, closes #13, closes #14

## Test plan
- [ ] npm test passes
- [ ] Manual testing done"
```

GitHub automatycznie zamknie issues #12, #13, #14 po merge PR.

---

## 6. Weryfikacja instalacji

```bash
# 1. Sprawdź CLI
specify --version

# 2. Sprawdź strukturę
ls .specify/scripts/bash/
ls .specify/templates/
ls .specify/memory/constitution.md
ls .claude/commands/speckit.*.md

# 3. Sprawdź uprawnienia
ls -la .specify/scripts/bash/*.sh

# 4. Test tworzenia feature
.specify/scripts/bash/create-new-feature.sh --json "Test feature"
# → {"BRANCH_NAME":"001-test-feature","SPEC_FILE":"...","FEATURE_NUM":"001"}

# 5. Cleanup
git checkout main
git branch -D 001-test-feature 2>/dev/null || true
rm -rf .specify/specs/001-test-feature

# 6. Test komendy w Claude Code
# Wpisz: /speckit.constitution
# Powinno aktywować komendę
```

### Checklist

**Core (wymagane):**
- [ ] `specify` CLI zainstalowany
- [ ] `specify init --here --force --ai claude --script sh` wykonany
- [ ] `.specify/memory/constitution.md` dostosowana do Spark
- [ ] `.specify/templates/plan-template.md` z kontekstem Spark
- [ ] `CLAUDE.md` z sekcją workflow
- [ ] `DZIENNIK_ZMIAN.md` istnieje
- [ ] Skrypty bash wykonywalne (`chmod +x`)
- [ ] Komendy `/speckit.*` widoczne w Claude Code

**Opcjonalne (GitHub Issues):**
- [ ] `gh` CLI zainstalowany i zalogowany
- [ ] GitHub remote skonfigurowany
- [ ] `.claude/commands/speckit.taskstoissues.md` utworzony
- [ ] Label `spec-kit` utworzony na GitHub

---

## 7. Użycie

### Pełny workflow nowej funkcjonalności

```
# 1. Ustanów zasady (jednorazowo, na początku projektu)
/speckit.constitution

# 2. Opisz co chcesz zbudować
/speckit.specify "Dodaj moduł produktów z CRUD i filtrowaniem"

# 3. Wyjaśnij niejasności (opcjonalnie)
/speckit.clarify

# 4. Wygeneruj plan techniczny
/speckit.plan

# 5. Rozpisz na zadania
/speckit.tasks

# 6. (Opcja) Wyeksportuj do GitHub Issues
/speckit.taskstoissues

# 7. Implementuj
/speckit.implement

# 8. Po implementacji — DZIENNIK_ZMIAN.md, commit, PR
```

### Wznowienie przerwanego workflow

```
# Claude wykryje istniejące artefakty:
# ✅ spec.md (istnieje)
# ✅ plan.md (istnieje)
# ⏳ tasks.md (3/7 ukończone)
#
# I kontynuuje od miejsca przerwania:
/speckit.implement
```

### Kolejna funkcjonalność

```
# Automatycznie tworzy 002-feature-name
/speckit.specify "Dodaj system autoryzacji JWT"
```

---

## Podsumowanie

| Co | Gdzie | Dostosować? |
|----|-------|-------------|
| CLI | `specify` (globalnie) | NIE — oficjalne narzędzie |
| Skrypty | `.specify/scripts/bash/` | NIE — generowane przez `specify init` |
| Szablony | `.specify/templates/` | **TAK** — `plan-template.md` ze stackiem Spark |
| Konstytucja | `.specify/memory/constitution.md` | **TAK** — zasady NestJS/Next.js |
| Komendy | `.claude/commands/speckit.*.md` | NIE — generowane przez `specify init` |
| taskstoissues | `.claude/commands/speckit.taskstoissues.md` | **Ręcznie** — opcjonalny |
| CLAUDE.md | `CLAUDE.md` | **TAK** — dodaj sekcję workflow |

### Kluczowe zasady

1. **`tasks.md` jest źródłem prawdy** — nie GitHub Issues, nie Project board
2. **GitHub Issues to jednokierunkowy eksport** — `/speckit.taskstoissues`
3. **Zamykanie issues przez PR** — `Closes #12` w opisie PR
4. **Nie buduj custom sync** — spec-kit celowo tego nie robi
5. **Constytucja = strażnik jakości** — weryfikowana przy każdym `/speckit.plan`

---

> **Źródła:**
> - [github/spec-kit](https://github.com/github/spec-kit) — oficjalne repo
> - [Spec-Driven Development blog post](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/)
> - [Quick Start Tutorial](https://deepwiki.com/github/spec-kit/2.2-quick-start-tutorial)
> - [Issue #880 — Spec-kit and GitHub Issues/Projects](https://github.com/github/spec-kit/issues/880)
> - [Issue #1088 — Tighter integration](https://github.com/github/spec-kit/issues/1088)
