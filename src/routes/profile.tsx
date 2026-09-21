import { useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, redirect } from '@tanstack/react-router'

import { ProfileScreen } from '#/features/account'
import { viewerQueryOptions } from '#/features/auth'

export const Route = createFileRoute('/profile')({
  beforeLoad: ({ context }) => {
    if (!context.viewer) {
      throw redirect({ to: '/sign-in', search: { redirect: '/profile' } })
    }
    if (!context.viewer.account) {
      throw redirect({ to: '/onboarding', search: { redirect: '/profile' } })
    }
  },
  component: ProfilePage,
})

function ProfilePage() {
  const viewerQuery = useSuspenseQuery(viewerQueryOptions())
  const account = viewerQuery.data?.account
  if (!account) {
    return null
  }

  return <ProfileScreen account={account} />
}
