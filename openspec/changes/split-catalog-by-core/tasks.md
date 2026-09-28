## 1. Подготовка

- [x] 1.1 Зафиксировать исходное состояние через `git status --short`
- [x] 1.2 Прогнать `npm run test` на текущем коде и зафиксировать зелёную базу — она будет эталоном
      для перенесённых тестов

## 2. Данные: колонка `core`

- [x] 2.1 Создать `supabase/migrations/<timestamp>_add_core_to_skills.sql` с колонкой `core` и
      check-ограничением на четыре направления
- [x] 2.2 Добавить в ту же миграцию `alter column core drop default` и индекс `skills_core_idx`
- [x] 2.3 Накатить миграцию на dev-БД и проверить, что у всех существующих строк `core = 'frontend'`

## 3. Контракт и кодогенерация

- [x] 3.1 Добавить `core` (enum из четырёх значений, `required`) в элемент ответа
      `api/src/paths/api_skills.yaml`
- [x] 3.2 Добавить в `api/src/paths/api_skills.yaml` необязательный query-параметр `core` с тем же
      enum
- [x] 3.3 Добавить `core` (enum, `required`) в `api/src/components/schemas/Skill.yaml` — ответ
      `GET /api/skills/{id}`
- [x] 3.4 Добавить необязательное свойство `core` в `api/src/database/components/schemas/SkillRow.yaml`
- [x] 3.5 Добавить необязательный параметр-фильтр `core` (PostgREST-выражение) в
      `api/src/database/paths/skills.yaml`
- [x] 3.6 Прогнать `npm --workspace @repo/api run generate` и убедиться, что generated-код правился
      только генератором

## 4. Реестр направлений

- [x] 4.1 Создать `src/constants/skill-cores.ts`: `SKILL_CORES`, тип `SkillCore` и резолвер сегмента
      `resolveSkillCore(segment): SkillCore | null`; отображаемые данные перенесены в `public.cores`
- [x] 4.2 Написать `src/constants/skill-cores.unit.test.ts`: резолвер на известном, неизвестном и
      пустом сегменте; сверка `SKILL_CORES` с generated-типом направления из `@repo/api`
- [x] 4.3 Перенести `isAvailable` из статического реестра в seed таблицы направлений

## 5. Сервер: репозиторий и route handler

- [x] 5.1 В `src/modules/skills/server/skills-repository.ts` расширить `select` до
      `id,title,topic,difficulty,questions_count,core` и прокинуть `core` в `toSkillCard`
- [x] 5.2 Добавить в `getSkills` применение фильтра `core: 'eq.<value>'`
- [x] 5.3 В `getSkillById` изменить `select` на `title,questions,core` и вернуть `core` в объекте
- [x] 5.4 Обновить `src/modules/skills/server/skills-repository.unit.test.ts`: проекция с `core`,
      фильтр по `core`, комбинация `core` с остальными фильтрами, `core` в детали навыка
- [x] 5.5 Добавить разбор `core` в `parseFilters` в `app/api/skills/route.ts`
- [x] 5.6 Обновить `app/api/skills/route.unit.test.ts`: валидный `core` доходит до репозитория,
      невалидный даёт `400 invalid_query`, отсутствие `core` не добавляет фильтр

## 6. Mock-режим

- [x] 6.1 Проставить `core: 'frontend'` всем карточкам и деталям в
      `packages/api/base/mock-scenarios.ts`
- [x] 6.2 Добавить в `filterSkillCards` ветку по `params.core`
- [x] 6.3 Обновить `packages/api/base/mock-scenarios.test.ts` под новую форму ответа и фильтр

## 7. Перенос каталога в сегмент `[core]`

- [x] 7.1 `git mv app/(main)/catalog/_components app/(main)/catalog/[core]/_components` (вместе с
      каталогами `__screenshots__/`)
- [x] 7.2 `git mv app/(main)/catalog/_hooks app/(main)/catalog/[core]/_hooks`
- [x] 7.3 `git mv app/(main)/catalog/[id] app/(main)/catalog/[core]/[id]`
- [x] 7.4 Поправить относительные импорты и алиасы `@/(main)/catalog/...` в перенесённых файлах;
      тела компонентов не менять
- [x] 7.5 Прогнать `git diff -M --stat` и убедиться, что переносы распознаны как переименования

## 8. Раздел направления `/catalog/[core]`

- [x] 8.1 Создать `app/(main)/catalog/[core]/page.tsx`: резолв сегмента через
      `resolveSkillCore`, `notFound()` на неизвестном направлении
- [x] 8.2 Для `isAvailable: false` рендерить заглушку «Раздел в разработке» по центру области
      содержимого, без запроса данных, фильтров и сетки карточек
- [x] 8.3 Для `isAvailable: true` воспроизвести прежний `/catalog`: SSR-прогрев `getSkills({ core })`
      в `try/catch`, `HydrationBoundary`, обёртка `page-wrapper v-stack gap-4 md:flex-row md:gap-12`,
      `<SidebarFilters />` и `<Catalog core={core} />`
- [x] 8.4 Положить прогретые данные в `getSkillsQueryOptions({ params: { core } }).queryKey`
- [x] 8.5 Добавить в `toSkillsQueryParams` обязательный аргумент `core` и убедиться, что функция
      внутри раздела никогда не возвращает `undefined`; обновить
      `use-skills-filters.unit.test.ts`
- [x] 8.6 Прокинуть `core` в `Catalog` и передать его в `useGetSkills({ params })`
- [x] 8.7 Написать component-тест заглушки раздела: показывается текст, нет сетки и панели фильтров

## 9. Витрина `/catalog`

