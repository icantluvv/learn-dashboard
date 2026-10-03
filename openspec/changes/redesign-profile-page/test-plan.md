# Test Plan

## Risk level

P1

## Scenario coverage

| Requirement                                                     | Scenario                                  | Risk | Test level | Test file                                                                              | Status |
| --------------------------------------------------------------- | ----------------------------------------- | ---- | ---------- | -------------------------------------------------------------------------------------- | ------ |
| profile-page: баннер и крупный аватар                           | У пользователя есть загруженное фото      | P2   | Component  | `app/(main)/profile/_components/profile-view/profile-view.test.tsx`                    | Done   |
| profile-page: баннер и крупный аватар                           | У пользователя нет загруженного фото      | P2   | Component  | `app/(main)/profile/_components/profile-view/profile-avatar-upload.test.tsx`           | Done   |
| profile-page: расширенные идентификационные данные              | У пользователя задана фамилия и возраст   | P2   | Component  | `app/(main)/profile/_components/profile-view/profile-view.test.tsx`                    | Done   |
| profile-page: расширенные идентификационные данные              | У пользователя не задан возраст           | P2   | Component  | `app/(main)/profile/_components/profile-view/profile-view.test.tsx`                    | Done   |
| profile-page: аватар — триггер замены фото                      | Пользователь нажимает на аватар           | P1   | Component  | `app/(main)/profile/_components/profile-view/profile-avatar-upload.test.tsx`           | Done   |
| profile-page: изученные навыки по направлениям                  | Несколько направлений                     | P1   | Component  | `app/(main)/profile/_components/profile-view/profile-view.test.tsx`                    | Done   |
| profile-page: изученные навыки по направлениям                  | Нет изученных навыков                     | P2   | Component  | `app/(main)/profile/_components/profile-view/profile-view.test.tsx`                    | Done   |
| profile-avatar-update: успешная замена фото                     | Корректный файл (JPEG/PNG/WebP, ≤5МБ)     | P0   | E2E + Unit | `src/tests/e2e/profile-avatar-update.spec.ts`, `src/modules/auth/actions.unit.test.ts` | Done   |
| profile-avatar-update: некорректный файл отклоняется            | Недопустимый MIME-тип                     | P1   | Unit + E2E | `src/modules/auth/actions.unit.test.ts`, `src/tests/e2e/profile-avatar-update.spec.ts` | Done   |
| profile-avatar-update: некорректный файл отклоняется            | Превышение размера                        | P1   | Unit       | `src/modules/auth/actions.unit.test.ts`                                                | Done   |
| profile-avatar-update: некорректный файл отклоняется            | Содержимое не соответствует формату       | P1   | Unit       | `src/modules/auth/actions.unit.test.ts`                                                | Done   |
| profile-avatar-update: требует активной сессии                  | Запрос без сессии                         | P1   | Unit       | `src/modules/auth/actions.unit.test.ts`                                                | Done   |
| profile-completed-skills-summary: группировка по направлениям   | Несколько направлений                     | P1   | Unit       | `src/modules/skills/server/skill-completion-repository.server.unit.test.ts`            | Done   |
| profile-completed-skills-summary: группировка по направлениям   | Нет изученных навыков                     | P2   | Unit       | `src/modules/skills/server/skill-completion-repository.server.unit.test.ts`            | Done   |
| profile-completed-skills-summary: исключение пустых направлений | Изучены навыки только в одном направлении | P2   | Unit       | `src/modules/skills/server/skill-completion-repository.server.unit.test.ts`            | Done   |

## Required automated tests

### Unit

- [x] Группировка изученных навыков по `core`: пусто / один core / несколько core / core без
      изученных навыков исключён — `src/modules/skills/server/skill-completion-repository.server.unit.test.ts`
- [x] Server action замены аватара: недопустимый MIME, превышение размера, несоответствие сигнатуры,
      отсутствие сессии, успешный путь с мок-репозиторием — `src/modules/auth/actions.unit.test.ts`

### Component

- [x] `profile-avatar-upload.tsx`: фото есть / фото нет (заглушка с инициалом) —
      `app/(main)/profile/_components/profile-view/profile-avatar-upload.test.tsx`
- [x] `profile-view.tsx`: возраст задан / возраст отсутствует —
      `app/(main)/profile/_components/profile-view/profile-view.test.tsx`
- [x] `profile-view.tsx`: секция навыков — несколько направлений / пусто —
      `app/(main)/profile/_components/profile-view/profile-view.test.tsx`
- [x] Компонент аватара: клик открывает file input, успешная загрузка показывает предпросмотр,
      ошибка валидации показывает сообщение и не меняет фото —
      `app/(main)/profile/_components/profile-view/profile-avatar-upload.test.tsx`

### Integration

- (не требуется отдельно — server action покрыт unit-тестами с моками, UI — component-тестами)

### E2E

- [x] P1: авторизованный пользователь открывает `/profile`, заменяет фото через реальный file picker,
      видит обновлённое фото без перезагрузки страницы — `src/tests/e2e/profile-avatar-update.spec.ts`
- [x] Недопустимый файл отклоняется и не меняет текущий аватар —
      `src/tests/e2e/profile-avatar-update.spec.ts`

## Manual checks

- [x] Визуальное сравнение экрана профиля с референсным макетом (баннер, карточка, расположение
      аватара и блоков) — выполнено интерактивно в браузере автором запроса; по итогам сделаны правки:
      карточка на всю ширину и выровнена от верха страницы (не по центру), контент внутри карточки
      выровнен по левому краю, секция «Изученные навыки» обёрнута в такую же белую карточку
- [x] Проверка состояния "нет изученных навыков" и "несколько направлений" — покрыто
      component-тестами `profile-view.test.tsx` и визуально подтверждено для пустого состояния

## Test data

- Fixtures: пользователь с/без `lastName`, `age`, `image`; пользователь с изученными навыками в 0/1/2+
  направлениях
- API mocks: мок `auth.api.updateUser`/`auth.api.getSession`, мок `saveAvatar` репозитория в
  unit-тестах action (`src/modules/auth/actions.unit.test.ts`)
- User roles: достаточно одной авторизованной роли — поведение не зависит от `role`, кроме отображения
  метки
- Seed data: для E2E — `createAvatarFile`/инлайн PNG fixture в
  `src/tests/e2e/profile-avatar-update.spec.ts`; реальная регистрация через форму (`/sign-up`)

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] openspec validate redesign-profile-page --strict --no-interactive
- [x] npm run lint (чисто для изменённых файлов; остальные ошибки — предсуществующие, вне скоупа)
- [x] npm run tsc
- [x] npm run test (420/420 тестов зелёные)
- [x] npm run build
- [x] npx playwright test src/tests/e2e/profile-avatar-update.spec.ts (2/2 зелёные)

## Известные ограничения вне скоупа

- `src/tests/e2e/auth.spec.ts` (`регистрация открывает сессию, выход её закрывает`) падает и на чистом
  `master` без изменений этого change — подтверждено через `git stash`. Причина не связана с
  redesign-profile-page; не исправлялось, так как выходит за рамки задачи (см. AGENTS.md: не
  исправлять чужие/предсуществующие проблемы попутно).
