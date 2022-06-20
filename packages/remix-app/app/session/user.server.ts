import type { Session } from '@remix-run/cloudflare'
import { createCookieSessionStorage, redirect } from '@remix-run/cloudflare'

function getUserSessionCookie(env: Env) {
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

export async function getUserSession(
  cookieOrRequest: Request | string | null,
  env: Env,
) {
  let sessionCookie = getUserSessionCookie(env)
  let cookie =
    typeof cookieOrRequest === 'string'
      ? cookieOrRequest
      : cookieOrRequest?.headers?.get('cookie')

  return await sessionCookie.getSession(cookie)
}

export async function commitUserSession(session: Session, env: Env) {
  let sessionCookie = getUserSessionCookie(env)
  return await sessionCookie.commitSession(session)
}

export async function destroyUserSession(session: Session, env: Env) {
  let sessionCookie = getUserSessionCookie(env)
  return await sessionCookie.destroySession(session)
}

export async function getUser(
  request: Request,
  env: Env,
): Promise<[Session, KVUserData | null]> {
  let session = await getUserSession(request, env)
  let userName = session.get('userName')

  if (!userName) {
    return [session, null]
  }

  let user = await env.USER.get(userName)
  if (!user) {
    return [session, null]
  }

  let userData = JSON.parse(user) as KVUserData

  return [session, userData]
}

export async function getUserOrRedirect(request: Request, env: Env) {
  let [session, userData] = await getUser(request, env)

  if (!userData) {
    throw redirect('/login', {
      headers: { 'Set-Cookie': await destroyUserSession(session, env) },
    })
  }

  return userData
}

export async function getUserSessionOrRedirect(request: Request, env: Env) {
  let session = await getUserSession(request, env)
  let userName = session.get('userName')

  if (userName) {
    throw redirect('/')
  }

  return session
}
