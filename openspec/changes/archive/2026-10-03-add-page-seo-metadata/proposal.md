## Why

Все маршруты приложения сейчас наследуют единственный статический `metadata` из корневого layout:
любая страница — главная, каталог, направление, навык, профиль, вход и регистрация — отдаёт один и
тот же `<title>Learn Frontend</title>` и одно и то же описание. Для поисковых систем и соцсетей
сайт выглядит как одна страница-дубликат: нет уникальных title/description, нет canonical, нет
Open Graph, приватные страницы открыты для индексации, а `sitemap.xml` перечисляет несуществующие
адреса `/login` и `/registration`.

Дополнительно метаданные описывают бренд «Learn Frontend» и продукт «сервис для подготовки по
фронтенду», тогда как проект называется **StarSkills** и покрывает Frontend, Backend, DevOps,
Design и другие направления. Публиковать SEO-метаданные, описывающие несуществующий бренд и
заниженный охват направлений, бессмысленно, поэтому ребрендинг метаданных входит в этот change.

## What Changes

**Ребрендинг метаданных (Learn Frontend → StarSkills)**

- Корневые `title`, `description`, `appleWebApp.title` в `app/layout.tsx` переводятся на StarSkills
  и описывают подготовку к собеседованиям и повышение грейда по нескольким направлениям.
- `app/manifest.ts`: `name`, `short_name`, `description` переводятся на StarSkills.
- Захардкоженное имя бренда в `src/components/navigation/logo.tsx` (aria-label) и
  `src/components/pwa-install/pwa-install-banner.tsx` заменяется на константу из SEO-модуля.
- Идентификатор production-стенда переименовывается под новый продукт: `isProductionApp` в
  `src/constants/env.ts` сравнивает `NEXT_PUBLIC_APP_NAME` с константой `PRODUCTION_APP_NAME`
  (`'starskills'`); наследие прежнего проекта из кода удаляется.
- **BREAKING (деплой)**: `NEXT_PUBLIC_APP_NAME` на production-стенде ОБЯЗАН быть изменён на
  `starskills` в том же релизе. Иначе `isProductionApp` станет `false`, и `app/robots.ts` закроет
  весь сайт от индексации, а Sentry начнёт писать в проект с прежним именем.
- Само значение переменной остаётся идентификатором стенда, а не именем бренда: `next.config.ts`
  передаёт его как имя Sentry-проекта, поэтому в коде метаданных используется `BRAND_NAME`, а не
  `NEXT_PUBLIC_APP_NAME`.
- **BREAKING (для тестов)**: E2E и component-тесты, сверяющие видимое имя бренда
  (`src/tests/e2e/sidebar-nav.spec.ts`, `src/tests/e2e/mobile-account-drawer.spec.ts`,
  `src/components/sidebar/sidebar.component.test.tsx`, `src/components/navigation/logo.test.tsx`),
  обновляются под новое имя.
- `lang` корневого `<html>` меняется с `en` на `ru`: контент страниц русскоязычный, а неверный
  `lang` напрямую вредит индексации и screen reader'ам.

**Базовый слой метаданных**

- В корневом layout добавляются `metadataBase` (из `NEXT_PUBLIC_FRONT_URL`), шаблон заголовка
  (`title.template` вида `%s — StarSkills` с `title.default`), `applicationName`, `openGraph`
  (`type`, `siteName`, `locale: ru_RU`, `url`) и `twitter` (`card: summary`).
- Появляется общий модуль SEO-констант и хелперов (`src/seo/`) — источник правды для имени бренда,
  описаний направлений и сборки per-page `Metadata`, чтобы строки не дублировались по маршрутам.

**Per-page метаданные**

- Статические `export const metadata` для `/`, `/catalog`, `/sign-in`, `/sign-up`, `/profile` и
  страницы 404 — с уникальными `title`, `description` и `alternates.canonical`.
- `generateMetadata` для `/catalog/[core]` — заголовок и описание формируются из направления
  (Frontend, Backend, DevOps, Design), включая недоступные направления.
- `generateMetadata` для `/catalog/[core]/[id]` — заголовок и описание формируются из данных
  навыка; при ненайденном навыке или чужом направлении метаданные не должны ломать рендер 404.
- Загрузка навыка для метаданных и для страницы дедуплицируется, чтобы `generateMetadata` не
  удваивал запрос к бэкенду.

**Индексация**

- Приватные и служебные маршруты (`/profile`, а также страница 404) получают `robots: { index:
false, follow: false }`; публичные остаются индексируемыми.
- `app/sitemap.ts`: адреса `/login` и `/registration` исправляются на реальные `/sign-in` и
  `/sign-up`, добавляются `/catalog` и страницы направлений `/catalog/<core>`; список направлений
  берётся из `SKILL_CORES`, а не дублируется строками.

**Вне scope**

- Open Graph / Twitter изображения (`opengraph-image`, `og:image`): ассетов нет, выносится в
  отдельную задачу. Добавляются только текстовые OG/Twitter-поля.
