## Why

Сегодня favicon и `apple-touch-icon` раздаются как статичные файлы из `public/` по неизменным
путям (`/favicon.ico`, `/apple-touch-icon.png`). Next.js не добавляет к таким путям cache-busting
метку, поэтому при замене содержимого файла после деплоя URL остаётся тем же, и браузер (в
частности Safari на iOS, который при «Добавить на экран „Домой"» кеширует `apple-touch-icon`
агрессивно и на долгий срок) продолжает показывать старую иконку, пока пользователь не очистит
кэш сайта вручную. Это уже происходило при последнем обновлении иконок. Next.js поддерживает
file-convention иконки (`app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`): при их наличии
фреймворк сам генерирует `<link>`-теги с хешем контента в query-параметре (`/icon?<hash>`), и этот
хеш меняется автоматически при каждой замене файла — тем самым кэш сбивается без ручных действий.

## What Changes

- `public/apple-touch-icon.png` переносится в `app/apple-icon.png` (file-convention). Next.js сам
  генерирует `<link rel="apple-touch-icon">` с хешем контента — именно этот тег iOS использует при
  добавлении на домашний экран, и именно он был источником бага.
- `public/favicon.ico` переносится в `app/favicon.ico` (file-convention) по тому же принципу для
  классического `<link rel="icon">`.
- Дополнительно создаётся `app/icon.png` (копия актуального `public/icon-512.png`) — Next.js
  добавляет ещё один хешированный `<link rel="icon" type="image/png">` для современных браузеров.
- Ручной блок `metadata.icons` в `app/layout.tsx` удаляется: записи для `/favicon.ico`,
  `/icon-192.png`, `/icon-512.png` и `apple: '/apple-touch-icon.png'` заменяются автогенерируемыми
  file-convention тегами, чтобы не дублировать `<link>`-теги на старые нехешированные пути.
- `app/manifest.ts` **не меняется** в части `icons`: Web App Manifest-спецификация требует
  конкретных файлов фиксированных размеров (192x192, 512x512, `maskable`) по стабильным адресам —
  Next.js не хеширует пути внутри `manifest.ts.icons`, это подтверждено официальной документацией
  Next.js (см. Impact). `public/icon-192.png` и `public/icon-512.png` остаются статичными файлами
  для Android/Chrome install-критериев.
- `src/tests/e2e/pwa.spec.ts` обновляется: проверка `apple-touch-icon` переходит от фиксированного
  статичного пути `/apple-touch-icon.png` к фактическому `href` тега `<link rel="apple-touch-icon">`
  из отрендеренного HTML (путь теперь содержит хеш и не является постоянной строкой).
- Неиспользуемые более статичные файлы `public/apple-touch-icon.png` и `public/favicon.ico`
  удаляются после переноса.

## Capabilities

### New Capabilities

_(нет)_

### Modified Capabilities

- `pwa-install`: требование «Иконки приложения» дополняется явным условием — favicon и
  `apple-touch-icon` SHALL отдаваться по URL, который меняется при изменении содержимого файла
  (content-addressed/хешированный путь), чтобы повторное появление бага с «залипшей» старой
  иконкой на iOS обнаруживалось автотестом, а не вручную на проде.

## Impact

- Затронутые файлы:
    - `app/layout.tsx` — удаление ручного блока `metadata.icons`.
    - `app/manifest.ts` — без изменений (см. выше).
    - Новые файлы: `app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`.
    - Удаляемые файлы: `public/apple-touch-icon.png`, `public/favicon.ico`.
    - `src/tests/e2e/pwa.spec.ts` — обновление проверки `apple-touch-icon` под хешированный путь.
- Источник: официальная документация Next.js по file-convention иконкам
  (`nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons`) — Next.js
  автоматически добавляет хеш контента к URL favicon/icon/apple-icon, сгенерированных из
  file-convention файлов в `app/`; официальный PWA-гайд Next.js (`.../guides/progressive-web-apps`)
  показывает `manifest.ts.icons` только со статичными путями в `public/`, без упоминания
  автоматического хеширования для них — прямого доступа к
  `node_modules/next/dist/docs` в этой сессии не было (permission denied), поэтому это
  подтверждено веб-поиском, а не прямым чтением установленной версии; при реализации стоит
  перепроверить фактическое поведение локальным `npm run build` и осмотром сгенерированного
  `<head>`.
- Публичные API, env contract и generated API-код не затрагиваются.
- Откат: вернуть файлы в `public/` под старыми именами и восстановить ручной блок
  `metadata.icons` в `app/layout.tsx`.
