# Test Plan

## Risk level

P2 — существующие сценарии не затрагиваются: манифест и иконки это статика, баннер — новый
необязательный элемент интерфейса. Хуже всего, что может случиться, — навязчивый баннер или ярлык
без иконки.

> **Статус прогона.** Unit (9) и component (5) тесты зелёные, E2E (4 в этом change'е, 17 всего в
> проекте) зелёные: `npm run test`, `npx playwright test`. Статика зелёная: `npm run fmt:check`,
> `npm run tsc`, `npm run build`. Визуально проверено скриншотами Playwright (баннер на мобильной и
> десктопной ширине, логотип в шапке, вид иконки под маской). Реальная установка на iPhone и
> Android **не выполнена** — нет доступа к физическому устройству; обе строки ниже остаются
> `planned`.

## Scenario coverage

| Requirement         | Scenario                                               | Risk | Test level | Test file                                                            | Status  |
| ------------------- | ------------------------------------------------------ | ---: | ---------- | -------------------------------------------------------------------- | ------- |
| Валидный манифест   | Манифест доступен и заполнен                           |   P1 | E2E        | `src/tests/e2e/pwa.spec.ts`                                          | done    |
| Валидный манифест   | Страница ссылается на манифест                         |   P1 | E2E        | `src/tests/e2e/pwa.spec.ts`                                          | done    |
| Иконки приложения   | Все объявленные иконки существуют                      |   P1 | E2E        | `src/tests/e2e/pwa.spec.ts`                                          | done    |
| Иконки приложения   | Маскируемая иконка объявлена                           |   P2 | E2E        | `src/tests/e2e/pwa.spec.ts`                                          | done    |
| Запуск в standalone | Приложение открывается без адресной строки             |   P1 | Manual     | установка на iPhone и Android                                        | planned |
| Запуск в standalone | Нижняя навигация не перекрывается индикатором          |   P2 | Manual     | запуск с домашнего экрана на iPhone                                  | planned |
| Баннер установки    | Баннер предлагает установку при поддержке браузера     |   P1 | Component  | `src/components/pwa-install/pwa-install-banner.component.test.tsx`   | done    |
| Баннер установки    | Закрытие баннера запоминается                          |   P1 | Component  | `src/components/pwa-install/pwa-install-banner.component.test.tsx`   | done    |
| Баннер установки    | Баннер скрыт в установленном приложении                |   P1 | Unit       | `src/components/pwa-install/should-show-install-banner.unit.test.ts` | done    |
| Баннер установки    | Баннер не показывается на десктопной ширине            |   P1 | Component  | `src/components/pwa-install/pwa-install-banner.component.test.tsx`   | done    |
| Баннер установки    | Баннер исчезает после установки                        |   P2 | Component  | `src/components/pwa-install/pwa-install-banner.component.test.tsx`   | done    |
| Установка через API | Кнопка вызывает системный диалог установки             |   P1 | Component  | `src/components/pwa-install/pwa-install-banner.component.test.tsx`   | done    |
| Установка через API | Отклонённый диалог не открывается повторно             |   P2 | Component  | `src/components/pwa-install/pwa-install-banner.component.test.tsx`   | done    |
| Подсказка без API   | iOS Safari получает инструкцию                         |   P1 | Component  | `src/components/pwa-install/pwa-install-banner.component.test.tsx`   | done    |
| Подсказка без API   | Инструкция не показывается там, где установка работает |   P1 | Unit       | `src/components/pwa-install/should-show-install-banner.unit.test.ts` | done    |

## Required automated tests

### Unit

- [x] `should-show-install-banner.unit.test.ts` — таблица решений по четырём входам
      (`isStandalone`, `isDismissed`, `hasInstallPrompt`, `isIosSafari`): режим `prompt` только при
      наличии промпта, `ios-instructions` только без промпта и при iOS Safari, `hidden` во всех
      случаях со standalone или закрытым баннером, включая комбинации standalone + промпт и
      отказ + iOS

### Component

- [x] `pwa-install-banner.component.test.tsx` — кнопка установки вызывает сохранённый промпт;
      закрытие скрывает баннер и пишет отметку в `localStorage`; в режиме iOS видна инструкция и
      нет кнопки установки; отклонение диалога скрывает баннер; в standalone компонент не рендерит
      ничего; на десктопной ширине баннер несёт класс `lg:hidden`

### Integration

- [x] Отдельного слоя нет: работа с браузерным API покрыта component-тестом через подставное
      событие `beforeinstallprompt`

### E2E

- [x] `src/tests/e2e/pwa.spec.ts` — манифест отдаётся и заполнен; все иконки из манифеста и
      `apple-touch-icon` отвечают `200` с типом изображения; HTML содержит ссылку на манифест

## Manual checks

- [ ] Установка на реальном iPhone: Safari → Поделиться → На экран «Домой» — ярлык с нашей иконкой,
      не со скриншотом страницы
- [ ] Запуск с домашнего экрана на iPhone: без адресной строки, подписи нижней навигации не
      перекрыты системным индикатором
- [ ] Установка в Chrome (Android или десктоп) из баннера — системный диалог, после установки
      баннер исчезает
- [ ] Внутри установленного приложения баннер не появляется
- [ ] Иконка под маской на Android (круг, сквиркл) — знак не обрезается
- [ ] Закрытый баннер не возвращается после перезагрузки страницы

## Test data

- Фикстуры: подставной объект события `beforeinstallprompt` с `prompt()` и `userChoice`,
  разрешающимся в `accepted` / `dismissed`
- API mocks: не требуются — сетевых запросов у баннера нет
- Роли пользователей: не влияют, баннер одинаков для гостя и авторизованного
- Seed data: не требуются

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `openspec validate add-pwa-install --strict --no-interactive`
- [ ] frontend: `npm run verify:fast`, `npm run test:unit`, `npm run test:component`,
      `npm run build`
- [ ] api: не требуется — контракт не затрагивается
- [ ] E2E: `npx playwright test src/tests/e2e/pwa.spec.ts` + ручная установка на устройствах
