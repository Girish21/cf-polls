import React from 'react'
import { clsx } from '~/utils'

export function AuthPageTitle({
  className,
  ...rest
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={clsx(
        className,
        'text-center text-2xl font-bold text-gray-900 dark:text-slate-100 md:text-4xl',
      )}
      {...rest}
    />
  )
}
