# Test Plan

## Risk level

P1 — пользовательская функциональность не меняется, но затрагиваются корневой layout, `lang`
документа и каждый маршрут; регресс виден внешне (заголовки, индексация, карта сайта) и способен
сломать существующие E2E на имя бренда.

## Scenario coverage

| Requirement                                      | Scenario                                               | Risk | Test level  | Test file                                                                                               | Status           |
| ------------------------------------------------ | ------------------------------------------------------ | ---: | ----------- | ------------------------------------------------------------------------------------------------------- | ---------------- |
| Единый бренд и язык документа                    | Заголовок и описание описывают StarSkills              |   P1 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Единый бренд и язык документа                    | Манифест использует то же имя бренда                   |   P2 | Unit        | `app/manifest.unit.test.ts`                                                                             | done             |
| Единый бренд и язык документа                    | Язык документа соответствует контенту                  |   P2 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Уникальные заголовок и описание                  | Заголовок главной страницы                             |   P1 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Уникальные заголовок и описание                  | Заголовок списка направлений                           |   P1 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Уникальные заголовок и описание                  | Заголовок страницы направления                         |   P1 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Уникальные заголовок и описание                  | Разные направления получают разные метаданные          |   P1 | Unit        | `src/seo/cores.unit.test.ts`, `app/(main)/catalog/[core]/generate-metadata.unit.test.ts`                | done             |
| Уникальные заголовок и описание                  | Заголовок страницы навыка                              |   P1 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Уникальные заголовок и описание                  | Заголовки страниц аутентификации и профиля             |   P2 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Метаданные не ломают обработку ошибочных адресов | Несуществующий навык                                   |   P1 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Метаданные не ломают обработку ошибочных адресов | Навык запрошен по чужому направлению                   |   P1 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Метаданные не ломают обработку ошибочных адресов | Несуществующее направление                             |   P1 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Метаданные не ломают обработку ошибочных адресов | Недоступное направление                                |   P2 | Unit        | `app/(main)/catalog/[core]/generate-metadata.unit.test.ts`                                              | done             |
| Метаданные не ломают обработку ошибочных адресов | Недоступность источника данных навыка                  |   P1 | Integration | `app/(main)/catalog/[core]/[id]/generate-metadata.unit.test.ts`                                         | done             |
| Канонический адрес страницы                      | Канонический адрес публичного маршрута                 |   P1 | Unit        | `src/seo/build-metadata.unit.test.ts`                                                                   | done             |
| Канонический адрес страницы                      | Query-параметры не попадают в canonical                |   P1 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Базовая разметка для соцсетей                    | Open Graph на публичном маршруте                       |   P2 | Unit        | `src/seo/build-metadata.unit.test.ts`                                                                   | done             |
| Базовая разметка для соцсетей                    | Twitter-разметка на публичном маршруте                 |   P2 | Unit        | `src/seo/build-metadata.unit.test.ts`                                                                   | done             |
| Запрет индексации непубличных страниц            | Профиль закрыт от индексации                           |   P1 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Запрет индексации непубличных страниц            | Страница 404 закрыта от индексации                     |   P2 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Запрет индексации непубличных страниц            | Публичные маршруты индексируются                       |   P1 | E2E         | `src/tests/e2e/seo-metadata.spec.ts`                                                                    | done             |
| Карта сайта                                      | Адреса входа и регистрации соответствуют маршрутам     |   P1 | Unit        | `app/sitemap.unit.test.ts`                                                                              | done             |
| Карта сайта                                      | Каталог и направления присутствуют в карте сайта       |   P1 | Unit        | `app/sitemap.unit.test.ts`                                                                              | done             |
| Карта сайта                                      | Новое направление попадает в карту сайта автоматически |   P2 | Unit        | `app/sitemap.unit.test.ts`                                                                              | done             |
| Карта сайта                                      | Приватные маршруты отсутствуют в карте сайта           |   P1 | Unit        | `app/sitemap.unit.test.ts`                                                                              | done             |
| Метаданные не удваивают обращения к данным       | Один запрос навыка на один запрос страницы             |   P1 | Manual      | ручная проверка на dev-сервере (автоматизация невозможна, см. ниже)                                     | waived-to-manual |
| Метаданные не удваивают обращения к данным       | Один запрос направления на один запрос страницы        |   P2 | Unit        | `app/(main)/catalog/[core]/generate-metadata.unit.test.ts` (метаданные вовсе не обращаются к источнику) | done             |

## Required automated tests

### Unit

- [x] `buildPageMetadata` возвращает `alternates.canonical` с путём маршрута и не содержит
      query-параметров
- [x] `buildPageMetadata` заполняет `openGraph.title/description/url/type/siteName/locale` и
      `twitter.card/title/description` согласованно с `title`/`description`
- [x] `buildPageMetadata` с `noIndex: true` возвращает `robots: { index: false, follow: false }`,
      а без флага — не возвращает запрещающую директиву
- [x] `absoluteUrl` собирает корректный абсолютный адрес без двойных слешей для `/` и вложенных
      путей
