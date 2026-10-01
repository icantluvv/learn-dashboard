## 1. База данных

- [x] 1.1 Добавить миграцию `supabase/migrations/<ts>_create_user_completed_skill_table.sql`:
      таблица `public.user_completed_skill` (`user_id` → `user.id`, `skill_id` → `skills.id`,
      `completed_at`, composite primary key, `on delete cascade`) по схеме из `design.md`
- [x] 1.2 В той же миграции включить RLS и deny-all политику для `anon`/`authenticated` по образцу
      `skills` и `user_avatar`
- [x] 1.3 Миграция применена скриптом `scripts/apply-user-completed-skill-migration.mjs`
      (повторный запуск идемпотентен); проверены composite primary key, два внешних ключа и RLS

## 2. Контракт и кодоген

- [x] 2.1 Добавить `api/src/components/schemas/SkillCompletion.yaml`
      (`completed`, `completedSkillsCount`, оба required)
- [x] 2.2 Добавить `api/src/paths/api_skills_id_completion.yaml`: метод `put`, `operationId`
      равный `setSkillCompletion`, тег `Skills`, `security` с `auth_cookie`, обязательное тело
      `{ completed: boolean }`, ответы `200 SkillCompletion`, `400`, `401`, `404`
- [x] 2.3 Добавить необязательное поле `completed` в `api/src/components/schemas/Skill.yaml` с
      описанием «present only for authenticated request»
- [x] 2.4 Зарегистрировать новый путь и схему в `api/src/openapi.yaml`
- [x] 2.5 Выполнить `npm --workspace @repo/api run generate` и проверить, что появились
      mutation-хук `useSetSkillCompletion`, client, типы, zod-схема, faker-фабрика и mock-route для
      `PUT /api/skills/{id}/completion`
- [x] 2.6 Прогнать `npm run tsc` и убедиться, что generated-код компилируется без ручных правок

## 3. Серверный слой

- [x] 3.1 Создать `src/modules/skills/server/skill-completion-repository.server.ts` с
      `isSkillCompleted(userId, skillId)` и `setSkillCompletion(userId, skillId, completed)` на
      пуле `getAuthDbPool()`; изменение отметки и пересчёт счётчика — одним SQL-запросом из
      `design.md`
- [x] 3.2 Отобразить ошибку FK Postgres `23503` в отдельный результат «навык не найден», чтобы
      Route Handler отдал `404` без предварительного `select`
- [x] 3.3 Создать `app/api/skills/[id]/completion/route.ts` (`PUT`): сессия через
      `getCurrentUser()` → `401`; тело валидируется generated zod-схемой запроса → `400`;
      неизвестный навык → `404`; успех → `200` с `{ completed, completedSkillsCount }`
- [x] 3.4 Обогатить `app/api/skills/[id]/route.ts`: для авторизованного запроса добавить
      `completed`, для анонимного — не добавлять; ответ отдавать с `Cache-Control: no-store`
- [x] 3.5 Подмешать `completed` в объект, которым `app/(main)/catalog/[core]/[id]/page.tsx`
      прогревает клиентский кэш, не меняя `getSkillById` (он используется `generateMetadata` и
      должен остаться независимым от сессии)

## 4. Возврат после входа

- [x] 4.1 Добавить в `src/modules/auth/` функцию валидации адреса возврата: возвращает внутренний
      путь или `'/'`; отвергает `//host`, абсолютные адреса, `/sign-in` и `/sign-up`
- [x] 4.2 Прочитать `next` из query на серверной странице `/sign-in`, провалидировать и передать
      готовый путь пропом в `SignInForm`
- [x] 4.3 Заменить безусловный `router.replace('/')` в `sign-in-form.tsx` на переход по
      полученному пути

## 5. UI-примитив Tooltip

- [x] 5.1 Сгенерировать примитив в `packages/core` через `npx shadcn@latest add tooltip`
      (npm/npx, не `bunx`) и привести к конвенциям пакета: директория `src/ui/tooltip/`, `index.ts`,
      тонкая обёртка над Base UI, `cn` для className
- [x] 5.2 Экспортировать `Tooltip` и связанные части из `packages/core/index.ts`
- [x] 5.3 Добавить `tooltip.component.test.tsx`: показ по наведению и по фокусу, скрытие, триггер
      сохраняет собственное действие

## 6. Страница навыка

- [x] 6.1 Создать
      `app/(main)/catalog/[core]/[id]/_components/skill-detail/skill-completion-button.tsx`:
      состояние из `useGetSkillById`, `useGetAuthMe` для признака авторизации,
      `useSetSkillCompletion` для мутации, `disabled` во время `isPending`, `aria-pressed`,
      иконка `Check` из `lucide-react`
