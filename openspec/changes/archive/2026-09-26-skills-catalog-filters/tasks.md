## 1. API-контракт

- [x] 1.1 Добавить query-параметры `search`, `topic`, `difficulty`, `minQuestionsCount`,
      `maxQuestionsCount` в `api/src/paths/api_skills.yaml`
- [x] 1.2 Перегенерировать `@repo/api` (`npm --workspace @repo/api run generate`) и проверить, что
      сгенерированные типы/клиент/React Query hook принимают эти параметры

## 2. Mock-режим

- [x] 2.1 Прокинуть `config` в `route.create(config)` в `packages/api/base/mock-client.ts`
- [x] 2.2 Реализовать `filterSkillCards()` в `packages/api/base/mock-scenarios.ts`: поиск по
      подстроке в названии, точное совпадение темы/сложности, диапазон количества вопросов

## 3. Каталог: компоненты и состояния

- [x] 3.1 Вынести рендер карточки в `SkillCard` (тема, RU-лейбл сложности, заголовок, счётчик
      вопросов, ссылка на `/catalog/{id}`)
- [x] 3.2 Создать заглушку маршрута `app/catalog/[id]/page.tsx`
- [x] 3.3 Реализовать `CatalogSkeleton` / `SkillCardSkeleton` (плейсхолдеры повторяют вёрстку
      реальной карточки)
- [x] 3.4 Реализовать `CatalogError` и `CatalogEmpty`
- [x] 3.5 Собрать `Catalog`: `isLoading` → skeleton, `isError` → error, пустой список → empty,
      иначе — сетка карточек

## 4. Данные: SSR-префетч и гидратация

- [x] 4.1 В `app/(home)/page.tsx` выполнить `queryClient.query(getSkillsQueryOptions())` без
      фильтров и обернуть дерево в `HydrationBoundary`
- [x] 4.2 В `Catalog` читать список через `useGetSkills({ params })`, чтобы при пустых фильтрах
      переиспользовать гидратированный кэш без повторного запроса

## 5. Фильтры: состояние и UI

- [x] 5.1 Реализовать `useSkillsFilters()` (`nuqs`, пять парсеров) и `toSkillsQueryParams()` в
      `app/(home)/_hooks/use-skills-filters.ts`
- [x] 5.2 Разбить `SidebarFilters` на `DesktopFiltersSidebar` / `MobileFiltersDrawer` +
      `FiltersContent`
- [x] 5.3 Подключить `SkillSearchInput`, `TopicSelect`, `DifficultySelect`,
      `QuestionsCountSlider` к `useSkillsFilters()`
- [x] 5.4 Добавить `ResetFiltersButton` (`setFilters(null)` сбрасывает все пять параметров разом)
- [x] 5.5 Вынести список тем/сложностей в общую константу `app/(home)/_constants/difficulty-options.ts`,
      переиспользовать в `SkillCard` и `DifficultySelect`

## 6. Тесты

- [x] 6.1 Unit: `use-skills-filters.unit.test.ts` — сборка query-параметров
- [x] 6.2 Unit: `packages/api/base/mock-scenarios.test.ts` — фильтрация мок-роута по всем пяти
      параметрам и их комбинациям
- [x] 6.3 Component: `skill-card.test.tsx` — поля карточки, RU-лейбл сложности, ссылка
- [x] 6.4 Component: `catalog.test.tsx` — все четыре ветки рендера (loading/error/empty/success)
- [x] 6.5 Component: `reset-filters-button.test.tsx` — сброс параметров из URL
- [x] 6.6 Добавить `@heroui/react`, `@tanstack/react-query`, `nuqs/adapters/testing`,
      `@t3-oss/env-nextjs`, `zod/mini` в `optimizeDeps` (`vitest.config.ts`) — без этого первый
      прогон browser-тестов падал с ошибкой дублирования React

## 7. Верификация

- [x] 7.1 `npm run tsc` — чисто
- [x] 7.2 `npm run lint` (`oxlint`) — чисто по изменённым файлам
- [x] 7.3 `npm run test` — 8 файлов / 24 теста, все зелёные
- [x] 7.4 `npm run build` — успешный production-билд
