import type { LinkProps } from '@remix-run/react'
import { Link as RemixLink } from '@remix-run/react'
import * as React from 'react'
import { clsx } from '~/utils'

export function P({ children }: { children: React.ReactNode }) {
  return <p className='text-gray-900 dark:text-slate-100'>{children}</p>
}

export function Link({ children, className, ...rest }: LinkProps) {
  return (
    <RemixLink
      {...rest}
      className={clsx(
        className,
        'underline hover:no-underline focus:outline-none focus-visible:rounded focus-visible:no-underline focus-visible:ring-1 focus-visible:ring-gray-700 dark:focus-visible:ring-slate-300',
      )}
    >
      {children}
    </RemixLink>
  )
}
