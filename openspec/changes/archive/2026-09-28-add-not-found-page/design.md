## Context

`app/not-found.tsx` — единственный App Router `not-found` файл, глобальный fallback для любого
несуществующего маршрута. См. proposal.md - Why. Рядом уже есть устоявшиеся паттерны для похожих
экранов: `app/global-error.tsx` (структура `page-wrapper v-stack min-h-svh items-center
justify-center`), `back-button.tsx` (кнопка `@heroui/react` с `next/navigation`) и
`error-boundary.tsx` (`data-testid="error-boundary"`, заголовок + описание + действие).

## Goals / Non-Goals

**Goals:**

- Переиспользовать существующий layout-класс `page-wrapper v-stack min-h-svh items-center
justify-center` и `data-testid="error-boundary"`, чтобы страница визуально и структурно
  совпадала с другими error-состояниями приложения.
- Использовать `next/link` (`<Link href="/">`) для перехода на главную без полной перезагрузки
  документа, обёрнутый в `@heroui/react` `Button` (`as`/`render`-паттерн, как в остальных местах
  проекта) для консистентного вида кнопок.

**Non-Goals:**

- Не вводить новый UI-kit или иконки сверх уже используемых (`lucide-react` опционален, не
  обязателен для этой задачи).
- Не менять `global-error.tsx` и другие error-компоненты — они вне scope этого изменения.
- Не добавлять аналитику/логирование 404-переходов — не запрошено.

## Decisions

- **Server Component без `'use client'`.** Страница статична (заголовок, текст, ссылка), не
  требует state/effects/event handlers, поэтому остаётся Server Component по умолчанию — в отличие
  от `back-button.tsx`, где нужен `router.back()`. Переход на `/` делается декларативным
  `<Link href="/">`, что не требует client boundary для самой страницы `not-found.tsx`.
- **Один интерактивный элемент, а не `Button` внутри `Link`.** `@heroui/react` `Button` рендерит
  `react-aria-components` `<button>` без поддержки `href`/полиморфного `as`; обёртка
  `<Link href="/"><Button>...</Button></Link>` создаёт невалидную вложенность `<a><button>` —
  два фокусируемых элемента на одном действии (двойной Tab-стоп, конфликт accessible role).
  Вместо этого используется `buttonVariants` из `@heroui/styles` (тот же класс, что применяет
  `Button` внутри) напрямую на `next/link` `<Link className={buttonVariants({...})} href="/">` —
  единственный `<a>`, визуально идентичный кнопке, с одним предсказуемым фокус-стопом.
- **Текст на русском**, как и весь остальной пользовательский текст в проекте (`CatalogError`,
  `SkillDetailError`, `ErrorFallback`).
- **Сохранить `data-testid="error-boundary"`** на корневом контейнере — тест-соглашение проекта
  для error-подобных экранов, не привязано к Sentry `ErrorBoundary` напрямую.

## Risks / Trade-offs

- [Next.js типизированные `next/link` роуты] → используем `href="/"`, существующий и типобезопасный
  маршрут; риска рассинхронизации с typed routes нет.
- [Дублирование `data-testid="error-boundary"` между Sentry `ErrorFallback` и `not-found.tsx`
  может усложнить точечный query в будущих тестах] → тесты для `not-found.tsx` используют текст
  заголовка/описания и роль ссылки, а не полагаются на уникальность testid в рамках всего DOM.
