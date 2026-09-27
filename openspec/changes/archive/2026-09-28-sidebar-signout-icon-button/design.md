## Context

`ProfilePopover` (src/components/auth-status/profile-popover.tsx) сейчас оборачивает `AccountSummary` в `PopoverTrigger` и показывает кнопку "Выйти" внутри `PopoverContent`. Это единственное место, где рендерится `AccountSummary` для десктопного Sidebar (через `AuthStatus` → `ProfilePopover`). См. proposal.md - Why.

`@repo/core` уже предоставляет `Button` с вариантом `variant="ghost"` (без фона и без бордера в состоянии покоя, с hover-подсветкой `hover:bg-muted`) и размерами `icon-sm`/`icon-lg` для квадратной иконочной кнопки.

## Goals / Non-Goals

**Goals:**

- Убрать Popover как способ выхода из аккаунта в Sidebar.
- Показать кнопку выхода как иконку без фона/бордера рядом с `AccountSummary`.
- Сохранить текущую логику `useSignOut` без изменений.

**Non-Goals:**

- Не меняем `AccountDrawer` (мобильная версия уже устроена похожим образом).
- Не меняем визуальное содержимое `AccountSummary` (аватар, имя, email).
- Не добавляем подтверждение перед выходом (его не было и в Popover-версии).

## Decisions

- Убрать `Popover`/`PopoverTrigger`/`PopoverContent`/`useState(open)` из `ProfilePopover` целиком; компонент становится простым layout-контейнером: `<div className="flex items-center justify-between gap-...">`, где слева `AccountSummary`, справа кнопка выхода. Альтернатива — оставить `Popover`, но управлять `open` через отдельную кнопку, была отклонена: пользователь явно просит убрать меню, а не просто добавить быстрый доступ рядом с ним.
- Кнопка выхода — `Button` из `@repo/core` с `variant="ghost"` и `size="icon-lg"` (или `icon-sm`, по месту в Sidebar), содержит `LogOutIcon` из `lucide-react`, `aria-label="Выйти"`. `ghost` выбран вместо `outline` (как в `AccountDrawer`), потому что задача явно требует "без бордера и без бг" в состоянии покоя, а `outline` рисует видимую границу.
- `AccountSummary` перестаёт быть частью `<button>`/`PopoverTrigger`: убираем обёртку `<button type="button" className="w-full cursor-pointer rounded-xl text-left">` вокруг него в `ProfilePopover`, рендерим `<AccountSummary user={user} />` напрямую как некликабельный блок. Сам компонент `account-summary.tsx` не требует изменений, так как он уже не содержит интерактивной разметки — кликабельность добавлял только `ProfilePopover`.
- Имя компонента `ProfilePopover` становится неточным после удаления Popover. Оставляем имя файла/экспорта как есть в рамках этого change, чтобы ограничить diff местом использования (`AuthStatus`) и не затрагивать несвязанные импорты/тесты сверх необходимого; переименование — отдельная, не обязательная задача.
- Индикация ожидания реализована через `useTransition`: клик оборачивает `await signOut()` в `startSignOutTransition`, `isPending` управляет заменой иконки на `Spinner` и `disabled` кнопки. Альтернатива — локальный `useState<boolean>` с ручным `try/finally`, была отклонена в пользу `useTransition`, так как в React 19 он уже умеет ждать асинхронный callback и не требует ручной обработки сброса состояния при ошибке.
- Индикатор — новый переиспользуемый примитив `Spinner` в `@repo/core` (`packages/core/src/ui/spinner`): тонкая обёртка над `LoaderIcon` из `lucide-react` с `role="status"`, `aria-label="Загрузка"` и `animate-spin`, по образцу остальных `@repo/core` примитивов (аналогично `Skeleton`). Добавлен в публичный баррель `packages/core/index.ts`, чтобы им могли пользоваться и другие компоненты (например, кнопки форм), а не только `ProfilePopover`.

## Risks / Trade-offs

- [Существующие тесты (`profile-popover.component.test.tsx`, `sidebar.component.test.tsx`, `src/tests/e2e/sidebar-auth.spec.ts`) ожидают клик по профилю/открытие Popover] → Обновить эти тесты в рамках этого change на новый сценарий (кнопка выхода видна и кликабельна сразу).
- [Имя `ProfilePopover` больше не отражает поведение] → Задокументировано выше как осознанный trade-off; не блокирует функциональность.

## Test strategy

- Component test (`profile-popover.component.test.tsx`): рендер для авторизованного пользователя показывает `AccountSummary` и кнопку выхода без предварительного клика; Popover-разметка отсутствует; клик по кнопке выхода вызывает `useSignOut`; во время незавершённого `signOut()` кнопка показывает `Spinner` (`role="status"`) и недоступна для повторного клика, после завершения — индикатор скрывается.
- E2E (`src/tests/e2e/sidebar-auth.spec.ts`): обновить сценарий выхода — кнопка выхода кликается напрямую, без открытия меню.
- Ручная проверка: визуально кнопка выхода не имеет фона/границы в состоянии покоя и получает hover/focus-стили при наведении/фокусе (light и dark тема).
