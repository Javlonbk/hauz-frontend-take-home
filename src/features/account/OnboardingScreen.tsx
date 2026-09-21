import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { Field } from '#/components'
import { viewerQueryOptions } from '#/features/auth'
import { createPersonalAccount } from '#/server'
import {
  PERSONAL_ROLES,
  createPersonalAccountSchema,
  type PersonalRole,
  type Viewer,
} from '#/types'

import { ROLE_LABELS } from './roleLabels'

const ROLE_HINTS: Record<PersonalRole, string> = {
  property_owner: 'I list my own property',
  realtor: 'I list for clients',
}

export function OnboardingScreen({ redirectTo }: { redirectTo: string }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const createAccountMutation = useMutation({
    mutationFn: (form: FormData) =>
      createPersonalAccount({
        data: createPersonalAccountSchema.parse(Object.fromEntries(form)),
      }),
    onSuccess: async (account) => {
      const viewer: Viewer = { account }
      queryClient.setQueryData(viewerQueryOptions().queryKey, viewer)
      await navigate({ href: redirectTo })
    },
  })

  return (
    <main className="screen">
      <h1>Tell us about you</h1>
      <p className="lede">This is how people you deal with on HAUZ will see you.</p>
      <form
        className="basin"
        onSubmit={(e) => {
          e.preventDefault()
          createAccountMutation.mutate(new FormData(e.currentTarget))
        }}
      >
        <Field label="First name" name="firstName" maxLength={100} required autoFocus />
        <Field label="Last name" name="lastName" maxLength={100} required />
        <fieldset>
          <legend>Role</legend>
          {PERSONAL_ROLES.map((role) => (
            <Field
              key={role}
              label={ROLE_LABELS[role]}
              hint={ROLE_HINTS[role]}
              name="role"
              type="radio"
              value={role}
              required
            />
          ))}
        </fieldset>
        <button type="submit" disabled={createAccountMutation.isPending}>
          Continue
        </button>
        {createAccountMutation.error && (
          <p role="alert">{createAccountMutation.error.message}</p>
        )}
      </form>
    </main>
  )
}
