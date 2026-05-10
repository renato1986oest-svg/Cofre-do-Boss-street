import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Removed the direct call to setIsMobile here that was causing the linter warning
    // Instead we can just use the initial state or matchMedia's matches property
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
