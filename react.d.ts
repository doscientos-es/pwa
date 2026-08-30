export type PwaInstallChoice = { outcome: 'accepted' | 'dismissed' }

export declare function usePwaInstallPrompt(options: { storageKey: string }): {
  isIos: boolean
  isStandalone: boolean
  visible: boolean
  pending: boolean
  dismiss: () => void
  install: () => Promise<PwaInstallChoice | null>
}