- [x] SEO-реестр направлений покрывает каждое значение `SKILL_CORES`, строки непустые и попарно
      различаются
- [x] SEO-реестр содержит запись для направления, отмеченного недоступным, — метаданные такой
      страницы называют направление
- [x] `sitemap()` содержит `/`, `/catalog`, путь каждого направления из `SKILL_CORES`, `/sign-in`
      и `/sign-up`
- [x] `sitemap()` не содержит `/profile`, `/login` и `/registration`
- [x] `sitemap()` выводит направления из `SKILL_CORES`: расширение реестра расширяет карту сайта
      без правки самой карты
- [x] `manifest()` использует то же имя бренда и описание, что и SEO-константы, и не содержит
      прежнего названия продукта

### Component

Не применяется: метаданные формируются фреймворком и не попадают в DOM тестируемого компонента.
На этом уровне только обновляются существующие проверки видимого имени бренда
(`src/components/navigation/logo.test.tsx`, `src/components/sidebar/sidebar.component.test.tsx`).

### Integration

- [x] `generateMetadata` страницы навыка строит заголовок и описание из данных навыка
      (`app/(main)/catalog/[core]/[id]/generate-metadata.unit.test.ts`)
- [x] `generateMetadata` страницы навыка при исключении источника данных возвращает валидные
      fallback-метаданные и не бросает ошибку
- [x] `generateMetadata` отдаёт 404 для несуществующего навыка, навыка чужого направления и
      неизвестного направления
- [x] `generateMetadata` страницы направления не обращается к источнику данных направления
      (`app/(main)/catalog/[core]/generate-metadata.unit.test.ts`)
- [~] **Снято с автоматизации**: «ровно одно обращение к SDK-слою навыка на один запрос страницы».
  React `cache()` мемоизирует только внутри RSC-рендера — в Node-окружении Vitest он вызывает
  функцию повторно (проверено экспериментально: 2 вызова вместо 1). Unit-тест на это либо
  падал бы при корректном коде, либо проверял бы факт оборачивания в `cache()`, то есть деталь
  реализации. Перенесено в ручные проверки.

### E2E

- [x] `/` — уникальные `<title>` с брендом, `description`, `canonical`, отсутствие запрещающего
      `robots`
- [x] `/catalog` — `<title>` и `description` отличаются от главной
- [x] `/catalog/frontend` и `/catalog/backend` — разные `<title>`/`description`, каждый называет
      своё направление
- [x] `/catalog/frontend?<фильтры>` — `canonical` без query-параметров
- [x] страница существующего навыка — `<title>` содержит название навыка и бренд
- [x] несуществующий навык, навык по чужому направлению и несуществующее направление отдают 404
      без ошибки рендеринга
- [x] `/profile` и 404 содержат `robots` с `noindex`
- [x] `/sign-in` и `/sign-up` индексируемы и имеют собственные заголовки
- [x] корневой `<html>` имеет `lang="ru"`
- [x] `/sitemap.xml` доступен, а каждый перечисленный в нём адрес отвечает не 404

## Manual checks

- [ ] **Дедупликация запросов (P1, замена автотеста)**: на запущенном dev-сервере открыть страницу
      навыка и убедиться по логам/сетевым запросам к БД, что навык запрашивается один раз, а не
      дважды. Обоснование замены — см. раздел Integration.
- [ ] `view-source` главной, `/catalog/frontend` и страницы навыка: теги присутствуют в разметке,
      значения соответствуют ожидаемым
- [x] `/robots.txt` на production-подобном стенде разрешает индексацию и указывает на sitemap
- [x] `/manifest.webmanifest` содержит новое имя бренда
- [ ] Предпросмотр ссылки во внешнем OG-валидаторе или мессенджере: заголовок и описание
      подставляются (изображение отсутствует осознанно — вне scope)
- [ ] Согласование финальных маркетинговых формулировок `description` с продуктом

## Test data

- **Fixtures**: generated Faker-фабрики `@repo/api` для навыка и направления; `SKILL_CORES` как
  источник списка направлений.
- **API mocks**: репозитории `#/modules/*/server/*-repository` замоканы через `vi.mock`;
  `next/navigation` перекрыт локально, поскольку общий тестовый alias делает `notFound()` no-op и
  не прерывает поток выполнения.
- **User roles**: анонимный пользователь (публичные маршруты, `/sign-in`, `/sign-up`);
  авторизованный пользователь (`/profile`).
- **Seed data**: минимум один доступный навык в направлении `frontend` и одно направление,
  отмеченное недоступным, — для E2E; `NEXT_PUBLIC_FRONT_URL` с известным значением для проверки
  canonical.

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `openspec validate add-page-seo-metadata --strict --no-interactive`
- [x] `npm run fmt:check`
- [x] `npm run tsc`
- [x] `npm run lint`
- [x] `npm run test`
- [ ] `npm run build` — подтверждает совместимость `generateMetadata` с `cacheComponents: true`
- [ ] `npm run test:e2e`
- [ ] Ручные проверки из раздела «Manual checks»
