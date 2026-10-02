export const USER_PLANS = ['free', 'premium'] as const

export type UserPlan = (typeof USER_PLANS)[number]

export interface PlanLimits {
  readonly maxEndpoints: number
  readonly retentionDays: number
}

export const PLAN_LIMITS: Record<UserPlan, PlanLimits> = {
  free: { maxEndpoints: 3, retentionDays: 1 },
  premium: { maxEndpoints: 50, retentionDays: 30 },
}

export function getPlanLimits(plan: string | null | undefined): PlanLimits {
  return plan === 'premium' ? PLAN_LIMITS.premium : PLAN_LIMITS.free
}

/**
 * Maps a Polar subscription status to the user plan it grants, or null when
 * the status should not change the current plan (e.g. canceled but still
 * active until period end, past due, paused).
 */
export function resolvePlanFromSubscriptionStatus(status: string): UserPlan | null {
  if (status === 'active' || status === 'trialing') {
    return 'premium'
  }

  if (status === 'revoked' || status === 'expired') {
    return 'free'
  }

  return null
}
