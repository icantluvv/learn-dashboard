# Test Plan

## Risk level

P1

## Scenario coverage

| Requirement                                 | Scenario                                     | Risk | Test level  | Test file                                                                   | Status |
| ------------------------------------------- | -------------------------------------------- | ---: | ----------- | --------------------------------------------------------------------------- | ------ |
| Список скиллов читается из Supabase         | Список без фильтров                          |   P1 | Integration | `app/api/skills/route.test.ts`                                              | Done   |
| Список скиллов читается из Supabase         | Пустая таблица                               |   P2 | Integration | `app/api/skills/route.test.ts`                                              | Done   |
| Фильтрация каталога по параметрам контракта | Фильтр по подстроке в названии               |   P1 | Unit        | `src/modules/skills/server/skills-repository.unit.test.ts`                  | Done   |
| Фильтрация каталога по параметрам контракта | Фильтр по теме                               |   P1 | Unit        | `src/modules/skills/server/skills-repository.unit.test.ts`                  | Done   |
| Фильтрация каталога по параметрам контракта | Фильтр по сложности                          |   P1 | Unit        | `src/modules/skills/server/skills-repository.unit.test.ts`                  | Done   |
| Фильтрация каталога по параметрам контракта | Фильтр по диапазону количества вопросов      |   P1 | Unit        | `src/modules/skills/server/skills-repository.unit.test.ts`                  | Done   |
| Фильтрация каталога по параметрам контракта | Комбинация фильтров без совпадений           |   P2 | Integration | `app/api/skills/route.test.ts`                                              | Done   |
| Деталь скилла читается из Supabase          | Существующий скилл                           |   P1 | Integration | `app/api/skills/[id]/route.test.ts`                                         | Done   |
| Деталь скилла читается из Supabase          | Отсутствующий скилл                          |   P1 | Integration | `app/api/skills/[id]/route.test.ts`                                         | Done   |
| Ключи доступа к Supabase не раскрываются    | Браузерный запрос не содержит Supabase-адрес |   P0 | E2E         | `src/tests/e2e/catalog-network.spec.ts` — **не написан**                    | Manual |
| SSR прогревает клиентский кэш данными       | SSR каталога не делает self-fetch            |   P1 | Unit        | `packages/api/base/client.unit.test.ts` + code review (нет fetch на `/api`) | Done   |
| SSR прогревает клиентский кэш данными       | Гидратация переиспользует прогретые данные   |   P2 | Manual      | —                                                                           | Waived |

## Required automated tests

### Unit

- [x] `src/modules/skills/server/skills-repository.unit.test.ts` (10 тестов): построение PostgREST-фильтров (`ilike`/`eq`/`gte`/`lte`) по каждому параметру и их комбинациям, включая boundary-значения `minQuestionsCount`/`maxQuestionsCount`; `getSkillById` возвращает `null` на пустой результат, не бросает исключение.
- [x] `packages/api/base/client.unit.test.ts` (3 теста): `getBaseUrl()` резолвит same-origin для skills-путей, сохраняет старую ветку для прочих.

### Component

- [x] Существующие `skill-card.test.tsx`, `catalog.test.tsx`, `skill-detail-content.test.tsx`, `skill-detail-error.test.tsx`, `back-button.test.tsx`, `reset-filters-button.test.tsx` проходят без изменений формы данных (регрессия) — 13/13.

### Integration

- [x] `app/api/skills/route.unit.test.ts` (4 теста): `GET /api/skills` — список, парсинг фильтров, пустой результат, 400 на невалидный `difficulty`. Репозиторий замокан (`vi.mock`), реальная сеть не используется.
- [x] `app/api/skills/[id]/route.unit.test.ts` (2 теста): `GET /api/skills/{id}` для существующего и несуществующего `id`.

### E2E

- [ ] `catalog-network.spec.ts` — **не написан в рамках этого change**. P0-сценарий (отсутствие Supabase-адреса/ключа в браузерном трафике) подтверждён вручную через DevTools Network во время smoke-теста (запросы идут на `/api/skills`, same-origin), но без постоянного автотеста регрессия может проскочить незамеченной. Рекомендация: добавить отдельным follow-up change.

## Manual checks

- [x] Открыть `/` на dev-сервере с реальным `.env` (Supabase) — каталог показывает засеянные данные (97 скиллов из docx), фильтры по `topic`/`difficulty` работают.
- [x] Открыть `/catalog/{существующий id}` — деталь отображается с вопросами.
- [ ] Открыть `/catalog/{несуществующий id}` — не перепроверено после последних правок (было корректно реализовано через `notFound()`, но не подтверждено вручную в этой сессии).
- [ ] Waived: явная проверка "нет дублирующего запроса при гидратации" в DevTools Network не проводилась — риск P2, `setQueryData` с идентичным query key технически исключает повторный fetch, но визуально не подтверждено.

## Test data

- Fixtures: реальные данные, а не Faker — 97 скиллов извлечены из `.docx`-материалов (title/questions), `id/topic/difficulty` сопоставлены с прежним mock-каталогом (`packages/api/base/mock-scenarios.ts`) по точному совпадению названия.
- API mocks: в unit/integration-тестах `getSkillRows` из `@repo/api/database` подменяется через `vi.mock` (не supabase-js — от него отказались в пользу второго Kubb-выхода, см. `design.md`), реальная сеть не используется.
- User roles: не применимо (аутентификации нет).
- Seed data: загружена в Supabase через REST (`POST /rest/v1/skills`, service role key) — 97/97 строк, минимум по одному значению каждого `difficulty`, множество разных `topic`.

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `openspec validate integrate-supabase-catalog --strict --no-interactive` — valid
- [x] `npm run tsc` — чисто
- [ ] `npm run lint` — не чисто по репозиторию в целом (широкий пре-существующий долг вне scope этого change); файлы этого change точечно чисты
- [x] `npx vitest run --project unit --project component` — 17/17 файлов, 70/70 тестов
- [x] `npm run build` — успешно
- [x] Manual exploratory — выполнен пользователем на реальном Supabase, найдены и исправлены 2 реальных бага (см. `tasks.md` §7.8)
- [ ] E2E smoke (Playwright) — не выполнялся
