## Context

Мотивация — `proposal.md` → «Why»; требования — `specs/support-contact/spec.md` и
`specs/ui-primitives/spec.md`.

Существующее состояние, формирующее решение:

- `@repo/core` содержит примитивы на Base UI 1.8.0 (`drawer`, `popover`, `dropdown-menu`, `button`),
  примитива `dialog` нет.
- Оболочка `(main)` собирается в `src/components/layout.tsx`: `Sidebar` (`hidden lg:flex`),
  контент, `PwaInstallBanner` (`fixed`, `z-30`), `BottomNav` (`fixed`, `z-40`, `lg:hidden`).
  Мобильный/десктопный раздел по всему проекту делается на breakpoint `lg`.
- Мобильное меню — `src/components/account-drawer/account-drawer.tsx`: `Drawer` на всю высоту и
  ширину вьюпорта, контент — вертикальный стек в `div` с `p-6`.
- Слои `z-index`: `30` — PWA-баннер, `40` — `BottomNav`, `50` — overlay/popup `Drawer` и `Popover`.
- Токены темы в `app/globals.css`: `--brand-primary: #9688e9` доступен как утилита
  `bg-brand-primary`; `Button` имеет варианты `default` и `outline` и размеры `icon*`.
- `lucide-react` установлен, но иконки Telegram в нём нет.
- `npm run build` не запускается без `.env`; тесты: project `unit` (`*.unit.test.ts`) и project
  `component` (`*.component.test.tsx`, `app/**/*.test.tsx`, `src/**/*.test.tsx`).

## Goals / Non-Goals

**Goals:**

- Один источник правды для содержимого диалога поддержки: обе точки входа (десктопный FAB и кнопка
  в дровере) рендерят один и тот же компонент.
- Примитив `Dialog` в `@repo/core` — общего назначения, без знания про поддержку.
- Нулевой прирост зависимостей и нулевое влияние на server/client-границы страниц: client-код
  остаётся листом оболочки.

**Non-Goals:**

- Форма обращения внутри приложения, тикеты, отправка на бэкенд.
- Хранение контактов в env и различие контактов между стендами.
- Замена `Drawer` или унификация `Drawer`/`Dialog` под общий примитив.
- Анимации сложнее стандартных `data-starting-style`/`data-ending-style` Base UI.

## Decisions

### Dialog на Base UI в `@repo/core`, а не `shadcn add dialog`

Запрошенный `bunx --bun shadcn@latest add dialog` не применяется: bun удалён из репозитория
(единственный пакетный менеджер — npm), а shadcn-реестр отдаёт Radix-реализацию, тогда как правило
проекта — Base UI без Radix. Берём shadcn-подход (тонкая обёртка + CVA + `cn`, data-slot-атрибуты),
но на `@base-ui/react/dialog`, повторяя структуру соседнего `packages/core/src/ui/drawer/drawer.tsx`:
`Dialog` (Root) → `DialogTrigger` → `DialogPortal` → `DialogOverlay` (Backdrop) → `DialogContent`
(Popup) → `DialogHeader`/`DialogTitle`/`DialogDescription`/`DialogFooter`/`DialogClose`. Экспорт —
через `packages/core/src/ui/dialog/index.ts` и корневой `packages/core/index.ts`.

Альтернативы: нативный `<dialog>` — пришлось бы вручную делать focus trap, возврат фокуса и
анимации; переиспользовать `Drawer` с `swipeDirection` — семантика и поведение (свайп, прижатие к
краю) не соответствуют модальному диалогу по центру.

Слой: overlay и content получают `z-50` — как у `Drawer`, чтобы диалог лежал выше `BottomNav`
(`z-40`) и работал поверх открытого дровера.

### Одна разметка диалога, две точки монтирования

Создаётся `src/components/support/`:

- `support-dialog.tsx` — `'use client'`, принимает `trigger: ReactElement` и рендерит
  `Dialog` + `DialogTrigger render={trigger}` + содержимое (заголовок, описание, две ссылки);
- `support-fab.tsx` — круглая кнопка-триггер; принимает `className`, чтобы вызывающая сторона
  задавала позиционирование;
- `telegram-icon.tsx` — локальный inline-SVG (в lucide иконки нет), с `aria-hidden`;
- `index.ts` — публичный API сегмента.

Монтирование:

- десктоп — в `src/components/layout.tsx` рядом с `BottomNav`: `fixed right-6 bottom-6 z-40
  hidden lg:flex`. Позиционируется от вьюпорта, поэтому остаётся на месте при прокрутке; на
  мобильной ширине не рендерится визуально благодаря `hidden lg:flex`;
- мобильное меню — внутри контентного `div` дровера в `AccountDrawer`: контейнеру добавляется
  `relative`, кнопке — `absolute right-6 bottom-[max(1.5rem,env(safe-area-inset-bottom))]`. Внутри
  дровера кнопка не `fixed`, чтобы её не выносило из слоя попапа.

