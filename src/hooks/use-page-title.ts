import { useEffect } from 'react'

export function usePageTitle(title: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} | Eagle Bank` : 'Eagle Bank'
    return () => {
      document.title = prev
    }
  }, [title])
}
