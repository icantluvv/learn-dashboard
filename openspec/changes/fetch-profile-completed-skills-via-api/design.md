## Context

Change ретроспективно описывает staged diff. Фактический API workspace использует Kubb и
`npm --workspace @repo/api run generate`; исходный контракт находится в `api/src/`.
Мотивация описана в proposal.md. Базовая группировка задана активным `redesign-profile-page`.

## Goals / Non-Goals

**Goals:** актуальные данные после SPA-навигации и независимые состояния карточки/списка.

**Non-Goals:** изменение модели completion, хранения аватаров, темы и slider.

## Decisions

- Route Handler переиспользует `getCurrentUser` и repository выборки. Идентификатор пользователя
  не принимается от клиента, чтобы граница доступа оставалась на сервере.
- Вместо прежней серверной выборки и `HydrationBoundary` используются `useGetAuthMe` и
  `useGetCompletedSkillsByCore`. Это связывает отображение с общим клиентским кэшем;
  сохранение prefetch потребовало бы согласования двух источников обновления.
- Ключ списка: `[...getCompletedSkillsByCoreQueryKey(), user.id]`; запрос включается после auth.
  Инвалидация префикса после успешной mutation обновляет активные и помечает неактивные запросы.
  Локальный `staleTime` не задаётся, применяются общие настройки QueryClient.
- Endpoint включён в same-origin маршрутизацию клиента: браузер использует относительный URL,
  сервер — origin `BETTER_AUTH_URL`. Общие обработчики API ошибок сохраняются; отсутствие
  редиректа в spec относится к компоненту выбора экранов, а не ко всему API-клиенту.
- Представление разбито на route-local карточку, аватар, содержимое списка, группы и ссылки.
  При ошибке обновления содержимое кэша остаётся доступно рядом с retry.

## Risks / Trade-offs

- Первый вход без кэша показывает загрузку и создаёт последовательные auth/list запросы →
  отдельный skeleton списка сохраняет доступность карточки после auth.
- Изменён 401 UX → явно обновить profile-page spec и проверить реальную сессию в E2E.
- Другие same-origin запросы затронуты изменением server base URL → unit regression проверки.
- Активный redesign-profile-page сохраняет прежние prefetch/guest решения → при архивировании
  согласовать порядок: сначала базовый redesign, затем этот change; прежний change здесь не редактируется.

## Migration Plan

Изменений БД нет. Endpoint, контракт/generated клиент и UI поставляются вместе.
Откат возвращает серверную выборку и прежние экраны, удаляет endpoint и регенерирует клиент.

## Test strategy

- Unit: session/no-session endpoint и same-origin маршрутизация; мок сессии и repository.
- Component: auth loading/error/success, список loading/empty/groups/error/retry, ссылки,
  смена пользователя и успешная инвалидация с реальным QueryClient и мокнутым API.
- E2E: реальная сессия, отметка и снятие отметки → возврат в профиль через SPA;
  отрицательный путь endpoint без сессии и смена аккаунта.
- Typed fixtures/generated factories, без реального backend в Vitest. Существующий
  `profile-view.test.tsx` соответствует текущему browser component project.
- TDD до существующего кода не подтверждается. Для недостающего покрытия: failing regression
  test → минимальная корректировка → green; в этой задаче production-код не меняется.
- Verification gates и каждый нормативный сценарий перечислены в test-plan.md.
