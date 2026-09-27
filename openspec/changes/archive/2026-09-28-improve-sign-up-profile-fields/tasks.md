## 1. Контракты и тестовые данные

- [x] 1.1 Добавить typed fixtures минимальных JPEG/PNG/WebP, файла ровно 5 MiB, файла 5 MiB + 1
      byte и файла с ложным MIME; не хранить большие дублирующиеся бинарные fixtures в Git, если их
      можно детерминированно собрать helper-функцией.
- [x] 1.2 Сначала расширить unit-тесты схем регистрации: `male`/`female` проходят, `other` и
      произвольное значение отклоняются, файл проверяется по MIME, сигнатуре и граничному размеру.
- [x] 1.3 Сначала расширить component-тест `SignUpForm`: ровно два option пола, file picker,
      drag-and-drop, preview/remove, ошибки типа/размера и отправка с/без `File`; добавить обязательные
      Allure labels до subject-specific setup.
- [x] 1.4 Сначала дополнить route/action unit-тесты сценариями записи аватара, отсутствия частичных
      данных, компенсирующей очистки и ответов изображения `200/404` с заголовками.
- [x] 1.5 Сначала расширить `src/tests/e2e/auth.spec.ts`: регистрация с PNG, отображение аватара
      после перезагрузки и отказ для поддельного изображения без создания аккаунта; использовать
      проектные Playwright fixtures, role/label locators, web-first assertions и Allure labels.

## 2. Модель данных и server-side хранение

- [x] 2.1 Добавить additive Supabase migration таблицы `user_avatar` с UUID primary key, unique
      FK на `user`, `bytea`, разрешённым MIME, длиной `1..5242880`, timestamp, cascade delete, RLS и
      deny-all policy для `anon`/`authenticated`.
- [x] 2.2 Вынести server-only repository/helper для вставки, чтения и идемпотентной очистки
      аватара через существующий `pg.Pool`, не добавляя новый путь доступа к auth-БД.
- [x] 2.3 Реализовать чистый валидатор JPEG/PNG/WebP по размеру, заявленному MIME и magic bytes;
      добиться green для тестов из 1.2 и 1.4.
- [x] 2.4 Разделить legacy `Gender` и допустимые значения новой регистрации; подключить
      `male`/`female` к клиентской и серверной схемам, заблокировать обход через публичный Better Auth
      sign-up endpoint и сохранить чтение существующих профилей.

## 3. API аватара и профильный контракт

- [x] 3.1 Добавить `GET /api/avatars/[avatarId]` с UUID validation, `200/404`, исходными байтами,
      `Content-Type`, `Content-Length`, `X-Content-Type-Options: nosniff` и
      `Cache-Control: public, max-age=31536000, immutable`.
- [x] 3.2 Уточнить description и same-origin example существующего `AuthMe.image` в
      `api/src/components/schemas/AuthMe.yaml`, сохранив `type: string`, `format: uri`; бинарный route не
      добавлять в generated SDK, пока общий client поддерживает только JSON responses.
- [x] 3.3 Выполнить API lint/bundle и Kubb generation, подтвердить отсутствие смыслового изменения
      публичных TypeScript/Zod типов и добиться green route/OpenAPI проверок.

## 4. Регистрация и согласованность данных

- [x] 4.1 Перевести `SignUpForm` и `AuthAction` на `FormData`, сохранив field/form errors,
      блокировку повторной отправки и инвалидацию `getAuthMeQueryKey`.
- [x] 4.2 До вызова Better Auth нормализовать поля и полностью валидировать необязательный файл;
      для валидного файла заранее создать UUID и same-origin URL аватара.
- [x] 4.3 После успешного `signUpEmail` связать байты с возвращённым user ID; при ошибке вставки
      идемпотентно удалить только созданного этой попыткой пользователя, его session/account и
      частичную запись аватара, затем вернуть общую ошибку.
- [x] 4.4 Убедиться, что `GET /api/me` возвращает URL endpoint при наличии аватара, не возвращает
      бинарные данные и остаётся `no-store`; добиться green unit-тестов action и route.

## 5. Интерфейс dropzone

- [x] 5.1 Создать route-local client-компонент dropzone на нативном file input с click/keyboard
      picker, drag states, single-file выбором и accept для JPEG/PNG/WebP.
- [x] 5.2 Реализовать preview через object URL, имя файла, замену/удаление и гарантированный
      `URL.revokeObjectURL` при замене и unmount.
- [x] 5.3 Подключить dropzone к `SignUpForm`, показывать ошибки формата/размера у поля и удалить
      прежний URL input; добиться green component-теста из 1.3.

## 6. Сквозная проверка и документация

- [ ] 6.1 Довести E2E из 1.5 до green на реальной dev-БД с очисткой созданных строк и подтвердить
      отдельный запрос изображения после перезагрузки.
- [x] 6.2 Обновить профильную документацию auth/API/database с лимитами, форматами, схемой хранения,
      публичностью URL, компенсирующей очисткой и operational-проверкой сирот.
- [x] 6.3 Синхронизировать статусы сценариев в `test-plan.md`; не отмечать задачу выполненной без
      автоматизации, обоснованной ручной проверки или waiver.
- [ ] 6.4 Запустить Oxfmt только на изменённых файлах, focused unit/component/E2E tests,
      `npm --prefix api run lint`, `npm --prefix api run bundle`, `npm --workspace @repo/api run
generate`, `npm run tsc`, `npm run lint` и `npm run build`.
- [x] 6.5 Запустить `openspec validate improve-sign-up-profile-fields --strict --no-interactive`
      и перечитать diff на отсутствие generated/manual, lockfile и посторонних изменений.
