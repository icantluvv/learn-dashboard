# План тестирования

## Уровень риска

P1. Изоляция аккаунтов и обновление после изменения отметок требуют автоматизированного покрытия.

## TDD workflow

Change оформлен после реализации: test-first история существующего кода не подтверждена.
Для найденных расхождений требуется failing regression test перед исправлением.
Ни один green результат не заявляется без свежего запуска.

## Покрытие сценариев

Пути ниже относительно корня. «Планируется» означает отсутствие подтверждённого покрытия.

| Требование          | Сценарий                                                     | Риск | Уровень тестирования | Файл теста                                                                                                                                                 | Статус                                         |
| ------------------- | ------------------------------------------------------------ | ---: | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| Клиентская загрузка | Открытие страницы профиля                                    |   P2 | Component + Static   | app/(main)/profile/_components/profile-view/profile-view.test.tsx; app/(main)/profile/page.tsx                                                             | Тест загрузки есть; запуск не выполнен         |
| Выбор экрана        | Запрос выполняется                                           |   P2 | Component            | app/(main)/profile/_components/profile-view/profile-view.test.tsx                                                                                          | Тест есть; запуск не выполнен                  |
| Выбор экрана        | Запрос завершился ошибкой, не связанной с отсутствием сессии |   P1 | Component            | app/(main)/profile/_components/profile-view/profile-view.test.tsx                                                                                          | Проверки 403/500/сети есть; запуск не выполнен |
| Выбор экрана        | Пользователь не авторизован                                  |   P1 | Component            | app/(main)/profile/_components/profile-view/profile-view.test.tsx                                                                                          | Проверка 401 есть; запуск не выполнен          |
| Выбор экрана        | Ответ не содержит пользователя                               |   P2 | Component            | app/(main)/profile/_components/profile-view/profile-view.test.tsx                                                                                          | Планируется проверка покрытия                  |
| Выбор экрана        | Пользователь авторизован                                     |   P2 | Component            | app/(main)/profile/_components/profile-view/profile-view.test.tsx                                                                                          | Тест есть; запуск не выполнен                  |
| API текущей сессии  | Получение списка авторизованным пользователем                |   P1 | Unit                 | app/api/me/completed-skills/route.unit.test.ts (планируется)                                                                                               | Планируется                                    |
| API текущей сессии  | Нет изученных навыков                                        |   P2 | Unit                 | app/api/me/completed-skills/route.unit.test.ts (планируется)                                                                                               | Планируется                                    |
| API текущей сессии  | Нет сессии                                                   |   P1 | Unit + E2E           | app/api/me/completed-skills/route.unit.test.ts; src/tests/e2e/profile-completed-skills.e2e.spec.ts (планируются)                                           | Планируется                                    |
| Состояния списка    | Загрузка списка                                              |   P2 | Component            | app/(main)/profile/_components/profile-view/profile-view.test.tsx                                                                                          | Планируется                                    |
| Состояния списка    | Пустой список                                                |   P2 | Component            | app/(main)/profile/_components/profile-view/profile-view.test.tsx                                                                                          | Тест есть; запуск не выполнен                  |
| Состояния списка    | Переход к изученному навыку                                  |   P2 | Component            | app/(main)/profile/_components/profile-view/profile-view.test.tsx                                                                                          | Планируется проверка href                      |
| Состояния списка    | Ошибка и повторный запрос                                    |   P2 | Component + Manual   | app/(main)/profile/_components/profile-view/profile-view.test.tsx                                                                                          | Планируется                                    |
| Синхронизация       | Возвращение после изменения отметки                          |   P1 | Component + E2E      | app/(main)/catalog/[core]/[id]/_components/skill-detail/skill-completion-button.test.tsx; src/tests/e2e/profile-completed-skills.e2e.spec.ts (планируется) | Планируется                                    |
| Изоляция кэша       | Смена аккаунта                                               |   P1 | Component + E2E      | app/(main)/profile/_components/profile-view/profile-view.test.tsx; src/tests/e2e/profile-completed-skills.e2e.spec.ts (планируется)                        | Планируется                                    |

## Обязательные автоматизированные тесты

### Unit

- [ ] Endpoint: сессия A возвращает только данные A, no-store, пустой массив, отсутствие сессии.
- [ ] `packages/api/base/client.unit.test.ts`: локальный endpoint без BFF-prefix и серверный origin.

### Component

- [ ] Auth loading/error/success/нет данных, без редиректа из компонента.
- [ ] Loading/empty/groups/links/error/retry списка; cached groups при сбое и disabled retry во время запроса.
- [ ] Успешная mutation обновляет список; неуспешная не меняет отображаемый прогресс.
- [ ] Смена аккаунта не отображает cached groups предыдущего пользователя.

### E2E Playwright

- [ ] Авторизация → профиль → отметка и снятие отметки → SPA-возврат с актуальным списком.
- [ ] Endpoint без сессии возвращает 401; смена A → B не раскрывает список A.

## Ручные проверки

- [ ] Сбой обновления при сохранённых группах → сообщение → retry → восстановление списка.
      Дополнительный exploratory smoke проверяет UX переходов, не заменяет автоматизированный P1.

## Тестовые данные

- Fixtures: typed user A/B, группы frontend/backend, пустой массив.
- API mocks: generated factories `@repo/api`, мок API/fetch; unhandled requests запрещены в Vitest.
- Пользовательские роли: авторизованный A/B и гость; role не меняет доступ к собственному списку.
- Seed data: два отдельных E2E аккаунта с различающимися completion, cleanup после сценария.

## Вне области

- Contract tests, visual regression, accessibility, mutation tests, feature flag matrices.
- Тема, slider и изменения avatar actions.

## Команды верификации

- [ ] `openspec validate fetch-profile-completed-skills-via-api --strict --no-interactive`
- [ ] `npx oxfmt --check openspec/changes/fetch-profile-completed-skills-via-api`
- [ ] `npm --workspace @repo/api run generate`
- [ ] `npx vitest run app/api/me/completed-skills/route.unit.test.ts packages/api/base/client.unit.test.ts --project unit`
- [ ] `npx vitest run 'app/(main)/profile/_components/profile-view/profile-view.test.tsx' 'app/(main)/catalog/[core]/[id]/_components/skill-detail/skill-completion-button.test.tsx' --project component`
- [ ] `npm run tsc` и `npm run lint`
- [ ] `npm run build`
- [ ] `npx playwright test src/tests/e2e/profile-completed-skills.e2e.spec.ts` после создания файла
- [ ] Ручной exploratory smoke
