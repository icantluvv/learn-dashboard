# Процесс разработки

## Структура репозитория

```
bcp/
├── api/
│   ├── redocly.yaml          ← линтер-правила и сборка спеки
│   └── src/
│       ├── openapi.yaml      ← корневой API-контракт (source of truth)
│       ├── paths/            ← эндпоинты (один файл = один path)
│       └── components/schemas/ ← переиспользуемые схемы
├── apps/
│   └── frontend/
├── CLAUDE.md                 ← технический контекст FE для AI
├── docs/                     ← документация проекта
└── openspec/
    ├── config.yaml           ← продуктовый контекст
    ├── specs/                ← живая документация поведения продукта
    └── changes/
        └── <feature>/
```

---

## Процесс разработки фичи

```
1. ТРЕБОВАНИЯ
   Аналитик/PM/codex/claude фиксирует бизнес-правила и сценарии в REQUIREMENTS.md.

2. OPENSPEC
   /openspec-propose <feature>

   proposal.md  — что и зачем меняется
   specs/       — поведение системы в нейтральном продуктовом языке
   design.md    — архитектура + API Shape (форма эндпоинтов и схемы)
   tasks.md     — группа 1: API-контракт; далее реализация и тесты

3. API-КОНТРАКТ
   Команда создаёт api/src/paths/<feature>.yaml по API Shape из design.md.
   Открывает PR → ревьюит и верифицирует → мержат.
   Контракт согласован — можно приступать к реализации.

4. РЕАЛИЗАЦИЯ
   /openspec-apply <feature>

5. ARCHIVE
   /openspec-archive-change → пополняет openspec/specs/
```

---

## Правила OpenSpec

Детальные правила описания спецификаций, дизайна и задач — в `openspec/config.yaml` (раздел `rules`).

## Контекст для AI

| Где работает AI     | Откуда берёт контекст  |
| ------------------- | ---------------------- |
| `/openspec-propose` | `openspec/config.yaml` |
| FE реализация       | `CLAUDE.md`            |

---

## Definition of Done

|      | Критерий                            |
| ---- | ----------------------------------- |
| FE   | тесты + линтер (см. `CLAUDE.md`)    |
| API  | `npm run lint` из `api/` без ошибок |
| Фича | реализована и заархивирована        |
