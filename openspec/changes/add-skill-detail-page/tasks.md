## 1. API-контракт

- [x] 1.1 Создать `api/src/paths/api_skills_id.yaml`: `GET /api/skills/{id}`, `operationId:
getSkillById`, тег `Skills`, обязательный path-параметр `id: string`, ответ `200` — схема
      `Skill` (`$ref: ../components/schemas/Skill.yaml`), ответ `404` без тела (как в
      `api_example.yaml`)
- [x] 1.2 Зарегистрировать `/api/skills/{id}: $ref: paths/api_skills_id.yaml` в `api/src/openapi.yaml`
- [x] 1.3 `npm --workspace @repo/api run lint` (redocly lint контракта) — 3 предсуществующих
      `security-defined`-ошибки (были и до изменения на `api_example`/`api_skills`, теперь и на
      новой операции по тому же паттерну); вне скоупа этого изменения
- [x] 1.4 Перегенерировать `@repo/api` (`npm --workspace @repo/api run generate`) — появились
      `packages/api/base/codegen/{clients,hooks,types,zod}/skillsController/*SkillById*`

## 2. Mock-режим

- [x] 2.1 В `packages/api/base/mock-scenarios.ts` добавить `skillQuestions: Record<string,
GetSkillByIdQueryResponse>` — по одному набору `title`/`questions` на каждый `id` из
      `skillCards`. Вопросы генерируются детерминированно (`createSkillQuestions()`) из `title` и
      `questionsCount`, а не авторятся вручную на 97 записей — так количество вопросов навсегда
      остаётся синхронизировано со списком каталога без риска рассинхронизации
- [x] 2.2 Добавить в `mockScenarios.default` маршрут `GET /api/skills/:id` (regex `skillDetailPattern`
      с захватом `id` из URL): найден в `skillQuestions` → вернуть данные; не найден → `throw new
Error('Not Found', { cause: { status: 404, statusText: 'Not Found' } })` — `getMockResponse`
      пробрасывает исключение из `route.create()` как rejected promise, тем самым повторяя форму
      ошибки реального клиента (`error.cause.status`)
- [x] 2.3 (Обнаружено на этапе 7.6) Добавить `/catalog` в `mockModePagePaths`
      (`src/mock-mode/config.ts`) — без этого mock-режим включался только на `/`, и страница навыка
      всегда уходила в реальный (несуществующий в dev) backend вместо мока, независимо от `id`

## 3. Страница навыка: server-компоненты

- [x] 3.1 Создать `app/catalog/[id]/_components/skill-detail/skill-detail-content.tsx` — server
      component, принимает `{ skill: GetSkillById200 }`, рендерит `<h1>` с `title` и явно
      пронумерованный (`index + 1`) список вопросов; если `questions` пуст — сообщение об отсутствии
      вопросов вместо списка
- [x] 3.2 Создать `app/catalog/[id]/_components/skill-detail/skill-detail-error.tsx` — server
      component без props, текст "Не удалось загрузить навык. Попробуйте обновить страницу." (стиль
      как у `CatalogError`)
- [x] 3.3 Создать `app/catalog/[id]/_components/skill-detail/index.ts` с публичными экспортами
      компонентов
- [x] 3.4 (По запросу пользователя после первичной реализации) Разбить `SkillDetailContent` на два
      визуальных блока (`rounded-xl bg-white p-6` каждый) в общем `v-stack gap-4`: заголовок
      отдельно от списка вопросов
- [x] 3.5 (По запросу пользователя, несколько итераций) Создать `app/catalog/[id]/_components/
skill-detail/back-button.tsx` — единственный `'use client'`-лист на странице: `Button`
      (`@heroui/react`, `variant="ghost"` — валидный вариант проекта без фона/рамки в покое) с
      иконкой `ArrowLeft` (`lucide-react`, уже используется в `MobileFiltersDrawer`) слева от текста
      "Назад", `onPress={() => router.back()}` через `useRouter()` из `next/navigation`. На hover —
      фон остаётся прозрачным (`hover:bg-transparent`, чтобы перекрыть встроенный hover-фон
      `ghost`-варианта), только текст меняет цвет (`hover:text-gray-600`)

