## 1. Пакет `packages/core`

- [x] 1.1 Создать workspace `packages/core` (`package.json` с именем `@repo/core`, `tsconfig.json`,
      включение в корневые npm workspaces) по аналогии со структурой `packages/api`
- [x] 1.2 Установить `@base-ui/react` как зависимость `packages/core`
- [x] 1.3 Инициализировать shadcn CLI (`components.json`) с Base UI registry, alias на
      `packages/core`, без Radix-зависимостей
- [x] 1.4 Добавить `cn` utility (`clsx` + `tailwind-merge`) и базовую CVA-инфраструктуру вариантов в
      `packages/core`
- [x] 1.5 Настроить публичный экспорт пакета (`index.ts`) и добавить `@repo/core` в root
      `tsconfig.json` paths, если требуется по аналогии с `@repo/api`

## 2. Примитивы: Button, Card, Skeleton

- [x] 2.1 Реализовать `Button` (`solid`/`outline`/`ghost`, `disabled`, `iconOnly` с обязательным
      `aria-label`, `fullWidth`, обработчик нажатия) в `packages/core`
- [x] 2.2 Component-тест `Button`: клик вызывает обработчик; `disabled` блокирует вызов и помечен
      недоступным; `iconOnly` без `aria-label` — невалидное состояние/проверка наличия имени
- [x] 2.3 Реализовать `Card` (контейнер, проброс `className`, `children`)
- [x] 2.4 Component-тест `Card`: рендер `children`, применение `className`
- [x] 2.5 Реализовать `Skeleton` (плейсхолдер, `aria-hidden`, проброс `className` для размеров)
- [x] 2.6 Component-тест `Skeleton`: декоративная a11y-семантика (`aria-hidden`)

## 3. Примитивы: Select

- [x] 3.1 Реализовать `Select` на Base UI (триггер + попап, управляемое `value`/`onValueChange`,
      `placeholder`, список опций с уникальными `id`, keyboard-навигация)
- [x] 3.2 Component-тест `Select`: выбор опции обновляет значение и вызывает `onValueChange`;
      пустое значение показывает `placeholder`; keyboard-навигация (Enter → открытие, стрелка вниз →
      следующая опция, Enter → выбор)

## 4. Примитивы: Slider

- [x] 4.1 Реализовать `Slider` на Base UI с поддержкой двух thumb (диапазон), `minValue`/
      `maxValue`, коммитом значения только по отпусканию указателя (`onValueCommitted`)
- [x] 4.2 Component-тест `Slider`: drag + release вызывает commit-обработчик один раз с итоговой
      парой значений; клавиатура (стрелка) двигает активный thumb в пределах границ

## 5. Примитивы: Input / SearchField

- [x] 5.1 Реализовать `Input` с поисковой композицией (иконка, `placeholder`, управляемое строковое
      значение, кнопка очистки, видимая только при непустом значении)
- [ ] 5.2 Component-тест `Input`: очистка сбрасывает значение и вызывает обработчик с пустой
      строкой; кнопка очистки скрыта при пустом значении

## 6. Примитивы: Drawer

- [x] 6.1 Реализовать `Drawer` (`Root`/`Trigger`/`Backdrop`/`Content`/`Dialog`/`Body`) на Base UI
      `Dialog`/`Popover`, с focus trap, закрытием по Escape и клику по backdrop, возвратом фокуса
      триггеру
- [ ] 6.2 Component-тест `Drawer`: открытие переносит фокус внутрь; Escape закрывает и возвращает
      фокус триггеру

## 7. Миграция потребителей

- [x] 7.1 Мигрировать `app/(home)/_components/catalog/skill-card-skeleton.tsx` на `Skeleton` из
      `@repo/core`
- [x] 7.2 Мигрировать `app/(home)/_components/catalog/skill-card.tsx` на `Card` из `@repo/core`
- [x] 7.3 Мигрировать `app/(home)/_components/sidebar-filters/difficulty-select.tsx` на `Select` из
      `@repo/core`, сохранив текущее поведение `useSkillsFilters`
- [x] 7.4 Мигрировать `app/(home)/_components/sidebar-filters/topic-select.tsx` на `Select` из
      `@repo/core`
- [x] 7.5 Мигрировать `app/(home)/_components/sidebar-filters/reset-filters-button.tsx` на `Button`
      из `@repo/core`
- [x] 7.6 Мигрировать `app/(home)/_components/sidebar-filters/questions-count-slider.tsx` на
      `Slider` из `@repo/core`, сохранив семантику `onChangeEnd`/commit
- [x] 7.7 Мигрировать `app/(home)/_components/sidebar-filters/skill-search-input.tsx` на `Input` из
      `@repo/core`
- [x] 7.8 Мигрировать `app/(home)/_components/sidebar-filters/mobile-filters-drawer.tsx` на
      `Button` + `Drawer` из `@repo/core`
- [x] 7.9 Мигрировать `app/catalog/[id]/_components/skill-detail/back-button.tsx` на `Button` из
      `@repo/core`

## 8. Удаление heroui и финальная проверка

- [x] 8.0 Удалить утилиты `base-select` и `base-input` из `app/globals.css` (заменяются
      дефолтными стилями новых примитивов `@repo/core`)
- [x] 8.1 Убедиться, что ни один файл в `app/` и `src/` не импортирует `@heroui/react`
      (`grep -r "@heroui/react" app src`)
- [x] 8.2 Удалить `@heroui/react` из `package.json` и обновить `package-lock.json` (`npm install`)
- [ ] 8.3 Прогнать `npm run tsc`, `npm run lint`, `npm run fmt:check`
- [ ] 8.4 Прогнать `npm run test` (unit + component projects)
- [ ] 8.5 Ручной smoke в браузере (`npm run dev`): каталог, сайдбар фильтров (desktop и mobile
      drawer), карточка скилла, страница деталей — по `design.md` Test strategy → Manual
- [ ] 8.6 Обновить `test-plan.md` статусами выполненных тестов и результатами verification
      commands

## 9. Документация и follow-up

- [ ] 9.1 Отметить в summary/PR, что Storybook stories для новых примитивов и финальная кастомная
      стилизация — осознанно отложены как follow-up (см. `design.md` Risks / Trade-offs)
