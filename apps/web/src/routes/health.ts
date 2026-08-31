import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/health')({
  server: {
    handlers: {
      GET: () => {
        return Response.json({
          service: 'probe-web',
          status: 'ok',
        })
      },
    },
  },
})
