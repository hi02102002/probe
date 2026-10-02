import type { PolarOptions } from '@polar-sh/better-auth'
import type { PostgresDatabase } from '@repo/db'
import type { UserPlan } from '@repo/utils'
import type { BetterAuthPlugin } from 'better-auth'
import { checkout, polar, portal, webhooks } from '@polar-sh/better-auth'
import { createPolarCore } from '@polar-sh/sdk/2026-10'
import * as schema from '@repo/db/schema'
import { resolvePlanFromSubscriptionStatus } from '@repo/utils'
import { eq } from 'drizzle-orm'

export interface PolarPluginOptions {
  readonly accessToken: string
  readonly premiumProductId?: string
  readonly server: 'sandbox' | 'production'
  readonly webhookSecret?: string
}

interface SubscriptionPayload {
  readonly data: {
    readonly status: string
    readonly customer: {
      readonly external_id?: string | null
    }
  }
}

/**
 * Builds the Polar billing plugin: creates a customer for every new user,
 * exposes the hosted checkout + customer portal, and syncs subscription
 * status changes back onto the user's plan column.
 */
export function createPolarPlugin(database: PostgresDatabase, options: PolarPluginOptions): BetterAuthPlugin {
  const client = createPolarCore({
    accessToken: options.accessToken,
    environment: options.server,
  })

  const syncPlan = async (externalId: string | null | undefined, plan: UserPlan | null): Promise<void> => {
    if (!plan || !externalId) {
      return
    }

    await database
      .update(schema.user)
      .set({ plan })
      .where(eq(schema.user.id, externalId))
  }

  const syncPlanFromSubscription = async (payload: SubscriptionPayload): Promise<void> => {
    await syncPlan(payload.data.customer?.external_id, resolvePlanFromSubscriptionStatus(payload.data.status))
  }

  const plugins: PolarOptions['use'] = [portal()]

  if (options.premiumProductId) {
    plugins.push(checkout({
      authenticatedUsersOnly: true,
      products: [{ productId: options.premiumProductId, slug: 'pro' }],
      successUrl: '/dashboard/billing?checkout=success',
    }))
  }

  if (options.webhookSecret) {
    plugins.push(webhooks({
      secret: options.webhookSecret,
      onSubscriptionActive: syncPlanFromSubscription,
      onSubscriptionCycled: syncPlanFromSubscription,
      onSubscriptionResumed: syncPlanFromSubscription,
      onSubscriptionUpdated: syncPlanFromSubscription,
      onSubscriptionRevoked: async (payload: { data: { customer: { external_id?: string | null } } }) => {
        await syncPlan(payload.data.customer?.external_id, resolvePlanFromSubscriptionStatus('revoked'))
      },
    }))
  }

  return polar({
    client,
    createCustomerOnSignUp: true,
    use: plugins,
  })
}
