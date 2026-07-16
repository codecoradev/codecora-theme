/**
 * CodeCora VitePress theme entry.
 *
 * Adoption in any product docs (`.vitepress/theme/index.ts`):
 *
 *   import type { Theme } from 'vitepress'
 *   import cc from '@codecora/theme/vitepress'
 *   import '@codecora/theme/vitepress/style.css'
 *
 *   export default {
 *     extends: cc,
 *     // optional per-product accent (defaults to green):
 *     enhanceApp({ app }) {
 *       // nothing required; accent is a CSS var, set it in a tiny css file
 *     }
 *   }
 *
 * Per-product accent: create `.vitepress/theme/accent.css`:
 *   :root { --cc-accent: var(--cc-red); }   /* trapfall */
 * and import it here after style.css.
 */
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

const codecoraTheme: Theme = {
	extends: DefaultTheme,
	// `enhanceApp` intentionally left to consumers; tokens are pure CSS.
}

export default codecoraTheme
