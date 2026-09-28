# Test Plan

## Risk level

P1 — меняется публичная модель данных навыка, адресация основного раздела продукта и схема БД.
Авторизация, персональные данные и платежи не затрагиваются.

## Scenario coverage

| Requirement                                               | Scenario                                           | Risk | Test level | Test file                                                                                    | Status               |
| --------------------------------------------------------- | -------------------------------------------------- | ---: | ---------- | -------------------------------------------------------------------------------------------- | -------------------- |
| catalog-cores / Направление навыка                        | Направление в элементе списка                      |   P1 | Unit       | `src/modules/skills/server/skills-repository.unit.test.ts`                                   | implemented, not run |
| catalog-cores / Направление навыка                        | Направление в детали навыка                        |   P1 | Unit       | `src/modules/skills/server/skills-repository.unit.test.ts`                                   | implemented, not run |
| catalog-cores / Существующие навыки относятся к фронтенду | Навык, созданный до введения направления           |   P1 | Manual     | миграция на dev-БД                                                                           | planned              |
| catalog-cores / Фильтрация списка по направлению          | Запрос с фильтром по направлению                   |   P0 | Unit       | `src/modules/skills/server/skills-repository.unit.test.ts`                                   | implemented, not run |
| catalog-cores / Фильтрация списка по направлению          | Направление комбинируется с остальными фильтрами   |   P1 | Unit       | `src/modules/skills/server/skills-repository.unit.test.ts`                                   | implemented, not run |
| catalog-cores / Фильтрация списка по направлению          | Направление без совпадений                         |   P2 | Unit       | `packages/api/base/mock-scenarios.test.ts`                                                   | implemented, not run |
| catalog-cores / Фильтрация списка по направлению          | Запрос без фильтра по направлению                  |   P2 | Unit       | `src/modules/skills/server/skills-repository.unit.test.ts`                                   | implemented, not run |
| catalog-cores / Недопустимое направление отклоняется      | Неизвестное значение фильтра                       |   P1 | Unit       | `app/api/skills/route.unit.test.ts`                                                          | implemented, not run |
| catalog-cores / Направления читаются из БД                | Получение направлений                              |   P1 | Unit       | `src/modules/cores/server/cores-repository.unit.test.ts`, `app/api/cores/route.unit.test.ts` | implemented, not run |
| catalog-cores / Направления читаются из БД                | Пустая таблица направлений                         |   P2 | Unit       | `src/modules/cores/server/cores-repository.unit.test.ts`                                     | implemented, not run |
| catalog-cores / Навык связан с направлением               | Неизвестное направление отклонено внешним ключом   |   P1 | Manual     | миграция на dev-БД                                                                           | planned              |
| catalog-landing / Витрина направлений                     | Открытие витрины                                   |   P1 | Component  | `app/(main)/catalog/_components/core-banners/core-banners.test.tsx`                          | implemented, not run |
| catalog-landing / Витрина направлений                     | Данные баннера получены из направления             |   P1 | Component  | `app/(main)/catalog/_components/core-banners/core-banners.test.tsx`                          | implemented, not run |
| catalog-landing / Состояния загрузки направлений          | Loading/error/empty                                |   P1 | Component  | `app/(main)/catalog/_components/core-banners/core-banners.test.tsx`                          | implemented, not run |
| catalog-landing / Витрина направлений                     | Переход во фронтенд-раздел                         |   P0 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                              | implemented, not run |
| catalog-landing / Витрина не показывает список навыков    | На витрине нет каталога                            |   P2 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                              | implemented, not run |
| catalog-landing / Незаполненные направления помечены      | Баннер направления в разработке                    |   P2 | Component  | `app/(main)/catalog/_components/core-banners/core-banners.test.tsx`                          | implemented, not run |
| catalog-landing / Раздел направления в разработке         | Открытие раздела в разработке                      |   P1 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                              | implemented, not run |
| catalog-landing / Раздел направления в разработке         | Открытие раздела в разработке (без запроса данных) |   P2 | Component  | `app/(main)/catalog/[core]/_components/core-placeholder/core-placeholder.test.tsx`           | implemented, not run |
| catalog-landing / Неизвестное направление в адресе        | Адрес с неизвестным направлением                   |   P1 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                              | implemented, not run |
| catalog-landing / Неизвестное направление в адресе        | Резолвер сегмента отвергает неизвестное значение   |   P1 | Unit       | `src/constants/skill-cores.unit.test.ts`                                                     | implemented, not run |
| skills-catalog / Отображение списка навыков               | Успешная загрузка списка                           |   P0 | Component  | `app/(main)/catalog/[core]/_components/catalog/catalog.test.tsx`                             | implemented, not run |
| skills-catalog / Отображение списка навыков               | Карточка ведёт на `/catalog/{core}/{id}`           |   P0 | Component  | `app/(main)/catalog/[core]/_components/catalog/skill-card.test.tsx`                          | implemented, not run |
| skills-catalog / Отображение списка навыков               | Список ограничен направлением раздела              |   P0 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                              | implemented, not run |
| skills-catalog-filters / Фильтры хранятся в URL           | Обновление страницы с активными фильтрами          |   P0 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                              | implemented, not run |
| skills-catalog-filters / Сброс всех фильтров              | Нажатие кнопки сброса                              |   P1 | Component  | `app/(main)/catalog/[core]/_components/sidebar-filters/reset-filters-button.test.tsx`        | implemented, not run |
| skills-catalog-filters / Комбинирование фильтров          | Несколько активных фильтров                        |   P1 | Unit       | `app/(main)/catalog/[core]/_hooks/use-skills-filters.unit.test.ts`                           | implemented, not run |
| skills-catalog-filters / Комбинирование фильтров          | Фильтры не выводят за пределы направления          |   P1 | Unit       | `app/(main)/catalog/[core]/_hooks/use-skills-filters.unit.test.ts`                           | implemented, not run |
| skills-catalog-data / Список читается из Supabase         | Список без фильтров содержит `core`                |   P1 | Unit       | `src/modules/skills/server/skills-repository.unit.test.ts`                                   | implemented, not run |
| skills-catalog-data / Фильтрация по параметрам контракта  | Фильтр по направлению                              |   P0 | Unit       | `src/modules/skills/server/skills-repository.unit.test.ts`                                   | implemented, not run |
| skills-catalog-data / Деталь скилла читается из Supabase  | Существующий скилл возвращает `core`               |   P1 | Unit       | `src/modules/skills/server/skills-repository.unit.test.ts`                                   | implemented, not run |
| skills-catalog-data / SSR прогревает кэш                  | SSR каталога не делает self-fetch                  |   P1 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                              | implemented, not run |
| skills-catalog-data / SSR прогревает кэш                  | Гидратация переиспользует прогретые данные         |   P0 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                              | implemented, not run |
| skills-catalog-data / SSR прогревает кэш                  | Раздел в разработке не запрашивает список          |   P2 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                              | implemented, not run |
| skill-detail / Отображение страницы навыка                | Успешная загрузка навыка с вопросами               |   P1 | Component  | `app/(main)/catalog/[core]/[id]/_components/skill-detail/skill-detail-content.test.tsx`      | implemented, not run |
| skill-detail / Возврат к предыдущей странице              | Нажатие кнопки "Назад"                             |   P2 | Component  | `app/(main)/catalog/[core]/[id]/_components/skill-detail/back-button.test.tsx`               | implemented, not run |
| skill-detail / Направление в адресе должно совпадать      | Навык открыт под чужим направлением                |   P0 | E2E        | `src/tests/e2e/catalog.spec.ts`                                                              | implemented, not run |
| skill-detail / Направление в адресе должно совпадать      | Совпадение, расхождение и неизвестное направление  |   P1 | Unit       | `app/(main)/catalog/[core]/[id]/skill-route.unit.test.ts`                                    | implemented, not run |

