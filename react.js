import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  detectPwaEnvironment,
  persistPwaDismissal,
  readPwaDismissal,
  shouldOfferPwaInstallation,
} from './core.js'

/** React adapter for the native install event; it intentionally renders no UI. */
export function usePwaInstallPrompt({ storageKey } = {}) {
  if (!storageKey) throw new Error('usePwaInstallPrompt requires a storageKey')

  const [installEvent, setInstallEvent] = useState(null)
  const [dismissed, setDismissed] = useState(true)
  const [environment, setEnvironment] = useState({ isIos: false, isStandalone: true })
  const [pending, setPending] = useState(false)

  useEffect(() => {
    setEnvironment(detectPwaEnvironment())
    setDismissed(readPwaDismissal(storageKey))
    const onBeforeInstallPrompt = (event) => {
      event.preventDefault()
      setInstallEvent(event)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  }, [storageKey])

  const dismiss = useCallback(() => {
    persistPwaDismissal(storageKey)
    setDismissed(true)
  }, [storageKey])

  const install = useCallback(async () => {
    if (!installEvent) return null
    setPending(true)
    try {
      await installEvent.prompt()
      const choice = await installEvent.userChoice
      if (choice.outcome === 'accepted')
        setEnvironment((current) => ({ ...current, isStandalone: true }))
      setInstallEvent(null)
      return choice
    } finally {
      setPending(false)
    }
  }, [installEvent])

  const visible = useMemo(
    () =>
      shouldOfferPwaInstallation({
        ...environment,
        isDismissed: dismissed,
        canPrompt: installEvent !== null,
      }),
    [dismissed, environment, installEvent],
  )

  return { ...environment, dismiss, install, pending, visible }
}
