export type PwaInstallAvailability = {
  isDismissed: boolean
  isIos: boolean
  isStandalone: boolean
  canPrompt: boolean
}

export type PwaEnvironment = Pick<PwaInstallAvailability, 'isIos' | 'isStandalone'>

export type PwaInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export declare function detectPwaEnvironment(options?: {
  windowRef?: Window
  navigatorRef?: Navigator
}): PwaEnvironment
export declare function shouldOfferPwaInstallation(availability: PwaInstallAvailability): boolean
export declare function readPwaDismissal(storageKey: string, storage?: Storage): boolean
export declare function persistPwaDismissal(storageKey: string, storage?: Storage): void
export declare function registerPwaServiceWorker(options?: {
  scriptUrl?: string
  updateViaCache?: ServiceWorkerUpdateViaCache
  onError?: (error: unknown) => void
  onRegistered?: (registration: ServiceWorkerRegistration) => void
  windowRef?: Window
  navigatorRef?: Navigator
  documentRef?: Document
}): () => void
