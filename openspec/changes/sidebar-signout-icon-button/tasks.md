## 1. Реализация

- [x] 1.1 В `src/components/auth-status/profile-popover.tsx` убрать `Popover`, `PopoverTrigger`, `PopoverContent`, `useState(open)`; заменить на контейнер `<div className="flex items-center justify-between gap-...">` с `AccountSummary` слева и кнопкой выхода справа.
- [x] 1.2 Кнопку выхода реализовать как `Button` из `@repo/core` с `variant="ghost"`, подходящим `size` (`icon-lg`/`icon-sm`), `aria-label="Выйти"` и иконкой `LogOutIcon` из `lucide-react`, вызывающей `useSignOut()` по клику (сохранить текущий вызов `void signOut()`).
- [x] 1.3 Убедиться, что `AccountSummary` больше не оборачивается в `<button>`/интерактивный триггер и не получает лишних hover/cursor-pointer стилей, рассчитанных на кликабельность.
- [ ] 1.4 Проверить визуально (light/dark тема), что кнопка выхода не имеет фона и границы в состоянии покоя и получает корректный hover/focus.
- [x] 1.5 Добавить примитив `Spinner` в `@repo/core` (`packages/core/src/ui/spinner`): обёртка над `LoaderIcon` из `lucide-react`, `role="status"`, `aria-label="Загрузка"`, `animate-spin`; экспортировать из `packages/core/index.ts`.
- [x] 1.6 В `ProfilePopover` добавить состояние ожидания через `useTransition`: на время выполнения `signOut()` заменять `LogOutIcon` на `Spinner` и блокировать кнопку (`disabled`).

## 2. Тесты

- [x] 2.1 Обновить `src/components/auth-status/profile-popover.component.test.tsx`: убрать сценарии открытия Popover, добавить проверку, что кнопка выхода видна и кликабельна сразу, и клик по ней вызывает sign-out.
- [x] 2.2 Обновить `src/components/sidebar/sidebar.component.test.tsx`, если он опирается на Popover-поведение профиля. (Не требуется — `AuthStatusSlot` замокан, Popover-поведение не затронуто.)
- [x] 2.3 Обновить `src/tests/e2e/sidebar-auth.spec.ts`: сценарий выхода через прямой клик по иконке, без открытия меню.
- [x] 2.4 Обновить/пересобрать снапшоты `profile-popover.component.test.tsx` (`__screenshots__`) при необходимости. (Устаревшая orphaned-снапшот-директория удалена, новый тест снапшотов не использует.)
- [x] 2.5 Добавить component test на индикацию ожидания: во время незавершённого `signOut()` кнопка показывает `Spinner` и недоступна, после завершения — индикатор скрывается и кнопка снова доступна.

## 3. Проверка и поддержка test-plan.md

- [x] 3.1 Актуализировать `test-plan.md` (статусы сценариев, пути к тестовым файлам) по мере выполнения задач 2.x.
- [x] 3.2 Прогнать команды из `## Verification commands` в `test-plan.md`. (Playwright и ручная визуальная проверка light/dark не выполнены в этой сессии — нет поднятого сервера/браузера; остаются открытыми.)
