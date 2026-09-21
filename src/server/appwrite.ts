import { deleteCookie, getCookie, setCookie } from '@tanstack/react-start/server'
import { Client } from 'node-appwrite'

const SESSION_COOKIE = 'hauz_session'

const cookieOptions = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
} as const

function requireEnv(name: string) {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing environment variable ${name}`)
  }
  return value
}

function baseClient() {
  return new Client()
    .setEndpoint(requireEnv('APPWRITE_ENDPOINT'))
    .setProject(requireEnv('APPWRITE_PROJECT_ID'))
}

export function adminClient() {
  return baseClient().setKey(requireEnv('APPWRITE_API_KEY'))
}

export function sessionClient(secret: string) {
  return baseClient().setSession(secret)
}

export function readSessionSecret() {
  return getCookie(SESSION_COOKIE) ?? null
}

export function writeSessionSecret(secret: string, expiresAt: string) {
  setCookie(SESSION_COOKIE, secret, {
    ...cookieOptions,
    expires: new Date(expiresAt),
  })
}

export function clearSessionSecret() {
  deleteCookie(SESSION_COOKIE, cookieOptions)
}
