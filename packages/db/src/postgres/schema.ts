import { createId } from '@repo/utils'
import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

export const session = pgTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  table => [index('session_user_id_idx').on(table.userId)],
)

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    issuer: text('issuer').notNull(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
    scope: text('scope'),
    password: text('password'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [
    uniqueIndex('account_issuer_accountId_uidx').on(table.issuer, table.accountId),
    index('account_user_id_idx').on(table.userId),
  ],
)

export const verification = pgTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [index('verification_identifier_idx').on(table.identifier)],
)

export const endpoint = pgTable(
  'endpoints',
  {
    id: text('id').primaryKey().$defaultFn(() => createId('ep')),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    token: text('token').notNull().unique(),
    status: text('status').notNull().default('active').$type<'active' | 'inactive' | 'paused'>(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    lastRequestAt: timestamp('last_request_at', { withTimezone: true }),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
)

export const webhook_request = pgTable(
  'webhook_requests',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId('wr')),
    endpointId: text('endpoint_id')
      .notNull()
      .references(() => endpoint.id, { onDelete: 'cascade' }),
    method: text('method')
      .$type<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>()
      .notNull(),
    url: text('url').notNull(),
    reqHeaders: jsonb('req_headers').notNull(),
    reqBody: jsonb('req_body'),
    resHeaders: jsonb('res_headers'),
    resBody: jsonb('res_body'),
    statusCode: text('status_code'),
    ip: text('ip'),
    size: text('size'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [
    index('webhook_request_endpoint_created_at_id_idx').on(
      table.endpointId,
      table.createdAt,
      table.id,
    ),
  ],
)

export const endpoint_rule = pgTable(
  'endpoint_rules',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId('er')),
    endpointId: text('endpoint_id')
      .notNull()
      .unique()
      .references(() => endpoint.id, { onDelete: 'cascade' }),
    customResponseEnabled: boolean('custom_response_enabled').notNull().default(false),
    customStatusCode: integer('custom_status_code'),
    customContentType: text('custom_content_type'),
    customResponseBody: text('custom_response_body'),
    delayEnabled: boolean('delay_enabled').notNull().default(false),
    delayMs: integer('delay_ms'),
    signatureEnabled: boolean('signature_enabled').notNull().default(false),
    signatureHeaderName: text('signature_header_name'),
    signatureSecret: text('signature_secret'),
    forwardEnabled: boolean('forward_enabled').notNull().default(false),
    forwardTargetUrl: text('forward_target_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
)

export const replay_log = pgTable(
  'replay_logs',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId('rp')),
    endpointId: text('endpoint_id')
      .notNull()
      .references(() => endpoint.id, { onDelete: 'cascade' }),
    originalRequestId: text('original_request_id'),
    method: text('method')
      .$type<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>()
      .notNull(),
    targetUrl: text('target_url').notNull(),
    reqBody: jsonb('req_body'),
    statusCode: integer('status_code'),
    resBody: jsonb('res_body'),
    durationMs: integer('duration_ms'),
    success: boolean('success').notNull().default(false),
    error: text('error'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [
    index('replay_log_endpoint_created_at_id_idx').on(
      table.endpointId,
      table.createdAt,
      table.id,
    ),
  ],
)

export const forward_log = pgTable(
  'forward_logs',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId('fl')),
    endpointId: text('endpoint_id')
      .notNull()
      .references(() => endpoint.id, { onDelete: 'cascade' }),
    method: text('method')
      .$type<'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'>()
      .notNull(),
    targetUrl: text('target_url').notNull(),
    reqBody: jsonb('req_body'),
    statusCode: integer('status_code'),
    durationMs: integer('duration_ms'),
    success: boolean('success').notNull().default(false),
    error: text('error'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  table => [
    index('forward_log_endpoint_created_at_id_idx').on(
      table.endpointId,
      table.createdAt,
      table.id,
    ),
  ],
)
