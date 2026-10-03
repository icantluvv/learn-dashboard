# Test Plan

## Risk level

P1 — появляется первая в приложении операция записи пользовательских данных из интерфейса
(`PUT`), меняется схема БД и денормализованный счётчик, ответ `GET /api/skills/{id}` становится
пользовательским и некэшируемым, а страница входа получает параметр редиректа (потенциальный open
redirect). Регресс виден пользователю и способен показать отметку одного пользователя другому.
Отдельные подзадачи ниже ранга P2/P3 (отступы, цвет нумерации, копирование вопроса).

## Scenario coverage

| Requirement                                | Scenario                                            | Risk | Test level  | Test file                                                                          | Status  |
| ------------------------------------------ | --------------------------------------------------- | ---: | ----------- | ---------------------------------------------------------------------------------- | ------- |
| Хранение отметки об изучении навыка        | Отметка сохраняется между сессиями                  |   P0 | E2E         | `src/tests/e2e/skill-completion.spec.ts`                                           | done    |
| Хранение отметки об изучении навыка        | Повторная отметка не создаёт дубликат               |   P1 | Unit        | `src/modules/skills/server/skill-completion-repository.server.unit.test.ts`        | done    |
| Хранение отметки об изучении навыка        | Отметки пользователей независимы                    |   P0 | Unit        | `src/modules/skills/server/skill-completion-repository.server.unit.test.ts`        | done    |
| Операция изменения отметки                 | Постановка отметки                                  |   P0 | Unit        | `app/api/skills/[id]/completion/route.unit.test.ts`                                | done    |
| Операция изменения отметки                 | Снятие отметки                                      |   P0 | Unit        | `app/api/skills/[id]/completion/route.unit.test.ts`                                | done    |
| Операция изменения отметки                 | Идемпотентное снятие неотмеченного навыка           |   P1 | Unit        | `src/modules/skills/server/skill-completion-repository.server.unit.test.ts`        | done    |
| Операция изменения отметки                 | Запрос без аутентификации                           |   P0 | Unit        | `app/api/skills/[id]/completion/route.unit.test.ts`                                | done    |
| Операция изменения отметки                 | Навык не существует                                 |   P1 | Unit        | `app/api/skills/[id]/completion/route.unit.test.ts`                                | done    |
| Операция изменения отметки                 | Некорректное тело запроса                           |   P1 | Unit        | `app/api/skills/[id]/completion/route.unit.test.ts`                                | done    |
| Согласованность счётчика изученных навыков | Счётчик дашборда отражает новую отметку             |   P0 | E2E         | `src/tests/e2e/skill-completion.spec.ts`                                           | done    |
| Согласованность счётчика изученных навыков | Счётчик дашборда отражает снятие отметки            |   P1 | Integration | `src/modules/dashboard/server/dashboard-stats-repository.unit.test.ts`             | done    |
| Согласованность счётчика изученных навыков | Отказ операции не меняет счётчик                    |   P1 | Unit        | `src/modules/skills/server/skill-completion-repository.server.unit.test.ts`        | done    |
| Отметка в данных страницы навыка           | Авторизованный запрос отмеченного навыка            |   P0 | Unit        | `app/api/skills/[id]/route.unit.test.ts`                                           | done    |
| Отметка в данных страницы навыка           | Авторизованный запрос неотмеченного навыка          |   P1 | Unit        | `app/api/skills/[id]/route.unit.test.ts`                                           | done    |
| Отметка в данных страницы навыка           | Анонимный запрос навыка                             |   P0 | Unit        | `app/api/skills/[id]/route.unit.test.ts`                                           | done    |
| Отметка в данных страницы навыка           | Ответ не кэшируется                                 |   P0 | Unit        | `app/api/skills/[id]/route.unit.test.ts`                                           | done    |
| Кнопка отметки (авторизованный)            | Отметка навыка изученным                            |   P0 | Component   | `.../skill-detail/skill-completion-button.test.tsx`                                | done    |
| Кнопка отметки (авторизованный)            | Снятие случайно поставленной отметки                |   P0 | Component   | `.../skill-detail/skill-completion-button.test.tsx`                                | done    |
| Кнопка отметки (авторизованный)            | Состояние кнопки при открытии страницы              |   P1 | Component   | `.../skill-detail/skill-completion-button.test.tsx`                                | done    |
| Кнопка отметки (авторизованный)            | Двойное нажатие во время запроса                    |   P1 | Component   | `.../skill-detail/skill-completion-button.test.tsx`                                | done    |
| Кнопка отметки (авторизованный)            | Ошибка запроса отметки                              |   P1 | Component   | `.../skill-detail/skill-completion-button.test.tsx`                                | done    |
| Кнопка отметки (авторизованный)            | Состояние доступно вспомогательным технологиям      |   P2 | Component   | `.../skill-detail/skill-completion-button.test.tsx`                                | done    |
| Кнопка отметки (гость)                     | Гость нажимает кнопку отметки                       |   P1 | Component   | `.../skill-detail/skill-completion-button.test.tsx` (роль и адрес) + E2E (переход) | done    |
| Кнопка отметки (гость)                     | Возврат на навык после входа                        |   P1 | E2E         | `src/tests/e2e/skill-completion.spec.ts`                                           | done    |
| Кнопка отметки (гость)                     | Отметка не проставляется автоматически после входа  |   P1 | E2E         | `src/tests/e2e/skill-completion.spec.ts`                                           | done    |
| Деталь скилла читается из Supabase (изм.)  | Существующий скилл для авторизованного пользователя |   P1 | Integration | `app/(main)/catalog/[core]/[id]/page-cache-warmup.unit.test.ts`                    | done    |
| Деталь скилла читается из Supabase (изм.)  | Ответ детали скилла не кэшируется                   |   P0 | Unit        | `app/api/skills/[id]/route.unit.test.ts`                                           | done    |
| Отображение страницы навыка (изм.)         | Номера вопросов основным цветом текста              |   P2 | Component   | `.../skill-detail/skill-detail-content.test.tsx`                                   | done    |
| Отображение страницы навыка (изм.)         | Увеличенный отступ между вопросами                  |   P3 | Component   | `.../skill-detail/skill-detail-content.test.tsx`                                   | done    |
| Копирование текста вопроса                 | Копирование одного вопроса                          |   P1 | Component   | `.../skill-detail/copy-question-button.test.tsx`                                   | done    |
| Копирование текста вопроса                 | Копирование с клавиатуры                            |   P2 | Component   | `.../skill-detail/copy-question-button.test.tsx`                                   | done    |
| Копирование текста вопроса                 | Браузер отказал в доступе к буферу обмена           |   P2 | Component   | `.../skill-detail/copy-question-button.test.tsx`                                   | done    |
| Копирование текста вопроса                 | Навык без вопросов                                  |   P3 | Component   | `.../skill-detail/skill-detail-content.test.tsx`                                   | done    |
| Подсказка у действия копирования           | Наведение на действие копирования                   |   P2 | Component   | `.../skill-detail/copy-question-button.test.tsx`                                   | done    |
| Подсказка у действия копирования           | Фокус с клавиатуры                                  |   P2 | Component   | `.../skill-detail/copy-question-button.test.tsx`                                   | done    |
| Подсказка у действия копирования           | Уход курсора                                        |   P3 | Component   | `packages/core/src/ui/tooltip/tooltip.component.test.tsx`                          | done    |
| Блок заголовка вмещает отметку             | Заголовок и кнопка на широком экране                |   P2 | Component   | `.../skill-detail/skill-detail-content.test.tsx`                                   | done    |
| Блок заголовка вмещает отметку             | Заголовок и кнопка на узком экране                  |   P2 | Manual      | ручная проверка на мобильной ширине с длинным названием навыка                     | planned |
| Страница входа (изм.)                      | Успешный вход с адресом возврата                    |   P1 | Component   | `.../sign-in-form/sign-in-form.component.test.tsx` + `skill-completion.spec.ts`    | done    |
| Безопасность адреса возврата               | Внешний адрес возврата игнорируется                 |   P0 | Unit        | `src/modules/auth/redirect-path.unit.test.ts`                                      | done    |
| Безопасность адреса возврата               | Внутренний адрес возврата принимается               |   P1 | Unit        | `src/modules/auth/redirect-path.unit.test.ts`                                      | done    |
| Безопасность адреса возврата               | Адрес возврата на страницу входа игнорируется       |   P2 | Unit        | `src/modules/auth/redirect-path.unit.test.ts`                                      | done    |
| Tooltip primitive                          | Подсказка по наведению                              |   P2 | Component   | `packages/core/src/ui/tooltip/tooltip.component.test.tsx`                          | done    |
| Tooltip primitive                          | Подсказка по фокусу с клавиатуры                    |   P2 | Component   | `packages/core/src/ui/tooltip/tooltip.component.test.tsx`                          | done    |
| Tooltip primitive                          | Скрытие подсказки                                   |   P3 | Component   | `packages/core/src/ui/tooltip/tooltip.component.test.tsx`                          | done    |
| Tooltip primitive                          | Триггер сохраняет своё действие                     |   P2 | Component   | `packages/core/src/ui/tooltip/tooltip.component.test.tsx`                          | done    |

