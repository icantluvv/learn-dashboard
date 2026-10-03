# Test Plan

## Risk level

P2

## Scenario coverage

| Requirement                                             | Scenario                                                                               | Risk | Test level                                | Test file                                                                | Status                     |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---: | ----------------------------------------- | ------------------------------------------------------------------------ | -------------------------- |
| Возврат к предыдущей странице (skills-catalog)          | Нажатие кнопки "Назад" на странице каталога направления                                |   P2 | Component                                 | `app/(main)/catalog/[core]/_components/back-button/back-button.test.tsx` | Done                       |
| Возврат к предыдущей странице (skills-catalog)          | Направление недоступно — кнопка не отображается                                        |   P2 | Manual (waived from Component — см. ниже) | —                                                                        | Waived — см. Manual checks |
| Возврат к предыдущей странице (skill-detail, регрессия) | Кнопка "Назад" на `/catalog/{core}/{id}` продолжает работать после переноса компонента |   P1 | Component                                 | перенесённый `back-button.test.tsx` на новом месте                       | Done                       |

## Required automated tests

### Unit

- (нет — логика кнопки не содержит выделенной чистой функции)

### Component

- [x] `back-button.test.tsx` на новом месте (`app/(main)/catalog/[core]/_components/back-button/`):
      клик по кнопке вызывает `router.back()` ровно один раз (перенесён без изменений поведения
      и без изменений самого теста).
- [x] Регрессия: страница `/catalog/{core}/{id}` продолжает импортировать и рендерить
      `BackButton` из нового места (проверено `npm run tsc` + тот же компонентный тест, так как
      сам компонент и его разметка не менялись).

### Integration

- (нет — поведение полностью наблюдаемо на component-уровне с замоканной навигацией)

### E2E

- (нет — не критический сквозной путь, достаточно component-тестов)

## Manual checks

- [x] Визуальная проверка в браузере: кнопка "Назад" отображается непосредственно над блоком
      `SidebarFilters`/`Catalog` на `/catalog/{core}` на mobile (`<md`) и desktop (`md+`)
      breakpoints, без смещения остальной верстки. Проверено на `/catalog/frontend`.
- [x] Визуальная проверка: на недоступном направлении (`CorePlaceholder`) кнопка "Назад"
      не отображается — ветка early-return в `page.tsx` её не рендерит. Проверено на
      `/catalog/devops` и `/catalog/backend`.

**Waiver (P2, "направление недоступно"):** в проекте нет ни одного `page.test.tsx` — страницы
`/catalog/{core}` и `/catalog/{core}/{id}` являются асинхронными Server Components, и их
текущая тестовая инфраструктура (`vitest-browser-react`) не покрывает такие страницы напрямую ни
для одного существующего маршрута (включая уже эксплуатируемую кнопку "Назад" на странице
навыка). Создание нестандартного для кодбейзы `page.test.tsx` только для этого изменения было бы
отходом от принятых конвенций. Отсутствие кнопки на недоступном направлении гарантируется
структурно: `<BackButton />` находится только в ветке после проверки `coreData.isAvailable`,
`CorePlaceholder` рендерится в отдельном early-return без него — проверяется ручным просмотром
(см. чекбокс выше).

## Test data

- Fixtures: не требуются — тест не обращается к API, использует существующий мок навигации.
- API mocks: не требуются для самого back-button; тест страницы использует существующие моки
  `getSkills`/`getCoreByType`, уже применяемые в текущих тестах `catalog.test.tsx` /
  `core-placeholder.test.tsx`.
- User roles: не применимо, кнопка видна всем пользователям независимо от роли.
- Seed data: не требуется.

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] openspec validate add-catalog-core-back-button --strict --no-interactive
- [x] frontend: npm run lint / npm run tsc / npm run test:component
- [x] api: не затронут, не требуется
- [x] E2E smoke / manual exploratory: ручная проверка позиционирования кнопки (см. Manual checks)
