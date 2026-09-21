import { useSuspenseQuery } from '@tanstack/react-query'
import { Link, createFileRoute } from '@tanstack/react-router'

import { viewerQueryOptions } from '#/features/auth'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const viewerQuery = useSuspenseQuery(viewerQueryOptions())

  return (
    <main className="screen">
      <h1>Homes across Uzbekistan</h1>
      <p className="lede">
        {viewerQuery.data ? (
          <Link to="/profile">Manage your profile</Link>
        ) : (
          <Link to="/sign-in">Sign in to list a property</Link>
        )}
      </p>
    </main>
  )
}
