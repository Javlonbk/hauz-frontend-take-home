import { useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

import { viewerQueryOptions } from '#/features/auth/viewer'

export function Header() {
  const viewerQuery = useSuspenseQuery(viewerQueryOptions())
  const viewer = viewerQuery.data

  return (
    <header>
      <Link to="/">HAUZ</Link>{' '}
      {viewer ? (
        <span>{viewer.account?.firstName}</span>
      ) : (
        <a href="/sign-in">Sign in</a>
      )}
    </header>
  )
}
