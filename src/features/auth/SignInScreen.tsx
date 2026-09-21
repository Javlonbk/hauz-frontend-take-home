import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { Field } from '#/components/Field'
import { viewerQueryOptions } from '#/features/auth/viewer'
import { requestSignInCode, verifySignInCode } from '#/server/auth'

export function SignInScreen({ redirectTo }: { redirectTo: string }) {
  const [userId, setUserId] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  async function handleSignedIn(hasAccount: boolean) {
    await queryClient.invalidateQueries({ queryKey: viewerQueryOptions().queryKey })
    await navigate({
      href: hasAccount
        ? redirectTo
        : `/onboarding?redirect=${encodeURIComponent(redirectTo)}`,
    })
  }

  return (
    <main>
      <h1>Sign in</h1>
      {userId ? (
        <CodeStep userId={userId} onSignedIn={handleSignedIn} />
      ) : (
        <EmailStep onCodeSent={setUserId} />
      )}
    </main>
  )
}

function EmailStep({ onCodeSent }: { onCodeSent: (userId: string) => void }) {
  const requestCodeMutation = useMutation({
    mutationFn: (email: string) => requestSignInCode({ data: { email } }),
    onSuccess: ({ userId }) => onCodeSent(userId),
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        requestCodeMutation.mutate(String(form.get('email')))
      }}
    >
      <Field label="Email" name="email" type="email" required autoFocus />
      <button type="submit" disabled={requestCodeMutation.isPending}>
        Send code
      </button>
      {requestCodeMutation.error && (
        <p role="alert">{requestCodeMutation.error.message}</p>
      )}
    </form>
  )
}

function CodeStep({
  userId,
  onSignedIn,
}: {
  userId: string
  onSignedIn: (hasAccount: boolean) => Promise<void>
}) {
  const verifyCodeMutation = useMutation({
    mutationFn: (code: string) => verifySignInCode({ data: { userId, code } }),
    onSuccess: ({ hasAccount }) => onSignedIn(hasAccount),
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        verifyCodeMutation.mutate(String(form.get('code')))
      }}
    >
      <p>Enter the code we emailed you.</p>
      <Field
        label="Code"
        name="code"
        inputMode="numeric"
        autoComplete="one-time-code"
        required
        autoFocus
      />
      <button type="submit" disabled={verifyCodeMutation.isPending}>
        Continue
      </button>
      {verifyCodeMutation.error && (
        <p role="alert">{verifyCodeMutation.error.message}</p>
      )}
    </form>
  )
}
