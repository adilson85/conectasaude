import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth()

  // Aguarda carregamento do usuário
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  // Se não está autenticado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Se requer uma role específica, verifica
  if (requiredRole && user.role !== requiredRole) {
    // Redireciona para dashboard apropriado
    if (user.role === 'secretaria') {
      return <Navigate to="/dashboard" replace />
    } else if (user.role === 'gestor_ubs') {
      return <Navigate to="/dashboard-ubs" replace />
    }
  }

  return children
}

export default ProtectedRoute
