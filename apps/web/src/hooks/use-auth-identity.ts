'use client'

import type { AuthSession } from '@/features/auth/api/get-auth-session'
import { clearIdentity, setIdentity } from 'evlog/client'
import { useEffect } from 'react'

export function useAuthIdentity(session: AuthSession | null) {
  const userId = session?.user.id
  const userName = session?.user.name

  useEffect(() => {
    if (!userId) {
      clearIdentity()
      return
    }

    setIdentity({
      userId,
      userName,
    })
  }, [userId, userName])
}
