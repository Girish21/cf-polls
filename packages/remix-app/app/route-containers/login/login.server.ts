import type { ActionFunction, LoaderFunction } from '@remix-run/cloudflare'
import { json, redirect } from '@remix-run/cloudflare'
import * as z from 'zod'
import {
  commitSession,
  getSession,
  getUserSessionIfNotExist,
} from '~/session/user.server'
import { validateName } from '~/utils'

export let action: ActionFunction = async ({ context, request }) => {
  let [session, formData] = await Promise.all([
    getSession(request, context.env),
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

  if (!kvUser) {
    throw redirect(
      `/signup?${new URLSearchParams([
        ['userName', name],
        ['error', 'User not found'],
      ])}`,
    )
  }

  session.set('userName', name)

  return redirect('/', {
    headers: { 'Set-Cookie': await commitSession(session, context.env) },
  })
}

export let loader: LoaderFunction = async ({ context, request }) => {
  await getUserSessionIfNotExist(request, context.env)

  return json(null)
}
