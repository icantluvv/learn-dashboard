## 1. Иконки

- [x] 1.1 Нарисовать `public/icon.svg` — марку приложения: монограмма на фирменном тёмном фоне
      (`#1c2637`), скруглённый квадрат, безопасные поля по краям
- [x] 1.2 Нарисовать `public/icon-maskable.svg` — тот же знак, уменьшенный внутрь безопасной зоны
      (≈80% полотна), фон на всё полотно
- [x] 1.3 Создать `scripts/generate-icons.ts` — растрирование через `sharp`:
      `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` (180×180)
- [x] 1.4 Добавить скрипт `icons` в `package.json`, запустить, закоммитить полученные PNG
- [x] 1.5 Проверить вес каждого PNG (ориентир — десятки килобайт, не сотни)

## 2. Манифест и метаданные

- [x] 2.1 Заполнить `app/manifest.ts`: `name: 'Learn Frontend'`, `short_name: 'Learn FE'`,
      `description`, `lang: 'ru'`, `id: '/'`, `scope: '/'`, `start_url: '/'`,
      `display: 'standalone'`, `orientation: 'portrait'`, `theme_color: '#1c2637'`,
      `background_color: '#1c2637'`
- [x] 2.2 Объявить иконки в манифесте: 192 и 512 с `purpose: 'any'`, отдельная запись 512 с
      `purpose: 'maskable'`
- [x] 2.3 Дополнить `metadata` в `app/layout.tsx`: `appleWebApp: { capable: true, title,
statusBarStyle: 'black-translucent' }`, `icons.apple` → `/apple-touch-icon.png`,
      `icons.icon` → PNG и SVG
- [x] 2.4 Добавить `themeColor` в `viewport` (светлая и тёмная схема), чтобы системная строка
      совпадала с фоном приложения
- [x] 2.5 Заменить плейсхолдер в `src/components/navigation/logo.tsx` на `icon.svg` через
      `next/image`, сохранив accessible name ссылки

## 3. Логика показа баннера

- [x] 3.1 Создать `src/components/pwa-install/should-show-install-banner.ts` — чистая функция
      `(state) => 'prompt' | 'ios-instructions' | 'hidden'` от `isStandalone`, `isDismissed`,
      `hasInstallPrompt`, `isIosSafari`
- [x] 3.2 Создать `src/components/pwa-install/use-install-prompt.ts` — клиентский хук: подписка на
      `beforeinstallprompt` (с `preventDefault` и сохранением события), `appinstalled`, чтение
      `display-mode: standalone` / `navigator.standalone`, чтение и запись отметки отказа в
      `localStorage`, таймаут ожидания события перед показом iOS-инструкции
- [x] 3.3 Написать `should-show-install-banner.unit.test.ts` — таблица решений по всем четырём
      входам, включая комбинации standalone + промпт и отказ + iOS

## 4. Компонент баннера

- [x] 4.1 Создать `src/components/pwa-install/pwa-install-banner.tsx` — клиентский компонент:
      кнопка установки (режим `prompt`), инструкция «Поделиться → На экран „Домой"» (режим
      `ios-instructions`), кнопка закрытия с `aria-label`, ничего (режим `hidden`)
- [x] 4.2 (Пересмотрено после ручной проверки на iPhone, см. группу 8) Раскладка: только мобильная
      ширина (`lg:hidden`), плашка у верхней границы экрана, крестик закрытия в правом верхнем углу
      баннера, кнопка «Установить» на всю ширину; фон `bg-card`, граница `border-border` — чтобы
      работало в обеих темах
- [x] 4.3 Создать `src/components/pwa-install/index.ts`
- [x] 4.4 Встроить баннер в `src/components/layout.tsx` перед `BottomNav`
- [x] 4.5 Написать `pwa-install-banner.component.test.tsx` — вызов промпта по кнопке, скрытие и
      запись отказа по закрытию, iOS-инструкция без кнопки установки, пустой рендер в standalone

## 5. E2E

- [x] 5.1 Написать `src/tests/e2e/pwa.spec.ts`: `/manifest.webmanifest` отдаёт `200` и JSON с
      непустыми `name`/`short_name`/`description`, `display: standalone`, `start_url: '/'`
- [x] 5.2 В том же спеке: каждый файл иконки из манифеста и `/apple-touch-icon.png` отвечает `200`
      с `content-type` изображения
- [x] 5.3 В том же спеке: HTML главной содержит ссылку на манифест

## 6. Документация и test-plan

- [x] 6.1 Описать в `README.md` PWA: что устанавливается, где лежат иконки, как их пересобрать
      (`npm run icons`), и что service worker намеренно не добавлялся
- [x] 6.2 Поддерживать `openspec/changes/add-pwa-install/test-plan.md` — отмечать статус сценариев
      по мере реализации

## 7. Верификация

- [x] 7.1 `openspec validate add-pwa-install --strict --no-interactive`
- [x] 7.2 `npm run verify:fast` (`fmt:check`, `lint`, `tsc`)
- [x] 7.3 `npm run test:unit` и `npm run test:component`
- [x] 7.4 `npm run build`
- [x] 7.5 `npx playwright test src/tests/e2e/pwa.spec.ts`
- [x] 7.6 Открыто на реальном iPhone (Safari): манифест и иконки подтянулись, баннер показал
      iOS-инструкцию. По итогам этого прогона обнаружено и исправлено в группе 8: баннер снизу
      экрана визуально сливался с нижней навигацией. Не выполнено: установка в Chrome на
      Android/десктопе и запуск с домашнего экрана в standalone — нет доступа к Android-устройству
- [ ] 7.7 (**не выполнено — нет доступа к физическому устройству**) Проверить вид иконки под
      маской на Android (круг/сквиркл) — знак не обрезается. Иконка нарисована с запасом в
      безопасной зоне (~80% полотна) и проверена визуально как PNG, но фактическую маску применяет
      только Android

## 8. Правки по итогам ручной проверки на iPhone (после первой реализации)

- [x] 8.1 (По замечанию пользователя) Баннер снизу экрана, поверх нижней навигации, на реальном
      устройстве читался как часть навигации, а не как отдельное уведомление — перенесён к верхней
      границе экрана (`top-[max(0.75rem,env(safe-area-inset-top))]`), учитывает
      `env(safe-area-inset-top)` для чёлки/выреза
- [x] 8.2 (По замечанию пользователя) Крестик закрытия был по центру относительно текста —
      перенесён в `absolute top-3 right-3` внутри баннера, независимо от длины текста
- [x] 8.3 (По замечанию пользователя) Кнопка «Установить» была `w-fit` — стала `w-full`
- [x] 8.4 (По замечанию пользователя) Десктопная карточка в правом нижнем углу убрана: баннер
      теперь `lg:hidden`, устанавливать с десктопа в сценарии сервиса не нужно
- [x] 8.5 Добавлен component-тест на `lg:hidden`; спека `pwa-install` дополнена требованием и
      сценарием «Баннер не показывается на десктопной ширине»
