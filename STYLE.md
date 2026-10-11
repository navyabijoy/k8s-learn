# STYLE.md — how this handbook is written

Source of truth: the "Ultimate Linux Handbook" by Code With Harry (62 pages, read end to end). This file lists what that book does, so the Kubernetes handbook sounds like the same author. Re-read this before finishing every chapter.

## 1. Voice rules

1. **Short sentences.** Most are under 20 words. One idea each. "Linux is the kernel. In conversation, 'Linux' almost always means a distribution."
2. **Second person.** "You run", "you will see". Never "the user", never "one".
3. **Plain everyday English.** If a jargon word must appear, give it a one-line meaning the first time. ("A VPS (Virtual Private Server) is a Linux machine you rent in the cloud.")
4. **Start from the problem, then name the tool.** The Linux book opens permissions with "Imagine a server with three people". Here: open with the pain (a container dies at 3 a.m., who restarts it?), then introduce the object that fixes it.
5. **Correct the beginner mistake out loud.** "`apt update` does not update your software." "`kill` doesn't mean destroy." Every chapter has at least one "this does NOT mean…" sentence.
6. **Everyday analogy, once, and keep it.** apt = app store. Pod = flat with flatmates. Do not stack three analogies on one idea.
7. **Tiny examples, same recurring names.** Linux book: harry, alice, bob, nginx, developers. Here: `web` (nginx), `harry`, `alice`, `bob`, label `app: web`, namespace `dev`/`prod`. Reuse them across chapters so the reader never has to learn a new cast.
8. **2–3 variations of a command, then one line per variation.** "`uname -s` prints Linux. `uname -a` dumps everything. `uname -r` prints the release."
9. **Break a command apart flag by flag** (the `usermod -aG` diagram). Use a `tree` block with `│ └──` lines pointing at each part.
10. **X vs Y.** `cat` vs `less`, `upgrade` vs `full-upgrade`, process vs service. Use a small table or two short code lines.
11. **Never a memorise-this list.** Always "here is why it exists". When a list is unavoidable, say so ("You do not need to memorise every directory").
12. **Say what can go wrong.** A "What can go wrong" section, with real consequences, not warnings for show.
13. **No marketing words.** No "powerful", "seamless", "robust", "leverage", "simply". If a sentence sounds like documentation, rewrite it as if talking to a friend at a terminal.
14. **Honest about limits.** "You do not need these yet." "Not every service supports reload."

## 2. Chapter shape (Kubernetes handbook)

Every chapter, same order:

1. **The problem** (2–4 short paragraphs, a concrete scenario)
2. **The idea in one sentence** (blue "Key idea" callout)
3. **A tiny YAML or command example**, then a flag-by-flag / field-by-field breakdown
4. **Variations** (2–3, one line each)
5. **Linux you already know** (link back, e.g. Deployment ≈ systemd keeping a service up)
6. **Common mistakes** (amber callouts, each starts with the wrong belief)
7. **Try it** lab (green). Real output only if it was run. Otherwise the command alone.
8. **Interview questions** (3–5, purple, click-to-reveal, answers written the way you would say them out loud)
9. **Habits worth keeping** wrap-up (one tight paragraph, bold the verbs)

## 3. Visual components (from the Linux PDF, plus colour)

| Component | Linux handbook | Here |
|---|---|---|
| Header | Chapter title top-left, "SECTION 07" pill top-right, blue→yellow gradient rule | Same. Pill says `Section 06`. |
| Label cards | 2-column grid, small blue ALL-CAPS tag, 1–2 sentences | `.cards` > `.card` > `.tag`. 1 column on phones. |
| Flow chips | `Hardware → Kernel → Shell → Programs` in rounded chips | `.flow` with `<span>` chips and `<i>→</i>` arrows. Wraps on phones. |
| Callout | Left blue bar, white box, one idea | Five colour-coded types, below. |
| Tables | Header row, light zebra, inline `code` cells | Same, wrapped for horizontal scroll on phones. |
| Code | Light grey block, purple commands, orange flags, blue numbers, grey punctuation | Same palette. Kubernetes additions: YAML keys, `kubectl` verbs, resource kinds. |
| Tree diagrams | `├──`/`└──` monospace blocks, annotations with `→` | `.tree` block. |
| Worked example | Near the end of the chapter | "Try it" lab plays this role. |
| Wrap-up | "What you can do now" + "Habits worth keeping" | Same, per chapter. |

### Callout colours (colour carries meaning, always with a text label)

| Type | Colour | Label | Use |
|---|---|---|---|
| `key` | blue | Key idea | the one-sentence idea; definitions |
| `try` | green | Try it | runnable steps |
| `mistake` | amber | Common mistake | a wrong belief and its fix |
| `danger` | red | This can break things | destructive or risky commands |
| `interview` | purple | Interview | wrapper for click-to-reveal Q&A |

### Code colour rules (same everywhere)

- **YAML keys**: teal. Values: default text. Strings: green. Numbers/booleans: blue. Comments: grey.
- **`kubectl`**: purple. **Verbs** (`get`, `apply`, `describe`, `logs`, `exec`, `delete`, `rollout`…): bold purple-magenta.
- **Flags** (`-n`, `--namespace`, `-o`): orange.
- **Resource kinds / names after a verb** (`pod`, `deployment`): default text, so the verb and flag stand out.
- **Output blocks**: no colouring, muted background, no copy button.

## 4. Things the Linux handbook never does (so we don't)

- No long theory before a command the reader can run.
- No "as we all know". No history for its own sake (history only if it explains today's behaviour).
- No emoji. No exclamation marks except inside quoted output.
- No invented output. If the command was not run, show the command only.
- No deprecated APIs or removed flags. Check against kubernetes.io for the version stated on the home page.

## 5. Final check before committing a chapter

- [ ] Opens with a problem, not a definition.
- [ ] Every new term has a one-line meaning at first use.
- [ ] At least one "does NOT mean" correction.
- [ ] Recurring names used (`web`, `app: web`, harry/alice/bob).
- [ ] Commands have 2–3 variations with one line each.
- [ ] A Linux connection paragraph.
- [ ] Try it lab, real output only.
- [ ] 3–5 interview answers sound spoken, under ~80 words each.
- [ ] No sentence sounds like docs.
- [ ] Looks right at 360px wide.