- [x] 6.2 В `onSuccess` записать `completed` из ответа в кэш навыка и инвалидировать
      `getDashboardStatsQueryKey()`; в `onError` показать `toast` из `@repo/core`, не меняя кэш
- [x] 6.3 Для неавторизованного пользователя рендерить `next/link` на
      `/sign-in?next=/catalog/{core}/{id}` вместо кнопки с обработчиком
- [x] 6.4 Создать `copy-question-button.tsx`: копирование текста одного вопроса без номера,
      `aria-label`, состояние «скопировано», сообщение при отказе `navigator.clipboard`
- [x] 6.5 Обернуть кнопку копирования в `Tooltip` с текстом «копировать вопрос»
- [x] 6.6 Перестроить блок заголовка в `skill-detail-content.tsx`: название и кнопка отметки в
      одном блоке, без обрезки и горизонтальной прокрутки на узком экране
- [x] 6.7 Увеличить вертикальный отступ между вопросами и сменить цвет нумерации с
      `text-muted-foreground` на основной цвет текста
- [x] 6.8 Экспортировать новые компоненты из `_components/skill-detail/index.ts`

## 7. Тесты

- [x] 7.1 Unit: `skill-completion-repository` на замоканном пуле — постановка, снятие,
      идемпотентность в обе стороны, возврат пересчитанного счётчика, маппинг `23503`
- [x] 7.2 Unit: `app/api/skills/[id]/completion/route.unit.test.ts` — `401`, `400`, `404`, `200`, и
      что пользователь берётся из сессии, а не из тела запроса
- [x] 7.3 Unit: обновить `app/api/skills/[id]/route.unit.test.ts` — наличие `completed` для
      авторизованного, отсутствие для анонима, заголовок `no-store`, неизменившийся `404`
- [x] 7.4 Unit: валидация адреса возврата на граничных значениях (`//host`, `https://host`,
      `/sign-in`, `/sign-up`, пустая строка, корректный путь)
- [x] 7.5 Unit: `isSameOriginPath('/api/skills/js-closures/completion')` возвращает `true`
      (в `packages/api/base/client.unit.test.ts`)
- [x] 7.6 Component: кнопка отметки — начальное состояние из кэша, переключение в обе стороны,
      `disabled` и один запрос на двойной клик, возврат состояния с сообщением при ошибке,
      `aria-pressed`, ссылка на `/sign-in?next=…` для анонима
- [x] 7.7 Component: кнопка копирования — копируется текст ровно одного вопроса без номера, работа
      с клавиатуры, сообщение при отказе `clipboard`
- [x] 7.8 Component: обновить `skill-detail-content.test.tsx` — цвет нумерации и увеличенный отступ
      через вычисленные стили; обновить затронутые snapshot-скриншоты в `__screenshots__`
- [x] 7.9 Integration: `page.tsx` прогревает кэш с `completed` для авторизованного и без него для
      анонима; `GET /api/dashboard-stats` отдаёт число, равное числу отметок
- [x] 7.10 E2E `src/tests/e2e/skill-completion.spec.ts`: авторизованный — отметить, перезагрузить,
      увидеть счётчик на главной, снять, перезагрузить; гость — клик ведёт на `/sign-in`, после
      входа возврат на навык и навык не отмечен

## 8. Сопровождение плана и документации

- [x] 8.1 Обновить `test-plan.md`: отметить выполненные тесты, проставить реальные пути файлов в
      колонке «Test file», перевести статусы сценариев
- [x] 8.2 Проверено: новых переменных окружения не понадобилось — `.env.example` не меняется
- [x] 8.3 Факт зафиксирован нормативно в delta-спеках (`skills-catalog-data`, `skill-completion`):
      отдельный документ в `docs/` не создаётся — там нет справочника по API-маршрутам

## 9. Проверка

- [x] 9.1 `openspec validate improve-skill-detail-interactions --strict --no-interactive`
- [x] 9.2 `npx oxfmt <изменённые файлы>` и `npm run fmt:check`
- [x] 9.3 `npm run tsc`
- [x] 9.4 `npm run lint`
- [x] 9.5 `npm run test` (unit + component)
- [x] 9.6 `npm run build` — маршруты, Route Handlers и `cacheComponents`
- [x] 9.7 `npx playwright test src/tests/e2e/skill-completion.spec.ts` — 2 сценария проходят
- [ ] 9.8 Ручные проверки из раздела «Manual checks» в `test-plan.md`
- [x] 9.9 Перечитать diff: нет ручных правок `packages/api/base/codegen/**`, нет случайных
      изменений lockfile, `.env` и файла `src/seo/build-metadata.ts`, изменённого до начала работы
