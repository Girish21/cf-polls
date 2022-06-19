import { AuthForm, AuthPageTitle, Link, P } from '~/components'

export default function Login() {
  return (
    <>
      <AuthPageTitle>Login</AuthPageTitle>
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
