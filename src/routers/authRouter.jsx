import { lazy } from 'react'

const LoginPage = lazy(() => import('@/pages/Auth/Login'))
const SignupPage = lazy(() => import('@/pages/Auth/Signup'))

const authRouter = [
  {
    path: 'login',
    element: <LoginPage />,
  },
  {
    path: 'signup',
    element: <SignupPage />,
  },
]

export default authRouter