## Required automated tests

### Unit

- [x] Постановка отметки: вставка пары и возврат пересчитанного счётчика
- [x] Снятие отметки: удаление пары и возврат уменьшенного счётчика
- [x] Идемпотентность в обе стороны: повторный `completed: true` и повторный `completed: false` не
      меняют счётчик и возвращают успех
- [x] Отметки разных пользователей не влияют друг на друга: `isSkillCompleted` фильтрует по
      `user_id`
- [x] Ошибка Postgres `23503` (FK на `skills`) отображается в результат «навык не найден», а не в
      `500`
- [x] Ошибка хранилища не приводит к изменению счётчика (единственный запрос либо применился, либо
      нет)
- [x] `PUT /api/skills/[id]/completion`: `401` без сессии, `400` на пустое/нечисловое/нелогическое
      тело, `404` на неизвестный навык, `200` с `{ completed, completedSkillsCount }`
- [x] `PUT /api/skills/[id]/completion` определяет пользователя из сессии и игнорирует любой
      идентификатор пользователя, переданный в теле или query
- [x] `GET /api/skills/[id]`: `completed` присутствует для авторизованного, отсутствует для
      анонима, `404` не изменился, ответ содержит `Cache-Control: no-store`
- [x] Валидация адреса возврата: `/catalog/frontend/js-closures` → принят; `//evil.example`,
      `https://evil.example`, `javascript:…`, `/sign-in`, `/sign-up`, `''`, `undefined` → `'/'`
