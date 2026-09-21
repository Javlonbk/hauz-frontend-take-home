import { ExecutionMethod, Functions } from 'node-appwrite'

import type { PersonalAccount } from '#/types'

import { requireEnv, sessionClient } from './appwrite'

export class PersonalAccountError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'PersonalAccountError'
  }
}

function parseJson(text: string): { error?: string; message?: string } {
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

export async function callPersonalAccount(
  secret: string,
  method: ExecutionMethod,
  body?: object,
): Promise<PersonalAccount> {
  const functions = new Functions(sessionClient(secret))
  const execution = await functions.createExecution({
    functionId: requireEnv('APPWRITE_FUNCTION_ID'),
    xpath: '/personal-account',
    method,
    body: body && JSON.stringify(body),
  })

  const status = execution.responseStatusCode
  if (status >= 200 && status < 300) {
    return JSON.parse(execution.responseBody)
  }

  const failure = parseJson(execution.responseBody)
  throw new PersonalAccountError(
    status,
    failure.error ?? 'internal_error',
    failure.message ?? `Function execution ${execution.status}.`,
  )
}
