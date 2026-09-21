import { createServerFn } from '@tanstack/react-start'
import { Account, AppwriteException, ExecutionMethod, ID } from 'node-appwrite'
import { z } from 'zod'

import {
  adminClient,
  clearSessionSecret,
  readSessionSecret,
  sessionClient,
  writeSessionSecret,
} from '#/server/appwrite'
import {
  PersonalAccountError,
  callPersonalAccount,
  type PersonalAccount,
} from '#/server/personal-account'

export type Viewer = { account: PersonalAccount | null } | null

async function loadAccount(secret: string) {
  try {
    return await callPersonalAccount(secret, ExecutionMethod.GET)
  } catch (error) {
    if (error instanceof PersonalAccountError && error.status === 404) {
      return null
    }
    throw error
  }
}

export const getViewer = createServerFn().handler(
  async (): Promise<Viewer> => {
    const secret = readSessionSecret()
    if (!secret) {
      return null
    }

    try {
      return { account: await loadAccount(secret) }
    } catch (error) {
      if (error instanceof AppwriteException && error.code === 401) {
        clearSessionSecret()
        return null
      }
      throw error
    }
  },
)

export const requestSignInCode = createServerFn({ method: 'POST' })
  .validator(z.object({ email: z.email() }))
  .handler(async ({ data }) => {
    const account = new Account(adminClient())
    const token = await account.createEmailToken({
      userId: ID.unique(),
      email: data.email,
    })
    return { userId: token.userId }
  })

export const verifySignInCode = createServerFn({ method: 'POST' })
  .validator(z.object({ userId: z.string().min(1), code: z.string().trim().min(1) }))
  .handler(async ({ data }) => {
    const account = new Account(adminClient())
    const session = await account.createSession({
      userId: data.userId,
      secret: data.code,
    })
    writeSessionSecret(session.secret, session.expire)
    return { hasAccount: (await loadAccount(session.secret)) !== null }
  })

export const logOut = createServerFn({ method: 'POST' }).handler(async () => {
  const secret = readSessionSecret()
  if (!secret) {
    return
  }

  try {
    await new Account(sessionClient(secret)).deleteSession({ sessionId: 'current' })
  } catch (error) {
    if (!(error instanceof AppwriteException && error.code === 401)) {
      throw error
    }
  }
  clearSessionSecret()
})
