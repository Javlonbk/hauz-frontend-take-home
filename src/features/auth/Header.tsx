import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'
import { Link, useNavigate } from '@tanstack/react-router'

import { viewerQueryOptions } from '#/features/auth/viewer'
import { logOut } from '#/server/auth'

export function Header() {
  const viewerQuery = useSuspenseQuery(viewerQueryOptions())
  const viewer = viewerQuery.data

  return (
    <header>
      <Link to="/">HAUZ</Link>{' '}
      {viewer ? (
        <>
          <span>{viewer.account?.firstName}</span> <LogOutButton />
        </>
      ) : (
        <Link to="/sign-in">Sign in</Link>
      )}
    </header>
  )
}

function LogOutButton() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const logOutMutation = useMutation({
    mutationFn: () => logOut(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: viewerQueryOptions().queryKey })
      await navigate({ to: '/' })
    },
  })

  return (
    <>
      <button
        type="button"
        disabled={logOutMutation.isPending}
        onClick={() => logOutMutation.mutate()}
      >
        Log out
      </button>
      {logOutMutation.error && <p role="alert">{logOutMutation.error.message}</p>}
    </>
  )
}
