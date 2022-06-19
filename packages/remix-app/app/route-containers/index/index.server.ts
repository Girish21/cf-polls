import type { LoaderFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import { getUserOrRedirect } from '~/session/user.server'

export const loader: LoaderFunction = async ({ context, request }) => {
  await getUserOrRedirect(request, context.env)

  return json(null)
}
