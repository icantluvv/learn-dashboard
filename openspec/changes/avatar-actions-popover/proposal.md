## Why

Клик по кругу аватарки на `/profile` сразу открывает системный file picker — так пользователь не
может удалить уже загруженную фотографию, а значит не может вернуться к дефолтному аватару (букве
имени) без обращения в поддержку. Нужно вторым действием рядом с загрузкой дать явное удаление.

## What Changes

- Клик по кругу аватарки открывает поповер с действиями вместо немедленного file picker.
- Поповер содержит пункт «Загрузить новое фото», который открывает тот же системный file picker,
  что и раньше.
- Поповер содержит пункт «Удалить фото», видимый только когда у пользователя уже есть `image`;
  выбор пункта удаляет сохранённый аватар и возвращает дефолтное отображение (буква имени на
  брендовом фоне).
- Новый server action `removeAvatarAction`: проверяет сессию, удаляет файл аватара из
  `user_avatar` по id, извлечённому из текущего `image`-URL, и сбрасывает `image` пользователя на
  `null` через `auth.api.updateUser`.
- `ProfileAvatarUpload` переиспользует `queryClient.setQueryData` для оптимистичного обновления
  кэша `auth me` после удаления — так же, как уже сделано после загрузки.

## Capabilities

### Modified Capabilities

- `profile-page`: добавляется требование к взаимодействию с аватаркой — клик открывает поповер
  действий, из которого доступны загрузка нового фото и (при наличии фото) удаление текущего.

## Impact

- `app/(main)/profile/_components/profile-view/profile-avatar-upload.tsx` — UI переводится на
  `Popover`/`PopoverContent` из `@repo/core`, добавляется пункт удаления и вызов нового action.
- `src/modules/auth/actions.ts` — новый `removeAvatarAction`.
- `src/modules/auth/avatar-repository.server.ts` — новая функция удаления записи аватара по id.
- `src/modules/auth/types.ts` — тип результата `RemoveAvatarAction`.
- `app/(main)/profile/page.tsx` (или эквивалентный server entry) — проброс нового action в
  `ProfileAuthenticated`/`ProfileAvatarUpload`, аналогично текущему `updateAvatarAction`.
