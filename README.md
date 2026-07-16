# @codecora/theme

Shared **design tokens** + **VitePress adapter** for the entire CodeCora ecosystem (Catppuccin Mocha). One source of truth, consumed by both `web-landing` (SvelteKit) and every product's VitePress docs — so they can never drift apart visually.

```
codecora-theme/
├── tokens.css              ← Catppuccin Mocha palette + fonts + radii (THE source)
├── catppuccin-mocha.json   ← Shiki theme for code blocks
├── vitepress/
│   ├── style.css           ← maps --cc-* onto VitePress --vp-c-* variables
│   ├── index.ts            ← theme entry (extends DefaultTheme)
│   └── config.ts           ← createConfig() helper: base path + fonts + Shiki baked in
└── package.json            ← @codecora/theme, consumed via npm or github:
```

## Why

Today each docs site looks different (uteke=amber, cora=indigo, trapfall=default green) and none match the landing (Catppuccin). This package fixes that: every site imports the **same variables**, so a palette change here updates all of them.

> "Shared tokens" = the raw design values (colors, fonts, radii) declared **once** as CSS variables (`--cc-green`, `--cc-font-sans`, …). Each project maps them onto its own framework's variables. Change the number once → it propagates everywhere.

## Consumed by `web-landing` (already wired)

`src/app.css` imports the tokens and maps them into Tailwind's `@theme`:

```css
@import "tailwindcss";
@import "../codecora-theme/tokens.css";

@theme {
  --color-green: var(--cc-green);   /* → utilities like text-green, bg-green/40 */
  /* …all palette colors remapped… */
}
```

So the landing now drinks its own champagne — its colors come from this exact file.

---

## Adopting into a product's VitePress docs

> Goal: docs move from `codecora.dev/docs/{product}/` → **`codecora.dev/{product}/docs/`**, and look identical to the landing.

### 1. Install

From the product repo's `docs/` folder:

```bash
# option A — published package (after you `npm publish` this folder from its own repo)
npm i -D @codecora/theme

# option B — consume directly from GitHub (no publish step needed)
npm i -D github:codecoradev/codecora-theme
```

> **Recommended:** move this `codecora-theme/` folder into its own repo
> `codecoradev/codecora-theme`, then everyone installs via `github:` or npm.

### 2. Theme entry — `.vitepress/theme/index.ts`

```ts
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import '@codecora/theme/vitepress/style.css'
import './accent.css'   // 1 line: per-product accent (see below)

export default { extends: DefaultTheme }
```

### 3. Per-product accent — `.vitepress/theme/accent.css`

```css
/* uteke / cora */   :root { --cc-accent: var(--cc-green); }
/* trapfall */       :root { --cc-accent: var(--cc-red); }
/* corin   */        :root { --cc-accent: var(--cc-blue); }
```

### 4. Config — `.vitepress/config.ts` (replaces the whole file)

```ts
import { createConfig } from '@codecora/theme/vitepress/config'

export default createConfig({
  product: 'uteke',                       // → base: '/uteke/docs/'
  title: 'Uteke',
  description: 'Local-first semantic memory engine…',
  accent: 'green',
  repo: 'uteke',                           // omit if slug ≠ repo (cora → repo:'cora-cli')
  sidebar: [ /* keep your existing sidebar array */ ],
})
```

`createConfig()` already sets: `base`, cleanUrls, Inter+JetBrains Mono fonts, theme-color, Shiki Catppuccin Mocha, default nav + socialLinks + local search.

### 5. Cloudflare route (the path move)

Change the Pages route so `/uteke/docs/*` hits the uteke Pages deployment:

```
Pattern                  Destination
/uteke/docs/*            codecora-uteke-docs.pages.dev/uteke/docs/*
/uteke/*                 codecora-web-landing.pages.dev/*     ← landing (must be AFTER docs)
```

**Order matters:** put the more specific `/uteke/docs/*` rule **above** the landing catch-all.

### 6. Fix absolute asset paths

Any `/favicon.svg`, `/logo.png` etc. written as **absolute** in the old config break under the new `base`. VitePress internal links starting with `/` are auto-prefixed by `base`, so prefer those. (`createConfig` sets `logo: '/logo.png'` which resolves to the domain root — fine if shared at `codecora.dev/logo.png`.)

---

## Per-product plan

| Repo | Now | Action |
|---|---|---|
| **uteke** | VitePress, amber theme, `base /docs/uteke/` | Adopt theme (accent green), move base → `/uteke/docs/`, update CF route |
| **cora-cli** | VitePress, indigo theme + **own `LandingPage.vue`** | Adopt theme (accent green), **retire the in-docs landing page** (marketing now lives in `web-landing`), move base |
| **trapfall** | VitePress, default theme | Adopt theme (accent red), move base |
| **corin / rungu / coflui** | loose `.md`, no VitePress | Either scaffold VitePress with this theme, or keep linking to GitHub README |

## Retire cora-cli's in-docs landing

`cora-cli/docs/.vitepress/theme/components/LandingPage.vue` (and `TerminalDemo.vue`) duplicate what `web-landing` now owns. After adoption, delete those components + the `index.md` landing frontmatter so the docs site is **docs only**, and `codecora.dev/cora` (landing) → `codecora.dev/cora/docs/` (docs) is the clean split.

---

## Publishing this package (optional, for npm)

```bash
cd codecora-theme
npm version patch
npm publish --access public     # publishes @codecora/theme
```
Until then, `github:codecoradev/codecora-theme` works with zero publishing.
