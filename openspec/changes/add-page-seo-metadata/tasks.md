## 1. SEO-слой и источник правды бренда

- [x] 1.1 Создать `src/seo/brand.ts`: `BRAND_NAME`, `BRAND_SHORT_NAME`, `SITE_DESCRIPTION`,
      `TITLE_TEMPLATE`, `OG_LOCALE`
- [x] 1.2 Создать `src/seo/urls.ts` с `absoluteUrl(path)` поверх
      `clientEnvironment.NEXT_PUBLIC_FRONT_URL`
- [x] 1.3 Создать `src/seo/cores.ts` с типом `CoreSeoCopy` и реестром
      `Record<SkillCore, CoreSeoCopy>` для frontend/backend/devops/design
- [x] 1.4 Создать `src/seo/build-metadata.ts` с функцией `buildPageMetadata`, принимающей
      `title`, `description`, `path` и `noIndex`. Она собирает `title`, `description`,
      `alternates.canonical`, `openGraph` (title/description/url/type/siteName/locale) и
      `twitter` (card/title/description); при `noIndex` добавляет запрещающую директиву robots
- [x] 1.5 Создать `src/seo/index.ts` как публичный API модуля

## 2. Дедупликация серверных данных

- [x] 2.1 Обернуть `getSkillById` в `src/modules/skills/server/skills-repository.ts` в `cache()`
      из `react`
- [x] 2.2 Обернуть `getCoreByType` в `src/modules/cores/server/cores-repository.ts` в `cache()`
      из `react`
- [x] 2.3 Убедиться, что сигнатуры и поведение при ошибке/`null` не изменились, а существующие
      вызовы в `page.tsx` не правятся

## 3. Корневые метаданные и ребрендинг

- [x] 3.1 В `app/layout.tsx` добавить `metadataBase` из `NEXT_PUBLIC_FRONT_URL`
- [x] 3.2 В `app/layout.tsx` заменить `title` на объект с `default` и `template` из
      `TITLE_TEMPLATE`, обновить `description` и `appleWebApp.title` на StarSkills
- [x] 3.3 В `app/layout.tsx` добавить `applicationName`, базовые `openGraph`
      (`type`/`siteName`/`locale`/`url`) и `twitter` (`card`)
- [x] 3.4 В `app/layout.tsx` заменить `lang="en"` на `lang="ru"`
- [x] 3.5 В `app/manifest.ts` обновить `name`, `short_name` и `description` из констант
      `src/seo/brand.ts`
- [x] 3.6 Заменить захардкоженный бренд в `src/components/navigation/logo.tsx` (aria-label) и
      `src/components/pwa-install/pwa-install-banner.tsx` на `BRAND_NAME`
- [x] 3.7 В `src/constants/env.ts` вынести идентификатор production-стенда в константу
      `PRODUCTION_APP_NAME` со значением `'starskills'`, убрав наследие прежнего проекта
- [x] 3.8 В `.env.example` задать `APP_NAME`/`NEXT_PUBLIC_APP_NAME` значение `starskills-local`,
      чтобы локальный стенд не совпадал с production-идентификатором
- [x] 3.9 Зафиксировать в документации требование выкатить `NEXT_PUBLIC_APP_NAME=starskills` на
      production-стенде синхронно с релизом (иначе `robots.ts` закроет сайт от индексации)

## 4. Метаданные статических маршрутов

- [x] 4.1 `app/(main)/(home)/page.tsx` — `export const metadata` через `buildPageMetadata` для `/`
- [x] 4.2 `app/(main)/catalog/page.tsx` — `export const metadata` для `/catalog`
- [x] 4.3 `app/(auth)/sign-in/page.tsx` — `export const metadata` для `/sign-in`
- [x] 4.4 `app/(auth)/sign-up/page.tsx` — `export const metadata` для `/sign-up`
- [x] 4.5 `app/(main)/profile/page.tsx` — `export const metadata` для `/profile` с `noIndex: true`
- [x] 4.6 `app/not-found.tsx` и `app/(main)/not-found.tsx` — `export const metadata` с
      `noIndex: true`

## 5. Метаданные динамических маршрутов

- [x] 5.1 `app/(main)/catalog/[core]/page.tsx` — `generateMetadata`: `resolveSkillCore`, при
      `null` — `notFound()`, иначе строки из `src/seo/cores.ts` и путь `/catalog/<core>`
- [x] 5.2 `app/(main)/catalog/[core]/[id]/page.tsx` — `generateMetadata`: `resolveSkillCore` →
      `notFound()` при `null`; `getSkillById` с проверкой `isSkillInCore` → `notFound()` при
      отсутствии навыка или чужом направлении
- [x] 5.3 В `generateMetadata` страницы навыка обработать исключение `getSkillById` и вернуть
      fallback-метаданные направления вместо ошибки рендеринга
- [x] 5.4 Убедиться, что `generateMetadata` нигде не читает `searchParams`, чтобы canonical
      оставался без query-параметров

