import type { AuthSession } from '@/features/auth/api/get-auth-session'
import { GradientAvatar } from '@outpacelabs/avatars'
import { SignOutIcon } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { useIntlayer } from 'react-intlayer'
import { LanguageSwitcher } from '@/components/language-switcher'
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from '@/components/ui/menu'
import { getAuthSessionQueryOptions } from '@/features/auth/api/get-auth-session'
import { getAuthClient } from '@/lib/auth-client'

export function UserMenu({ user }: { user: AuthSession['user'] }) {
  const content = useIntlayer('dashboard')
  const queryClient = useQueryClient()
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function handleSignOut() {
    setIsSigningOut(true)

    try {
      const result = await getAuthClient().signOut()

      if (result.error) {
        return
      }

      await queryClient.invalidateQueries({
        queryKey: getAuthSessionQueryOptions.queryKey,
      })
      await router.invalidate()
    }
    finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Menu>
      <MenuTrigger
        aria-label={`Open user menu for ${user.name}`}
        className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <GradientAvatar
          className="bg-neutral-800"
          pattern="dither"
          radius={99999}
          seed={user.email}
          size={32}
        />
      </MenuTrigger>
      <MenuPopup align="end" className="w-64" sideOffset={8}>
        <MenuGroup>
          <MenuGroupLabel className="px-2 py-2 normal-case">
            <span className="block truncate font-medium text-foreground text-sm">
              {user.name}
            </span>
            <span className="mt-0.5 block truncate font-normal text-muted-foreground text-xs">
              {user.email}
            </span>
          </MenuGroupLabel>
        </MenuGroup>
        <MenuSeparator className="-mx-1" />
        <LanguageSwitcher />
        <MenuSeparator className="-mx-1" />
        <MenuItem disabled={isSigningOut} onClick={() => void handleSignOut()}>
          <SignOutIcon className="size-4 shrink-0" weight="duotone" />
          {isSigningOut ? content.loggingOut.value : content.logOut.value}
        </MenuItem>
      </MenuPopup>
    </Menu>
  )
}
