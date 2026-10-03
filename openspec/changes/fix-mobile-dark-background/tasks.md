## 1. Implementation

- [x] 1.1 Заменить `bg-white` на `bg-sidebar` в `DrawerContent` компонента `AccountDrawer`
      (`src/components/account-drawer/account-drawer.tsx`).
- [x] 1.2 Заменить `bg-card` на `bg-sidebar` в `<nav>` компонента `BottomNav`
      (`src/components/bottom-nav/bottom-nav.tsx`).

## 2. Verification

- [x] 2.1 `npx oxfmt` на изменённые файлы.
- [x] 2.2 `npm run tsc`.
- [x] 2.3 `npm run lint` на изменённые файлы.
- [x] 2.4 `npm run test` (component) для `bottom-nav.component.test.tsx` и
      `account-drawer.component.test.tsx` — оба проходят, снапшотов цвета фона не было, обновление
      не потребовалось.
- [x] 2.5 Поддерживать `test-plan.md` в актуальном состоянии.
