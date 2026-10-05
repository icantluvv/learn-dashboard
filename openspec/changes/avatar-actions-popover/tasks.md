## 1. Server: удаление аватара

- [ ] 1.1 Добавить `deleteAvatar(id: string)` в `src/modules/auth/avatar-repository.server.ts`
      (`delete from user_avatar where id = $1`).
- [ ] 1.2 Добавить тип `RemoveAvatarActionResult`/`RemoveAvatarAction` в `src/modules/auth/types.ts`
      (`{ ok: true }` | `{ ok: false, error: string }`).
- [ ] 1.3 Реализовать `removeAvatarAction()` в `src/modules/auth/actions.ts`: получить сессию через
      `auth.api.getSession`, извлечь id аватара из `session.user.image` (reuse-схема парсинга как в
      `getAvatarDisplayUrl`), вызвать `deleteAvatar` best-effort (try/catch + лог через
      `#/observability/logger`, не блокирует сброс), затем `auth.api.updateUser({ body: { image: null } })`.
- [ ] 1.4 Если `session == null` или `image` не распознан как `/api/avatars/<id>` — вернуть
      `{ ok: false, error }` без побочных эффектов.
- [ ] 1.5 Экспортировать `removeAvatarAction` из `src/modules/auth/index.ts` (там же, где
      `updateAvatarAction`).

## 2. Проброс action в дерево компонентов

- [ ] 2.1 `app/(main)/profile/page.tsx`: импортировать и передать `removeAvatarAction` рядом с
      `updateAvatarAction`.
- [ ] 2.2 `profile-view.tsx`: расширить props и проброс до `ProfileAuthenticated`.
- [ ] 2.3 `profile-authenticated.tsx`: расширить props и проброс до `ProfileAvatarUpload`.

## 3. UI: поповер действий на круге аватарки

- [ ] 3.1 В `profile-avatar-upload.tsx` заменить `<label>` вокруг круга на `Popover` +
      `PopoverTrigger` (`render` на `<button type="button">`, сохранить `group`/hover-камеру и
      текущие классы круга) + `PopoverContent`.
- [ ] 3.2 Управлять `open` поповера через `useState`, т.к. нужно закрывать его программно после
      выбора пункта «Удалить фото» и перед открытием file picker по «Загрузить новое фото».
- [ ] 3.3 Пункт «Загрузить новое фото» — `<label htmlFor="profile-avatar-file">`, оборачивающий
      прежний `<input type="file" className="sr-only" ... />`; клик закрывает поповер
      (`onClick={() => setOpen(false)}`), file picker открывается нативно через `label`.
- [ ] 3.4 Пункт «Удалить фото» рендерится только когда `user.image != null`; по клику закрывает
      поповер, ставит `isRemoving = true`, вызывает `removeAction()`, при успехе обновляет кэш
      `getAuthMeQueryKey()` (`image: null`) как уже сделано для загрузки, при ошибке показывает
      `error` в том же месте, где уже отображаются ошибки загрузки.
- [ ] 3.5 Показывать существующий `Spinner`-оверлей и на `isUploading`, и на `isRemoving`
      (объединить в одно условие или оставить два одинаковых блока).
- [ ] 3.6 Задизейблить триггер поповера (или сам `input`/пункты) на время `isUploading`/`isRemoving`,
      чтобы исключить повторный клик во время запроса.

## 4. Тесты

- [ ] 4.1 Обновить `profile-avatar-upload.test.tsx`: тест «открывает выбор файла по клику на
      аватар» — адаптировать под поповер (открыть поповер кликом по триггеру, затем найти
      `getByLabelText('Изменить фото профиля')` внутри открытого попапа).
- [ ] 4.2 Добавить component-тест: пункт «Удалить фото» не отображается, когда `user.image == null`.
- [ ] 4.3 Добавить component-тест: пункт «Удалить фото» отображается и при успешном вызове
      `removeAvatarAction` круг возвращается к заглушке с инициалом (мок `user` с `image`).
- [ ] 4.4 Добавить component-тест: ошибка `removeAvatarAction` показывает сообщение об ошибке и не
      меняет отображаемое изображение.
- [ ] 4.5 Добавить unit-тест для парсинга id аватара из `image`-URL в `removeAvatarAction`
      (валидный `/api/avatars/<id>`, посторонний URL, `image == null`) — либо напрямую, либо через
      вынесенную чистую функцию, если парсинг будет выделен отдельно от `actions.ts`.
- [ ] 4.6 Обновить/проверить `profile-view.test.tsx`, если проброс нового action требует мок в
      рендере `ProfileView`.

## 5. Проверка и синхронизация test-plan.md

- [ ] 5.1 Отметить в `test-plan.md` выполненные сценарии и фактические пути тестовых файлов.
- [ ] 5.2 Прогнать `npm run tsc`, `npm run lint`, `npx vitest run <затронутые файлы>`.
- [ ] 5.3 Ручная проверка в браузере (desktop + мобильная ширина, светлая и тёмная тема): открытие
      поповера, загрузка нового фото, удаление фото, поведение при ошибке сети (DevTools offline).
- [ ] 5.4 `openspec validate avatar-actions-popover --strict --no-interactive`.
