## Context

`ProfileAvatarUpload` (`app/(main)/profile/_components/profile-view/profile-avatar-upload.tsx`)
сейчас рендерит `<label htmlFor="profile-avatar-file">`, обёрнутый вокруг круга аватарки и
скрытого `<input type="file">`. Клик по кругу = клик по `label` = открытие системного file picker.
Это нативное поведение HTML, не JS-обработчик, поэтому переход на поповер требует убрать прямую
связку `label`/`input` с кругом и перенести её на пункт меню.

Загрузка идёт через server action `updateAvatarAction` (`src/modules/auth/actions.ts`), который
валидирует файл, сохраняет байты в `user_avatar` через `saveAvatar`
(`avatar-repository.server.ts`) и обновляет `image` пользователя через `auth.api.updateUser`.
`image` хранится как абсолютный URL вида `${BETTER_AUTH_URL}/api/avatars/<id>`. См. proposal.md —
Why/What Changes.

## Goals / Non-Goals

**Goals:**

- Поповер на базе существующего `Popover`/`PopoverContent` (`@repo/core`), без нового примитива.
- Удаление аватара — полноценный server action с очисткой строки в `user_avatar`, а не просто
  сброс `image` на клиенте.
- Сохранить текущий UX загрузки (hover-иконка камеры, spinner, инлайн-ошибка) без регрессий.

**Non-Goals:**

- Подтверждающий диалог «вы уверены?» перед удалением — не входит в этот change, можно добавить
  отдельно при необходимости.
- История/отмена удаления, soft-delete — не нужны, удаление безвозвратное сразу.
- Изменение поведения `updateAvatarAction` (сигнатуры, валидации) — переиспользуется как есть.

## Decisions

### Поповер оборачивает круг, пункт загрузки содержит `label`+`input`, а не наоборот

Триггер поповера — сам круг (`PopoverTrigger render={<button>}`), а не `label`. Внутри
`PopoverContent` пункт «Загрузить новое фото» — это `<label htmlFor="...">`, оборачивающий
`<input type="file" className="sr-only">`, как раньше, но теперь расположенный внутри попапа.
Клик по пункту открывает file picker нативно (без JS), что проще и надёжнее ручного
`inputRef.current?.click()`. После выбора файла `handleFileChange` как раньше валидирует и грузит
файл; `Popover` закрывается автоматически, т. к. `label`-клик не обязан держать попап открытым —
управляем `open` state явно и закрываем его в обработчике клика по пункту.

Альтернатива (отклонена): держать `input` вне поповера и дергать `.click()` через ref из
обработчика пункта меню. Работает, но менее надёжно в Safari/iOS (программный `.click()` на
file input из обработчика внутри popup иногда блокируется браузером как не-user-gesture, если
между кликом и `.click()` есть лишний re-render/microtask). Нативный `label` исключает этот риск.

### `removeAvatarAction` получает текущий `image` неявно, через сессию, а не параметром

Подпись: `removeAvatarAction(): Promise<RemoveAvatarActionResult>` — без `FormData`, в отличие от
`updateAvatarAction`. Внутри: `auth.api.getSession` → `session.user.image` → распарсить id из
пути `/api/avatars/<id>` (та же схема, что `getAvatarDisplayUrl`) → удалить строку в `user_avatar`
→ `auth.api.updateUser({ body: { image: null } })`. Если `image` уже `null`/не распознан как наш
URL — action возвращает ошибку, UI такое состояние не допускает (пункт удаления скрыт без
`image`), это защита от гонки/двойного клика.

Альтернатива (отклонена): передавать id аватара с клиента. Небезопасно/избыточно — клиент не
должен владеть внутренним id, сервер и так знает текущий `image` пользователя через сессию.

### Удаление строки `user_avatar` best-effort, не блокирует сброс `image`

Если `deleteAvatar(id)` падает (например, запись уже отсутствует), это не должно мешать сбросить
`image` — отсутствие файла хуже, чем осиротевшая строка в БД. Поэтому `deleteAvatar` вызывается в
`try/catch`, ошибка логируется через `#/observability/logger` и не прерывает выполнение; реальная
ошибка action — только если падает `auth.api.updateUser`.

### Оптимистичное обновление кэша таким же паттерном, как при загрузке

`ProfileAvatarUpload` после успешного `removeAvatarAction()` делает
`queryClient.setQueryData(getAuthMeQueryKey(), (current) => current == null ? current : { ...current, image: null })` —
симметрично текущему коду после `updateAvatarAction`.

## Risks / Trade-offs

- [Риск] Пользователь кликает «Удалить» на устройстве с медленной сетью, пункт удаления всё ещё
  виден до ответа сервера → двойной клик вызовет action дважды, т.к. нет disabled-состояния.
  → Митигация: добавить тот же `isUploading`-подобный флаг (`isRemoving`) и дизейблить пункт и
  весь триггер поповера на время запроса, показывая spinner поверх круга как при загрузке.
- [Риск] `auth.api.updateUser` успевает отработать, а `deleteAvatar` — нет (сеть/БД) → осиротевшая
  строка в `user_avatar`, которая никогда не будет раздана (т.к. `image` уже `null`), просто
  занимает место. → Приемлемо: это best-effort, не требует retry/cron в рамках этого change.
- [Риск] Существующие тесты `profile-avatar-upload.test.tsx` рассчитывают на прямой клик по кругу
  = открытие file picker → тесты сломаются и требуют обновления под новый флоу (клик → поповер →
  клик по пункту). → Учтено в tasks.md/test-plan.md.