## Required automated tests

### Unit

- [ ] `getCores` запрашивает нужную проекцию, порядок и преобразует snake_case поля
- [ ] `getCoreByType` фильтрует по `type` и возвращает `null` для отсутствующей строки
- [ ] `GET /api/cores` возвращает результат репозитория как JSON
- [ ] `getSkills` кладёт `core` в проекцию `select` и в возвращаемую карточку
- [ ] `getSkills` применяет `core: 'eq.<value>'` и комбинирует его с `search`/`topic`/`difficulty`/
      диапазоном количества вопросов
- [ ] `getSkills` без `core` не добавляет фильтр направления
- [ ] `getSkillById` возвращает `core` и запрашивает `select=title,questions,core`
- [ ] `GET /api/skills` с `core=frontend` доводит фильтр до репозитория
- [ ] `GET /api/skills` с `core=mobile` отвечает `400 invalid_query`
- [ ] `resolveSkillCore` на известном, неизвестном и пустом сегменте
- [ ] `SKILL_CORES` совпадает с generated-типом направления из `@repo/api`
- [ ] `toSkillsQueryParams` всегда содержит `core` и не возвращает `undefined` внутри раздела

### Component

- [ ] Витрина показывает отдельные loading, error и empty состояния запроса направлений
- [ ] Баннер получает название, описание, иконку и `href` из typed fixture ответа `GET /api/cores`
- [ ] Витрина рендерит баннер на каждое направление с корректным `href`
- [ ] Баннеры `backend`/`devops`/`design` содержат пометку «Раздел в разработке», `frontend` — нет
- [ ] На витрине нет сетки карточек и панели фильтров
- [ ] Заглушка раздела показывает «Раздел в разработке» без карточек и фильтров
- [ ] `SkillCard` ведёт на `/catalog/{core}/{id}`
- [ ] Перенесённые тесты каталога, фильтров и детали навыка проходят без правок тел

