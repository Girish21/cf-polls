import { AuthForm, AuthPageTitle, Link, P } from '~/components'

export default function Signup() {
  return (
    <>
      <AuthPageTitle>Signup</AuthPageTitle>
      <AuthForm />
      <P>
        Already have an account?{' '}
        <Link prefetch='intent' to='/login'>
          Login
        </Link>
      </P>
    </>
  )
}
