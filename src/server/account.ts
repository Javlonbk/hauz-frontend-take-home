import { createServerFn } from '@tanstack/react-start'
import { ExecutionMethod } from 'node-appwrite'

import { createPersonalAccountSchema, updatePersonalAccountSchema } from '#/types'

import { requireSessionSecret } from './appwrite'
import { callPersonalAccount } from './personal-account'

export const createPersonalAccount = createServerFn({ method: 'POST' })
  .validator(createPersonalAccountSchema)
  .handler(({ data }) =>
    callPersonalAccount(requireSessionSecret(), ExecutionMethod.POST, data),
  )

export const updatePersonalAccount = createServerFn({ method: 'POST' })
  .validator(updatePersonalAccountSchema)
  .handler(({ data }) =>
    callPersonalAccount(requireSessionSecret(), ExecutionMethod.PATCH, data),
  )
