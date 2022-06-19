import { Outlet } from '@remix-run/react'

export default function AuthLayout() {
  return (
    <main className='grid h-full place-content-center'>
      <section className='flex flex-col gap-4 rounded-2xl p-6 shadow-lg shadow-slate-300 dark:shadow-lg dark:shadow-gray-900'>
        <Outlet />
      </section>
    </main>
  )
}
