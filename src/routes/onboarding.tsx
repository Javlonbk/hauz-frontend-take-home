import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { OnboardingScreen } from '#/features/account'
import { safeRedirect } from '#/features/auth'

export const Route = createFileRoute('/onboarding')({
  validateSearch: z.object({ redirect: z.string().optional() }),
  beforeLoad: ({ context, search }) => {
    if (!context.viewer) {
      throw redirect({ to: '/sign-in', search: { redirect: search.redirect } })
    }
    if (context.viewer.account) {
      throw redirect({ href: safeRedirect(search.redirect) })
    }
  },
  component: OnboardingPage,
})

function OnboardingPage() {
  const search = Route.useSearch()

  return <OnboardingScreen redirectTo={safeRedirect(search.redirect)} />
}
