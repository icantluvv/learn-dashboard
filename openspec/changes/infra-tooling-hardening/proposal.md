## Why

Claude Code skills were shipped directly under `.claude/<name>/SKILL.md` instead of the
`.claude/skills/<name>/SKILL.md` path the harness discovers, so none of them (including
`/openspec-propose`) were actually loadable. Fixing that surfaced a second gap: nothing enforced a
link between a commit and the OpenSpec change it belongs to, so history had no reliable way to
trace a commit back to the proposal that motivated it. Both are pure tooling problems with no
effect on application behavior.

## What Changes

- Move every project skill from `.claude/<name>/SKILL.md` to `.claude/skills/<name>/SKILL.md` so
  the harness discovers them.
- Remove the `update-specs` skill entirely: its Confluence export script shipped a committed
  `.confluence_auth.json` containing live session cookies.
- Add `.claude/settings.json` with a permission denylist for secrets, editor state, and
  generated/vendored output.
- Fix `oxlint.config.ts`'s `tailwindcss.entryPoint` to point at the real `app/globals.css` instead
  of a non-existent `src/styles/globals.css`.
- Restore `printWidth` and `sortTailwindcss` in `oxfmt.config.ts`, which had been dropped while the
  file was being edited.
- Fix `lefthook.yml`:
    - the `lint` pre-commit job failed with "No files found to lint" on commits touching only
      markdown/json/toml files, since oxlint has nothing to lint in those extensions; added
      `--no-error-on-unmatched-pattern`.
    - the `prepare-commit-msg` commitizen step always launched its interactive wizard, including for
      commits made with `git commit -m`, and then failed outright in non-TTY environments; it now
      skips itself whenever git already reports a message source (`-m`, template, merge, squash).
- **BREAKING**: Replace `cz-conventional-changelog` with a custom `commitizen-adapter.cjs` that
  always asks which entry under `openspec/changes/` a commit belongs to, and add
  `commitlint.config.mjs` wired into the `commit-msg` hook so every commit message must carry a
  `Change: <name>` trailer — enforced regardless of whether the commit was authored through the
  interactive wizard or with a raw `-m` message.

## Capabilities

No spec-level application behavior changes; this is tooling/process only (`skip_specs: true` is
set in `.openspec.yaml`).

## Impact

- `.claude/` skill layout and `.claude/settings.json` (agent tooling only, no app code).
- `oxlint.config.ts`, `oxfmt.config.ts` (lint/format configuration).
- `lefthook.yml`, `commitizen-adapter.cjs`, `commitlint.config.mjs`, `commitlint.config.d.mts` and
  their unit tests (git hook / commit workflow).
- `package.json` / `package-lock.json`: drop `cz-conventional-changelog`, add `@commitlint/cli`.
- Process impact: every future commit, including ones made outside the interactive `cz` wizard,
  must include a `Change: <openspec-change-name>` trailer or the `commit-msg` hook rejects it.
