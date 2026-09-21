import { createServerFn } from '@tanstack/react-start'
import { ExecutionMethod } from 'node-appwrite'

import { createPersonalAccountSchema } from '#/types'

import { requireSessionSecret } from './appwrite'
import { callPersonalAccount } from './personal-account'

export const createPersonalAccount = createServerFn({ method: 'POST' })
  .validator(createPersonalAccountSchema)
  .handler(({ data }) =>
    callPersonalAccount(requireSessionSecret(), ExecutionMethod.POST, data),
  )
