import { AuthForm, Link, P } from '~/components'

export default function Signup() {
  return (
    <>
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
