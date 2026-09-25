# Test Plan

## Risk level

P1

## Scenario coverage

| Requirement                      | Scenario                                                  | Risk | Test level | Test file                                                | Status  |
| -------------------------------- | --------------------------------------------------------- | ---: | ---------- | -------------------------------------------------------- | ------- |
| Button primitive                 | Обычная кнопка вызывает обработчик по клику               |   P1 | Component  | `packages/core/src/button/button.component.test.tsx`     | Planned |
| Button primitive                 | Disabled-кнопка не вызывает обработчик                    |   P1 | Component  | `packages/core/src/button/button.component.test.tsx`     | Planned |
| Button primitive                 | Icon-only кнопка требует доступного имени                 |   P2 | Component  | `packages/core/src/button/button.component.test.tsx`     | Planned |
| Select primitive                 | Выбор опции обновляет значение                            |   P0 | Component  | `packages/core/src/select/select.component.test.tsx`     | Planned |
| Select primitive                 | Пустое значение показывает placeholder                    |   P2 | Component  | `packages/core/src/select/select.component.test.tsx`     | Planned |
| Select primitive                 | Список опций доступен с клавиатуры                        |   P1 | Component  | `packages/core/src/select/select.component.test.tsx`     | Planned |
| Card primitive                   | Card рендерит переданное содержимое                       |   P2 | Component  | `packages/core/src/card/card.component.test.tsx`         | Planned |
| Skeleton primitive               | Skeleton скрыт от screen reader                           |   P2 | Component  | `packages/core/src/skeleton/skeleton.component.test.tsx` | Planned |
| Range slider primitive           | Перемещение диапазона вызывает commit-обработчик один раз |   P0 | Component  | `packages/core/src/slider/slider.component.test.tsx`     | Planned |
| Range slider primitive           | Thumb управляется с клавиатуры                            |   P1 | Component  | `packages/core/src/slider/slider.component.test.tsx`     | Planned |
| Search input primitive           | Кнопка очистки сбрасывает значение                        |   P1 | Component  | `packages/core/src/input/input.component.test.tsx`       | Planned |
| Search input primitive           | Кнопка очистки скрыта при пустом значении                 |   P2 | Component  | `packages/core/src/input/input.component.test.tsx`       | Planned |
| Drawer primitive                 | Открытие Drawer перемещает фокус внутрь                   |   P1 | Component  | `packages/core/src/drawer/drawer.component.test.tsx`     | Planned |
| Drawer primitive                 | Escape закрывает Drawer и возвращает фокус                |   P1 | Component  | `packages/core/src/drawer/drawer.component.test.tsx`     | Planned |
| No dependency on `@heroui/react` | Поиск импортов heroui не даёт результатов                 |   P0 | Static     | verification command (task 8.1)                          | Planned |

## Required automated tests

### Unit

- [ ] Нет — примитивы не содержат изолированной чистой логики, требующей отдельных unit-тестов
      (см. design.md Test strategy). Если при реализации `Slider`/`Select` появится чистая
      helper-функция (например, clamp/normalize значений), добавить unit-тест на неё здесь.

### Component

- [ ] `Button`: клик вызывает handler; `disabled` блокирует вызов и помечен недоступным;
      `iconOnly` имеет accessible name
- [ ] `Select`: выбор опции обновляет значение и вызывает `onValueChange`; пустое значение →
      `placeholder`; keyboard-навигация (Enter/стрелки/Enter)
- [ ] `Card`: рендер `children`, проброс `className`
- [ ] `Skeleton`: `aria-hidden` / декоративная семантика
- [ ] `Slider`: commit-обработчик вызывается один раз по release с итоговой парой `[min, max]`;
      keyboard-управление активным thumb в границах `[minValue, maxValue]`
- [ ] `Input`/SearchField: очистка сбрасывает значение; кнопка очистки скрыта при пустом значении
- [ ] `Drawer`: открытие переносит фокус внутрь; Escape закрывает и возвращает фокус триггеру

### Integration

- [ ] Не требуется отдельно — покрывается существующими тестами каталога/фильтров, если они есть;
      иначе — regression проверяется ручным smoke (см. Manual checks) и общим прогоном test suite

### E2E

- [ ] Не требуется для этого change — нет нового пользовательского сценария, только замена UI
      реализации существующих экранов

## Manual checks

- [ ] Каталог (`/`): карточки скиллов рендерятся (`Card`), skeleton-заглушки во время загрузки
      (`Skeleton`)
- [ ] Сайдбар фильтров desktop: `Select` (сложность, тема), `Slider` (количество вопросов),
      `Input` (поиск), `Button` (сброс фильтров) — работают идентично текущему поведению
- [ ] Мобильный вид: `Drawer` с фильтрами открывается по кнопке, закрывается по Escape/backdrop/
      свайпу-эквиваленту, фокус возвращается на триггер
- [ ] Страница деталей скилла (`/catalog/[id]`): `Button` "Назад" работает (роутинг `router.back()`)
- [ ] Клавиатурная навигация по всем мигрированным контролам (Tab, Enter, стрелки, Escape) без
      потери фокуса и без визуальных "прыжков"

## Test data

- Fixtures: не требуются — примитивы тестируются с инлайн-пропсами в component-тестах
- API mocks: не требуются — миграция не затрагивает сетевой слой; существующие Zod/Faker фабрики
  `@repo/api` не изменяются
- User roles: не применимо
- Seed data: не применимо

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests (сверх базовых a11y-сценариев, зафиксированных в specs как поведенческие
  требования — например, focus trap, aria-hidden, accessible name)
- Mutation tests
- Feature flag combination matrices
- Storybook stories для новых примитивов (см. design.md Risks / Trade-offs — осознанный follow-up)
- Финальная кастомная стилизация под дизайн проекта (следующий change)

## Verification commands

- [ ] openspec validate replace-heroui-with-shadcn --strict --no-interactive
- [ ] frontend: `npm run tsc` / `npm run lint` / `npm run fmt:check` / `npm run test` / `npm run build`
- [ ] api: не затронуто — `packages/api` не изменяется
- [ ] `grep -r "@heroui/react" app src` — не даёт совпадений после миграции
- [ ] Ручной smoke в браузере согласно Manual checks (P0/P1 риск требует этого при данном уровне
      риска изменения)
