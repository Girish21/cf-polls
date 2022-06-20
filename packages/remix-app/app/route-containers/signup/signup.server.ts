import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json, redirect } from '@remix-run/cloudflare'
import * as z from 'zod'
import {
  commitUserSession,
  getUserSession,
  getUserSessionOrRedirect,
} from '~/session/user.server'
import { validateName } from '~/utils'

export let action: ActionFunction = async ({ context, request }) => {
  let [session, formData] = await Promise.all([
    getUserSession(request, context.env),
    request.formData(),
  ])

  let name: string | null
  try {
    name = validateName(formData.get('userName'))
  } catch (e) {
    if (e instanceof z.ZodError) {
      return json<AuthActionData>({ error: e.issues.at(0)?.message })
    }
    return json<AuthActionData>({ error: 'Unknown error' })
  }

  let kvUser = await context.env.USER.get(name)

  if (kvUser) {
    throw redirect(
      `/login?${new URLSearchParams([
        ['userName', name],
        ['error', 'User already exist'],
      ])}`,
    )
  }

  await context.env.USER.put(name, JSON.stringify({ name, polls: [] }))
  session.set('userName', name)

  throw redirect('/', {
    headers: { 'Set-Cookie': await commitUserSession(session, context.env) },
  })
}

export let loader: LoaderFunction = async ({ context, request }) => {
  await getUserSessionOrRedirect(request, context.env)

  return json(null)
}
