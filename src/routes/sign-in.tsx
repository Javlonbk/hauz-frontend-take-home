import { createFileRoute, redirect } from '@tanstack/react-router'
import { z } from 'zod'

import { SignInScreen } from '#/features/auth/SignInScreen'
import { safeRedirect } from '#/features/auth/redirect'

export const Route = createFileRoute('/sign-in')({
  validateSearch: z.object({ redirect: z.string().optional() }),
  beforeLoad: ({ context, search }) => {
    if (context.viewer) {
      throw redirect({ href: safeRedirect(search.redirect) })
    }
  },
  component: SignInPage,
})

function SignInPage() {
  const search = Route.useSearch()

  return <SignInScreen redirectTo={safeRedirect(search.redirect)} />
}
