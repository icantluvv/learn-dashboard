# Test Plan

## Risk level

P2

## Scenario coverage

| Requirement                          | Scenario                                        | Risk | Test level | Test file              | Status |
| ------------------------------------ | ----------------------------------------------- | ---: | ---------- | ---------------------- | ------ |
| Отображение заголовка и описания 404 | Переход на несуществующий URL                   |   P2 | Component  | app/not-found.test.tsx | Done   |
| Отображение заголовка и описания 404 | Заголовок и описание доступны для screen reader |   P2 | Component  | app/not-found.test.tsx | Done   |
| Возврат на главную страницу          | Переход на главную по клику                     |   P2 | Component  | app/not-found.test.tsx | Done   |
| Возврат на главную страницу          | Доступность управления с клавиатуры             |   P3 | Manual     | -                      | Done   |

## Required automated tests

### Unit

- (нет — логики без UI нет)

### Component

- [x] `app/not-found.test.tsx`: рендерит заголовок "Страница не найдена" как видимый `<h1>`.
- [x] `app/not-found.test.tsx`: рендерит описание под заголовком как видимый текст.
- [x] `app/not-found.test.tsx`: рендерит единственную ссылку (role `link`) с доступным именем
      "На главную" и `href="/"` (`buttonVariants` из `@heroui/styles` на `next/link` `Link`, без
      вложенного `@heroui/react` `Button`).

### Integration

- (нет — нет внешних зависимостей/API)

### E2E

- (нет — не критический journey, покрытия component-теста достаточно для P2)

## Manual checks

- [x] Открыть несуществующий URL в dev-режиме (`curl` рендера) — видны заголовок, описание и
      единственный `<a href="/" class="button button--md button--outline">На главную</a>`.
- [x] Клавиатурная доступность: единственный фокусируемый элемент возврата (`<a>`), нет вложенных
      интерактивных элементов и двойного Tab-стопа — подтверждено разметкой; интерактивная проверка
      реального Tab/Enter в браузере не выполнялась (только HTML-рендер через `curl`), риск низкий
      (P3, нативный `<a href>`).

## Test data

- Fixtures: не требуются (страница не зависит от данных).
- API mocks: не требуются.
- User roles: любой пользователь, без авторизации.
- Seed data: не требуется.

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] openspec validate add-not-found-page --strict --no-interactive
- [x] frontend: npm run tsc / npm run lint (изменённые файлы чисты; pre-existing ошибки
      репозитория вне scope) / npx vitest run app/not-found.test.tsx --project component
- [x] api: не затронут, не требуется
- [x] E2E smoke / manual exploratory: ручная проверка перехода на несуществующий URL (см. Manual
      checks)
