import React from 'react'
import { clsx, useForwardedRef } from '~/utils'

export const ContentEditable = React.forwardRef<HTMLDivElement, Props>(
  function Editable(
    {
      autoFocus,
      className,
      contentEditable = true,
      inputProps = {},
      onBlur,
      onContentChange,
      onDelete,
      onEnter,
      onFocus,
      onKeyDown,
      size = 'md',
      ...rest
    },
    ref,
  ) {
    let [content, setContent] = React.useState('')
    let forwardedRef = useForwardedRef(ref)

    React.useEffect(() => {
      if (autoFocus && forwardedRef.current) {
        forwardedRef.current.focus()
      }
    }, [autoFocus, forwardedRef])

    return (
      <>
        <div
          ref={forwardedRef}
          {...rest}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              e.stopPropagation()
              e.currentTarget.blur()

              onEnter?.(e)
            }
            if (e.key === 'Escape') {
              e.currentTarget.blur()
            }
            if (e.key === 'Backspace') {
              let value = e.currentTarget.innerText.trim()
              if (value === '') {
                e.preventDefault()
                onDelete?.(e)
              }
            }
            onKeyDown?.(e)
          }}
          onBlur={e => {
            let value = e.currentTarget.innerText.trim()

            setContent(value)

            onContentChange?.(value)
            onBlur?.(e)
          }}
          onFocus={e => {
            caretToEnd(e.currentTarget)
            onFocus?.(e)
          }}
          contentEditable={contentEditable}
          className={clsx(
            className,
            'bg-transparent text-gray-900 caret-gray-900 before:pointer-events-none before:block before:text-gray-400 before:transition-colors before:duration-300 before:ease-out before:empty:content-[attr(placeholder)] focus:outline-none focus-visible:before:text-gray-600 dark:text-slate-100 dark:caret-slate-400 dark:before:text-slate-700 dark:before:focus-visible:text-slate-500',
            size === 'sm' && 'text-lg',
            size === 'md' && 'text-2xl',
            size === 'lg' && 'text-4xl',
          )}
        />
        <input type='hidden' value={content} {...inputProps} />
      </>
    )
  },
)

function caretToEnd(el: HTMLDivElement) {
  let range = document.createRange()
  range.selectNodeContents(el)
  range.collapse(false)
  let sel = window.getSelection()
  if (sel) {
    sel.removeAllRanges()
    sel.addRange(range)
  }
}

type Props<TElement extends HTMLElement = HTMLDivElement> = {
  autoFocus?: boolean
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  onContentChange?: (content: string) => void
  onDelete?: (e: React.KeyboardEvent<TElement>) => void
  onEnter?: (e: React.KeyboardEvent<TElement>) => void
  size?: 'sm' | 'md' | 'lg'
} & React.PropsWithChildren<
  React.DetailedHTMLProps<React.HTMLAttributes<TElement>, TElement>
>
