import assert from 'node:assert/strict'
import test from 'node:test'

import {
  detectPwaEnvironment,
  readPwaDismissal,
  registerPwaServiceWorker,
  shouldOfferPwaInstallation,
} from '../core.js'

test('detects iOS and standalone mode without browser globals', () => {
  assert.deepEqual(detectPwaEnvironment({ windowRef: undefined, navigatorRef: undefined }), {
    isIos: false,
    isStandalone: false,
  })
  assert.deepEqual(
    detectPwaEnvironment({
      windowRef: { matchMedia: () => ({ matches: true }) },
      navigatorRef: { platform: 'MacIntel', maxTouchPoints: 2, userAgent: '' },
    }),
    { isIos: true, isStandalone: true },
  )
})

test('offers installation only when the browser can complete it', () => {
  assert.equal(
    shouldOfferPwaInstallation({
      isDismissed: false,
      isIos: false,
      isStandalone: false,
      canPrompt: true,
    }),
    true,
  )
  assert.equal(
    shouldOfferPwaInstallation({
      isDismissed: true,
      isIos: true,
      isStandalone: false,
      canPrompt: true,
    }),
    false,
  )
})

test('reads dismissal defensively and registers after load', async () => {
  let onLoad
  const registrations = []
  const unregister = registerPwaServiceWorker({
    documentRef: { readyState: 'loading' },
    navigatorRef: { serviceWorker: { register: async (...args) => registrations.push(args) } },
    windowRef: {
      addEventListener: (_name, callback) => {
        onLoad = callback
      },
      removeEventListener: () => undefined,
    },
  })
  onLoad()
  await Promise.resolve()
  assert.deepEqual(registrations, [['/sw.js', { updateViaCache: 'none' }]])
  assert.equal(readPwaDismissal('missing', { getItem: () => '0' }), false)
  unregister()
})