- [x] `isSameOriginPath('/api/skills/js-closures/completion')` возвращает `true` (иначе запрос
      уйдёт на внешний бэкенд)

### Component

- [x] Кнопка отметки отображает состояние из прогретого кэша с первого рендера (отмечено /
      не отмечено)
- [x] Клик по неотмеченной кнопке отправляет мутацию с `completed: true`, по отмеченной — с
      `completed: false`
- [x] Во время `isPending` кнопка `disabled`; двойной клик даёт ровно один запрос
- [x] Ошибка мутации: кнопка возвращается в исходное состояние, показывается сообщение
- [x] Состояние кнопки выражено `aria-pressed`
- [x] Для анонима вместо кнопки-обработчика рендерится ссылка на `/sign-in?next=<путь навыка>`, и
      мутация не вызывается
- [x] Кнопка копирования копирует текст ровно одного вопроса без порядкового номера
- [x] Копирование срабатывает при активации с клавиатуры
- [x] Отказ `navigator.clipboard` показывает сообщение об ошибке, список вопросов не меняется
- [x] Подсказка «копировать вопрос» появляется по наведению и по фокусу и скрывается при уходе
- [x] Номера вопросов используют основной цвет текста (проверка по вычисленному стилю, не по
      снимку)
- [x] Отступ между вопросами больше межстрочного интервала внутри вопроса
- [x] `Tooltip` примитива: показ по наведению и фокусу, скрытие, триггер-кнопка сохраняет
      собственный `onClick`

