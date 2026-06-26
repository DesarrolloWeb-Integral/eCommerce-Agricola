import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

import { ToastContainer } from '../components/notifications/ToastContainer'
import { ToastContext } from '../contexts/ToastContext'
import type { ShowToastOptions, Toast } from '../types/toast.types'

interface ToastProviderProps {
  children: ReactNode
}

const DEFAULT_TOAST_DURATION = 4000
const MAX_VISIBLE_TOASTS = 3

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const activeToastIdsRef = useRef<Set<string>>(new Set())
  const timeoutIdsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((toastId: string): void => {
    const timeoutId = timeoutIdsRef.current.get(toastId)

    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutIdsRef.current.delete(toastId)
    }

    activeToastIdsRef.current.delete(toastId)

    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== toastId))
  }, [])

  const showToast = useCallback(
    (message: string, options: ShowToastOptions = {}): void => {
      if (activeToastIdsRef.current.size >= MAX_VISIBLE_TOASTS) {
        return
      }

      const toastId = crypto.randomUUID()
      const duration = options.duration ?? DEFAULT_TOAST_DURATION

      const newToast: Toast = {
        id: toastId,
        message,
        type: options.type ?? 'info',
      }

      activeToastIdsRef.current.add(toastId)
      setToasts((currentToasts) => [...currentToasts, newToast])

      const timeoutId = setTimeout(() => {
        removeToast(toastId)
      }, duration)

      timeoutIdsRef.current.set(toastId, timeoutId)
    },
    [removeToast]
  )

  useEffect(() => {
    const timeoutIds = timeoutIdsRef.current
    const activeToastIds = activeToastIdsRef.current

    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId))
      timeoutIds.clear()
      activeToastIds.clear()
    }
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  )
}
