import * as React from 'react'

export function useForwardedRef<T extends HTMLElement>(ref: React.Ref<T>) {
  let internalRef = React.useRef<T | null>(null)

  React.useEffect(() => {
    if (!ref) {
      return
    }
    if (typeof ref === 'function') {
      ref(internalRef.current)
    } else {
      ;(ref as React.MutableRefObject<T | null>).current = internalRef.current
    }
  })

  return internalRef
}
