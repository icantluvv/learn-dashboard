## 1. Skill relocation

- [x] 1.1 Move every `.claude/<name>/SKILL.md` directory to `.claude/skills/<name>/SKILL.md`
      via `git mv` so history is preserved.
- [x] 1.2 Delete the `update-specs` skill entirely, including the committed
      `.confluence_auth.json` cookie file it shipped.
- [x] 1.3 Add `.claude/settings.json` with the default permission denylist.

## 2. Lint/format config fixes

- [x] 2.1 Point `oxlint.config.ts`'s `tailwindcss.entryPoint` at the real `app/globals.css`.
- [x] 2.2 Restore `printWidth` and `sortTailwindcss` in `oxfmt.config.ts`.

## 3. Lefthook fixes

- [x] 3.1 Add `--no-error-on-unmatched-pattern` to the pre-commit `lint` job so commits touching
      only non-lintable extensions (`.md`, `.json`, `.toml`) don't fail with
      "No files found to lint".
- [x] 3.2 Make the `prepare-commit-msg` `commitizen` step skip itself when git already reports a
      message source (`-m`, template, merge, squash), instead of always launching the interactive
      wizard.

## 4. Commit-change gate

- [x] 4.1 Write `commitizen-adapter.cjs`: keep type/scope/subject/body/breaking-change prompts,
      drop the `KT-xxx` ticket question, and add a mandatory `change` prompt listing
      `openspec/changes/` entries (excluding `archive`).
- [x] 4.2 Write `commitlint.config.mjs` with a `required-trailers` rule that accepts exactly one
      well-formed `Change: <name>` trailer in a proper footer block and rejects everything else.
- [x] 4.3 Add a `.d.mts` declaration for `commitlint.config.mjs` so the `.mjs` module type-checks
      under `allowJs: false`.
- [x] 4.4 Wire `commitlint --edit {1}` into `lefthook.yml`'s `commit-msg` hook.
- [x] 4.5 Update `package.json`: point `config.commitizen.path` at `./commitizen-adapter.cjs`,
      remove `cz-conventional-changelog`, add `@commitlint/cli` as an exact-pinned devDependency;
      regenerate `package-lock.json`.

## 5. Tests

- [x] 5.1 Unit tests for `commitizen-adapter.cjs`: `getOpenSpecChanges`, `buildCommitMessage`,
      and the full `createPrompter` flow (change prompt always asked, no `Refs`/ticket prompt,
      error propagation from a missing changes directory and from a rejected prompt).
- [x] 5.2 Unit tests for the `commitlint.config.mjs` `required-trailers` rule: valid message,
      missing footer, empty `Change:`, duplicate `Change:`, trailer without a separating blank
      line, and text after the trailer block.

## 6. Verification

- [x] 6.1 `npm run tsc` - clean.
- [x] 6.2 `npx oxlint` over the changed files - clean.
- [x] 6.3 `npm run test -- --silent --reporter=minimal` - all suites passing, including the new
      unit tests.
- [x] 6.4 Manually exercised `npx commitlint --edit <file>` against a valid and an invalid message
      to confirm the rule fires as expected.
- [x] 6.5 Made real commits through the fixed hook chain (lint/format/typecheck/test, the
      `prepare-commit-msg` TTY guard, and the new `commitlint` check) to confirm the full pipeline
      works end-to-end, not just its unit tests.
- [ ] 6.6 Keep `test-plan.md` in sync if any further scenario is added to this change.
