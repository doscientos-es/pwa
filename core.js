const noOperation = () => undefined

/** Returns browser capabilities without accessing globals during SSR. */
export function detectPwaEnvironment({
  windowRef = globalThis.window,
  navigatorRef = globalThis.navigator,
} = {}) {
  if (!windowRef || !navigatorRef) return { isIos: false, isStandalone: false }

  const isStandalone =
    windowRef.matchMedia?.('(display-mode: standalone)').matches === true ||
    navigatorRef.standalone === true
  const isIos =
    /iPad|iPhone|iPod/.test(navigatorRef.userAgent ?? '') ||
    (navigatorRef.platform === 'MacIntel' && (navigatorRef.maxTouchPoints ?? 0) > 1)

  return { isIos, isStandalone }
}

export function shouldOfferPwaInstallation({ isDismissed, isIos, isStandalone, canPrompt }) {
  return !isStandalone && !isDismissed && (isIos || canPrompt)
}

export function readPwaDismissal(storageKey, storage = globalThis.localStorage) {
  try {
    return storage?.getItem(storageKey) === '1'
  } catch {
    return false
  }
}

export function persistPwaDismissal(storageKey, storage = globalThis.localStorage) {
  try {
    storage?.setItem(storageKey, '1')
  } catch {
    // A prompt remains dismissible when storage is unavailable.
  }
}

/**
 * Registers an app-owned worker after load. Cache strategy remains in the app's
 * service worker and is never inferred or shared by this package.
 */
export function registerPwaServiceWorker({
  scriptUrl = '/sw.js',
  updateViaCache = 'none',
  onError = noOperation,
  onRegistered = noOperation,
  windowRef = globalThis.window,
  navigatorRef = globalThis.navigator,
  documentRef = globalThis.document,
} = {}) {
  const serviceWorker = navigatorRef?.serviceWorker
  if (!windowRef || !documentRef || !serviceWorker?.register) return noOperation

  let disposed = false
  const register = () => {
    void serviceWorker
      .register(scriptUrl, { updateViaCache })
      .then((registration) => {
        if (!disposed) onRegistered(registration)
      })
      .catch((error) => {
        if (!disposed) onError(error)
      })
  }

  if (documentRef.readyState === 'complete') register()
  else windowRef.addEventListener('load', register, { once: true })

  return () => {
    disposed = true
    windowRef.removeEventListener('load', register)
  }
}
