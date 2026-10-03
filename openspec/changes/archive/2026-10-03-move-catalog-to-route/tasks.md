## 1. Подготовка

- [x] 1.1 Зафиксировать исходное состояние через `git status --short`
- [x] 1.2 Прогнать `npm run test` на текущем коде и зафиксировать зелёную базу — она будет эталоном
      для перенесённых тестов

## 2. Подъём общей константы сложности

- [x] 2.1 Перенести `app/(home)/_constants/difficulty-options.ts` в
      `src/constants/difficulty-options.ts` через `git mv`
- [x] 2.2 Обновить импорты у текущих потребителей (`skill-card.tsx`, `difficulty-select.tsx`) на
      `#/constants/difficulty-options`
- [x] 2.3 Удалить опустевшую `app/(home)/_constants/` и прогнать `npm run tsc`

## 3. Перенос каталога на /catalog

- [x] 3.1 `git mv app/(home)/_components/catalog app/catalog/_components/catalog`
- [x] 3.2 `git mv app/(home)/_components/sidebar-filters app/catalog/_components/sidebar-filters`
- [x] 3.3 `git mv` хука и его теста: `app/(home)/_hooks/use-skills-filters.ts` и
      `use-skills-filters.unit.test.ts` → `app/catalog/_hooks/`
- [x] 3.4 Создать `app/catalog/page.tsx` — точная копия текущего `app/(home)/page.tsx`: тот же
      SSR-прогрев `getSkills()` в `try/catch`, тот же `HydrationBoundary`, та же обёртка
      `page-wrapper v-stack gap-12 md:flex-row`, те же `<SidebarFilters />` и `<Catalog />`
- [x] 3.5 Поправить относительные импорты в перенесённых файлах; тела компонентов и тестов не менять
- [x] 3.6 Прогнать `npm run tsc` и перенесённые тесты — они должны пройти без правок тел тестов
- [x] 3.7 Прогнать `git diff -M --stat` и убедиться, что переносы распознаны как переименования, а
      содержимое компонентов не изменилось

## 4. Дашборд на главной

- [x] 4.1 Создать `app/(home)/_utils/compute-catalog-stats.ts` — чистая функция
      `computeCatalogStats(skills)` → `{ skillsCount, topicsCount, questionsCount, byDifficulty }`
- [x] 4.2 Написать `app/(home)/_utils/compute-catalog-stats.unit.test.ts` — пустой список, один
      навык, несколько тем с повторами, уровень сложности без навыков, суммирование `questionsCount`
- [x] 4.3 Создать компоненты дашборда в `app/(home)/_components/dashboard/`: клиентский контейнер на
      `useGetSkills()` с тремя состояниями (загрузка → плейсхолдеры, ошибка → сообщение, пустой
      список → сообщение об отсутствии навыков) и презентационные карточки показателей
- [x] 4.4 Добавить вводный блок: заголовок, краткое описание сервиса и ссылку на `/catalog`
- [x] 4.5 Переписать `app/(home)/page.tsx` — SSR-прогрев тем же `getSkills()` + `HydrationBoundary` +
      дашборд; убрать `SidebarFilters` и `Catalog`
- [x] 4.6 Написать component-тесты дашборда: показатели по непустому каталогу, распределение по
      сложности с русскими подписями, состояние загрузки, состояние ошибки, пустой каталог
- [x] 4.7 Проверить, что подписи уровней сложности берутся из `#/constants/difficulty-options`, а не
      дублируются

## 5. E2E

- [x] 5.1 Добавить E2E: `/catalog` открывается и показывает карточки навыков
- [x] 5.2 Добавить E2E: заданный в UI фильтр попадает в query-параметры `/catalog` и переживает
      перезагрузку страницы
- [x] 5.3 Добавить E2E: переход с `/` по ссылке дашборда ведёт на `/catalog`, а на `/` сетки карточек
      нет

## 6. Спеки и документация

- [x] 6.1 Отредактировать `## Purpose` в `openspec/specs/skills-catalog/spec.md` — заменить «на
      главной странице» на «на странице `/catalog`» (delta не может менять Purpose)
- [x] 6.2 Проверить `openspec/specs/skills-catalog-filters/spec.md` и `skills-catalog-data/spec.md`
      на другие упоминания главной страницы и при необходимости поправить их Purpose так же
- [x] 6.3 `docs/architecture.md` в репозитории отсутствует, упоминаний размещения каталога в `docs/`
      нет — правки не требуются
- [x] 6.4 Обновить `test-plan.md` — проставить статусы сценариев и фактические пути тест-файлов

## 7. Верификация

- [x] 7.1 `npx oxfmt` по всем изменённым файлам
- [x] 7.2 `npm run tsc`
- [x] 7.3 `npm run lint`
- [x] 7.4 `npm run knip` — убедиться, что после переноса не осталось неиспользуемых экспортов
- [x] 7.5 `npm run test`
- [x] 7.6 `npm run build`
- [x] 7.7 `npm run test:e2e`
- [x] 7.8 `openspec validate move-catalog-to-route --strict --no-interactive`
- [ ] 7.9 Ручные проверки из `test-plan.md` → «Manual checks», включая сравнение `/catalog` с
      прежней главной
- [ ] 7.10 Перечитать итоговый diff и перечислить в отчёте выполненные проверки и непроверенные риски
