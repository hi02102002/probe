import type { AnyRouter } from '@orpc/server'
import {
  BodyLimitPlugin,
  CompressionPlugin,
  RPCHandler,
} from '@orpc/server/fetch'
import {
  RequestHeadersPlugin,
  ResponseHeadersPlugin,
} from '@orpc/server/plugins'
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
    keep(ctx) {
      const user = ctx.context?.user as { isPremium?: boolean, plan?: string } | undefined
      if (user?.isPremium || user?.plan === 'enterprise') {
        ctx.shouldKeep = true
      }
    },
  })
}
