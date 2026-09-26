## 1. Токены темы в `app/globals.css`

- [x] 1.1 Добавить `--heading`, `--outline-border`, `--outline-hover-background/foreground`,
      `--outline-active-border/background/foreground` в `:root` и зарегистрировать в `@theme inline`
- [x] 1.2 Добавить `--select-background/foreground/placeholder` (одинаковые в `:root` и в
      `@media (dark)` — сознательно не тематизируются, см. `design.md`)
- [x] 1.3 Добавить `--slider-track/indicator/thumb` в `:root` (со значениями по умолчанию через
      `var(--muted)`/`var(--primary)`/белый) и зарегистрировать в `@theme inline`
- [x] 1.4 Переопределить `--heading`, `--outline-*`, `--slider-*` внутри
      `@media (prefers-color-scheme: dark)`
- [x] 1.5 Расширить существующий блок `@media (prefers-color-scheme: dark)` переопределениями
      `--card`, `--card-foreground`, `--popover`, `--popover-foreground`, `--secondary`,
      `--secondary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--accent-foreground`,
      `--input`, `--sidebar`, `--sidebar-foreground`, `--gray-ultralight`

## 2. UI-примитивы `@repo/core`

- [x] 2.1 `button.tsx`: outline-вариант — заменить `border-button-default`/`dark:border-input`/
      `dark:bg-input/30`/`dark:hover:bg-input/50` на `border-outline-border`,
      `hover:bg-outline-hover-background hover:text-outline-hover-foreground`,
      `active:border-outline-active-border active:bg-outline-active-background
  active:text-outline-active-foreground`
- [x] 2.2 `button.tsx`: убрать `active:not-aria-[haspopup]:translate-y-px`; сузить `transition-all`
      до `transition-colors` и добавить `duration-200`
- [x] 2.3 `select.tsx`: `SelectTrigger` — заменить `border-input`/`bg-transparent` на
      `border-outline-border`/`bg-select-background`/`text-select-foreground`; плейсхолдер —
      `data-placeholder:text-select-placeholder`
- [x] 2.4 `select.tsx`: `SelectContent`-попап и `SelectScrollUpButton`/`SelectScrollDownButton` —
      заменить `bg-popover`/`text-popover-foreground` на `bg-select-background`/
      `text-select-foreground`
- [x] 2.5 `slider.tsx`: `Track` → `bg-slider-track`, `Indicator` → `bg-slider-indicator`, `Thumb` →
      `bg-slider-thumb` (вместо `bg-muted`/`bg-primary`/`bg-white`)
- [x] 2.6 `input-group.tsx`: `InputGroup` — `bg-select-background text-select-foreground`, убрать
      `has-disabled:bg-input/50`/`dark:bg-input/30`/`dark:has-disabled:bg-input/80`
- [x] 2.7 `input-group.tsx`: `InputGroupAddon`/`InputGroupText` — `text-muted-foreground` →
      `text-select-foreground`
- [x] 2.8 `input-group.tsx`: `InputGroupInput`/`InputGroupTextarea` — добавить
      `placeholder:text-select-placeholder`

## 3. Страничные компоненты каталога и фильтров

- [x] 3.1 `skill-card.tsx`: `text-gray-500` → `text-muted-foreground` (топик, сложность, счётчик
      вопросов); заголовок наследует `text-card-foreground` от `Card`
- [x] 3.2 `desktop-filters-sidebar.tsx`: `bg-white` → `bg-card`, добавить `text-foreground`
- [x] 3.3 `filters-content.tsx`: `text-black` → `text-heading` для заголовка «Фильтры»
- [x] 3.4 `questions-count-slider.tsx`: `text-gray-600` → `text-heading` для лейбла и диапазона;
      увеличить `gap-2` → `gap-4` между текстом и слайдером
- [x] 3.5 `mobile-filters-drawer.tsx`: добавить `className="size-12"` кнопке-триггеру (48×48) —
      иконка `Settings` уже была `size-6` (24px)
- [x] 3.6 `back-button.tsx`: `text-black` → `text-heading`, `hover:text-gray-600` →
      `hover:text-muted-foreground` (иконка `ArrowLeft` наследует цвет через `currentColor`)
- [x] 3.7 `skill-detail-content.tsx`: оба `bg-white` → `bg-card text-card-foreground`,
      `text-gray-600`/`text-gray-500` → `text-muted-foreground`

## 4. Верификация

- [ ] 4.1 `npx oxfmt <изменённые файлы>` — форматирование (выполнено точечно по мере правок; финально
      прогнать по всему списку из `proposal.md - Impact`)
- [ ] 4.2 `npm run tsc`
- [ ] 4.3 `npm run lint`
- [ ] 4.4 Ручная проверка в браузере с `prefers-color-scheme: dark` и `light` (см.
      `test-plan.md - Manual checks`): каталог, боковая панель фильтров, мобильный Drawer с
      фильтрами, страница навыка
- [ ] 4.5 `openspec validate dark-theme-support --strict --no-interactive`

## 5. Обновление test-plan.md

- [ ] 5.1 Отметить фактический статус сценариев в `test-plan.md` после ручной проверки (шаг 4.4)
