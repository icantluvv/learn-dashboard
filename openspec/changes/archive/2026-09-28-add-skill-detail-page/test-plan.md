# Test Plan

## Risk level

P1

## Scenario coverage

| Requirement                   | Scenario                                  | Risk | Test level | Test file                                                                 | Status |
| ----------------------------- | ----------------------------------------- | ---: | ---------- | ------------------------------------------------------------------------- | ------ |
| Отображение страницы навыка   | Успешная загрузка навыка с вопросами      |   P1 | Component  | `app/catalog/[id]/_components/skill-detail/skill-detail-content.test.tsx` | Done   |
| Отображение страницы навыка   | Навык без вопросов                        |   P2 | Component  | `app/catalog/[id]/_components/skill-detail/skill-detail-content.test.tsx` | Done   |
| Навык не найден               | Запрос по несуществующему id (мок-слой)   |   P1 | Unit       | `packages/api/base/mock-scenarios.test.ts`                                | Done   |
| Состояние ошибки загрузки     | Запрос завершился ошибкой (компонент)     |   P1 | Component  | `app/catalog/[id]/_components/skill-detail/skill-detail-error.test.tsx`   | Done   |
| Отображение страницы навыка   | Мок-роут возвращает title/questions по id |   P1 | Unit       | `packages/api/base/mock-scenarios.test.ts`                                | Done   |
| Возврат к предыдущей странице | Нажатие кнопки "Назад"                    |   P2 | Component  | `app/catalog/[id]/_components/skill-detail/back-button.test.tsx`          | Done   |

## Required automated tests

### Unit

- [x] Мок-роут `GET /api/skills/:id`: существующий `id` → `{ title, questions }` из
      `skillQuestions` (title, длина `questions`, порядок 1-й/14-й вопрос); несуществующий `id` →
      выброшенная ошибка с `cause.status === 404` — `mock-scenarios.test.ts`

### Component

- [x] `SkillDetailContent`: заголовок = `title`; список вопросов пронумерован с 1 в порядке
      массива `questions`; пустой `questions` → сообщение об отсутствии вопросов, `listitem`
      не рендерится — `skill-detail-content.test.tsx`
- [x] `SkillDetailError`: текст сообщения об ошибке отображается — `skill-detail-error.test.tsx`
- [x] `BackButton`: клик вызывает `router.back()` — `back-button.test.tsx`

### Integration

- [ ] Не требуется: единственная интеграция (server component ↔ generated query client ↔ mock
      route) уже покрыта unit-тестом мок-роута и component-тестами презентационных компонентов
      страницы с инлайновыми props.

### E2E

- [ ] Не добавляются в это изменение — 404-ветка полагается на встроенный Next.js `notFound()`,
      который в проекте уже отвечает за `app/not-found.tsx` на других маршрутах.

## Manual checks

- [x] Открыть `/catalog/{id}` существующего навыка из каталога (клик по карточке) — заголовок и
      пронумерованный список вопросов видны сразу, без мигания (проверено `agent-browser`,
      `skill-01`)
- [x] Открыть `/catalog/does-not-exist` напрямую — показывается страница "не найдено"
      (`app/not-found.tsx`), HTTP `404`
- [x] Кнопка "Назад" возвращает на каталог (переход карточка → навык → "Назад" проверен вручную
      через `agent-browser`); при наведении фон не меняется, меняется только цвет текста
- [ ] Десктопная и мобильная ширина — обёртка `page-wrapper v-stack gap-12 md:flex-row` выглядит
      так же, как на главной странице (десктоп проверен скриншотом; мобильная ширина не
      перепроверялась отдельно — гэп, `page-wrapper` переиспользован без изменений из уже
      провалидированного на мобильной ширине `app/(home)/page.tsx`)

## Test data

- Fixtures: инлайновые объекты формы `GetSkillByIdQueryResponse` (`{ title, questions }`) прямо в
  тестах
- API mocks: `packages/api/base/mock-scenarios.ts` — новый `skillQuestions` и маршрут
  `GET /api/skills/:id` через `getMockScenarioRoute('GET', '/api/skills/:id').create(config)`
- User roles: не применимо (страница не требует авторизации)
- Seed data: не применимо

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices
- E2E-проверка перехода каталог → страница навыка (покрыта частично component-тестом `SkillCard.href`
  из `skills-catalog-filters`, здесь не дублируется)
- Проверка `GET /api/skills/{id}` на реальном (не mock) бэкенде

## Verification commands

- [x] `openspec validate add-skill-detail-page --strict --no-interactive`
- [x] `npm run tsc`
- [x] `npm run lint` (чисто по изменённым файлам; pre-existing repo-wide долг вне скоупа)
- [x] `npm run fmt:check` (по изменённым файлам; несвязанные незакоммиченные файлы не трогались)
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm --workspace @repo/api run lint` (redocly lint контракта; 3 pre-existing
      `security-defined`-ошибки, см. `tasks.md - 1.3`)
