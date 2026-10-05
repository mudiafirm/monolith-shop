import { Navigate, Outlet } from 'react-router-dom'

function decodeToken(token) {
  try {
    const payload = token.split('.')[1]

    if (!payload) {
      return null
    }

    return JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    )
  } catch (error) {
    console.error('Token decode error:', error)
    return null
  }
}

function ProtectedAdminRoute() {
  const token = localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  const payload = decodeToken(token)

  if (!payload) {
    localStorage.removeItem('token')
    return <Navigate to="/login" replace />
  }

  if (payload.exp && payload.exp * 1000 < Date.now()) {
    localStorage.removeItem('token')
    return <Navigate to="/login" replace />
  }

  if (payload.role !== 'admin') {
    return <Navigate to="/account" replace />
  }

  return <Outlet />
}

export default ProtectedAdminRoute
