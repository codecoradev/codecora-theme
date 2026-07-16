/**
 * CodeCora VitePress config helper (compiled JS).
 *
 * Identical logic to config.ts but without TypeScript annotations,
 * so Node.js 24 can import it from node_modules without type-stripping errors.
 */
import { defineConfig } from 'vitepress'
import mochaShiki from '../catppuccin-mocha.json'

const ACCENT_VAR = {
  green: 'var(--cc-green)',
  mauve: 'var(--cc-mauve)',
  blue: 'var(--cc-blue)',
  red: 'var(--cc-red)',
  peach: 'var(--cc-peach)',
  teal: 'var(--cc-teal)',
  yellow: 'var(--cc-yellow)',
  lavender: 'var(--cc-lavender)',
}

export function createConfig(opts) {
  const repo = opts.repo ?? opts.product
  const accent = opts.accent ?? 'green'

  return defineConfig({
    title: opts.title,
    description: opts.description,
    lang: 'en',
    cleanUrls: true,
    base: `/${opts.product}/docs/`,
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
      [
        'style',
        {},
        `:root{--cc-accent:${ACCENT_VAR[accent]};}`
      ]
    ],
    markdown: {
      theme: { light: 'github-light', dark: mochaShiki },
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
