# План тестирования

## Уровень риска

P0 — критический путь регистрации, запись пользовательских данных и безопасная выдача загруженного
файла.

## TDD workflow

- [ ] Для каждого автоматизируемого сценария сначала добавлен падающий тест
- [ ] Реализация сделана после failing test
- [ ] Тесты доведены до green
- [ ] Refactor выполнен только после green
- [ ] Manual/waiver явно зафиксирован для сценариев без автоматизации

## Покрытие сценариев

| Требование           | Сценарий                           | Риск | Уровень тестирования   | Файл теста                                                      | Статус                  |
| -------------------- | ---------------------------------- | ---: | ---------------------- | --------------------------------------------------------------- | ----------------------- |
| Страница регистрации | Состав формы                       |   P1 | Component              | `sign-up-form.component.test.tsx`                               | Implemented, not run    |
| Страница регистрации | Доступные варианты пола            |   P1 | Component              | `sign-up-form.component.test.tsx`                               | Implemented, not run    |
| Страница регистрации | Порядок и обозначение полей        |   P2 | Component              | `sign-up-form.component.test.tsx`                               | Implemented, not run    |
| Страница регистрации | Обязательные поля ещё не заполнены |   P1 | Component              | `sign-up-form.component.test.tsx`                               | Implemented, not run    |
| Страница регистрации | Все обязательные поля заполнены    |   P1 | Component              | `sign-up-form.component.test.tsx`                               | Implemented, not run    |
| Страница регистрации | Регистрация отправляется           |   P2 | Component              | `sign-up-form.component.test.tsx`                               | Implemented, not run    |
| Страница регистрации | Выбор аватара через диалог         |   P1 | Component              | `sign-up-form.component.test.tsx`                               | Implemented, not run    |
| Страница регистрации | Выбор аватара перетаскиванием      |   P1 | Component              | `sign-up-form.component.test.tsx`                               | Implemented, not run    |
| Страница регистрации | Удаление выбранного аватара        |   P1 | Component              | `sign-up-form.component.test.tsx`                               | Implemented, not run    |
| Страница регистрации | Успешная регистрация               |   P0 | E2E                    | `src/tests/e2e/auth.spec.ts`                                    | Implemented, not run    |
| Страница регистрации | Занятый email                      |   P0 | Component + E2E        | `sign-up-form.component.test.tsx`, `src/tests/e2e/auth.spec.ts` | Existing, not rerun     |
| Страница входа       | Autofill внутри скруглённых границ |   P2 | Manual browser         | Chrome с сохранёнными учётными данными                          | Implemented, not run    |
| Страница входа       | Вход выполняется                   |   P2 | Component              | `sign-in-form.component.test.tsx`                               | Implemented, not run    |
| Валидация формы      | Имя короче 3 символов              |   P2 | Component              | `sign-up-form.component.test.tsx`                               | Existing                |
| Валидация формы      | Граница длины имени                |   P2 | Unit                   | `src/modules/auth/schemas.unit.test.ts`                         | Planned                 |
| Валидация формы      | Пароль короче 8 символов           |   P2 | Component              | `sign-up-form.component.test.tsx`                               | Existing                |
| Валидация формы      | Граница длины пароля               |   P2 | Unit                   | `src/modules/auth/schemas.unit.test.ts`                         | Planned                 |
| Валидация формы      | Некорректный email                 |   P2 | Component              | `sign-up-form.component.test.tsx`                               | Existing                |
| Валидация формы      | Не выбран пол или возраст          |   P2 | Component              | `sign-up-form.component.test.tsx`                               | Existing                |
| Валидация формы      | Недопустимое значение пола         |   P1 | Unit                   | `src/modules/auth/schemas.unit.test.ts`                         | Implemented, not run    |
| Валидация формы      | Возраст вне диапазона              |   P2 | Unit                   | `src/modules/auth/schemas.unit.test.ts`                         | Existing                |
| Валидация формы      | Пустой аватар допустим             |   P1 | Component              | `sign-up-form.component.test.tsx`                               | Implemented, not run    |
| Валидация формы      | Неподдерживаемый тип аватара       |   P0 | Unit + Component + E2E | validator unit, form component, `src/tests/e2e/auth.spec.ts`    | Implemented, not run    |
| Валидация формы      | Аватар превышает лимит             |   P1 | Unit + Component       | validator unit, form component                                  | Implemented, not run    |
| Валидация формы      | Серверная валидация в обход формы  |   P0 | Unit                   | `src/modules/auth/actions.unit.test.ts`                         | Implemented, not run    |
| Регистрация          | Успех без аватара                  |   P0 | Unit + E2E             | action unit, `src/tests/e2e/auth.spec.ts`                       | Existing/Update         |
| Регистрация          | Успех с аватаром                   |   P0 | Unit + E2E             | action unit, `src/tests/e2e/auth.spec.ts`                       | Implemented, not run    |
| Регистрация          | Ошибка сохранения аватара          |   P0 | Unit                   | `src/modules/auth/actions.unit.test.ts`                         | Implemented, not run    |
| Регистрация          | Email уже занят                    |   P0 | Unit + E2E             | action unit, `src/tests/e2e/auth.spec.ts`                       | Existing/Update         |
| Регистрация          | Отказ при невалидных данных        |   P0 | Unit                   | schema/action unit                                              | Implemented, not run    |
| `GET /api/me`        | Профиль с URL аватара              |   P1 | Unit                   | `app/api/me/route.unit.test.ts`                                 | Update                  |
| `GET /api/me`        | Гость                              |   P1 | Unit                   | `app/api/me/route.unit.test.ts`                                 | Existing                |
| `GET /api/me`        | Контракт описан                    |   P1 | Static                 | API lint/bundle + Kubb generation                               | Source updated, not run |
| Выдача аватара       | Получение существующего аватара    |   P0 | Unit + E2E             | avatar route unit, `src/tests/e2e/auth.spec.ts`                 | Implemented, not run    |
| Выдача аватара       | Неизвестный идентификатор          |   P1 | Unit                   | avatar route unit                                               | Implemented, not run    |
| Страница входа       | Состав формы                       |   P2 | Component              | `sign-in-form.component.test.tsx`                               | Existing, not rerun     |
| Страница входа       | Поля входа не заполнены            |   P1 | Component              | `sign-in-form.component.test.tsx`                               | Implemented, not run    |
| Страница входа       | Успешный вход                      |   P0 | Component + E2E        | sign-in component, `src/tests/e2e/auth.spec.ts`                 | Existing, not rerun     |
| Страница входа       | Неверные учётные данные            |   P0 | Component + E2E        | sign-in component, `src/tests/e2e/auth.spec.ts`                 | Existing, not rerun     |
| Страница входа       | Пустые поля                        |   P2 | Component              | `sign-in-form.component.test.tsx`                               | Implemented, not run    |

