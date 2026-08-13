# AGENTS.md

## Spec Kit (SDD) — Devin CLI integration

This project uses [GitHub Spec Kit](https://github.com/github/spec-kit) for
Spec-Driven Development. It was initialized with `specify init --here
--integration generic --integration-options="--commands-dir .devin/commands/"`.

**Important**: Spec Kit's `generic` integration writes flat command files to
`.devin/commands/*.md`. The Devin CLI does **not** scan `.devin/commands/` —
it only recognizes slash-invokable skills at `.devin/skills/<name>/SKILL.md`
(one directory per skill, with `name`/`description` frontmatter).

To make the commands work in Devin CLI / Windsurf, they were mirrored into
`.devin/skills/<name>/SKILL.md`. The skill name **must use hyphens, not
dots**: Devin's skill loader collapses everything after the first `.` (it
treats the dot as a namespace separator), so 10 skills all named
`speckit.<something>` collide into a single `speckit` entry and only one
survives. Renaming to `speckit-<something>` avoids the collision.

If you re-run `specify init --force` (e.g. after upgrading the Spec Kit CLI)
and the commands in `.devin/commands/` change, regenerate the mirrors with:

```bash
python3 - << 'EOF'
import re, os

src_dir = ".devin/commands"
dst_dir = ".devin/skills"

for fname in sorted(os.listdir(src_dir)):
    if not fname.endswith(".md"):
        continue
    name = fname[:-3].replace(".", "-")  # dots break Devin's skill loader
    with open(os.path.join(src_dir, fname), encoding="utf-8") as f:
        content = f.read()
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", content, re.DOTALL)
    frontmatter, body = m.group(1), m.group(2)
    desc_match = re.search(r'^description:\s*(.*)$', frontmatter, re.MULTILINE)
    description = desc_match.group(1).strip() if desc_match else name
    body = re.sub(r'/speckit\.([a-z]+)', r'/speckit-\1', body)  # fix cross-refs
    new_content = f"---\nname: {name}\ndescription: {description}\n---\n{body}"
    dst_subdir = os.path.join(dst_dir, name)
    os.makedirs(dst_subdir, exist_ok=True)
    with open(os.path.join(dst_subdir, "SKILL.md"), "w", encoding="utf-8") as f:
        f.write(new_content)
EOF
```

Available commands: `/speckit-constitution`, `/speckit-specify`,
`/speckit-plan`, `/speckit-tasks`, `/speckit-implement`, `/speckit-converge`,
`/speckit-clarify`, `/speckit-analyze`, `/speckit-checklist`,
`/speckit-taskstoissues`.

## Commands

- Build: `npm run build`
- Lint: `npm run lint:check` (or `npm run lint` to auto-fix)
- Format: `npm run format`
- Tests: `npm test` / `npm run test:cov` / `npm run test:e2e`
- Dev server: `npm run start:dev`
- Prisma: `npm run prisma:generate`, `npm run prisma:migrate`
