## Context

См. `proposal.md - Why` для мотивации. Технический контекст:

- Монорепо npm workspaces; сейчас единственный workspace-пакет — `packages/api`. `packages/core`
  нужно создать с нуля: `package.json`, `tsconfig.json`, экспорт через `@repo/core` (по аналогии с
  `@repo/api`), включение в корневой `tsconfig.json`/workspaces.
- `components.json` (shadcn CLI) в проекте отсутствует — нужно сгенерировать его с указанием на
  Base UI registry, а не Radix (`AGENTS.md`: "UI-примитивы основаны на Base UI и shadcn-подходе").
- `@base-ui/react` не установлен. `class-variance-authority`, `clsx`, `tailwind-merge`
  уже есть в корневом `package.json` — переиспользуются для `cn` и вариантов.
- Текущие потребители heroui используют react-aria-подобный API: `Select`/`ListBox` с
  `value`/`onChange(key)`, `Slider` с массивом `[min, max]` и `onChangeEnd`, `SearchField` с
  compound-частями (`Group`, `SearchIcon`, `Input`, `ClearButton`), `Drawer` с `Root/Backdrop/
Content/Dialog/Body`, `Button` с `isIconOnly`/`fullWidth`/`onPress`. Base UI имеет собственные
  примитивы (`useRender`, compound components), но конкретный публичный API компонентов
  `@repo/core` мы проектируем сами (shadcn-подход = мы владеем кодом, а не импортируем чужую
  библиотеку компонентов).
- Существующие CSS-утилиты `base-select` и `base-input` в `app/globals.css` используются как
  className hooks на heroui-компонентах (`Select.Trigger`, `SearchField.Group`). Новые примитивы
  `@repo/core` получают собственные дефолтные стили (Base UI + shadcn-подход), поэтому эти две
  ad hoc утилиты удаляются из `globals.css` вместе с их использованием в мигрируемых компонентах, а
  не переносятся дальше.

## Goals / Non-Goals

**Goals:**

- Каждый из 7 используемых heroui-компонентов имеет функциональный эквивалент в `@repo/core`,
  реализованный через Base UI + собственный код (не через другую third-party component library).
  Storybook-документация для этих примитивов — за рамками данного изменения (в отличие от общего
  правила AGENTS.md про reusable UI); может быть добавлена отдельным change.
- Публичный API новых примитивов достаточно близок к текущему usage, чтобы миграция 9 файлов не
  требовала изменения бизнес-логики (`useSkillsFilters`, роутинг и т.д.) — меняются только импорты
  и, где необходимо, форма пропсов.
- `@heroui/react` удалён из зависимостей и всех импортов.

**Non-Goals:**

- Финальная визуальная кастомизация под дизайн-систему проекта (цвета, radius, typography scale) —
  отдельный будущий change, как решил пользователь.
- Storybook stories и полное покрытие a11y тестами для новых примитивов — можно добавить позже;
  этот change покрывает функциональную эквивалентность и базовую a11y-семантику, зафиксированную в
  specs.
- Миграция prom-client/observability/BFF — не затронуты.

## Decisions