Альтернатива — отдельный компонент для каждой точки входа: отвергнута, дублировала бы текст и
ссылки, а значит и тесты.

### Вложенный диалог внутри открытого дровера

На мобильном диалог открывается поверх открытого `Drawer`. Base UI поддерживает вложенные модальные
слои, дровер остаётся открытым под диалогом, Escape закрывает верхний слой (диалог). Дровер при
открытии диалога намеренно не закрывается: пользователь возвращается в меню, где он был.

Риск-сценарий (два модальных слоя и возврат фокуса) проверяется component-тестом
`AccountDrawer`.

### Контакты — shared-константы

`src/constants/support.ts`: `SUPPORT_EMAIL`, `SUPPORT_TELEGRAM_URL` и производный
`SUPPORT_MAILTO_URL`. Контакты публичные, одинаковые на всех стендах и нужны в client-компоненте —
env-переменная добавила бы `NEXT_PUBLIC_`-поверхность без выгоды. Формирование `mailto:` — чистая
функция, покрывается unit-тестом.

Открытый пункт: фактические значения адреса почты и ссылки Telegram ещё не предоставлены
(см. Open Questions). Это не меняет ни спеки, ни подход, ни разбивку задач.

### Доступность и разметка ссылок

Кнопки-действия — `<a>` с `className={buttonVariants({ variant: 'default' | 'outline' })}`, как уже
сделано для `Войти` в `AccountDrawer`, а не `Button render={<a/>}`: ссылке нужна нативная семантика
и `href`. Telegram — `target="_blank"` + `rel="noreferrer nofollow"`; у `mailto:` ни `target`, ни
`rel` нет. У круглой кнопки нет видимого текста, поэтому обязателен `aria-label="Поддержка"`;
иконки — `aria-hidden="true"`.

## Risks / Trade-offs

- FAB перекрывает контент в правом нижнем углу (например, кнопки внутри карточек на десктопе) →
  `z-40` ниже слоя модалок, отступ `right-6 bottom-6`, ручная проверка на страницах каталога и
  профиля.
- Два модальных слоя на мобильном (диалог внутри дровера) могут конфликтовать по фокусу или
  блокировке скролла → component-тест на открытие диалога из дровера и закрытие по Escape с
  возвратом фокуса.
- `safe-area-inset-bottom` на iOS может прижать кнопку в дровере к системному индикатору →
  `bottom-[max(1.5rem,env(safe-area-inset-bottom))]`, ручная проверка в standalone-режиме.
- Контраст белой иконки на `#9688e9` — на границе AA для крупных элементов → иконка размером не
  менее `size-6`, ручная проверка в светлой и тёмной темах.
- Inline-SVG Telegram поддерживается вручную и разойдётся со стилем lucide-иконок → фиксированные
  `currentColor` и `size-6`, рендер рядом с lucide-иконкой почты при ручной проверке.

## Migration Plan

Чистое добавление: нет миграций данных, env и API. Деплой обычный. Откат — удаление
`src/components/support/`, точки монтирования в `src/components/layout.tsx` и кнопки в
`AccountDrawer`; примитив `Dialog` аддитивен и может остаться.

## Test strategy

- **Static**: `npm run tsc`, `npm run lint`, `npx oxfmt --check` по изменённым файлам.
- **Unit** (`*.unit.test.ts`, project `unit`): константы поддержки и формирование `mailto:`-адреса —
  непустой адрес, корректный префикс схемы.
- **Component** (`*.component.test.tsx` / `*.test.tsx`, project `component`, реальный Chromium):
    - `packages/core/src/ui/dialog/dialog.component.test.tsx` — сценарии примитива: открытие
      триггером, доступное имя/описание, отсутствие содержимого в закрытом состоянии, Escape с
      возвратом фокуса, закрытие элементом закрытия, управляемый режим;
    - `src/components/support/support-dialog.component.test.tsx` — заголовок и описание,
      `href` и атрибуты обеих ссылок, отсутствие лишних ссылок, закрытое состояние по умолчанию;
    - `src/components/account-drawer/account-drawer.component.test.tsx` (дополнение существующего) —
      кнопка «Поддержка» в меню для гостя и для авторизованного, открытие диалога из дровера.
- **Integration / E2E**: не требуется — поведение целиком клиентское, без API, сессий и
  переходов между маршрутами; риск P2.
- **Performance**: не требуется.
- **Manual**: позиция и видимость FAB на `lg`+ и его отсутствие на мобильной ширине, позиция кнопки
  в дровере, светлая и тёмная темы, фактическое открытие почтового клиента и Telegram.

## Open Questions

- Фактические значения `SUPPORT_EMAIL` и `SUPPORT_TELEGRAM_URL` — задаются при реализации, до тех
  пор в константах стоят явные заглушки с `TODO`. Спеки, подход и задачи от значений не зависят.
- Нужна ли кнопка поддержки на страницах группы `(auth)` (вход/регистрация) — сейчас нет, оболочка
  `Layout` там не используется. При необходимости добавляется отдельным изменением.
