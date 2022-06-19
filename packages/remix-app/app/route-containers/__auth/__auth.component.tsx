import { Outlet } from '@remix-run/react'

export default function AuthLayout() {
  return (
    <main className='grid h-full place-content-center'>
      <section className='flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-lg shadow-slate-300 dark:bg-transparent dark:shadow-gray-900'>
        <Outlet />
      </section>
    </main>
  )
}
