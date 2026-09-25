## 1. Реализация страницы 404

- [x] 1.1 Переписать `app/not-found.tsx`: заголовок (`<h1>`) "Страница не найдена", описание ниже
      и кнопка/ссылка возврата на главную (`next/link` `href="/"` + `@heroui/react` `Button`),
      сохранив `page-wrapper v-stack min-h-svh items-center justify-center` и
      `data-testid="error-boundary"` на корневом контейнере.
- [x] 1.2 `@heroui/react` `Button` не поддерживает `href`; вложение `<Link><Button/></Link>`
      создавало два фокусируемых элемента. Вместо этого `buttonVariants` из `@heroui/styles`
      применён как className к `next/link` `<Link>` — единственный `<a>`, client-контекст не
      требуется, `not-found.tsx` остаётся Server Component без отдельного файла кнопки.

## 2. Тесты

- [x] 2.1 Добавить `app/not-found.test.tsx` (`vitest-browser-react`, `describe`/`it`), проверяющий:
      видимость заголовка, видимость описания, наличие ссылки/кнопки с доступным именем и
      `href="/"`.
- [x] 2.2 Обновить `openspec/changes/add-not-found-page/test-plan.md`, отметив выполненные пункты
      после прогона тестов.

## 3. Проверка

- [x] 3.1 `npx oxfmt app/not-found.tsx app/not-found.test.tsx` (и файл кнопки, если создан).
- [x] 3.2 `npx vitest run app/not-found.test.tsx --project component`.
- [x] 3.3 `npm run tsc`.
- [x] 3.4 `npm run lint`: pre-existing ошибки в репозитории не касаются `app/not-found.tsx` /
      `app/not-found.test.tsx` — новые файлы не попали в вывод lint.
- [x] 3.5 Ручная проверка: `npm run dev`, запрос несуществующего URL — в HTML присутствуют
      заголовок "Страница не найдена", описание и `<a href="/">` с кнопкой "На главную".
- [x] 3.6 `openspec validate add-not-found-page --strict --no-interactive`.