## 6. Карта сайта и индексация

- [x] 6.1 В `app/sitemap.ts` заменить `/login` и `/registration` на `/sign-in` и `/sign-up`
- [x] 6.2 В `app/sitemap.ts` добавить `/catalog` и пути направлений, выведенные из `SKILL_CORES`
- [x] 6.3 Задать приоритеты: `/` — 1, `/catalog` и направления — 0.8, auth-маршруты — 0.5;
      убедиться, что `/profile` отсутствует
- [x] 6.4 Проверить, что `app/robots.ts` продолжает работать без изменений

## 7. Обновление существующих тестов бренда

- [x] 7.1 Обновить `src/components/navigation/logo.test.tsx` под новое имя бренда
- [x] 7.2 Обновить `src/components/sidebar/sidebar.component.test.tsx`
- [x] 7.3 Обновить `src/tests/e2e/sidebar-nav.spec.ts` и
      `src/tests/e2e/mobile-account-drawer.spec.ts`
- [x] 7.4 Прогнать `npm run test` и починить остальные упавшие из-за бренда или `lang` проверки

## 8. Новые тесты

- [x] 8.1 `src/seo/build-metadata.unit.test.ts`: canonical, OG/Twitter-поля, ветка `noIndex`
- [x] 8.2 `src/seo/urls.unit.test.ts`: сборка абсолютного адреса, отсутствие двойных слешей
- [x] 8.3 `src/seo/cores.unit.test.ts`: реестр покрывает все значения `SKILL_CORES`, строки
      непустые и различаются между направлениями
- [x] 8.4 `app/sitemap.unit.test.ts`: наличие `/`, `/catalog`, всех направлений, `/sign-in`,
      `/sign-up`; отсутствие `/profile`, `/login`, `/registration`
- [x] 8.5 `src/constants/env.unit.test.ts`: `isProductionApp` истинен при `NEXT_PUBLIC_APP_NAME`
      равном `starskills` и ложен для любого другого значения стенда
- [x] 8.5a `app/manifest.unit.test.ts`: `name`/`short_name`/`description` совпадают с
      SEO-константами и не содержат прежнего названия продукта
- [x] 8.6 Unit-тест дедупликации (`app/(main)/catalog/[core]/[id]/generate-metadata.unit.test.ts`):
      при последовательном вызове `generateMetadata` и загрузки данных страницы навыка замоканный
      SDK-слой получает ровно одно обращение; аналогичный тест для страницы направления
- [x] 8.7 Unit-тест `generateMetadata` страницы навыка при исключении источника данных: возвращает
      валидные fallback-метаданные и не бросает
- [x] 8.8 E2E `src/tests/e2e/seo-metadata.spec.ts`: `<title>`, `description`, `canonical` и
      `robots` на `/`, `/catalog`, `/catalog/frontend`, странице навыка, `/profile` и 404
- [x] 8.9 E2E-проверка доступности `/sitemap.xml` и отсутствия в нём 404-адресов

## 9. Документация и артефакты change

- [x] 9.1 Добавить в `docs/` раздел о правилах метаданных: где источник правды бренда, как
      добавлять метаданные новому маршруту, как заводить SEO-строки для нового направления
- [x] 9.2 Индекса `docs/README.md` в репозитории нет (вопреки AGENTS.md) — обновлять нечего;
      создан `docs/seo-metadata.md`
- [x] 9.3 Актуализировать `openspec/changes/add-page-seo-metadata/test-plan.md`: проставить статусы
      и реальные пути тестовых файлов

## 10. Верификация

- [x] 10.1 `openspec validate add-page-seo-metadata --strict --no-interactive`
- [x] 10.2 `npx oxfmt <изменённые файлы>` и `npm run fmt:check`
- [x] 10.3 `npm run tsc`
- [x] 10.4 `npm run lint`
- [x] 10.5 `npm run test`
- [x] 10.6 `npm run build` — подтвердить отсутствие ошибок `blocking-prerender-metadata-*` при
      `cacheComponents: true`
- [x] 10.7 `npm run test:e2e` — новый `seo-metadata.spec.ts` 11/11 зелёный; предсуществующие
      падения `auth.spec.ts`, `sidebar-auth.spec.ts` и `sidebar-nav.spec.ts:33` подтверждены на
      чистом дереве (нужен реальный backend) и к этому change не относятся
- [x] 10.8 Разметка главной проверена в реальном браузере: `<title>`, `description`, `canonical`,
      `og:*`, `twitter:*`, `application-name` и `apple-mobile-web-app-title` отдаются корректно;
      `/sitemap.xml` и `/manifest.webmanifest` покрыты E2E
- [ ] 10.9 ОСТАЛОСЬ ВРУЧНУЮ (требует внешних условий): `/robots.txt` на production-подобном
      стенде; предпросмотр ссылки во внешнем OG-валидаторе; проверка дедупликации запросов по
      логам БД; согласование маркетинговых формулировок `description` с продуктом
