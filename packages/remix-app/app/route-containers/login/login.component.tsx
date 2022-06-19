import { AuthForm, Link, P } from '~/components'

export default function Login() {
  return (
    <>
      <AuthForm />
      <P>
        Don't have an account?{' '}
        <Link prefetch='intent' to='/signup'>
          Signup
        </Link>
      </P>
    </>
  )
}