## Обязательные автоматизированные тесты

### Unit

- [ ] Таблица валидных/невалидных gender, MIME, magic bytes и размеров 5 MiB / 5 MiB + 1.
- [ ] Action не вызывает Better Auth при невалидных данных и не оставляет пользователя при сбое
      записи аватара.
- [ ] Avatar repository пишет и читает точные байты и метаданные; cleanup идемпотентен.
- [ ] Avatar route возвращает точные bytes/headers и безопасный `404`.
- [ ] `/api/me` возвращает URL, но не байты аватара.

### Component

- [ ] Список пола содержит ровно «Мужской» и «Женский».
- [ ] Picker и drop выбирают один валидный файл; preview появляется и удаляется.
- [ ] Неверный тип и превышение размера блокируют отправку с понятной ошибкой.
- [ ] Форма передаёт ожидаемый `FormData` с аватаром и без него и сохраняет текущие состояния
      server error/loading.

### E2E Playwright

- [ ] Happy path: регистрация с PNG → авторизованное состояние → перезагрузка → браузер успешно
      загружает тот же аватар отдельным запросом.
- [ ] Negative path: текстовый файл с MIME `image/png` отклоняется, пользователь и аватар в БД не
      появляются.
- [ ] Все новые/изменённые тесты используют проектные fixtures и обязательные Allure labels.

## Ручные проверки

- [ ] В Chromium выбрать JPEG/PNG/WebP через системный picker и перетаскиванием; проверить preview,
      замену и удаление.
- [ ] После регистрации и перезагрузки проверить DevTools Network: `/api/me` возвращает URL, а
      изображение загружается отдельным `GET /api/avatars/<uuid>` с immutable/nosniff headers.
- [ ] Проверить понятность ошибок для файла больше 5 MiB и неподдерживаемого формата.

## Тестовые данные

- Fixtures: детерминированные минимальные JPEG/PNG/WebP; boundary-файлы 5 MiB и 5 MiB + 1;
  текстовые bytes с ложным MIME.
- API mocks: typed `AuthActionResult`, repository mocks и generated API types/factories, где они
  применимы; без свободных JSON fixtures.
- Пользовательские роли: гость для регистрации, созданный авторизованный пользователь для профиля.
- Seed data: уникальные email и строки `user`/`user_avatar`, удаляемые после E2E.

## Вне области

- Контрактные тесты
- Тесты визуальной регрессии
- Accessibility-тесты как отдельное направление
- Mutation-тесты
- Матрицы комбинаций feature flags
- Crop/resize и редактирование аватара после регистрации

## Команды верификации

- [ ] `openspec validate improve-sign-up-profile-fields --strict --no-interactive`
- [ ] `npm --prefix api run lint`
- [ ] `npm --prefix api run bundle`
- [ ] `npm --workspace @repo/api run generate` и проверка отсутствия смыслового type/schema diff
- [ ] focused `vitest --project unit` для schemas/actions/routes/repository
- [ ] focused `vitest --project component` для `SignUpForm`
- [ ] `npx playwright test src/tests/e2e/auth.spec.ts`
- [ ] `npm run tsc`
- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] ручное exploratory-тестирование picker/drop/preview/network headers
