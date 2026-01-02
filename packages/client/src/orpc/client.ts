import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { RouterClient } from '@orpc/server'
import type { AppRouter } from '../../../server/src/routes'

export function serverClient() {
  const serviceUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000'

  try {
    const link = new RPCLink({
      url: `${serviceUrl}/api`,
      headers: () => {
        const h = new Headers()
        return h
      },
    })

    return createORPCClient(link) as RouterClient<AppRouter>
  } catch (error) {
    console.error(`[Client] Error creating server client: ${error}`)
    throw error
  }
}
