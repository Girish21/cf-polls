import type { Session } from '@remix-run/cloudflare'
import { createCookieSessionStorage, redirect } from '@remix-run/cloudflare'

function getSessionCookie(env: Env) {
  if (!env.SESSION_SECRET) {
    throw new Error('SESSION_SECRET is not set')
  }

  return createCookieSessionStorage({
    cookie: {
      name: '__user',
      sameSite: 'lax',
      secure: true,
      path: '/',
      httpOnly: true,
      secrets: [env.SESSION_SECRET],
    },
  })
}

export async function getSession(
  cookieOrRequest: Request | string | null,
  env: Env,
) {
  let sessionCookie = getSessionCookie(env)
  let cookie =
    typeof cookieOrRequest === 'string'
      ? cookieOrRequest
      : cookieOrRequest?.headers?.get('cookie')

  return await sessionCookie.getSession(cookie)
}

export async function commitSession(session: Session, env: Env) {
  let sessionCookie = getSessionCookie(env)
  return await sessionCookie.commitSession(session)
}

export async function getUser(request: Request, env: Env) {
  let session = await getSession(request, env)
  let userName = session.get('userName')

  if (!userName) {
    return null
  }

  let user = await env.USER.get(userName)
  if (!user) {
    return null
  }

  let userData = JSON.parse(user) as { name: string }

  return userData
}

export async function getUserOrRedirect(request: Request, env: Env) {
  let userData = await getUser(request, env)

  if (!userData) {
    throw redirect('/login')
  }

  return userData
}

export async function getUserSessionIfNotExist(request: Request, env: Env) {
  let session = await getSession(request, env)
  let userName = session.get('userName')

  if (userName) {
    throw redirect('/')
  }

  return session
}
