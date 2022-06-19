import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/cloudflare'
import { json } from '@remix-run/cloudflare'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  // useLoaderData,
} from '@remix-run/react'
import styles from '~/styles/app.css'
import { getUser } from './session/user.server'

export let meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Polls',
  viewport: 'width=device-width,initial-scale=1',
  'color-scheme': 'dark light',
})

export let links: LinksFunction = () => [{ rel: 'stylesheet', href: styles }]

export let loader: LoaderFunction = async ({ request, context }) => {
  let userData = await getUser(request, context.env)

  if (!userData) {
    return json(null)
  }

  return json<LoaderData>({ userName: userData.name })
}

export default function App() {
  // let loaderData = useLoaderData<LoaderData>()

  return (
    <html lang='en' className='h-full dark:bg-slate-800'>
      <head>
        <Meta />
        <Links />
      </head>
      <body className='h-full'>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}

type LoaderData = {
  userName: string
} | null
