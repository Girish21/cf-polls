import { Form, useActionData, useSearchParams } from '@remix-run/react'
import * as React from 'react'
import { clsx } from '~/utils'

export function AuthForm() {
  let [searchparams] = useSearchParams()
  let actionData = useActionData<{ error: string } | undefined>()
  let inputRef = React.useRef<HTMLInputElement>(null)

  let error = actionData && actionData.error
  let defaultUserName = searchparams.get('userName') || ''

  React.useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <Form method='post'>
      <fieldset className='flex w-[min(45ch,100vw-2rem)] flex-col gap-1'>
        <label
          htmlFor='user-name'
          className='block text-lg text-gray-900 dark:text-slate-100'
        >
          User Name
        </label>
        <input
          ref={inputRef}
          id='user-name'
          name='userName'
          className={clsx(
            'w-full border-b-2 border-b-gray-900 bg-transparent pb-2 pr-2 text-lg text-gray-900 focus:outline-none focus-visible:border-b-blue-500 dark:border-b-slate-100 dark:text-slate-100',
            error && 'border-b-red-500',
          )}
          autoComplete='off'
          defaultValue={defaultUserName}
          required
          {...(error && { 'aria-describedby': 'user-name-error' })}
        />
        {error && (
          <p
            className='rounded bg-red-400 p-2 text-base font-bold text-gray-900 ring-2 ring-red-500 ring-offset-2 ring-offset-transparent dark:ring-red-700'
            id='user-name-error'
          >
            {error}
          </p>
        )}
      </fieldset>
    </Form>
  )
}
