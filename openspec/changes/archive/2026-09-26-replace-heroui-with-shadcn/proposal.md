## Why

`@heroui/react` — единственная UI-kit зависимость в проекте, но она противоречит зафиксированной в
`AGENTS.md` целевой архитектуре: UI-примитивы должны жить в `packages/core` (`@repo/core`) на базе
Base UI и shadcn-подхода (CVA, `cn`), а не в стороннем компонентном фреймворке. Сейчас
`packages/core` не существует, `components.json` не настроен, Base UI не установлен. Пока
зависимость остаётся, каждая новая фича продолжает наращивать долг вместо следования архитектурной
границе. Миграция сейчас, пока heroui используется всего в 9 файлах, дешевле, чем откладывать её до
роста поверхности использования.

## What Changes

- Создать workspace-пакет `packages/core` (`@repo/core`) с `components.json` (shadcn CLI, Base UI
  registry) и базовой инфраструктурой примитивов (`cn`, CVA variants, index-экспорты).
- Установить `@base-ui/react` как единственную headless-зависимость примитивов; не
  добавлять Radix.
- Сгенерировать/реализовать через shadcn-подход эквиваленты используемых heroui-компонентов:
  `Skeleton`, `Card`, `Select` (на основе `ListBox`/`Select`), `Button`, `Slider`, `SearchField`
  (как `Input` + иконка/семантика поиска), `Drawer`.
- Мигрировать все 9 файлов, импортирующих `@heroui/react`, на новые примитивы из `@repo/core`,
  сохранив текущее поведение и props usage на уровне вызывающего кода.
- Удалить зависимость `@heroui/react` из `package.json` и лок-файла после миграции последнего
  потребителя.
- **BREAKING**: публичный API локальных wrapper-компонентов (`reset-filters-button.tsx`,
  `back-button.tsx` и т.д.) может измениться в части имён/форм пропсов там, где heroui и Base UI
  расходятся по контракту (например, `ListBox`/`Select` value shape). Внешних потребителей нет —
  затронуты только `app/`-компоненты в этом же репозитории, которые мигрируются в этом же change.
- Финальная кастомная стилизация под дизайн проекта — вне рамок этого change; примитивы поставляются
  с дефолтным shadcn/Base UI видом (нейтральная тема), интегрированным с существующими Tailwind
  токенами настолько, насколько это делает стандартный shadcn init.

## Capabilities

### New Capabilities

- `ui-primitives`: набор переиспользуемых UI-примитивов в `packages/core` на базе Base UI и
  shadcn-подхода (Button, Select, Card, Skeleton, Slider, Input/SearchField, Drawer), доступных
  через `@repo/core` и служащих заменой `@heroui/react` во всём приложении.

### Modified Capabilities

(нет — в проекте ранее не было spec для UI-примитивов или heroui-компонентов)

## Impact

- **Affected code**: `app/(home)/_components/catalog/skill-card.tsx`,
  `skill-card-skeleton.tsx`, `app/(home)/_components/sidebar-filters/*` (difficulty-select,
  topic-select, reset-filters-button, questions-count-slider, skill-search-input,
  mobile-filters-drawer), `app/catalog/[id]/_components/skill-detail/back-button.tsx`.
- **New package**: `packages/core` (`@repo/core`) — новый npm workspace, `components.json`,
  примитивы, Storybook stories (по правилам `AGENTS.md`).
- **Dependencies**: удаляется `@heroui/react`; добавляются `@base-ui/react` и
  зависимости, которые ставит shadcn CLI для выбранных примитивов (без Radix).
- **Build/tooling**: обновление root `package.json` (workspaces), `tsconfig.json` paths при
  необходимости, `oxlint`/`oxfmt` конфигурация для нового пакета — без изменения самих правил.
- **No API/contract changes**: `packages/api` и BFF не затрагиваются.
