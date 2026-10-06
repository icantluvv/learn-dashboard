# Test Plan

## Risk level

P2 — изолированная клиентская фича без данных, auth и API. Худший исход: нерабочая ссылка на
поддержку или перекрытый кнопкой контент.

## Scenario coverage

| Requirement | Scenario | Risk | Test level | Test file | Status |
| ----------- | -------- | ---: | ---------- | --------- | ------ |
| Кнопка вызова поддержки на десктопе | Кнопка доступна на странице основной группы | P2 | Component | `src/components/layout.component.test.tsx` | done |
| Кнопка вызова поддержки на десктопе | Кнопка не дублируется на мобильной ширине | P3 | Component | `src/components/layout.component.test.tsx` | done |
| Кнопка вызова поддержки в мобильном меню | Гость видит кнопку поддержки в меню | P2 | Component | `src/components/account-drawer/account-drawer.component.test.tsx` | done |
| Кнопка вызова поддержки в мобильном меню | Авторизованный пользователь видит кнопку поддержки в меню | P2 | Component | `src/components/account-drawer/account-drawer.component.test.tsx` | done |
| Диалог «Поддержка» | Диалог открывается по нажатию | P1 | Component | `src/components/support/support-dialog.component.test.tsx` | done |
| Диалог «Поддержка» | Диалог закрыт по умолчанию | P2 | Component | `src/components/support/support-dialog.component.test.tsx` | done |
| Диалог «Поддержка» | Диалог закрывается по Escape | P2 | Component | `src/components/support/support-dialog.component.test.tsx` | done |
| Способы связи в диалоге | Ссылка на почту ведёт на mailto | P1 | Component | `src/components/support/support-dialog.component.test.tsx` | done |
| Способы связи в диалоге | Ссылка на Telegram открывается безопасно | P1 | Component | `src/components/support/support-dialog.component.test.tsx` | done |
| Способы связи в диалоге | Лишних действий в диалоге нет | P3 | Component | `src/components/support/support-dialog.component.test.tsx` | done |
| Dialog primitive | Диалог открывается триггером и получает доступное имя | P1 | Component | `packages/core/src/ui/dialog/dialog.component.test.tsx` | done |
| Dialog primitive | Закрытый диалог не рендерит содержимое | P2 | Component | `packages/core/src/ui/dialog/dialog.component.test.tsx` | done |
| Dialog primitive | Escape закрывает диалог и возвращает фокус | P1 | Component | `packages/core/src/ui/dialog/dialog.component.test.tsx` | done |
| Dialog primitive | Элемент закрытия закрывает диалог | P2 | Component | `packages/core/src/ui/dialog/dialog.component.test.tsx` | done |
| Dialog primitive | Управляемый режим подчиняется внешнему состоянию | P2 | Component | `packages/core/src/ui/dialog/dialog.component.test.tsx` | done |
| Способы связи в диалоге (данные) | Контакты непустые, `mailto:` сформирован корректно | P2 | Unit | `src/constants/support.unit.test.ts` | done |

## Required automated tests

### Unit

- [x] `src/constants/support.unit.test.ts`: `SUPPORT_EMAIL` непустой и содержит `@`;
      `SUPPORT_TELEGRAM_URL` непустой и начинается с `https://`; `SUPPORT_MAILTO_URL` равен
      `mailto:` + `SUPPORT_EMAIL`

### Component

- [x] `packages/core/src/ui/dialog/dialog.component.test.tsx`: открытие триггером и accessible
      name/description из `DialogTitle`/`DialogDescription`; отсутствие содержимого в закрытом
      состоянии; Escape закрывает и возвращает фокус на триггер; `DialogClose` закрывает;
      управляемый режим вызывает `onOpenChange(false)` и не закрывается сам
- [x] `src/components/support/support-dialog.component.test.tsx`: до нажатия заголовка
      «Поддержка» в документе нет; после нажатия виден заголовок и описание; ссылка «Почта» имеет
      `href` с префиксом `mailto:` и без `target`; ссылка «Telegram» имеет `target="_blank"` и
      `rel`, содержащий `noreferrer` и `nofollow`; внутри диалога ровно две ссылки; Escape
      закрывает диалог и возвращает фокус на кнопку