### Integration

- [ ] Отдельного уровня нет: связка route handler → репозиторий покрыта unit-тестами с замоканным
      database-клиентом, как в текущем `app/api/skills/route.unit.test.ts`

### E2E

- [ ] Витрина → баннер «Frontend» → `/catalog/frontend` с карточками навыков
- [ ] Клик по карточке ведёт на `/catalog/frontend/{id}` и открывает навык
- [ ] Фильтр из UI попадает в query-параметры `/catalog/frontend`, переживает перезагрузку и не
      выводит из раздела; сброс фильтров оставляет в разделе
- [ ] `/catalog/backend` показывает «Раздел в разработке» и не запрашивает `/api/skills`
- [ ] `/catalog/mobile` даёт страницу «не найдено»
- [ ] `/catalog/backend/{frontend-skill-id}` даёт страницу «не найдено»
- [ ] На `/catalog/frontend` при первом рендере нет клиентского запроса к `/api/skills`

## Manual checks

- [ ] После миграции `public.cores` содержит четыре seed-строки в ожидаемом порядке, а
      `skills.core` ссылается на `cores.type`
- [ ] После миграции на dev-БД у всех существующих навыков `core = 'frontend'`, вставка без `core`
      падает (default снят)
- [ ] `/catalog/frontend` визуально и функционально идентичен прежнему `/catalog`
- [ ] Баннеры витрины корректно выглядят на мобильной и десктопной ширине `page-wrapper`
- [ ] Тёмная тема на витрине и на заглушке раздела

## Test data

- Фикстуры: generated Faker-фабрики `@repo/api` для `GetSkills200` и `GetSkillById200` — после
  регенерации они сами включают `core`
- API-моки: `packages/api/base/mock-scenarios.ts` (`core: 'frontend'` у всех карточек, ветка
  фильтрации по `core`); database-клиент мокается в unit-тестах репозитория
- Роли пользователей: не влияют — каталог доступен без различия ролей
- Seed-данные: существующие строки `public.skills`, получающие `core = 'frontend'` миграцией

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `npx openspec validate split-catalog-by-core --strict --no-interactive`
- [ ] `npm run tsc`
- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm --workspace @repo/api run generate` — generated-код в diff только от генератора
- [ ] `npm run test:e2e`
