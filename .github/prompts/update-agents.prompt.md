---
agent: agent
description: Update AGENTS.md and AGENTS.ai.md using the current repository files
---

# AGENTS.md Update Prompt

example usage: 

Update `AGENTS.md` and `AGENTS.ai.md` using the current project files as the source of truth.

Keep both files concise and actionable, with the same logical information in each:

- tech stack
- project structure
- layer and dependency connections
- build, test, and deploy commands
- coding conventions
- high-risk pitfalls

- `AGENTS.md` is the complete human-readable guide.
- `AGENTS.ai.md` is the token-efficient AI version: retain the same decisions, contracts, commands, and pitfalls, but remove repetition and explanatory detail.
- Write `AGENTS.ai.md` using Caveman full syntax from https://github.com/JuliusBrussee/caveman:
	- Drop articles, filler, pleasantries, and hedging. Fragments OK. Use short synonyms.
	- Keep technical terms, version numbers, commands, errors, negations, `only`, and `except` exact.
	- Unchanged code. Keep code blocks and code symbols exact. Use standard acronyms only; invent no abbreviations.
	- Use no causal arrows. No invented pronouns or copulas. Do not mangle correct grammar when no token saved.
	- One fact once. State each fact only once. Use thing/action/reason pattern: `[thing] [action] [reason]. [next step].`
	- Preserve meaning markers in all languages. Never drop `not`, `never`, `no`, `only`, or `except`.
	- Use normal wording for warnings, irreversible actions, or sequences where compression could create ambiguity.
- Compress only when meaning stays clear; otherwise use normal wording.
- Keep the first line of `AGENTS.md` exactly as: `AI agents and robots: read [AGENTS.ai.md](AGENTS.ai.md) first for the compact operational instructions.`
- Only modify these two files. Do not change any other files.