- JSON-LD / структурированная разметка.
- Переименование самих маршрутов, i18n и мультиязычные `alternates.languages`.

## Capabilities

### New Capabilities

- `page-seo-metadata`: уникальные title/description/canonical для каждого маршрута, шаблон
  заголовка и базовые Open Graph/Twitter-поля, правила индексации приватных маршрутов и
  корректный `sitemap.xml`.

### Modified Capabilities

<!-- Требования существующих спеков не меняются: pwa-install требует непустых name/short_name/
     description манифеста, а не конкретных значений, поэтому ребрендинг не меняет спек-уровень. -->

## Impact

**Код**

- `app/layout.tsx` — `metadataBase`, `title.template`, OG/Twitter-база, ребрендинг, `lang="ru"`.
- `app/(main)/(home)/page.tsx`, `app/(main)/catalog/page.tsx`, `app/(main)/catalog/[core]/page.tsx`,
  `app/(main)/catalog/[core]/[id]/page.tsx`, `app/(main)/profile/page.tsx`,
  `app/(auth)/sign-in/page.tsx`, `app/(auth)/sign-up/page.tsx`, `app/not-found.tsx`,
  `app/(main)/not-found.tsx` — `metadata` / `generateMetadata`.
- `app/sitemap.ts` — исправление и расширение путей.
- `app/manifest.ts` — ребрендинг.
- Новый `src/seo/` — константы бренда, описания направлений, хелпер сборки `Metadata`.
- `src/modules/skills/server/skills-repository.ts` и `src/modules/cores/server/cores-repository.ts` —
  дедупликация чтения навыка и направления через React `cache`.
- `src/components/navigation/logo.tsx`, `src/components/pwa-install/pwa-install-banner.tsx` —
  имя бренда из SEO-модуля.

**Конфигурация и окружение**

- `.env.example` — новых переменных не вводится; значения `APP_NAME`/`NEXT_PUBLIC_APP_NAME`
  для локальной разработки приводятся к `starskills-local`, чтобы локальный стенд не совпадал с
  production-идентификатором и не открывался для индексации.
- **Внешнее действие**: переменной `NEXT_PUBLIC_APP_NAME` на production-стенде выставляется
  значение `starskills` (CI/CD или секреты окружения) синхронно с выкаткой — прежнее значение
  `bcp-prod` перестаёт распознаваться как production.
- `NEXT_PUBLIC_FRONT_URL` становится обязательным для корректного `metadataBase` и canonical —
  переменная уже обязательна в `src/env/client.ts`, новых переменных не добавляется.

**Тесты**

- Обновление существующих тестов бренда (см. выше).
- Новые unit-тесты на SEO-хелперы и `sitemap`, component-тесты не требуются (метаданные
  не рендерятся в DOM компонента), E2E-проверка `<title>`/canonical/`robots` по ключевым маршрутам.

**Документация**

- `docs/` — короткий раздел о правилах метаданных и о том, где лежит источник правды для бренда.

**Риски**

- `cacheComponents: true`: `generateMetadata` с обращением к API на динамических маршрутах должен
  оставаться совместимым с текущей моделью кеширования и не ломать сборку.
- Дубли запросов в `generateMetadata` + `page` при отсутствии дедупликации — прямой рост нагрузки
  на бэкенд.
- Рассинхрон переименования стенда: код ждёт `starskills`, а окружение отдаёт прежнее значение —
  production молча уходит под полный `Disallow: /`.

## Quality impact

- **Уровень риска**: P1. Пользовательская функциональность не меняется, но затрагиваются корневой
  layout, каждый маршрут и `lang` документа; регресс виден внешне (title, индексация) и способен
  сломать существующие E2E на бренд.
- **Затронутые маршруты**: `/`, `/catalog`, `/catalog/[core]`, `/catalog/[core]/[id]`, `/profile`,
  `/sign-in`, `/sign-up`, 404, `/sitemap.xml`, `/manifest.webmanifest`, `/robots.txt`.
- **Затронутые компоненты**: корневой layout, `src/components/navigation/logo.tsx` и
  `src/components/pwa-install/pwa-install-banner.tsx` (текст бренда), новый `src/seo/`.
- **Затронутые API**: изменений контракта нет; добавляется чтение навыка и направления в
  `generateMetadata`.
- **Требуемые уровни тестов**: unit (SEO-хелперы, sitemap, resolve направления), E2E (проверка
  `<title>`, canonical и `robots` на ключевых маршрутах), static (`tsc`, `lint`, `build`).
- **Ручные проверки**: просмотр `view-source` главной, направления и навыка; `/robots.txt`,
  `/sitemap.xml`, `/manifest.webmanifest`; предпросмотр ссылки в мессенджере/валидаторе OG.
- **Согласование с деплоем**: переименование production-идентификатора требует правки переменной
  окружения вне репозитория; выкатка кода без неё ломает индексацию прода.
- **Откат**: изменения изолированы в metadata-экспортах, `src/seo/`, sitemap и manifest; откат —
  revert коммита, миграций данных и изменений API нет.
