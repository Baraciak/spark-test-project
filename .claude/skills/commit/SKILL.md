---
name: commit
description: Analizuje zmiany i generuje commit message w konwencji Conventional Commits. Wykonuje commit.
---

# Generowanie commit message

## 1. Sprawdź zmiany

```bash
git status
git diff --staged
git diff
```

## 2. Wygeneruj commit message

Format: `type(scope): description`

**Typy:**
- `feat` - nowa funkcjonalność
- `fix` - naprawa błędu
- `docs` - dokumentacja
- `refactor` - refaktoryzacja
- `test` - testy
- `chore` - maintenance, config, CI

**Scope (opcjonalny):**
- `api` - zmiany w apps/api
- `web` - zmiany w apps/web
- `shared` - zmiany w packages/
- `config` - zmiany w konfiguracji root (docker, CI, tsconfig)

**Przykłady:**
- `feat(api): add products CRUD module`
- `fix(web): fix todo toggle not updating UI`
- `docs: update CLAUDE.md with new endpoints`
- `test(api): add unit tests for todos service`
- `chore(config): update docker-compose for hot-reload`

## 3. Dodaj pliki i wykonaj commit

```bash
git add [pliki]
git commit -m "type(scope): description"
```

Jeśli zmiany dotyczą wielu scope'ów, użyj najbardziej ogólnego lub pomiń scope.
