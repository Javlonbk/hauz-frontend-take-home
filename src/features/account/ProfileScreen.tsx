import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Field } from '#/components'
import { viewerQueryOptions } from '#/features/auth'
import { updatePersonalAccount } from '#/server'
import { updatePersonalAccountSchema, type PersonalAccount, type Viewer } from '#/types'

import { ROLE_LABELS } from './roleLabels'

const optional = (value: FormDataEntryValue | null) => String(value).trim() || null

export function ProfileScreen({ account }: { account: PersonalAccount }) {
  const queryClient = useQueryClient()
  
  const updateAccountMutation = useMutation({
    mutationFn: (form: FormData) =>
      updatePersonalAccount({
        data: updatePersonalAccountSchema.parse({
          firstName: form.get('firstName'),
          lastName: form.get('lastName'),
          contactEmail: optional(form.get('contactEmail')),
          bio: optional(form.get('bio')),
        }),
      }),
    onSuccess: (updated) => {
      const viewer: Viewer = { account: updated }
      queryClient.setQueryData(viewerQueryOptions().queryKey, viewer)
    },
  })

  return (
    <main className="screen">
      <h1>Profile</h1>
      <p className="lede">{ROLE_LABELS[account.role]} · can't be changed</p>
      <form
        className="basin"
        key={account.updatedAt}
        onSubmit={(e) => {
          e.preventDefault()
          updateAccountMutation.mutate(new FormData(e.currentTarget))
        }}
      >
        <Field
          label="First name"
          name="firstName"
          defaultValue={account.firstName}
          maxLength={100}
          required
        />
        <Field
          label="Last name"
          name="lastName"
          defaultValue={account.lastName}
          maxLength={100}
          required
        />
        <Field
          label="Contact email"
          name="contactEmail"
          type="email"
          defaultValue={account.contactEmail ?? ''}
          placeholder="name@example.com"
          maxLength={254}
          hint="Shown to people who contact you. Leave empty to remove it."
        />
        <div className="field">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            defaultValue={account.bio ?? ''}
            maxLength={2000}
            placeholder="A few lines about you and the properties you work with"
          />
        </div>
        <button type="submit" disabled={updateAccountMutation.isPending}>
          Save changes
        </button>
        {updateAccountMutation.isSuccess && <p className="notice">Saved</p>}
        {updateAccountMutation.error && (
          <p role="alert">{updateAccountMutation.error.message}</p>
        )}
      </form>
    </main>
  )
}
