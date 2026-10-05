# Test Plan

## Risk level

P1

## Scenario coverage

| Requirement                                        | Scenario                                  | Risk | Test level | Test file                                                                               | Status  |
| -------------------------------------------------- | ----------------------------------------- | ---: | ---------- | --------------------------------------------------------------------------------------- | ------- |
| Клик открывает поповер действий                    | Клик без фото — только пункт загрузки     |   P1 | Component  | `app/(main)/profile/_components/profile-view/profile-avatar-upload.test.tsx`            | Planned |
| Клик открывает поповер действий                    | Клик с фото — пункт загрузки + удаления   |   P1 | Component  | `app/(main)/profile/_components/profile-view/profile-avatar-upload.test.tsx`            | Planned |
| Пункт «Загрузить новое фото» открывает file picker | Загрузка нового фото через поповер        |   P1 | Component  | `app/(main)/profile/_components/profile-view/profile-avatar-upload.test.tsx` (обновить) | Planned |
| Пункт «Удалить фото» сбрасывает аватар             | Успешное удаление фото                    |   P0 | Component  | `app/(main)/profile/_components/profile-view/profile-avatar-upload.test.tsx`            | Planned |
| Пункт «Удалить фото» сбрасывает аватар             | Ошибка при удалении фото                  |   P1 | Component  | `app/(main)/profile/_components/profile-view/profile-avatar-upload.test.tsx`            | Planned |
| `removeAvatarAction` парсит id из `image`          | Валидный/невалидный/отсутствующий `image` |   P1 | Unit       | `src/modules/auth/actions.unit.test.ts` (новый)                                         | Planned |

## Required automated tests

### Unit

- [ ] `removeAvatarAction` без сессии возвращает `{ ok: false }` без побочных вызовов.
- [ ] `removeAvatarAction` с `image`, не похожим на `/api/avatars/<id>`, возвращает `{ ok: false }`
      и не вызывает `updateUser`.
- [ ] `removeAvatarAction` при успехе вызывает `deleteAvatar(id)` и
      `auth.api.updateUser({ body: { image: null } })` и возвращает `{ ok: true }`.
- [ ] `removeAvatarAction` при падении `deleteAvatar` (best-effort) всё равно доходит до
      `updateUser` и возвращает `{ ok: true }`.

### Component

- [ ] Поповер без пункта «Удалить фото», когда `user.image == null`.
- [ ] Поповер с пунктом «Удалить фото», когда `user.image != null`.
- [ ] Выбор «Загрузить новое фото» открывает связанный `input[type=file]` (доступен по
      `getByLabelText('Изменить фото профиля')`), существующий флоу загрузки не регрессирует.
- [ ] Выбор «Удалить фото» при успешном моке action очищает изображение и показывает заглушку с
      инициалом.
- [ ] Выбор «Удалить фото» при ошибочном моке action показывает сообщение об ошибке и оставляет
      текущее изображение.

### Integration

- (не требуется — взаимодействие action/UI покрыто component-тестами с замоканным `action` prop,
  как уже сделано для `updateAvatarAction`)

### E2E

- (не требуется для P1; ручная проверка ниже покрывает сквозной путь через реальный сервер)

## Manual checks

- [ ] Desktop, светлая и тёмная тема: клик по аватарке открывает поповер, визуально читаемый,
      позиционирование корректно рядом с кругом.
- [ ] Мобильная ширина (< `lg`): тап по аватарке открывает поповер, пункты достаточно большие для
      тапа, поповер не обрезается краем экрана.
- [ ] Реальная загрузка нового фото через поповер end-to-end (файл действительно сохраняется и
      отображается после reload).
- [ ] Реальное удаление фото через поповер end-to-end (после удаления `GET /api/avatars/<id>`
      больше не отдаёт файл, профиль показывает заглушку после reload).

## Test data

- Fixtures: `createAvatarFile()` из `#/tests/fixtures/avatar-files`.
- API mocks: `action`/`removeAction` пропсы мокаются через `vi.fn()` в component-тестах (как
  `updateAvatarAction` сейчас); для unit-теста `removeAvatarAction` мокаются `auth.api.getSession`,
  `auth.api.updateUser`, `deleteAvatar`.
- User roles: авторизованный пользователь с `image` и без `image` (минимум два фикстурных
  `CurrentUser`).
- Seed data: не требуется (БД не поднимается для unit/component уровней).

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices
- Подтверждающий диалог перед удалением (см. design.md — Non-Goals)

## Verification commands

- [ ] openspec validate avatar-actions-popover --strict --no-interactive
- [ ] npm run tsc
- [ ] npm run lint
- [ ] npx vitest run app/(main)/profile/_components/profile-view/profile-avatar-upload.test.tsx --project component
- [ ] npx vitest run src/modules/auth/actions.unit.test.ts --project unit (после создания файла)
- [ ] npm run test (перед завершением change)
