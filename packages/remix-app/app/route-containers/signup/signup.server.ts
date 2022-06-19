import type { ActionFunction } from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'

export let action: ActionFunction = async () => {
  return json(null)
}
