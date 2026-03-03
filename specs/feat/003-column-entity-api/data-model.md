# Data Model: BoardColumn

## Entity: BoardColumn

**Table**: `board_columns`
**Extends**: `BaseEntity` (UUID PK, createdAt, updatedAt)

| Column | Type | Constraints | Default | Description |
|--------|------|-------------|---------|-------------|
| id | uuid | PK | auto-generated | From BaseEntity |
| name | varchar(255) | NOT NULL | — | Column display name |
| order | int | NOT NULL | 0 | Position within board (0-indexed) |
| boardId | uuid | FK → boards.id, NOT NULL | — | Parent board reference |
| createdAt | datetime(6) | NOT NULL | CURRENT_TIMESTAMP(6) | From BaseEntity |
| updatedAt | datetime(6) | NOT NULL | CURRENT_TIMESTAMP(6) ON UPDATE | From BaseEntity |

## Relations

### BoardColumn → Board (ManyToOne)
- `board_columns.boardId` → `boards.id`
- `onDelete: CASCADE` — usunięcie boarda kaskadowo usuwa kolumny
- `eager: false` — ładowane jawnie przez serwis

### Board → BoardColumn (OneToMany)
- Odwrotna strona relacji
- `cascade: false` na stronie Board
- Ładowane w `BoardsService.findOne()` z `relations: ['columns']`
- Sortowanie: `order: { columns: { order: 'ASC' } }`

### BoardColumn → Task (OneToMany) — przygotowane na feature 004
- Placeholder: `@OneToMany(() => Task, task => task.column)` — zakomentowane lub bez importu
- Zostanie aktywowane w feature 004

## Migration SQL (expected)

```sql
CREATE TABLE `board_columns` (
  `id` uuid NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `name` varchar(255) NOT NULL,
  `order` int NOT NULL DEFAULT 0,
  `boardId` uuid NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_board_columns_board` FOREIGN KEY (`boardId`) REFERENCES `boards` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;
```
