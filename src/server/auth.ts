import { createServerFn } from '@tanstack/react-start'
import { AppwriteException, ExecutionMethod } from 'node-appwrite'

import { clearSessionSecret, readSessionSecret } from '#/server/appwrite'
import {
  PersonalAccountError,
  callPersonalAccount,
  type PersonalAccount,
} from '#/server/personal-account'

export type Viewer = { account: PersonalAccount | null } | null

export const getViewer = createServerFn().handler(
  async (): Promise<Viewer> => {
    const secret = readSessionSecret()
    if (!secret) {
      return null
    }

    try {
      return { account: await callPersonalAccount(secret, ExecutionMethod.GET) }
    } catch (error) {
      if (error instanceof PersonalAccountError && error.status === 404) {
        return { account: null }
      }
      if (error instanceof AppwriteException && error.code === 401) {
        clearSessionSecret()
        return null
      }
      throw error
    }
  },
)