## 4. Страница навыка: данные и разметка маршрута

- [x] 4.1 Реализовать `app/catalog/[id]/page.tsx`: `await params`, `getQueryClient()`,
      `try { const skill = await queryClient.query(getSkillByIdQueryOptions({ id })) } catch
(error)` — при `error.cause.status === 404` вызвать `notFound()` из `next/navigation`; при
      любой другой ошибке отрендерить `<SkillDetailError />` внутри обёртки. (Сигнатура
      `getSkillByIdQueryOptions({ id })` — по факту сгенерированного kubb-хука, а не `{ path: { id
} }`, как предполагалось в design.md/tasks.md на этапе планирования). После code review
      переписано на ранний `return` в `catch`-ветке вместо переменных `skill: GetSkillById200 |
undefined` + `hasError` и тернарника в JSX — итоговая функция содержит только два ветвления,
      каждое со своим готовым JSX, без промежуточного флагового состояния
- [x] 4.2 Обернуть содержимое в `<HydrationBoundary state={dehydrate(queryClient)}>` и
      `<div className="page-wrapper v-stack gap-12 md:flex-row">` (та же обёртка, что и на
      `app/(home)/page.tsx`), внутри — `<BackButton />` и `<SkillDetailContent skill={skill} />`
      (обёрнутые в `v-stack gap-4 min-w-0 flex-1`, чтобы не стать `flex-row`-соседями `page-wrapper`
      на md+) при успехе

## 5. Тесты

- [x] 5.1 Unit: `packages/api/base/mock-scenarios.test.ts` — `GET /api/skills/:id` для
      существующего `id` возвращает `title`/`questions`; для несуществующего `id` — `404`
- [x] 5.2 Component: `skill-detail-content.test.tsx` — нумерация вопросов с 1 в порядке массива;
      пустой `questions` → сообщение об отсутствии вопросов вместо списка
- [x] 5.3 Component: `skill-detail-error.test.tsx` — текст сообщения об ошибке отображается
- [x] 5.4 Component: `back-button.test.tsx` — клик вызывает `router.back()` (через
      `nextRouterMock`/`resetNextNavigationMock` из `#/tests/mocks/next-navigation`)

## 6. Тестовая документация

- [x] 6.1 Проставить в `test-plan.md` фактические пути тестовых файлов и статус `Done` по мере
      выполнения задач раздела 5

## 7. Верификация

- [x] 7.1 `npm run tsc` — чисто
- [x] 7.2 `npm run lint` — по всем файлам, созданным/изменённым в этом change, чисто (проект в
      целом имеет большой pre-existing lint-долг, не в скоупе этого изменения)
- [x] 7.3 `npm run fmt:check` (или `npx oxfmt` на изменённые файлы) — отформатированы все файлы
      этого change; 4 файла из несвязанного незакоммиченного рабочего дерева
      (`app/(home)/_components/catalog/catalog.tsx`, `skill-card.tsx`,
      `sidebar-filters/desktop-filters-sidebar.tsx`, `app/(home)/page.tsx`) не трогались
- [x] 7.4 `npm run test` — 13 файлов / 51 тест, все зелёные (после добавления `BackButton` и его
      теста)
- [x] 7.5 `npm run build` — успешный production-билд, `/catalog/[id]` в списке маршрутов
- [x] 7.6 Ручная проверка в браузере (`npm run dev`, `agent-browser`) — `/catalog/skill-01`
      отдаёт `200` с заголовком и пронумерованным списком (скриншот подтверждает вёрстку);
      `/catalog/does-not-exist` отдаёт `404` через `notFound()`. Навыка с пустым `questions` в
      mock-данных нет (у всех 97 записей `questionsCount > 0`), ветка проверена только
      component-тестом (5.2) — зафиксировано как осознанный gap, а не пропуск
