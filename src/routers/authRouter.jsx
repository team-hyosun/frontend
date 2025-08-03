import { lazy, Suspense } from 'react'

const loading = <div>loading...</div>

const LoginPage = lazy(() => import('@/pages/Auth/Login'))
const SignupPage = lazy(() => import('@/pages/Auth/Signup'))

const authRouter = [
  {
    path: 'login',
    element: (
      <Suspense fallback={loading}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: 'signup',
    element: (
      <Suspense fallback={loading}>
        <SignupPage />
      </Suspense>
    ),
  },
]

export default authRouter
