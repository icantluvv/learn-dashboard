## 1. Примитив Dialog в @repo/core

- [x] 1.1 Создать `packages/core/src/ui/dialog/dialog.tsx` на `@base-ui/react/dialog` по образцу
      `packages/core/src/ui/drawer/drawer.tsx`: `Dialog`, `DialogTrigger`, `DialogPortal`,
      `DialogOverlay`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`,
      `DialogFooter`, `DialogClose`; `data-slot`-атрибуты, `cn`, `z-50` у overlay и content
- [x] 1.2 Добавить `packages/core/src/ui/dialog/index.ts` и экспорты в `packages/core/index.ts`
- [x] 1.3 ~~Добавить `dialog.stories.tsx`~~ — пропущено: в репозитории нет `.storybook/`
      конфига и ни одного существующего `*.stories.tsx` файла (ни у одного примитива `@repo/core`,
      включая `Drawer`/`Popover`); Storybook-зависимости в `package.json` есть, но инфраструктура
      не развёрнута. Добавление stories только для `Dialog` без общей настройки Storybook не
      даст проверяемого результата.

## 2. Контакты поддержки

- [x] 2.1 Создать `src/constants/support.ts` с `SUPPORT_EMAIL`, `SUPPORT_TELEGRAM_URL` и
      производным `SUPPORT_MAILTO_URL`; до получения реальных значений поставить явные заглушки
      с `TODO`
- [x] 2.2 Подставить фактические адрес почты и ссылку Telegram, полученные от владельца продукта,
      и снять `TODO`

## 3. Компоненты поддержки

- [x] 3.1 Создать `src/components/support/telegram-icon.tsx` — inline-SVG с `currentColor` и
      `aria-hidden="true"`
- [x] 3.2 Создать `src/components/support/support-fab.tsx` — круглая кнопка с `aria-label="Поддержка"`,
      `bg-brand-primary`, белой иконкой `size-6`, принимающая `className` для позиционирования
- [x] 3.3 Создать `src/components/support/support-dialog.tsx` (`'use client'`) — принимает
      `trigger`, рендерит заголовок «Поддержка», описание «Вы можете обратиться с проблемой или
      пожеланием для доработки сервиса» и две ссылки: «Почта» (`mailto:`, `buttonVariants({ variant: 'default' })`)
      и «Telegram» (`target="_blank"`, `rel="noreferrer nofollow"`, `buttonVariants({ variant: 'outline' })`)
- [x] 3.4 Создать `src/components/support/index.ts` с публичным API сегмента

## 4. Точки монтирования

- [x] 4.1 Смонтировать десктопный FAB в `src/components/layout.tsx`:
      `fixed right-6 bottom-6 z-40 hidden lg:flex`
- [x] 4.2 Добавить кнопку в правый нижний угол контента `AccountDrawer`: контейнеру `relative`,
      кнопке `absolute right-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))]`
- [x] 4.3 Убедиться, что открытие диалога из дровера не закрывает дровер и Escape закрывает только
      верхний слой

## 5. Тесты

- [x] 5.1 `src/constants/support.unit.test.ts` — непустые контакты, корректный префикс
      `mailto:` и совпадение адреса в `SUPPORT_MAILTO_URL` с `SUPPORT_EMAIL`
- [x] 5.2 `packages/core/src/ui/dialog/dialog.component.test.tsx` — пять сценариев примитива из
      `specs/ui-primitives/spec.md`
- [x] 5.3 `src/components/support/support-dialog.component.test.tsx` — закрытое состояние по
      умолчанию, открытие по нажатию, заголовок и описание, `href`/`target`/`rel` обеих ссылок,
      отсутствие лишних ссылок, закрытие по Escape с возвратом фокуса
- [x] 5.4 Дополнить `src/components/account-drawer/account-drawer.component.test.tsx`: кнопка
      «Поддержка» видна гостю и авторизованному, диалог открывается из дровера
- [x] 5.5 Добавить в `src/components/layout`-уровень проверку, что FAB присутствует в оболочке
      `(main)` и помечен как десктопный (`hidden lg:flex`)

## 6. Документация и test-plan

- [x] 6.1 Обновить `openspec/changes/support-fab-dialog/test-plan.md`: проставить фактические пути
      тестов и статусы по мере реализации
- [x] 6.2 Проверить, нужно ли упоминание новой точки входа в `docs/` — не требуется: ни один файл
      в `docs/` не описывает `Sidebar`/`BottomNav`/`AccountDrawer` или навигационную оболочку,
      соответствующего документа для дополнения нет

## 7. Верификация

- [x] 7.1 `openspec validate support-fab-dialog --strict --no-interactive` — valid
- [x] 7.2 `npx oxfmt <изменённые файлы>` — выполнено (отдельного `npm run fmt:check` по всему
      репозиторию не запускал, чтобы не зацепить несвязанные параллельные изменения в рабочем
      дереве)
- [x] 7.3 `npm run tsc` и точечный `npx oxlint <файлы этого change>` — 0 ошибок в файлах change;
      `npm run tsc` показывает 2 несвязанные ошибки в `packages/api/base/client.ts` и
      `database/client.ts` из-за параллельного изменения `search-params.ts` другой сессией (не
      трогал); полный `npm run lint` не запускал по той же причине
- [x] 7.4 `npm run test:unit` (точечно `support.unit.test.ts`) и `npm run test:component`
      (точечно 4 файла этого change) — 24/24 пройдено
- [ ] 7.5 Ручные проверки из `test-plan.md` → «Manual checks» — не выполнены: нет браузерного
      окружения в этой сессии; часть проверок (клик по ссылкам) требует подстановки реальных
      `SUPPORT_EMAIL`/`SUPPORT_TELEGRAM_URL`
