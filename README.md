# @doscientos/pwa

Reusable PWA installation primitives. It shares safe browser detection,
installation state and service-worker registration without imposing a UI,
manifest or caching strategy on applications.

## Exports

- `@doscientos/pwa/core`: browser-safe detection, dismissal storage and
  `registerPwaServiceWorker`.
- `@doscientos/pwa/react`: `usePwaInstallPrompt`, a headless React hook.

Each app owns its manifest, icons, `public/sw.js`, cache name and cache policy.
Never cache API, authentication or user-specific responses in a shared default.

## React example

Use `usePwaInstallPrompt({ storageKey: 'product:pwa-dismissed' })` and render
your own design-system UI from its `visible`, `isIos`, `pending`, `install` and
`dismiss` values. Register the worker once from the app shell with
`registerPwaServiceWorker()`.

## Publishing

Run `npm run check` and `npm pack --dry-run` before publishing. Every regular
commit to `main` publishes the next patch version and creates its tag
automatically. To publish a minor or major, edit the `version` in
`package.json` before pushing; the workflow publishes that exact version and
continues patch releases from it. Configure npm Trusted Publishing for
`doscientos-es/pwa`, workflow
`.github/workflows/publish.yml`, and GitHub environment `npm-production`; no
registry token is stored in the repository.
