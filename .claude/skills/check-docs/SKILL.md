---
name: check-docs
description: Sprawdza czy dokumentacja projektu (CLAUDE.md, DZIENNIK_ZMIAN.md, README.md) wymaga aktualizacji względem ostatnich zmian w kodzie.
---

# Sprawdzanie aktualności dokumentacji

## 1. Przeczytaj pliki dokumentacji

Przeczytaj kluczowe sekcje:

- `DZIENNIK_ZMIAN.md` - data ostatniego wpisu
- `CLAUDE.md` - sekcje: "API Endpoints", "Komendy", "Struktura projektu", "Aktualne blokery"
- `README.md` - endpointy, komendy, struktura

## 2. Sprawdź ostatnie zmiany w kodzie

```bash
git status
git log --oneline -5
git diff --name-only HEAD~5
```

## 3. Sprawdź moduły NestJS

```bash
ls apps/api/src/
```

Porównaj z sekcją "Struktura projektu" w CLAUDE.md i README.md. Czy są nowe moduły?

## 4. Sprawdź komponenty React

```bash
ls apps/web/src/components/
ls apps/web/src/app/
ls apps/web/src/store/
```

Porównaj z dokumentacją. Czy są nowe komponenty, strony, slice'y?

## 5. Sprawdź endpointy API

```bash
grep -r "@Controller\|@Get\|@Post\|@Patch\|@Put\|@Delete" apps/api/src/ --include="*.ts" | grep -v node_modules | grep -v ".spec."
```

Porównaj z tabelą "API Endpoints" w CLAUDE.md.

## 6. Sprawdź skrypty package.json

```bash
cat package.json | grep -A 20 '"scripts"'
```

Porównaj z sekcją "Komendy" w CLAUDE.md.

## 7. Raportuj wyniki

```
## Status dokumentacji

| Plik | Status | Uwagi |
|------|--------|-------|
| DZIENNIK_ZMIAN.md | OK/DO AKTUALIZACJI | data ostatniego wpisu |
| CLAUDE.md | OK/DO AKTUALIZACJI | ... |
| README.md | OK/DO AKTUALIZACJI | ... |

### Nowe elementy do udokumentowania:

**Moduły NestJS:**
- [ ] `nazwa-modulu` - brak w dokumentacji

**Komponenty React:**
- [ ] `NazwaKomponentu` - brak w dokumentacji

**Endpointy API:**
- [ ] `METHOD /endpoint` - brak w dokumentacji

**Komendy:**
- [ ] `komenda` - brak w dokumentacji

### Sugerowane akcje:
1. [konkretna akcja do wykonania]
2. [kolejna akcja]
```

Jeśli wszystko aktualne: "Dokumentacja jest aktualna. Brak wymaganych zmian."
