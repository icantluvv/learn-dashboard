## 1. Перенос BackButton в общую директорию

- [x] 1.1 Создать `app/(main)/catalog/[core]/_components/back-button/back-button.tsx` с
      содержимым текущего
      `app/(main)/catalog/[core]/[id]/_components/skill-detail/back-button.tsx` (без изменений
      логики/разметки).
- [x] 1.2 Перенести `back-button.test.tsx` рядом, обновив только относительный импорт при
      необходимости.
- [x] 1.3 Создать `app/(main)/catalog/[core]/_components/back-button/index.ts` с
      `export { BackButton } from './back-button'`.
- [x] 1.4 Удалить `back-button.tsx` и `back-button.test.tsx` из
      `[id]/_components/skill-detail/` и убрать реэкспорт `BackButton` из
      `skill-detail/index.ts`.
- [x] 1.5 Обновить импорт `BackButton` в `app/(main)/catalog/[core]/[id]/page.tsx` на новый путь.

## 2. Добавление кнопки на страницу каталога направления

- [x] 2.1 Импортировать `BackButton` в `app/(main)/catalog/[core]/page.tsx` и разместить его
      непосредственно над `<div className="page-wrapper v-stack gap-4 md:flex-row md:gap-12">`
      внутри `HydrationBoundary`, только в ветке доступного направления (после проверки
      `coreData.isAvailable`).
- [x] 2.2 Проверено вручную через локальный dev-сервер: на `/catalog/frontend` (доступное
      направление) кнопка "Назад" рендерится; на `/catalog/devops` и `/catalog/backend`
      (недоступные направления, плейсхолдер "в разработке") кнопка не рендерится.

## 3. Тесты

- [x] 3.1 Прогнать перенесённый `back-button.test.tsx` на новом месте
      (`npx vitest run app/\(main\)/catalog/\[core\]/_components/back-button/back-button.test.tsx --project component`).
- [x] 3.2 Component-тест страницы `/catalog/{core}` не добавлен: в кодбейзе нет ни одного
      `page.test.tsx` для async Server Component страниц (включая уже существующую
      `/catalog/{core}/{id}`). Условие показа кнопки покрыто мануальной проверкой и структурной
      гарантией (кнопка только в ветке после `coreData.isAvailable`) — см. waiver в
      `test-plan.md`.
- [x] 3.3 Обновить `test-plan.md` статусами выполненных тестов.

## 4. Проверка качества

- [x] 4.1 `npx oxfmt` на всех изменённых/перенесённых файлах.
- [x] 4.2 `npm run tsc`.
- [x] 4.3 `npm run lint` (точечно по затронутым файлам — чисто; предсуществующие ошибки в
      несвязанных файлах репозитория не в скоупе этого изменения).
- [x] 4.4 `npm run test:component` — 43/43 файла, 163/163 теста прошли.
- [x] 4.5 `openspec validate add-catalog-core-back-button --strict --no-interactive` — valid.
