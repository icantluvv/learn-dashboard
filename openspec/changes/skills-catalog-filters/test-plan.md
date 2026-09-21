# Test Plan

## Risk level

P1

## Scenario coverage

| Requirement                   | Scenario                                      | Risk | Test level    | Test file                                                              | Status                    |
| ----------------------------- | --------------------------------------------- | ---: | ------------- | ---------------------------------------------------------------------- | ------------------------- |
| Отображение списка навыков    | Успешная загрузка списка                      |   P1 | Component     | `app/(home)/_components/catalog/catalog.test.tsx`                      | Done                      |
| Индикация загрузки            | Запрос ещё выполняется                        |   P2 | Component     | `app/(home)/_components/catalog/catalog.test.tsx`                      | Done                      |
| Состояние ошибки              | Запрос завершился ошибкой                     |   P1 | Component     | `app/(home)/_components/catalog/catalog.test.tsx`                      | Done                      |
| Пустой результат              | Список навыков пуст                           |   P1 | Component     | `app/(home)/_components/catalog/catalog.test.tsx`                      | Done                      |
| Поиск по названию             | Ввод текста поиска                            |   P1 | Unit          | `packages/api/base/mock-scenarios.test.ts`                             | Done                      |
| Фильтр по теме                | Выбор темы                                    |   P1 | Unit          | `packages/api/base/mock-scenarios.test.ts`                             | Done                      |
| Фильтр по сложности           | Выбор сложности                               |   P1 | Unit          | `packages/api/base/mock-scenarios.test.ts`                             | Done                      |
| Фильтр по количеству вопросов | Выбор диапазона                               |   P1 | Unit          | `packages/api/base/mock-scenarios.test.ts`                             | Done                      |
| Комбинирование фильтров       | Несколько активных фильтров                   |   P1 | Unit          | `packages/api/base/mock-scenarios.test.ts`                             | Done                      |
| Фильтры хранятся в URL        | Сборка query-параметров из состояния фильтров |   P1 | Unit          | `app/(home)/_hooks/use-skills-filters.unit.test.ts`                    | Done                      |
| Фильтры хранятся в URL        | Обновление страницы с активными фильтрами     |   P2 | Component/E2E | —                                                                      | Waived (см. Out of scope) |
| Сброс всех фильтров           | Нажатие кнопки сброса                         |   P1 | Component     | `app/(home)/_components/sidebar-filters/reset-filters-button.test.tsx` | Done                      |
| Отображение списка навыков    | Поля карточки и ссылка на `/catalog/{id}`     |   P2 | Component     | `app/(home)/_components/catalog/skill-card.test.tsx`                   | Done                      |

## Required automated tests

### Unit

- [x] `toSkillsQueryParams()`: пустые фильтры → `undefined`; пустые строки search/topic
      игнорируются; `minQuestionsCount`/`maxQuestionsCount` сохраняются при значении `0`;
      комбинация всех пяти полей — `use-skills-filters.unit.test.ts`
- [x] Мок-роут `GET /api/skills`: без параметров, поиск по подстроке (case-insensitive), точное
      совпадение темы/сложности, диапазон количества вопросов, комбинация фильтров, пустой
      результат — `mock-scenarios.test.ts`

### Component

- [x] `SkillCard`: заголовок, тема, счётчик вопросов, RU-лейбл сложности, `href` ссылки —
      `skill-card.test.tsx`
- [x] `Catalog`: loading (без текста ошибки/пустоты) / error / empty / success (карточка на
      каждый элемент) — `catalog.test.tsx`, `useGetSkills` замокан
- [x] `ResetFiltersButton`: клик очищает все query-параметры — `reset-filters-button.test.tsx`,
      проверка через `NuqsTestingAdapter.onUrlUpdate`

### Integration

- [ ] Не требуется: единственная интеграция (React Query ↔ mock API) уже покрыта unit-тестом
      мок-роута и component-тестом `Catalog` с замоканным hook-ом.

### E2E

- [ ] Не добавлялись в это изменение — см. Out of scope.

## Manual checks

- [x] Визуально проверено в браузере (`npm run dev`) на десктопной и мобильной ширине: sticky
      сайдбар, Drawer с фильтрами, скелетон при смене фильтра, сброс фильтров, hover-эффект
      карточки

## Test data

- Fixtures: инлайновые объекты `GetSkills200[number]` прямо в тестах (без отдельных фабрик — Kubb
  Faker-фабрика `createGetSkills200` в проекте есть, но для этих сценариев не потребовалась)
- API mocks: `packages/api/base/mock-scenarios.ts` (`skillCards`, ~97 записей) через
  `getMockScenarioRoute('GET', '/api/skills').create(config)`
- User roles: не применимо (страница не требует авторизации)
- Seed data: не применимо

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices
- Interaction-тесты на реальный выбор значения в `TopicSelect` / `DifficultySelect` /
  `QuestionsCountSlider` (клик по опции, перетаскивание слайдера) — зафиксировано как известный
  gap в `design.md - Risks / Trade-offs`
- E2E-проверка persistence фильтров в URL при реальном reload страницы — логика сборки
  query-параметров покрыта unit-тестом, но сам факт "URL пережил reload" не проверен
  браузерным E2E-тестом
- Проверка фильтрации на реальном (не mock) бэкенде

## Verification commands

- [x] `npm run tsc`
- [x] `npm run lint` (`oxlint`)
- [x] `npm run test` (unit + component projects)
- [x] `npm run build`
- [ ] `npm run test:e2e` — не запускался (E2E вне скоупа этого изменения)
