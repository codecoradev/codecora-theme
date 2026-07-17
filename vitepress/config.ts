/**
 * CodeCora VitePress config helper.
 *
 * Centralises the boring, must-be-consistent parts so each product docs
 * config stays tiny. Adoption in `.vitepress/config.ts`:
 *
 *   import { createConfig } from '@codecora/theme/vitepress/config'
 *   export default createConfig({
 *     product: 'uteke',
 *     title: 'Uteke',
 *     description: 'Local-first semantic memory engine…',
 *     accent: 'green',
 *     sidebar: [ … ],
 *   })
 *
 * IMPORTANT: sets `base: '/<product>/docs/'` — the NEW routing scheme
 * (codecora.dev/<product>/docs/). Update the Cloudflare route accordingly.
 */
import { defineConfig, type UserConfig } from 'vitepress'
import mochaShiki from '../catppuccin-mocha.json'

export type Accent =
	| 'green'
	| 'mauve'
	| 'blue'
	| 'red'
	| 'peach'
	| 'teal'
	| 'yellow'
	| 'lavender'

const ACCENT_VAR: Record<Accent, string> = {
	green: 'var(--cc-green)',
	mauve: 'var(--cc-mauve)',
	blue: 'var(--cc-blue)',
	red: 'var(--cc-red)',
	peach: 'var(--cc-peach)',
	teal: 'var(--cc-teal)',
	yellow: 'var(--cc-yellow)',
	lavender: 'var(--cc-lavender)'
}

export interface CodeCoraConfig {
	/** repo/product slug, e.g. 'uteke'. Drives `base` and default links. */
	product: string
	title: string
	description: string
	/** Accent color token. Default 'green'. */
	accent?: Accent
	/** GitHub repo path override if slug ≠ repo name (e.g. cora → cora-cli). */
	repo?: string
	sidebar?: UserConfig['themeConfig'] extends infer T ? any : never
	nav?: Array<{ text: string; link: string }>
	/** Disable local search if a product wants Algolia later. */
	search?: false
	/** Extra VitePress head tags (merged after theme defaults). */
	head?: UserConfig['head']
	/** VitePress ignoreDeadLinks (boolean or RegExp[]). */
	ignoreDeadLinks?: UserConfig['ignoreDeadLinks']
	/** VitePress srcExclude patterns. */
	srcExclude?: UserConfig['srcExclude']
	/** Show last-updated timestamp. */
	lastUpdated?: boolean
}

export function createConfig(opts: CodeCoraConfig): UserConfig {
	const repo = opts.repo ?? opts.product
	const accent = opts.accent ?? 'green'

	return defineConfig({
		title: opts.title,
		description: opts.description,
		lang: 'en',
		cleanUrls: true,

		// NEW routing scheme: codecora.dev/<product>/docs/
		base: `/${opts.product}/docs/`,

		// Forward optional user config
		...(opts.ignoreDeadLinks !== undefined && { ignoreDeadLinks: opts.ignoreDeadLinks }),
		...(opts.srcExclude && { srcExclude: opts.srcExclude }),
		...(opts.lastUpdated !== undefined && { lastUpdated: opts.lastUpdated }),

		head: [
			['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
			['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
			[
				'link',
				{
					rel: 'stylesheet',
					href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap'
				}
			],
			['meta', { name: 'theme-color', content: '#1e1e2e' }],
			// Apply the per-product accent before paint so there's no flash.
			[
				'style',
				{},
				`:root{--cc-accent:${ACCENT_VAR[accent]};}`
			]
		],

		markdown: {
			// Catppuccin Mocha code highlighting (shipped with this package).
			theme: { light: 'github-light', dark: mochaShiki as any },
			defaultHighlightOptions: { decodeNamedCharacterReference: true },
			lineNumbers: true
		},

		themeConfig: {
			logo: { src: '/logo.png', width: 24, height: 24, alt: 'CodeCora' },
			siteTitle: opts.title,
			nav: opts.nav ?? [
				{ text: 'codecora.dev', link: 'https://codecora.dev' },
				{ text: 'GitHub', link: `https://github.com/codecoradev/${repo}` }
			],
			sidebar: opts.sidebar,
			socialLinks: [{ icon: 'github', link: `https://github.com/codecoradev/${repo}` }],
			...(opts.search === false ? {} : { search: { provider: 'local' } })
		}
	})
}

export { ACCENT_VAR }
