import { z } from 'zod'

export const PERSONAL_ROLES = ['property_owner', 'realtor'] as const

export const createPersonalAccountSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  role: z.enum(PERSONAL_ROLES),
})

export type PersonalRole = z.infer<typeof createPersonalAccountSchema>['role']

export interface PersonalAccount {
  personalAccountId: string
  firstName: string
  lastName: string
  role: PersonalRole
  contactEmail: string | null
  bio: string | null
  createdAt: string
  updatedAt: string
}
