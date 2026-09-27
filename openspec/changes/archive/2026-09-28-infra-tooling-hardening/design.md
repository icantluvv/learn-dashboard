## Context

See proposal.md - Why. Relevant existing state:

- Skills lived at `.claude/<name>/SKILL.md`; the harness only scans `.claude/skills/<name>/SKILL.md`.
- `lefthook.yml` drove `commitizen` via `npx cz --hook` with no access to git's hook arguments, and
  `pre-commit`'s `lint` job passed all staged files (including non-lintable extensions) straight to
  `oxlint` with no fallback for zero matches.
- Commit messages had no required structure tying them to `openspec/changes/`.

## Goals / Non-Goals

**Goals:**

- Make every shipped skill discoverable without changing skill content.
- Make `Change: <name>` on the commit message mandatory and impossible to bypass by skipping the
  interactive `cz` wizard.
- Keep the fix minimal: no new ticket-tracker integration, no required `Refs:` trailer.

**Non-Goals:**

- Building broader commit-message tooling (scopes enforcement, ticket linking, changelog
  generation) beyond the single `Change:` trailer.
- Auto-detecting which OpenSpec change a diff belongs to; the author still picks it from a list.

## Decisions

- **Enforce at `commit-msg`, not just inside the `cz` prompter.** A custom `commitizen-adapter.cjs`
  question already forces authors to pick a change when they use `git cz`, but any `git commit -m`
  or IDE commit would bypass it entirely. `commitlint.config.mjs` (wired into `lefthook.yml`'s
  `commit-msg` hook) re-validates the final message text regardless of how it was authored, so the
  guarantee holds for every commit path.
- **Custom trailer rule instead of `@commitlint/config-conventional`.** The requirement is narrow
  (exactly one well-formed `Change: <name>` trailer in a proper git-trailer footer block); a hand
  written rule (`required-trailers`) is a few lines and avoids pulling in a full conventional-commit
  rule set this project doesn't otherwise want enforced.
- **Drop `cz-conventional-changelog` rather than layering on top of it.** Its prompt flow has no
  extension point for an OpenSpec-change question without forking the whole adapter, so replacing
  it outright is simpler than wrapping it.
- **No `KT-xxx` ticket reference.** An earlier draft of this adapter (copied from a sibling project)
  required a `Refs: KT-123` trailer tied to an external tracker this project doesn't use. Removed
  entirely rather than left optional, since an unused required field is worse than no field.
- **Fix `prepare-commit-msg` by checking git's message-source argument**, not by disabling the hook.
  `cz --hook` only prompts meaningfully for a plain `git commit` (no `-m`, no template, no
  merge/squash); lefthook wasn't forwarding that source argument, so the wizard always launched even
  when a message was already supplied. Passing `{2}` through and skipping when it's non-empty
  matches the standard husky-style guard for this exact scenario.
- **`--no-error-on-unmatched-pattern` for the lint job**, matching the pattern already used by the
  adjacent `format` job in the same file, instead of narrowing the `glob` filter. Narrowing the glob
  would silently stop linting file types oxlint can validate (`.json`, `.jsonc`); the unmatched
  pattern flag keeps the glob's intent (lint whichever staged files oxlint understands) while no
  longer treating "nothing to lint" as failure.

## Risks / Trade-offs

- [Every commit now requires selecting an OpenSpec change] → Mitigated by keeping `openspec/changes/`
  browsable as a plain `list` prompt; contributors who need a change that doesn't exist yet must
  create one first (via `/openspec-propose` or `openspec new change`) before committing.
- [`commitlint`'s footer-detection requires a blank line before the trailer block] → Documented in
  the rule's own error message; covered by unit tests for the "no separating blank line" case so a
  regression is caught immediately.
- [`prepare-commit-msg` TTY handling is now conditional shell logic in YAML] → Kept intentionally
  small (single `if [ -n "{2}" ]` guard) and covered by manually exercising both branches
  (`git commit -m` and `git commit` without `-m`) rather than adding process-spawning tests for
  lefthook itself, which is out of this project's test surface.

## Migration Plan

1. Land the skill relocation and `update-specs` removal first — no dependency on the commit-message
   change, so it can be reviewed independently.
2. Land the `lefthook.yml` lint/commitizen fixes — required before the commit-gate change, otherwise
   every subsequent commit (including this change's own) fails on unrelated pre-existing bugs.
3. Land the `commitizen-adapter.cjs` / `commitlint.config.mjs` swap last, once the hooks it depends
   on are already fixed.
4. No rollback tooling is needed: reverting is a plain `git revert` of the relevant commits, since
   nothing here touches persisted data or external services.
