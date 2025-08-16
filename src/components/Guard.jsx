import { Navigate } from 'react-router-dom'

export const Guard = ({ children, condition, redirectTo, replace = true }) => {
  if (!condition) {
    return <Navigate to={redirectTo} replace={replace} />
  }

  return children
}
