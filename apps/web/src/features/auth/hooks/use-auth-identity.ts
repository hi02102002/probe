'use client'

import type { AuthSession } from '../api/auth-session'
import { clearIdentity, setIdentity } from 'evlog/client'
import { useEffect } from 'react'

export function useAuthIdentity(session: AuthSession | null) {
  const userId = session?.user.id
  const userName = session?.user.name
  const userEmail = session?.user.email

  useEffect(() => {
    if (!userId) {
      clearIdentity()
      return
    }

    setIdentity({
      userId,
      userName,
    })

    if (typeof window !== 'undefined' && window.umami) {
      window.umami.identify(userId, {
        email: userEmail,
        name: userName,
      })
    }
  }, [userId, userName, userEmail])
}