- [x] 9.1 Переписать `app/(main)/catalog/page.tsx` — Server Component без запросов данных, обёртка
      `page-wrapper`
- [x] 9.2 Создать `app/(main)/catalog/_components/core-banners/` — баннеры во всю ширину по одному
      на направление из реестра, каждый ссылкой на `/catalog/{core}`
- [x] 9.3 Добавить на баннеры направлений с `isAvailable: false` пометку «Раздел в разработке»,
      сохранив их кликабельность
- [x] 9.4 Написать component-тесты витрины: баннеры всех направлений и их `href`; пометка «в
      разработке» у `backend`/`devops`/`design` и её отсутствие у `frontend`; сетки карточек и
      панели фильтров на витрине нет

## 10. Карточка и страница навыка

- [x] 10.1 Изменить ссылку в `SkillCard` на `/catalog/${skill.core}/${skill.id}` и обновить
      `skill-card.test.tsx`
- [x] 10.2 В `app/(main)/catalog/[core]/[id]/page.tsx` резолвить сегмент направления и отдавать
      `notFound()` на неизвестном значении
- [x] 10.3 Сверять `skill.core` с направлением из адреса и отдавать `notFound()` при расхождении
- [x] 10.4 Добавить unit-тест сверки направления: совпадение, расхождение, неизвестное направление
- [x] 10.5 Проверить, что `BackButton` не меняется (возврат по истории браузера)

## 11. E2E

- [x] 11.1 Обновить `src/tests/e2e/catalog.spec.ts` под новые адреса
- [x] 11.2 E2E: витрина `/catalog` → баннер «Frontend» → `/catalog/frontend` с карточками
- [x] 11.3 E2E: клик по карточке ведёт на `/catalog/frontend/{id}` и открывает навык
- [x] 11.4 E2E: фильтр, заданный в UI, попадает в query-параметры `/catalog/frontend`, переживает
      перезагрузку и не выводит из раздела; сброс фильтров оставляет пользователя в разделе
- [x] 11.5 E2E: `/catalog/backend` показывает «Раздел в разработке» без карточек и фильтров
- [x] 11.6 E2E: `/catalog/mobile` и `/catalog/backend/{frontend-skill-id}` дают страницу «не найдено»
- [x] 11.7 E2E: на `/catalog/frontend` при первом рендере нет клиентского запроса к `/api/skills`
- [x] 11.8 Проверить `src/tests/e2e/sidebar-nav.spec.ts` — пункт «Каталог» теперь ведёт на витрину;
      поправить ожидания, если они завязаны на карточки

## 12. Спеки и документация

- [x] 12.1 Отредактировать `## Purpose` в `openspec/specs/skills-catalog/spec.md` — страница
      каталога теперь `/catalog/{core}` (delta не может менять Purpose)
- [x] 12.2 Отредактировать `## Purpose` в `openspec/specs/skills-catalog-filters/spec.md` и
      `openspec/specs/skill-detail/spec.md` под новые адреса
- [x] 12.3 Проверить `docs/` и `README.md` на упоминания адресов каталога и поправить при наличии
- [x] 12.4 Обновить `test-plan.md` — проставить статусы сценариев и фактические пути тест-файлов

## 13. Верификация

- [x] 13.1 `npx oxfmt` по всем изменённым файлам
- [x] 13.2 `npm run tsc`
- [x] 13.3 `npm run lint`
- [x] 13.4 `npm run knip`
- [x] 13.5 `npm run test`
- [x] 13.6 `npm run build`
- [x] 13.7 `npm run test:e2e` — сценарии каталога зелёные; падения в `auth.spec.ts`, `sidebar-auth.spec.ts`, `sidebar-nav.spec.ts` существуют вне этого change
- [x] 13.8 `npx openspec validate split-catalog-by-core --strict --no-interactive`
- [ ] 13.9 Ручные проверки из `test-plan.md` → «Manual checks»
- [x] 13.10 Перечитать итоговый diff и перечислить в отчёте выполненные проверки и непроверенные
      риски

## 14. Таблица и контракт направлений

- [x] 14.1 Сначала добавить unit-тест репозитория направлений и route handler `GET /api/cores`
- [x] 14.2 Расширить миграцию таблицей `public.cores`, seed четырёх направлений и внешним ключом
      `skills.core -> cores.type`
- [x] 14.3 Добавить публичные `Core`/`GET /api/cores` и database `CoreRow`/`GET /cores` в OpenAPI
- [x] 14.4 Перегенерировать оба выхода `@repo/api` и проверить generated diff

## 15. Серверное чтение направлений

- [x] 15.1 Реализовать `src/modules/cores/server/cores-repository.ts` с `getCores` и
      `getCoreByType`
- [x] 15.2 Реализовать `app/api/cores/route.ts`, возвращающий данные репозитория
- [x] 15.3 Добавить данные направлений в mock-сценарий публичного API

## 16. Витрина и раздел направления

- [x] 16.1 Запрашивать `GET /api/cores` из `CoreBanners` через generated `useGetCores`
- [x] 16.2 Строить название, описание, иконку и ссылку баннера из ответа направлений
- [x] 16.3 Получать descriptor текущего направления в `/catalog/[core]` через `getCoreByType`
- [x] 16.4 Обновить component-тест баннеров typed fixture из generated API и состояниями
      loading/error/empty/success

## 17. Применение миграции и regression-проверка

- [x] 17.1 Обновить `.mjs`-скрипт: применить миграцию, проверить seed, внешний ключ и backfill
- [x] 17.2 Накатить миграцию на dev-БД без вывода `SUPABASE_DB_URL`
- [x] 17.3 Проверить `GET /api/cores` и `GET /api/skills?core=frontend` на локальном приложении
