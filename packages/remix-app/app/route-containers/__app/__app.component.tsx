import { Outlet } from '@remix-run/react'

export default function AppLayout() {
  return (
    <main className='flex h-full flex-col'>
      <Outlet />
    </main>
  )
}