**1. Новый workspace-пакет `packages/core`, а не `src/components/ui`.**
Так фиксирует `AGENTS.md` ("packages/core (@repo/core) — дизайн-система и UI-примитивы"; "packages/*
→ только другие packages/*"). Альтернатива (`src/components/ui`) была отклонена пользователем в
уточняющем вопросе — расходится с зафиксированной архитектурной картой репозитория.

**2. Headless-слой — `@base-ui/react`, компоненты пишем сами (shadcn-подход), не
устанавливаем `shadcn` runtime-зависимость в приложение.**
`shadcn` CLI используется только как генератор кода во время разработки (уже в `devDependencies`);
сгенерированные/написанные компоненты копируются в `packages/core` и становятся частью нашего кода,
как это принято в shadcn-модели. Alternative: использовать сам `@heroui/react` дальше — отклонено,
это и есть предмет миграции. Alternative: Radix — прямо запрещено `AGENTS.md`.

**3. Публичный API примитивов проектируется под текущих потребителей, а не копирует heroui 1:1.**
Например, `Select` в `@repo/core` держит react-aria-совместимую форму (`value` + `onValueChange`,
`options: {id, label}[]`), чтобы `difficulty-select.tsx` и `topic-select.tsx` менялись минимально.
`Slider` принимает `value: [number, number]` и `onValueCommitted`, чтобы сохранить семантику
`onChangeEnd` из heroui (коммит только по окончании перетаскивания, не на каждый промежуточный
кадр) — это explicit design decision, а не побочный эффект Base UI (Base UI `Slider` по умолчанию
вызывает `onValueChange` на каждое движение; коммит на отпускание реализуется оберткой).
`SearchField` реализуется как composed `Input` с иконкой и conditional clear-button, а не отдельный
react-aria `SearchField` тип, так как Base UI не имеет прямого аналога — это наш собственный
compound-компонент поверх `Input`.

**4. `Drawer` реализуется на `@base-ui/react` `Dialog` (или `Popover`, в зависимости от
того, что Base UI предоставляет с нужной семантикой bottom-sheet) с собственной обёрткой
`Root/Trigger/Backdrop/Content/Dialog/Body`, сохраняющей compound-API, использованный в
`mobile-filters-drawer.tsx`.**
Это позволяет мигрировать `mobile-filters-drawer.tsx` заменой только импорта.

**5. Миграция выполняется по одному потребителю за раз, каждый коммит/шаг — компилируемое
состояние.**
Оба пакета (heroui и `@repo/core`) могут временно сосуществовать в `package.json` до последнего
шага (удаление heroui) — это снижает риск сломать сборку посередине миграции. Alternative:
атомарная замена всех 9 файлов одним шагом — отклонено как более рискованное и хуже проверяемое.

## Risks / Trade-offs

- **[Риск] Base UI `Select`/`Slider`/`Dialog` API может не покрывать 1:1 нужную семантику
  (например, двойной thumb range slider, bottom-sheet placement Drawer).**
  → Mitigation: перед реализацией каждого примитива — точечная проверка actual Base UI API
  (`node_modules/@base-ui/react` типов/доков) до кодирования; при отсутствии готового
  паттерна — композиция из более базовых Base UI примитивов (`useRender`, `Popover`, `Dialog`)
  остаётся в рамках "shadcn-подход = пишем сами".
- **[Риск] Визуально компоненты будут выглядеть "голыми" (дефолтные стили) до последующего change
  со стилизацией — регрессия UX до завершения обеих частей работы.**
  → Mitigation: явно согласовано с пользователем как acceptable trade-off; существующие
  layout-классы в потребителях (не связанные с heroui-специфичной стилизацией) переносятся как
  есть, чтобы минимизировать визуальный разрыв. Ad hoc утилиты `base-select`/`base-input`
  удаляются из `globals.css` — новые примитивы несут собственные дефолтные стили.
- **[Риск] `noUncheckedIndexedAccess`/строгий TypeScript усложняет типизацию compound-компонентов
  Select/Slider/Drawer.**
  → Mitigation: следовать существующим паттернам типизации в `packages/api`/`src/components`;
  избегать `any`/`as` widening, предпочитать discriminated unions и generics с явными границами.
- **[Trade-off] Отсутствие Storybook stories для новых примитивов на этом шаге нарушает общее
  правило AGENTS.md "для reusable UI добавляйте Storybook stories".**
  → Осознанно отложено, чтобы не расширять scope; зафиксировать как follow-up в tasks.md/финальном
  summary.

## Test strategy

- **Static**: `npm run tsc`, `npm run lint`, `npm run fmt:check` — после создания `packages/core` и
  после каждой миграции потребителя.
- **Unit**: не применимо к самим UI-примитивам (это не чистая логика); unit-тесты не создаются
  специально под это изменение, кроме случаев наличия чистых helper-функций (например, вычисление
  clamped значения slider).
- **Component** (`*.component.test.tsx`, `vitest-browser-react`, headless Chromium): для каждого
  нового примитива в `packages/core` — тест на ключевые сценарии из specs (клик/disabled для
  Button, выбор опции и placeholder для Select, commit-семантика и keyboard для Slider, clear
  button для Input/SearchField, focus trap и Escape для Drawer, decorative a11y для Skeleton,
  content passthrough для Card).
- **Integration/E2E**: не требуется отдельно — 9 мигрированных потребителей уже покрываются (или
  должны быть покрыты) существующими component/E2E тестами каталога и фильтров; regression
  проверяется прогоном текущего test suite, а не новыми сценариями.
- **Manual**: ручной smoke в браузере (`npm run dev`) по каждому мигрированному экрану — каталог,
  сайдбар фильтров (desktop и mobile drawer), карточка скилла, страница деталей — согласно
  `AGENTS.md` "для UI или frontend изменений... используйте фичу в браузере до отчёта о готовности".
