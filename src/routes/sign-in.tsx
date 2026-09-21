import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { SignInScreen, safeRedirect } from '#/features/auth'

export const Route = createFileRoute('/sign-in')({
  validateSearch: z.object({ redirect: z.string().optional() }),
  beforeLoad: ({ context, search }) => {
    if (context.viewer?.account) {
      throw redirect({ href: safeRedirect(search.redirect) })
    }
    if (context.viewer) {
      throw redirect({ to: '/onboarding', search: { redirect: search.redirect } })
    }
  },
  component: SignInPage,
})

function SignInPage() {
  const search = Route.useSearch()

  return <SignInScreen redirectTo={safeRedirect(search.redirect)} />
}
