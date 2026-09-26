# Test Plan

## Risk level

P1 — перенос затрагивает основную функциональность продукта и меняет публичные URL, но не трогает
данные, авторизацию и контракт API. Сценарий «каталог доступен на `/catalog` и работает как прежде»
внутри этого change оценивается как P0.

## Scenario coverage

| Requirement                    | Scenario                                     | Risk | Test level | Test file                                                                           | Status |
| ------------------------------ | -------------------------------------------- | ---: | ---------- | ----------------------------------------------------------------------------------- | ------ |
| Каталог доступен по `/catalog` | Открытие каталога по прямому адресу          |   P0 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                     | done   |
| Каталог доступен по `/catalog` | Главная больше не содержит каталог           |   P1 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                     | done   |
| Каталог доступен по `/catalog` | Состояния списка сохраняются на новом адресе |   P0 | Component  | `app/catalog/_components/catalog/catalog.test.tsx` (перенесён без правок)           | done   |
| Фильтры хранятся в URL         | Обновление страницы с активными фильтрами    |   P0 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                     | done   |
| Фильтры хранятся в URL         | Параметры фильтров на главной не применяются |   P2 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                     | done   |
| Фильтры хранятся в URL         | Сброс фильтров очищает URL                   |   P1 | Component  | `app/catalog/_components/sidebar-filters/reset-filters-button.test.tsx` (перенесён) | done   |
| Фильтры хранятся в URL         | Сериализация фильтров в query-параметры      |   P1 | Unit       | `app/catalog/_hooks/use-skills-filters.unit.test.ts` (перенесён)                    | done   |
| SSR прогревает кэш             | SSR каталога не делает self-fetch            |   P1 | Static     | ревью `app/catalog/page.tsx` — прямой вызов `getSkills()`                           | done   |
| SSR прогревает кэш             | Гидратация переиспользует прогретые данные   |   P1 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                     | done   |
| SSR прогревает кэш             | SSR дашборда не делает self-fetch            |   P1 | Static     | ревью `app/(home)/page.tsx` — прямой вызов `getSkills()`                            | done   |
| Сводные показатели каталога    | Показатели по непустому каталогу             |   P1 | Unit       | `app/(home)/_utils/compute-catalog-stats.unit.test.ts`                              | done   |
| Сводные показатели каталога    | Распределение по сложности                   |   P1 | Component  | `app/(home)/_components/dashboard/dashboard.test.tsx`                               | done   |
| Сводные показатели каталога    | Уровень сложности без навыков                |   P2 | Unit       | `app/(home)/_utils/compute-catalog-stats.unit.test.ts`                              | done   |
| Состояния загрузки дашборда    | Загрузка показателей                         |   P2 | Component  | `app/(home)/_components/dashboard/dashboard.test.tsx`                               | done   |
| Состояния загрузки дашборда    | Ошибка загрузки показателей                  |   P1 | Component  | `app/(home)/_components/dashboard/dashboard.test.tsx`                               | done   |
| Состояния загрузки дашборда    | Пустой каталог                               |   P2 | Component  | `app/(home)/_components/dashboard/dashboard.test.tsx`                               | done   |
| Общая информация о сервисе     | Переход в каталог с главной                  |   P1 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                     | done   |
| Общая информация о сервисе     | Вводный блок присутствует                    |   P3 | Component  | `app/(home)/_components/dashboard/dashboard.test.tsx`                               | done   |

## Required automated tests

### Unit

- [x] `computeCatalogStats` — пустой список → нули; один навык → `skillsCount: 1`; несколько навыков
      с повторяющимися темами → `topicsCount` считает уникальные; суммирование `questionsCount`;
      уровень сложности без навыков → 0, а не отсутствующий ключ
- [x] `use-skills-filters.unit.test.ts` — перенесён без изменений тела, должен пройти как есть

### Component

- [x] `catalog.test.tsx`, `skill-card.test.tsx`, `reset-filters-button.test.tsx` — перенесены без
      изменений тел тестов и снапшотов; их зелёный прогон и есть доказательство переноса «один в
      один»
- [x] `Dashboard` — показатели по непустому каталогу; распределение по сложности с русскими
      подписями; состояние загрузки (плейсхолдеры, нет сообщения об ошибке); состояние ошибки (нет
      значений показателей); пустой каталог (сообщение вместо нулей); вводный блок со ссылкой на
      `/catalog`

### Integration

- [x] Отдельного уровня нет. Связка «SSR-прогрев → гидратация без повторного запроса» наблюдаема
      только в реальном браузере и закрывается E2E

### E2E

- [x] `src/tests/e2e/catalog.spec.ts` — `/catalog` открывается и показывает карточки навыков
- [x] `src/tests/e2e/catalog.spec.ts` — фильтр, заданный в UI, попадает в query-параметры `/catalog`
      и переживает перезагрузку страницы
- [x] `src/tests/e2e/catalog.spec.ts` — `/` не содержит сетки карточек; переход по ссылке дашборда
      ведёт на `/catalog`
- [x] `src/tests/e2e/catalog.spec.ts` — при открытии `/catalog` сразу после SSR нет повторного
      сетевого запроса за списком навыков при первом рендере

## Manual checks

- [ ] `/catalog` визуально совпадает с прежней главной: раскладка, отступы, сетка карточек, боковая
      панель фильтров на десктопе
- [ ] Мобильный drawer фильтров на `/catalog` открывается и работает как прежде
- [ ] Дашборд на `/` при пустом каталоге показывает сообщение, а не нули
- [ ] Дашборд на `/` при ошибке загрузки показывает сообщение об ошибке
- [ ] `/catalog/{id}` открывается с карточки и кнопка «Назад» возвращает на `/catalog`
- [ ] Старая ссылка вида `/?search=...` открывает дашборд и не приводит к ошибке

## Test data

- Fixtures: элементы `GetSkills200[number]` (`id`, `title`, `topic`, `difficulty`, `questionsCount`)
  — наборы: пустой, один навык, несколько навыков с повторяющимися темами и разными уровнями
  сложности
- API mocks: generated mock client `@repo/api/mocks` и Faker-фабрики для `GET /api/skills`;
  свободных JSON-моков не используем
- User roles: не применимо — каталог и дашборд доступны и гостю, и авторизованному пользователю
- Seed data: E2E работают против данных dev-стенда; отдельный seed не вводим

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `openspec validate move-catalog-to-route --strict --no-interactive`
- [x] `npx oxfmt <изменённые файлы>`
- [x] `npm run tsc`
- [x] `npm run lint`
- [x] `npm run knip`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run test:e2e`
