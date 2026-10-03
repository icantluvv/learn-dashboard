## Why

На странице `/catalog/{core}` нет способа вернуться назад, кроме системной кнопки браузера.
Аналогичная кнопка "Назад" уже существует и проверена на странице навыка (`/catalog/{core}/{id}`,
капабилити `skill-detail`), поэтому пользователь ожидает такой же способ навигации и на странице
каталога направления.

## What Changes

- На странице `/catalog/{core}` над блоком `SidebarFilters` + `Catalog` добавляется кнопка "Назад",
  возвращающая пользователя на предыдущую страницу истории браузера (`router.back()`).
- Существующий клиентский компонент `BackButton` (сейчас лежит в
  `app/(main)/catalog/[core]/[id]/_components/skill-detail/`) переносится в общую для обоих
  маршрутов директорию `app/(main)/catalog/[core]/_components/back-button/`, так как у него
  появляется второй потребитель — страница `/catalog/{core}`. Публичный API компонента
  (`<BackButton />`, текст "Назад", поведение `router.back()`) не меняется.
- Импорты `BackButton` в `app/(main)/catalog/[core]/[id]/page.tsx` и в barrel-файле
  `skill-detail/index.ts` обновляются на новый путь.
- Кнопка добавляется только в ветке страницы, где направление доступно (`coreData.isAvailable`);
  плейсхолдер недоступного направления (`CorePlaceholder`) не затрагивается этим изменением.

## Capabilities

### New Capabilities

_(нет)_

### Modified Capabilities

- `skills-catalog`: добавляется требование "Возврат к предыдущей странице" — кнопка "Назад" над
  списком навыков направления.

## Impact

- Затронутые файлы:
    - `app/(main)/catalog/[core]/page.tsx` — добавление `<BackButton />`.
    - `app/(main)/catalog/[core]/[id]/_components/skill-detail/back-button.tsx` и
      `back-button.test.tsx` — перенос в `app/(main)/catalog/[core]/_components/back-button/`.
    - `app/(main)/catalog/[core]/[id]/_components/skill-detail/index.ts` — удаление реэкспорта
      `BackButton`.
    - `app/(main)/catalog/[core]/[id]/page.tsx` — обновление пути импорта `BackButton`.
- Новые файлы: `app/(main)/catalog/[core]/_components/back-button/{back-button.tsx,
back-button.test.tsx, index.ts}`.
- Публичные API, env contract и generated-код не затрагиваются.
- Откат: удалить кнопку со страницы каталога и вернуть компонент на старое место (либо оставить
  его в общей директории — поведение не изменится, downgrade не обязателен).
