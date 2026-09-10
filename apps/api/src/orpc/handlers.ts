import type { AnyRouter } from '@orpc/server'
import { SmartCoercionPlugin } from '@orpc/json-schema'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import {
  BodyLimitPlugin,
  CompressionPlugin,
  RPCHandler,
} from '@orpc/server/fetch'
import {
  RequestHeadersPlugin,
  ResponseHeadersPlugin,
} from '@orpc/server/plugins'
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4'
import { useLogger, withEvlog } from 'evlog/orpc'
import { createAppEnricher, enrichLogger, getAuthIdentifier } from '#/libs/evlog.js'

const maxBodySize = 1024 * 1024

export function createRpcHandler<R extends AnyRouter>(router: R) {
  const handler = new RPCHandler(router, {
    interceptors: [
      async (options) => {
        const logger = useLogger()
        await getAuthIdentifier()(
          logger,
          options.request.headers,
        )
        await enrichLogger(logger, options.request.headers)

        return options.next()
      },
    ],
    plugins: [
      new RequestHeadersPlugin(),
      new ResponseHeadersPlugin(),
      new BodyLimitPlugin({
        maxBodySize,
      }),
      new CompressionPlugin(),
    ],
  })

  return withEvlog(handler, {
    enrich: createAppEnricher(),
    redact: true,
  })
}

export function createOpenApiHandler<R extends AnyRouter>(router: R) {
  const zodConverter = new ZodToJsonSchemaConverter()

  const handler = new OpenAPIHandler(router, {
    interceptors: [
      async (options) => {
        const logger = useLogger()
        await getAuthIdentifier()(
          logger,
          options.request.headers,
        )
        await enrichLogger(logger, options.request.headers)

        return options.next()
      },
    ],
    plugins: [
      new RequestHeadersPlugin(),
      new ResponseHeadersPlugin(),
      new BodyLimitPlugin({
        maxBodySize,
      }),
      new CompressionPlugin(),
      new SmartCoercionPlugin({
        schemaConverters: [zodConverter],
      }),
      new OpenAPIReferencePlugin({
        docsProvider: 'scalar',
        docsTitle: 'Probe API Reference',
        docsPath: '/',
        specPath: '/spec.json',
        schemaConverters: [zodConverter],
        specGenerateOptions: {
          info: {
            title: 'Probe API',
            version: '1.0.0',
            description: 'Developer-focused webhook inspection and debugging platform API',
          },
        },
      }),
    ],
  })

  return withEvlog(handler, {
    enrich: createAppEnricher(),
    redact: true,
  })
}
