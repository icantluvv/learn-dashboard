# Test Plan

## Risk level

P2

## Scenario coverage

| Requirement                                           | Scenario                                                  | Risk | Test level | Test file                                                    | Status  |
| ----------------------------------------------------- | --------------------------------------------------------- | ---: | ---------- | ------------------------------------------------------------ | ------- |
| Персонализированное приветствие                       | Авторизованный пользователь видит приветствие с именем    |   P1 | Component  | `app/(main)/(home)/_components/dashboard/dashboard.test.tsx` | Planned |
| Персонализированное приветствие                       | Неавторизованный посетитель видит нейтральное приветствие |   P1 | Component  | `app/(main)/(home)/_components/dashboard/dashboard.test.tsx` | Planned |
| Персонализированное приветствие                       | Подзаголовок отражает призыв к действию                   |   P2 | Component  | `app/(main)/(home)/_components/dashboard/dashboard.test.tsx` | Planned |
| Сводная статистика каталога без разбивки по сложности | Отображаются только карточки сводной статистики           |   P1 | Component  | `app/(main)/(home)/_components/dashboard/dashboard.test.tsx` | Planned |
| Сводная статистика каталога без разбивки по сложности | Карточка статистики содержит иконку и мини-диаграмму      |   P2 | Component  | `app/(main)/(home)/_components/dashboard/stat-card.test.tsx` | Planned |

## Required automated tests

### Unit

- [ ] Не требуется — `computeCatalogStats` не меняется, покрыт существующим
      `compute-catalog-stats.unit.test.ts`.

### Component

- [ ] `dashboard.test.tsx`: рендер приветствия «С возвращением, {name}» для авторизованного
      пользователя (мокнутый `useCurrentUser`/`useGetAuthMe`).
- [ ] `dashboard.test.tsx`: рендер «Добро пожаловать» для неавторизованного пользователя.
- [ ] `dashboard.test.tsx`: наличие текста «К чему приступим сегодня?».
- [ ] `dashboard.test.tsx`: отсутствие в DOM карточек с текстом «Лёгкий», «Средний», «Сложный».
- [ ] `stat-card.test.tsx`: карточка рендерит переданную иконку и sparkline с `aria-hidden="true"`.

### Integration

(нет — весь сценарий укладывается в component-уровень с мокнутым query client)

### E2E

(нет новых сценариев — риск P2, точечная сверка существующих спеков в рамках задачи 5.3)

## Manual checks

- [ ] Визуальная проверка карточек статистики (иконки, мини-диаграммы, новые цвета) против
      референса в светлой теме, desktop и mobile ширина, без горизонтального скролла.
- [ ] Проверка приветствия вживую: вход/выход из аккаунта на `/sign-in`, `/profile`.

## Test data

- Fixtures: существующие Faker-фабрики `@repo/api` для `GetSkills200` (`getSkills` mocks), не
  меняются.
- API mocks: `useGetSkills`/`useGetAuthMe` мокаются через существующую mock-инфраструктуру
  (`src/mock-mode`, generated mocks `@repo/api/mocks`), без ручных JSON fixtures.
- User roles: авторизованный пользователь (`CurrentUser` с непустым `name`) и анонимный
  (`null`).
- Seed data: не требуется.

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [ ] openspec validate update-home-dashboard --strict --no-interactive
- [ ] frontend: `npm run lint` / `npm run tsc` / `npm run test` / `npm run build`
- [ ] api: не затронут — пропустить
- [ ] E2E smoke / manual exploratory: ручная проверка главной страницы (см. Manual checks)
