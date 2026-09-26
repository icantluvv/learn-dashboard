## Why

Тёмная тема (`prefers-color-scheme: dark`) в приложении включалась только частично: `--background` и
`--foreground` в `app/globals.css` реагировали на системную тему, но большинство UI-примитивов
(`Button` outline, `Select`, `Slider`, `InputGroup`) и часть страничных компонентов использовали
захардкоженные Tailwind-утилиты (`bg-white`, `text-black`, `text-gray-500/600`, `border-[#131313]`),
которые не менялись между темами. В тёмной теме это давало нечитаемый текст, невидимые бордеры кнопок
и рамки полей, а также случайно почти чёрный фон карточек-«островов». Продукт нужно привести к
консистентному поведению в обеих темах без введения ручного переключателя темы (в приложении нет
`.dark`-класса — переключение только системное).

## What Changes

- Ввести в `app/globals.css` набор именованных design-токенов вместо литеральных hex-классов:
  `--heading`, `--outline-border`, `--outline-hover-background/foreground`,
  `--outline-active-border/background/foreground`, `--select-background/foreground/placeholder`,
  `--slider-track/indicator/thumb`; зарегистрировать их в `@theme inline` как
  `text-*`/`bg-*`/`border-*` Tailwind-утилиты.
- Задать значения этих токенов отдельно для светлой темы (`:root`) и для тёмной темы
  (`@media (prefers-color-scheme: dark)`), включая обновлённые `--background`, `--card`, `--popover`,
  `--secondary`, `--muted`, `--accent`, `--input`, `--sidebar` и их `-foreground`-варианты.
- Обновить `packages/core/src/ui/button/button.tsx` (outline-вариант: цвет бордера/hover/active),
  `select.tsx` (trigger/content/scroll-кнопки — стабильно белый фон и тёмный текст независимо от
  темы, включая читаемый плейсхолдер), `slider.tsx` (полоса белая, ручка тёмная в тёмной теме),
  `input-group.tsx` (то же поведение фона/текста/плейсхолдера, что и у `Select`) — заменить
  хардкод-цвета на новые токены и убрать мёртвые `dark:`-классы (в проекте нет `.dark`-класса на
  `<html>`, поэтому Tailwind-модификатор `dark:` никогда не срабатывал).
- Обновить страничные компоненты, использовавшие нетематизированные Tailwind-цвета:
  `app/(home)/_components/catalog/skill-card.tsx`,
  `app/(home)/_components/sidebar-filters/{desktop-filters-sidebar,filters-content,questions-count-slider,mobile-filters-drawer}.tsx`,
  `app/catalog/[id]/_components/skill-detail/{back-button,skill-detail-content}.tsx` — заменить
  `bg-white`/`text-black`/`text-gray-*` на токенизированные классы (`bg-card`, `text-heading`,
  `text-muted-foreground` и т.д.).
- Точечные визуальные правки в рамках той же работы: убрать `active:translate-y-px` у `Button`
  (кнопка больше не «прыгает» при нажатии), сузить `transition-all` до `transition-colors` с
  `duration-200`, увеличить отступ между лейблом и слайдером в `QuestionsCountSlider`, увеличить
  мобильную кнопку-триггер фильтров до `48x48` с иконкой `24px`.

## Capabilities

### New Capabilities

- `ui-theming`: правила согласованного отображения UI-примитивов `@repo/core` (Button, Select,
  Slider, InputGroup) и связанных страничных компонентов каталога/фильтров в светлой и тёмной
  системной теме через CSS-токены в `app/globals.css`.

### Modified Capabilities

(нет — в `openspec/specs/` пока не архивирована ни одна capability для UI-примитивов или тем)

## Impact

- **Affected code**: `app/globals.css`; `packages/core/src/ui/{button,select,slider,input-group}/*`;
  `app/(home)/_components/catalog/skill-card.tsx`;
  `app/(home)/_components/sidebar-filters/{desktop-filters-sidebar,filters-content,questions-count-slider,mobile-filters-drawer}.tsx`;
  `app/catalog/[id]/_components/skill-detail/{back-button,skill-detail-content}.tsx`.
- **No API/contract changes**: `packages/api`, BFF, серверные роуты не затрагиваются.
- **No new dependencies**: изменения только на уровне Tailwind CSS custom properties и className.
- **Visual-only regression risk**: возможны точечные несоответствия контраста в местах, не
  затронутых этим change (не все компоненты приложения аудированы на тёмную тему).
