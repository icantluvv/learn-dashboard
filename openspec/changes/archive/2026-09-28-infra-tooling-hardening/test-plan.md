# Test Plan

## Risk level

P2

## Scenario coverage

| Requirement                                                     | Scenario                                                             | Risk | Test level | Test file                         | Status |
| --------------------------------------------------------------- | -------------------------------------------------------------------- | ---: | ---------- | --------------------------------- | ------ |
| `getOpenSpecChanges` lists changes, excludes `archive`          | Directory has multiple changes plus an `archive` folder              |   P2 | Unit       | `commitizen-adapter.unit.test.ts` | Done   |
| `getOpenSpecChanges` surfaces read failures                     | Changes directory is missing                                         |   P2 | Unit       | `commitizen-adapter.unit.test.ts` | Done   |
| `buildCommitMessage` emits exactly one `Change:` footer         | Change selected, with and without a body                             |   P1 | Unit       | `commitizen-adapter.unit.test.ts` | Done   |
| `buildCommitMessage` omits the footer when no change is set     | Empty `change` answer                                                |   P2 | Unit       | `commitizen-adapter.unit.test.ts` | Done   |
| `buildCommitMessage` drops an empty `BREAKING CHANGE` trailer   | Breaking flag set but description is blank/prefix-only               |   P2 | Unit       | `commitizen-adapter.unit.test.ts` | Done   |
| Prompter always asks for a change, never asks for a ticket ref  | Full prompt flow with a populated changes directory                  |   P1 | Unit       | `commitizen-adapter.unit.test.ts` | Done   |
| Prompter surfaces a changes-directory read error via `commit()` | Missing changes directory                                            |   P2 | Unit       | `commitizen-adapter.unit.test.ts` | Done   |
| Prompter surfaces a rejected `cz.prompt()` via `commit()`       | `prompt()` throws a non-Error value                                  |   P2 | Unit       | `commitizen-adapter.unit.test.ts` | Done   |
| Breaking-change description is required and trimmed             | Whitespace-only / bare-prefix / valid descriptions                   |   P2 | Unit       | `commitizen-adapter.unit.test.ts` | Done   |
| `required-trailers` accepts a well-formed `Change:` footer      | Header + body + `Change: <name>`                                     |   P1 | Unit       | `commitlint.config.unit.test.ts`  | Done   |
| `required-trailers` rejects a missing/empty/duplicate `Change:` | No footer, empty value, two `Change:` lines                          |   P1 | Unit       | `commitlint.config.unit.test.ts`  | Done   |
| `required-trailers` rejects a malformed trailer block           | No separating blank line, trailing non-trailer text after the footer |   P1 | Unit       | `commitlint.config.unit.test.ts`  | Done   |
| Commit-msg hook rejects a message without `Change:`             | `git commit` with a message lacking the trailer                      |   P1 | Manual     | -                                 | Done   |
| Commit-msg hook accepts a message with `Change:`                | `git commit` with a valid trailer                                    |   P1 | Manual     | -                                 | Done   |
| Pre-commit `lint` job no longer fails on md/json-only commits   | Staged files are all `.md`/`.json`/`.toml`                           |   P1 | Manual     | -                                 | Done   |
| `prepare-commit-msg` no longer hangs/fails for `-m` commits     | `git commit -m "..."` in a non-TTY shell                             |   P1 | Manual     | -                                 | Done   |

## Required automated tests

### Unit

- [x] `commitizen-adapter.unit.test.ts` - adapter CommonJS export, `getOpenSpecChanges`,
      `buildCommitMessage`, `createPrompter` (change prompt, error propagation, breaking-change
      validation).
- [x] `commitlint.config.unit.test.ts` - `required-trailers` rule (valid/invalid message shapes).

### Component

- Not applicable: no UI surface changed.

### Integration

- Not applicable: no cross-layer runtime behavior changed.

### E2E

- Not applicable: no user-facing flow changed.

## Manual checks

- [x] Run `git commit -m "..."` without a `Change:` trailer and confirm `commitlint` rejects it
      with the expected error message.
- [x] Run `git commit -m "..."` with a valid `Change:` trailer and confirm the commit succeeds
      through the full hook chain (lint, format, typecheck, test, commitizen guard, commitlint,
      no-ai-attribution).
- [x] Stage only markdown/json/toml files and confirm the pre-commit `lint` job no longer fails.
- [x] Confirm `git commit -m` no longer hangs/errors on the `prepare-commit-msg` TTY prompt.

## Test data

- Fixtures: none (temporary directories created per test via `mkdtempSync` for
  `getOpenSpecChanges`/`createPrompter` cases).
- API mocks: none - this change has no HTTP/API surface.
- User roles: not applicable.
- Seed data: not applicable.

## Out of scope

- Contract tests
- Visual regression tests
- Accessibility tests
- Mutation tests
- Feature flag combination matrices

## Verification commands

- [x] `openspec validate infra-tooling-hardening --strict --no-interactive`
- [x] `npm run tsc`
- [x] `npx oxlint` (changed files)
- [x] `npm run test -- --silent --reporter=minimal`
- [ ] `npm run build`, if this change is later found to affect the app build (not expected: no
      `app/`/`src/` runtime code changed)
