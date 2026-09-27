## 1. Токены цвета в globals.css

- [x] 1.1 Добавить `--brand-primary: #9688e9`, `--brand-soft: #e1ddf6`, `--brand-ink: #3b3b3b` в
      `:root` в `app/globals.css`.
- [x] 1.2 Добавить соответствующие `--color-brand-primary`, `--color-brand-soft`, `--color-brand-ink`
      alias'ы в блок `@theme inline`.

## 2. Приветствие на главной странице

- [x] 2.1 В `dashboard.tsx` получить текущего пользователя через `useCurrentUser(null)`
      (`#/components/auth-status/use-current-user`, deep import — барrel `auth-status/index.ts`
      также реэкспортирует server-only `AuthStatusSlot`) — без серверного прогрева в `page.tsx`,
      по требованию: сессия приходит только из клиентского `useGetAuthMe`.
- [x] 2.2 (объединено с 2.1)
- [x] 2.3 Заменить заголовок `<h1>Learn Frontend</h1>` на условный рендер: `С возвращением, {name}`
      при наличии пользователя с непустым `name`, иначе «Добро пожаловать».
- [x] 2.4 Заменить текст подзаголовка на «К чему приступим сегодня?».

## 3. Удаление карточек уровней сложности

- [x] 3.1 Убрать блок рендера `DIFFICULTY_OPTIONS.map(...)` и второй `grid` в `DashboardStats`
      (`dashboard.tsx`).
- [x] 3.2 Убрать неиспользуемый импорт `DIFFICULTY_OPTIONS` из `dashboard.tsx` (константа остаётся в
      `src/constants/difficulty-options.ts`, так как используется в `difficulty-select.tsx`).

## 4. Редизайн StatCard

- [x] 4.1 Расширить `StatCardProps` (`stat-card.tsx`) опциональными `icon: LucideIcon` и
      `sparkline?: number[]`.
- [x] 4.2 Добавить разметку круглого icon-бейджа (`bg-brand-soft`, `text-brand-primary`) слева от
      `label`/`value`.
- [x] 4.3 Реализовать компактный декоративный SVG sparkline (столбики) справа,
      строящийся детерминированно от `value` через `_utils/build-sparkline.ts`; помечен
      `aria-hidden="true"`.
- [x] 4.4 В `DashboardStats` (`dashboard.tsx`) передать по иконке на каждую карточку («Навыков»,
      «Тем», «Вопросов») и включить `sparkline`.

## 5. Тесты

- [x] 5.1 Обновить `dashboard.test.tsx`: проверка приветствия для авторизованного и
      неавторизованного пользователя, проверка нового подзаголовка, проверка отсутствия карточек
      «Лёгкий»/«Средний»/«Сложный».
- [x] 5.2 Добавить/обновить component test для `StatCard` (иконка отображается, sparkline
      `aria-hidden`).
- [x] 5.3 Проверить и при необходимости поправить `src/tests/e2e/catalog.spec.ts` и
      `src/tests/e2e/header-nav.spec.ts` на ссылки на старый текст главной страницы (обновлён
      `catalog.spec.ts`; `header-nav.spec.ts` ссылался на лого, не менялся).
- [x] 5.4 Актуализировать `test-plan.md` по мере закрытия сценариев.

## 6. Верификация

- [x] 6.1 `npx oxfmt` для всех изменённых файлов.
- [x] 6.2 `npm run tsc`.
- [x] 6.3 `npm run lint`.
- [x] 6.4 `npx vitest run app/\(main\)/\(home\)/_components/dashboard/dashboard.test.tsx --project component`
      (и `stat-card.test.tsx`) — а также полный `npm run test` (207/207 passed).
- [x] 6.5 `openspec validate update-home-dashboard --strict --no-interactive`.
- [x] 6.6 `npm run build` прошёл успешно (production build). Ручная browser-проверка визуального
      вида не выполнялась в рамках этой сессии.
