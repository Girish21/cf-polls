import * as z from 'zod'

export function validateName(name: FormDataEntryValue | string | null) {
  return z
    .string({
      required_error: 'User Name is required!',
      invalid_type_error: 'User Name should be a string',
    })
    .min(5, 'User Name should be at least 5 characters long')
    .max(20, 'User Name should be at most 20 characters long')
    .parse(name)
}