- [x] `src/components/account-drawer/account-drawer.component.test.tsx` (дополнение): кнопка
      «Поддержка» видна в открытом меню гостю и авторизованному; нажатие открывает диалог
      «Поддержка», меню остаётся открытым (контент дровера остаётся в документе, хоть и становится
      inert под модальным диалогом)
- [x] `src/components/layout.component.test.tsx`: оболочка `(main)` рендерит ровно одну кнопку с
      доступным именем «Поддержка», помеченную как десктопная (`hidden lg:flex`); на десктопной
      ширине (`1280×800`) кнопка видима, на мобильной (`390×844`) — `offsetParent === null`
      (реально скрыта `display:none`, не просто отсутствует в assertion); нажатие открывает диалог

### Integration

- [x] Не требуется — нет взаимодействия нескольких слоёв, API-моков и провайдеров сверх уже
      покрытых component-тестами

### E2E

- [x] Не требуется (обоснование): поведение полностью клиентское, без сессий, cookies, middleware
      и переходов между маршрутами; `mailto:` и `tg`-переход уводят из браузера и в Playwright
      проверяются только как значение `href`, что уже покрыто component-тестом. Риск P2 допускает
      отказ от E2E.

## Manual checks

- [ ] Десктоп (`lg`+): FAB в правом нижнем углу, остаётся на месте при прокрутке, не перекрывает
      контент на главной, в каталоге, на странице навыка и в профиле
- [ ] Мобильная ширина: плавающей кнопки поверх контента страницы нет; кнопка есть в правом нижнем
      углу открытого меню и не конфликтует с `BottomNav` и safe-area на iOS
- [ ] FAB и кнопка в меню: фон брендовый фиолетовый, иконка белая, читаемый контраст в светлой и
      тёмной темах
- [ ] Клик «Почта» открывает почтовый клиент с адресом поддержки (после подстановки реального
      `SUPPORT_EMAIL`)
- [ ] Клик «Telegram» открывает Telegram в новой вкладке (после подстановки реального
      `SUPPORT_TELEGRAM_URL`)
- [ ] Клавиатура: Tab доводит до кнопки, Enter открывает диалог, Tab не выходит за пределы диалога,
      Escape закрывает и возвращает фокус на кнопку

## Test data

- Fixtures: не требуются
- API mocks: `@repo/api/base/codegen/clients/meController/getAuthMe` — уже замокан в
  `account-drawer.component.test.tsx`; новых моков не добавляется
- User roles: гость (401 от `getAuthMe`) и авторизованный пользователь (существующий объект `user`
  в тесте дровера)
- Seed data: не требуется

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `openspec validate support-fab-dialog --strict --no-interactive` — valid
- [x] `npx oxfmt <изменённые файлы>` — выполнено для всех новых/изменённых файлов этого change
- [x] `npm run tsc` — 0 ошибок в файлах этого change (2 несвязанные ошибки в
      `packages/api/base/client.ts`/`database/client.ts` возникли из-за параллельного изменения
      `packages/api/base/search-params.ts` другой сессией, вне скоупа этого change — не трогались)
- [x] `npx oxlint <файлы этого change>` — 0 ошибок (полный `npm run lint` по всему репозиторию
      также не трогался — в нём уже были несвязанные ошибки в других файлах до начала работы)
- [x] `npx vitest run src/constants/support.unit.test.ts --project unit` — 3/3
- [x] `npx vitest run <component-тесты этого change> --project component` — 24/24 (включая
      `dialog.component.test.tsx`, `support-dialog.component.test.tsx`,
      `account-drawer.component.test.tsx`, `layout.component.test.tsx`)
- [ ] Ручные проверки из раздела «Manual checks» — не выполнены в этой сессии (нет браузерного
      окружения); требуют реальных значений `SUPPORT_EMAIL`/`SUPPORT_TELEGRAM_URL` (E2E не
      требуется, обоснование выше)
