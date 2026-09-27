# Frontend Starter Next App: архитектура и contract-first pipeline

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

## Авторизация

Аутентификация по email и паролю построена на [Better Auth](https://better-auth.com).

- `src/lib/auth/server.ts` — серверный инстанс (`server-only`). Подключается к **той же**
  Supabase-базе, но напрямую по Postgres (`SUPABASE_DB_URL`, session pooler), а не через PostgREST:
  таблицы `user`, `session`, `account`, `verification` создаются миграцией
  `supabase/migrations/*_create_better_auth_tables.sql` и закрыты RLS deny-all — читает их только
  серверное подключение.
- `app/api/auth/[...all]/route.ts` — catch-all Better Auth. Эти маршруты намеренно **не** входят в
  OpenAPI-контракт: это протокол библиотеки, а не наш API.
- `GET /api/me` (`operationId: getAuthMe`) — контрактный эндпоинт профиля: `200` с
  `{ id, name, email, gender, age, image? }` либо `401` для гостя. Фронтенд определяет состояние
  авторизации только по нему (`useGetAuthMe`), `authClient` используется для мутаций.
- Необязательный аватар регистрации принимается как JPEG, PNG или WebP размером до 5 МБ. Байты и
  MIME хранятся в закрытой RLS-таблице `user_avatar`, а `image` содержит абсолютный same-origin URL
  `GET /api/avatars/<uuid>`. Изображение отдаётся с `nosniff` и immutable cache headers; endpoint
  загружается браузером напрямую и не входит в JSON-oriented generated SDK.
- Если запись аватара после Better Auth завершается ошибкой, созданный этой попыткой пользователь
  удаляется, а FK каскадно очищает session/account/avatar. Operational-проверка несогласованных
  строк: найти `user.image LIKE '%/api/avatars/%'`, для которых отсутствует `user_avatar.user_id`;
  такой результат требует ручного удаления незавершённого пользователя.
- Новая регистрация принимает только `male` или `female`. Legacy-значение `other` остаётся в типе
  чтения и DB CHECK, чтобы не ломать уже сохранённые профили, но server action его отклоняет.
- `src/proxy/auth-guard.ts` — оптимистичная проверка cookie в proxy (редиректы). Авторитетная
  проверка сессии всегда делается на сервере через `getCurrentUser()`.

Переменные окружения (все server-only): `SUPABASE_DB_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`.
Браузерному `authClient` базовый URL не нужен — Better Auth берёт `window.location.origin`, а
handler висит на том же origin.

## PWA

Приложение устанавливается на домашний экран телефона и компьютера.

- `app/manifest.ts` — web app manifest (`name`, иконки, `display: standalone`, цвета темы).
- `public/icon.svg` и `public/icon-maskable.svg` — исходники иконки; `npm run icons` растрирует их
  через `sharp` в `public/icon-192.png`, `icon-512.png`, `icon-maskable-512.png` и
  `apple-touch-icon.png`. При замене марки достаточно перерисовать SVG и перезапустить команду.
- `app/layout.tsx` — метаданные для iOS (`appleWebApp`, `apple-touch-icon`) и `themeColor` для
  светлой/тёмной схемы; без них iOS не запускает сайт в standalone-режиме.
- `src/components/pwa-install/` — баннер установки: показывает кнопку там, где браузер поддерживает
  `beforeinstallprompt` (Chrome/Edge/Android), и инструкцию «Поделиться → На экран „Домой"» в iOS
  Safari, где такого события нет. Отказ пользователя запоминается в `localStorage`.
- Service worker и офлайн-режим сознательно не добавлялись — это отдельная тема со своими рисками
  (устаревший кэш), а установка работает и без них.

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
