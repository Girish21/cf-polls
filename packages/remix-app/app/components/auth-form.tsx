import { Form, useActionData } from '@remix-run/react'
import { clsx } from '~/utils'

export function AuthForm() {
  let actionData = useActionData<{ error: string } | undefined>()

  let error = actionData && actionData.error

  return (
    <Form method='post'>
      <fieldset className='flex w-[min(30ch,100vw-2rem)] flex-col gap-1'>
        <label
          htmlFor='user-name'
          className='block text-lg text-gray-900 dark:text-slate-100'
        >
          User Name
        </label>
        <input
          id='user-name'
          name='userName'
          className={clsx(
            'w-full border-b-2 border-b-gray-900 bg-transparent p-2 pl-0 text-lg text-gray-900 focus:outline-none focus-visible:border-b-blue-500 dark:border-b-slate-100 dark:text-slate-100',
            error && 'border-b-red-500',
          )}
          autoComplete='off'
          required
          {...(error && { 'aria-describedby': 'user-name-error' })}
        />
        {error && (
          <p
            className='bg-red-400 p-2 text-base font-bold text-gray-900 ring-2 ring-red-700 ring-offset-2 ring-offset-transparent'
            id='user-name-error'
          >
            {error}
          </p>
        )}
      </fieldset>
    </Form>
  )
}
