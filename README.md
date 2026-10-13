# Turbopack scope hoisting: merged module evaluated twice, duplicating module singletons

Reproduction for https://github.com/vercel/next.js/issues/100139.

Minimal-ish reproduction (8 source files (~220 lines), no monorepo, no custom loaders) of a Turbopack
**production** bug: with scope hoisting enabled (the default), one merged module factory is
executed **twice** in the browser, so every module-level singleton it contains exists twice.
Here the styled-components theme object is duplicated, and the app crashes during hydration
on every load. In the app this was extracted from, a React context created with
`createContext` was duplicated the same way (provider wrote into one instance, consumers read
the other → `useNavigation must be used within a NavigationProvider`).

Extracted from https://github.com/betagouv/mon-entreprise (real production app).

## Reproduce

```bash
npm install
NODE_ENV=production npm run build     # Turbopack production build (Next 16 default)
NODE_ENV=production npm run start
```

Open http://localhost:3000/ — the page crashes during hydration ("Une erreur est survenue",
`Cannot read properties of undefined (reading 'main')`: a styled-component reads
`theme.fonts.main` from a theme instance that is not the one the ThemeProvider provided).

The browser console also shows the instrumentation warning from
`source/design-system/root.tsx`:

```
[repro] theme module evaluated 2 times: module-level singletons are duplicated
```

## Control: disable scope hoisting

Add to `next.config.mjs`:

```js
experimental: { turbopackScopeHoisting: false },
```

Rebuild — the page renders correctly and the theme module is evaluated exactly once.
Building with webpack also renders correctly.

## Notes

- Only reproduces in production builds; `next dev` is fine (scope hoisting is disabled in dev).
- Reproduces on next 16.2.6, 16.3.4, 16.4.0 (latest stable) and 16.5.0-canary.9 — i.e. also after
  vercel/next.js#96697 ("Raise registration calls in hoisted modules to the top", the fix
  that closed vercel/next.js#96648) and its 16.3 backport vercel/next.js#97308.
- The repo is 1-minimal at module granularity: 8 source files, and cutting any remaining
  file or import edge was tested and makes the bug disappear. The proven ingredients:
  - a barrel (`design-system/index.ts`) with one import cycle back into it
    (`InfoButton` → barrel → `InfoButton`),
  - two `'use client'` boundaries sharing that barrel (`ClientProviders` and
    `PageLayout` — removing the layout's `'use client'` directive alone makes the bug
    disappear), both rendering a component from it (`Body`) and both pulling
    `react-helmet-async` and `react-i18next`,
  - two modules that must stay separate, imported by the barrel: `Meta` (renders a
    `<Helmet>`) and `root` (holds the computed styled-components theme object — the
    singleton that gets duplicated); inlining either into the barrel makes the bug
    disappear,
  - a client component reading `usePathname()`/`useSearchParams()` under the root
    `Suspense`.
- Notably NOT required in the minimal state (each was needed in larger graphs but became
  removable as the graph shrank): `lazy()`/dynamic imports, React context consumers, any
  router abstraction, `global-error`, the styled-components SSR registry.
- Ruled out as non-ingredients (the bug survives their removal): Redux, publicodes,
  react-aria, react-stately, focus-trap-react, markdown-to-jsx, react-easy-emoji,
  react-spring, effect, dark-mode/localStorage plumbing, analytics.
- Same bug family as vercel/next.js#96648 and
  https://yceffort.kr/en/2026/08/turbopack-scope-hoisting-singleton-split (duplicated
  WebSocket singleton) — but this variant still reproduces after the #96697 fix.
