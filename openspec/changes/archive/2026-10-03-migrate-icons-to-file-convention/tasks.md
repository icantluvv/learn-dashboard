## 1. Перенос иконок на file-convention

- [x] 1.1 Скопировать `public/apple-touch-icon.png` в `app/apple-icon.png`.
- [x] 1.2 Скопировать `public/favicon.ico` в `app/favicon.ico`.
- [x] 1.3 Скопировать `public/icon-512.png` в `app/icon.png`.
- [x] 1.4 Удалить `public/apple-touch-icon.png` и `public/favicon.ico` (перенесены, больше не
      нужны как статичные файлы).
- [x] 1.5 `public/icon-192.png`, `public/icon-512.png`, `public/icon.png`, `public/icon.svg` не
      трогать — они используются `app/manifest.ts` и `logo.tsx` (см. design.md Non-Goals).

## 2. Обновление metadata

- [x] 2.1 Удалить блок `icons: { icon: [...], apple: '/apple-touch-icon.png' }` из
      `app/layout.tsx` — теперь он формируется автоматически из file-convention файлов.
- [x] 2.2 Проверено локальным `npm run build && npm run prod`: в отрендеренном `<head>`
      присутствуют `<link rel="icon" href="/favicon.ico?favicon.<hash>.ico">`,
      `<link rel="icon" href="/icon.png?icon.<hash>.png">` и
      `<link rel="apple-touch-icon" href="/apple-icon.png?apple-icon.<hash>.png">` — хеш в
      query-параметре подтверждён.
- [x] 2.3 Временно заменено содержимое `app/icon.png` на другой файл, пересобрано — хеш в `href`
      изменился (`icon.1sox7q_nnnx3i.png` → `icon.0l_of0tzke9ta.png`), механизм подтверждён;
      файл возвращён к исходному содержимому (копия `public/icon-512.png`).

## 3. Delta spec и тесты

- [x] 3.1 Обновить `src/tests/e2e/pwa.spec.ts`: проверка статичного пути
      `/apple-touch-icon.png` заменена на чтение фактического `href` тегов
      `<link rel="apple-touch-icon">` и `<link rel="icon">` из HTML, запрос по этому `href` и
      проверку наличия query-параметра (хеша).
- [x] 3.2 `npx playwright test src/tests/e2e/pwa.spec.ts` — 5/5 тестов прошли.
- [x] 3.3 Обновить `test-plan.md` статусами выполненных тестов.

## 4. Проверка качества

- [x] 4.1 `npx oxfmt` на изменённых файлах.
- [x] 4.2 `npm run tsc` — чисто.
- [x] 4.3 `npm run lint` (точечно по затронутым файлам) — чисто.
- [x] 4.4 `npm run build` — сборка прошла без ошибок с новыми file-convention файлами при
      включённом `cacheComponents: true`; Next.js сгенерировал статические роуты `/apple-icon.png`
      и `/icon.png`.
- [x] 4.5 `openspec validate migrate-icons-to-file-convention --strict --no-interactive` — valid.
