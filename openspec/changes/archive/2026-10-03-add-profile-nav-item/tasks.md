## 1. Пункт навигации «Профиль»

- [x] 1.1 Добавить в `src/components/navigation/nav-links.ts` третий элемент `NAV_LINKS`:
      `{ href: '/profile', icon: UserRoundIcon, label: 'Профиль' }`, сохранив `BOTTOM_NAV_MENU_LINK`
      без изменений
- [x] 1.2 Проверить, что `MainNav` и `BottomNav` не требуют правок кода (оба итерируют `NAV_LINKS`),
      и при необходимости подстроить только верстку `BottomNav` под четыре элемента

## 2. Удаление выхода из оболочки приложения

- [x] 2.1 Убрать из `src/components/auth-status/profile-card.tsx` кнопку выхода, `useSignOut`,
      `useTransition`, `Button`, `Spinner` и `LogOutIcon`; оставить вывод `AccountSummary`
- [x] 2.2 Убрать из `src/components/account-drawer/account-drawer.tsx` кнопку выхода и импорты
      `useSignOut`, `Button`, `LogOutIcon`; сохранить логотип, переключатель темы и блок аккаунта
- [x] 2.3 Прогнать `npm run knip` и по его результату либо оставить `use-sign-out.ts`, либо удалить
      хук вместе с его использованием в тестах — хук сохранён и переиспользован в
      `ProfileAuthenticated` вместо продублированной там логики выхода

## 3. Тесты

- [x] 3.1 Дополнить `src/components/navigation/is-active-route.unit.test.ts` кейсами для `/profile`
- [x] 3.2 Обновить `src/components/navigation/main-nav.test.tsx`: три ссылки, активное состояние
      «Профиль» на `/profile`
- [x] 3.3 Обновить `src/components/bottom-nav/bottom-nav.component.test.tsx`: ссылка «Профиль» с
      `href="/profile"`, «Меню» без `href`, активное состояние на `/profile` (эталонные скриншоты в
      `__screenshots__/` не используются текущими тестами и не перегенерировались)
- [x] 3.4 Обновить `src/components/sidebar/sidebar.component.test.tsx`: есть ссылка «Профиль», нет
      кнопки «Выйти»
- [x] 3.5 Обновить `src/components/auth-status/profile-card.component.test.tsx` и
      `auth-status.component.test.tsx`: блок аккаунта показывает имя и email и не содержит кнопки
      «Выйти»
- [x] 3.6 Обновить `src/components/account-drawer/account-drawer.component.test.tsx`: у
      авторизованного пользователя нет кнопки «Выйти», остальное содержимое дровера сохранено
- [x] 3.7 Убедиться, что `app/(main)/profile/_components/profile-view/profile-view.test.tsx`
      проверяет наличие кнопки «Выйти» на экране авторизованного пользователя, и добавить проверку,
      если её нет
- [x] 3.8 Обновить `src/tests/e2e/sidebar-nav.spec.ts`: переход «Профиль» → `/profile` с проверкой
      `aria-current` и отсутствие действия выхода в серверной разметке оболочки

## 4. Документация и артефакты изменения

- [x] 4.1 Отметить выполненные пункты в `openspec/changes/add-profile-nav-item/tasks.md` и заполнить
      колонки `Test file` / `Status` в `test-plan.md`
- [x] 4.2 Проверить, требуют ли обновления `docs/` (навигация и оболочка приложения) — расхождений
      нет, `docs/` не описывает состав навигации

## 5. Верификация

- [x] 5.1 `npx oxfmt <изменённые файлы>` и `npm run fmt:check`
- [x] 5.2 `npm run tsc` и `npm run lint`
- [x] 5.3 `npx vitest run src/components/navigation src/components/bottom-nav src/components/sidebar
src/components/auth-status src/components/account-drawer` (нужные project-флаги) и полный
      `npm run test`
- [x] 5.4 `npm run knip`
- [x] 5.5 `npx playwright test src/tests/e2e/sidebar-nav.spec.ts` — 4 из 5 тестов зелёные; падение
      «Sidebar занимает пропорцию 1:5» воспроизводится и до этого изменения (существующий дефект)
- [x] 5.6 `npx openspec validate add-profile-nav-item --strict --no-interactive`
- [x] 5.7 Ручные проверки из `test-plan.md` (BottomNav на 320/360px, выход только со `/profile`)
