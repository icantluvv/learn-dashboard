# Frontend Starter: архитектура и contract-first pipeline

## Стек

| Компонент    | Технология                            |
| ------------ | ------------------------------------- |
| Frontend     | Next.js 16, React 19                  |
| Стили        | Tailwind CSS 4                        |
| API-контракт | OpenAPI 3.0 (yaml)                    |
| Codegen      | Kubb (клиенты, хуки, моки, zod-схемы) |
| Тесты        | Vitest, Playwright                    |
| Линтер       | ESLint, oxfmt                         |

## Структура репозитория

```
starter/
├── app/                          # Next.js App Router (страницы, layout)
├── src/
│   ├── constants/                # Глобальные константы
│   ├── env/                      # Типизация переменных окружения
│   ├── mock-mode/                # Mock-режим (конфиг + runtime)
│   ├── proxy/                    # Прокси-цепочка (inject-headers и др.)
│   └── utils/                    # Утилиты (query client и др.)
├── packages/
│   └── api/                      # Codegen-пакет (Kubb)
│       ├── kubb.config.ts
│       ├── base/                 # Базовые клиенты, моки, search-params
│       │   └── codegen/          # Сгенерированные клиенты, хуки, типы, zod
│       └── plugins/              # Kubb-плагины
├── api/                          # OpenAPI-контракт
│   ├── redocly.yaml              # Линтер-правила и сборка спеки
│   └── src/
│       ├── openapi.yaml          # Source of truth для HTTP API
│       ├── paths/                # Эндпоинты (один файл = один path)
│       └── components/           # Переиспользуемые схемы и security
├── docs/                         # Документация
│   ├── DEVELOPMENT_PROCESS.md
│   └── adr/                      # Architectural Decision Records
└── public/                       # Статические ассеты
```

## Contract-first pipeline

### Два уровня спецификаций

```
OpenSpec (процесс)     →  "ЧТО строим, ЗАЧЕМ, КАК спроектировано"
  proposal → design → specs → tasks

OpenAPI (контракт)     →  "КАК выглядит API для потребителя"
  api/src/openapi.yaml — source of truth

Codegen (автоматизация) →  генерируемые артефакты (clients, hooks, mocks, zod)
  packages/api/base/codegen/
```

### Workflow фичи

1. **OpenSpec**: proposal.md → design.md → specs/\*.md
2. Из спеки → правка `api/src/openapi.yaml`
3. Валидация и сборка контракта через Redocly
4. Запуск Kubb → регенерация `packages/api/base/codegen/`
5. **OpenSpec**: tasks.md → реализация

Полный процесс — в [docs/DEVELOPMENT_PROCESS.md](docs/DEVELOPMENT_PROCESS.md).

### Codegen (Kubb)

Генерация клиентов запускается командой:

```bash
bun run --filter @packages/api kubb generate
```

Артефакты в `packages/api/base/codegen/`:

- `clients/` — типизированные fetch-клиенты
- `hooks/` — React Query хуки
- `mocks/` — MSW-хендлеры для mock-режима
- `types/` — TypeScript-типы
- `zod/` — zod-схемы для валидации

## Переменные окружения

Пример конфига: `.env.example`. Типизация:

- `src/env/server.ts` — серверные переменные
- `src/env/client.ts` — клиентские переменные (только `NEXT_PUBLIC_*`)

## Скрипты

```bash
bun dev            # Dev-сервер
bun build          # Production-сборка
bun test           # Все тесты
bun test:unit      # Unit-тесты (Vitest)
bun test:e2e       # E2E-тесты (Playwright)
bun lint           # ESLint
bun fmt            # oxfmt
bun typecheck      # TypeScript
```