### Integration

- [x] `page.tsx` прогревает клиентский кэш объектом с `completed` для авторизованного пользователя
      и без этого поля — для анонима
- [x] `GET /api/dashboard-stats` после постановки и снятия отметки отдаёт число, равное числу
      отметок пользователя (репозитории замоканы)

### E2E

- [x] Авторизованный пользователь: открыть навык → отметить → перезагрузить (отметка сохранилась) →
      открыть главную (счётчик увеличился) → вернуться и снять отметку → перезагрузить (отметка
      снята)
- [x] Гость: клик по кнопке отметки ведёт на `/sign-in`; после успешного входа пользователь
      оказывается на странице того же навыка, и навык не отмечен

## Manual checks

- [x] Копирование в буфер обмена проверено в реальном Chromium с разрешениями clipboard:
      `navigator.clipboard.readText()` после нажатия возвращает текст ровно одного вопроса без
      номера. Вставка во внешнее приложение остаётся за пределами автоматизации
- [x] Подсказка «копировать вопрос» показана в реальном браузере по наведению (появляется через
      ~600 мс — задержка Base UI по умолчанию) и не мешает нажатию
- [ ] Поведение подсказки на touch-устройстве
- [x] Блок заголовка с самым длинным названием каталога на ширине 320px: `scrollWidth` равен
      `clientWidth` (горизонтальной прокрутки нет), заголовок переносится, кнопка целиком в
      пределах экрана
- [x] Светлая и тёмная темы на 320px: кнопка отметки, нумерация и кнопки копирования читаемы
      (проверено скриншотами в обеих схемах)
- [ ] Ручная проверка на стенде без применённой миграции: нажатие кнопки показывает сообщение об
      ошибке, страница не падает

## Test data

- **Fixtures**: generated Faker-фабрики `@repo/api` (`createSkill`, `createGetSkillById`,
  `createAuthMe`, `createGetDashboardStats`) и новая фабрика `SkillCompletion` из кодогена; навык с
  несколькими вопросами и навык без вопросов.
- **API mocks**: generated mock client и mock-route для `PUT /api/skills/{id}/completion`;
  серверные репозитории (`skills-repository`, `skill-completion-repository.server`,
  `get-session`) замоканы через `vi.mock`; пул `pg` замокан на уровне `getAuthDbPool`;
  типизированные фабрики вместо рукописного JSON.
- **User roles**: аноним (видит кнопку, уходит на `/sign-in`); авторизованный пользователь без
  отметок; авторизованный пользователь с уже отмеченным навыком; второй авторизованный
  пользователь — для проверки независимости отметок.
- **Seed data**: минимум два навыка в направлении `frontend`, у одного из них ≥ 2 вопроса; для E2E —
  пользователь с известными учётными данными и нулевым `completedSkillsCount` на старте.

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `openspec validate improve-skill-detail-interactions --strict --no-interactive`
- [x] `npm run fmt:check`
- [x] `npm run tsc` (включает generated output)
- [x] `npm run lint` — новых замечаний в изменённых файлах нет; остаются прежние замечания
      репозитория в незатронутых файлах
- [x] `npm run test` (unit + component) — 384 теста, 81 файл
- [x] `npm run build`
- [x] `npm --workspace @repo/api run generate`
- [x] `npx redocly lint` в `api` — новых замечаний по добавленному пути нет
- [x] `npx playwright test src/tests/e2e/skill-completion.spec.ts` — 2 сценария проходят (миграция
      применена). Полный `npm run test:e2e` не запускался: в `auth.spec.ts` сейчас 5 падений,
      не связанных с этим change (кнопка профиля в хедере — незакоммиченные правки хедера
      в рабочем дереве)
- [ ] Ручные проверки из раздела «Manual checks»
