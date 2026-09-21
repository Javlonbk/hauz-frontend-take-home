import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

import { Field } from '#/components'
import { requestSignInCode, verifySignInCode } from '#/server'

import { viewerQueryOptions } from './viewer'

export function SignInScreen({ redirectTo }: { redirectTo: string }) {
  const [pending, setPending] = useState<{ userId: string; email: string } | null>(null)
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
    <main className="screen">
      <h1>Sign in</h1>
      <p className="lede">
        {pending
          ? `We sent a code to ${pending.email}.`
          : 'One code by email. No password to remember.'}
      </p>
      {pending ? (
        <CodeStep userId={pending.userId} onSignedIn={handleSignedIn} />
      ) : (
        <EmailStep onCodeSent={(userId, email) => setPending({ userId, email })} />
      )}
    </main>
  )
}

function EmailStep({
  onCodeSent,
}: {
  onCodeSent: (userId: string, email: string) => void
}) {
  const requestCodeMutation = useMutation({
    mutationFn: (email: string) => requestSignInCode({ data: { email } }),
    onSuccess: ({ userId }, email) => onCodeSent(userId, email),
  })

  return (
    <form
      className="basin"
      onSubmit={(e) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        requestCodeMutation.mutate(String(form.get('email')))
      }}
    >
      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="name@example.com"
        required
        autoFocus
      />
      <button type="submit" disabled={requestCodeMutation.isPending}>
        Email me a code
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
      className="basin"
      onSubmit={(e) => {
        e.preventDefault()
        const form = new FormData(e.currentTarget)
        verifyCodeMutation.mutate(String(form.get('code')))
      }}
    >
      <Field
        label="Code"
        name="code"
        className="code-input"
        inputMode="numeric"
        autoComplete="one-time-code"
        placeholder="000000"
        maxLength={6}
        pattern="[0-9]{6}"
        title="The 6-digit code from the email"
        required
        autoFocus
      />
      <button type="submit" disabled={verifyCodeMutation.isPending}>
        Sign in
      </button>
      {verifyCodeMutation.error && (
        <p role="alert">{verifyCodeMutation.error.message}</p>
      )}
    </form>
  )
}
