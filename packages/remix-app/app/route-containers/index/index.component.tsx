import { Link } from '@remix-run/react'

export default function Index() {
  return (
    <section className='grid flex-1 place-content-center'>
      <Link
        to='create'
        className='rounded bg-gradient-to-r from-orange-600 to-pink-600 p-3 text-xl text-white shadow-lg shadow-slate-300 transition-shadow duration-150 ease-out hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 dark:text-slate-100 dark:shadow-gray-900 dark:focus-visible:ring-slate-100'
      >
        Create Poll
      </Link>
    </section>
  )
}
