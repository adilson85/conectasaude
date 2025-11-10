import { Link, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Dashboard from './pages/Dashboard'
import Agendamentos from './pages/Agendamentos'
import Relatorios from './pages/Relatorios'
import Filas from './pages/Filas'
import DashboardUBS from './pages/DashboardUBS'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import UserMenu from './components/UserMenu'

function App() {
  const location = useLocation()
  const activePath = location.pathname || '/'
  const { user } = useAuth()

  // Se não está na página de login e não está autenticado, não mostra header/nav
  const showLayout = user && location.pathname !== '/login'

  return (
    <div className="min-h-screen bg-gray-50">
      {showLayout && (
        <>
          {/* Header */}
          <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg" role="banner">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white rounded-lg p-2">
                    <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Conecta Saúde</h1>
                    <p className="text-blue-100 text-sm">Sistema de Gestão de Agendamentos - SUS</p>
                  </div>
                </div>
                <UserMenu />
              </div>
            </div>
          </header>

          {/* Tabs Navigation */}
          <nav className="bg-white border-b" role="navigation" aria-label="Navegação principal">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-8" role="tablist" aria-label="Seções">
                {user.role === 'secretaria' ? (
                  <>
                    <Link
                      to="/dashboard"
                      role="tab"
                      aria-selected={activePath === '/dashboard'}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activePath === '/dashboard'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/agendamentos"
                      role="tab"
                      aria-selected={activePath === '/agendamentos'}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activePath === '/agendamentos'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Agendamentos
                    </Link>
                    <Link
                      to="/relatorios"
                      role="tab"
                      aria-selected={activePath === '/relatorios'}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activePath === '/relatorios'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Relatórios
                    </Link>
                    <Link
                      to="/filas"
                      role="tab"
                      aria-selected={activePath === '/filas'}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activePath === '/filas'
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Filas
                    </Link>
                  </>
                ) : user.role === 'gestor_ubs' ? (
                  <Link
                    to="/dashboard-ubs"
                    role="tab"
                    aria-selected={activePath === '/dashboard-ubs'}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activePath === '/dashboard-ubs'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Minha UBS
                  </Link>
                ) : null}
              </div>
            </div>
          </nav>
        </>
      )}

      {/* Main Content */}
      <main
        className={showLayout ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}
        role="main"
      >
        <Routes>
          {/* Rota pública de login */}
          <Route path="/login" element={<Login />} />

          {/* Rotas protegidas para Secretaria */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="secretaria">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agendamentos"
            element={
              <ProtectedRoute requiredRole="secretaria">
                <Agendamentos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/relatorios"
            element={
              <ProtectedRoute requiredRole="secretaria">
                <Relatorios />
              </ProtectedRoute>
            }
          />
          <Route
            path="/filas"
            element={
              <ProtectedRoute requiredRole="secretaria">
                <Filas />
              </ProtectedRoute>
            }
          />

          {/* Rota protegida para Gestor UBS */}
          <Route
            path="/dashboard-ubs"
            element={
              <ProtectedRoute requiredRole="gestor_ubs">
                <DashboardUBS />
              </ProtectedRoute>
            }
          />

          {/* Rota raiz - redireciona baseado no usuário */}
          <Route
            path="/"
            element={
              user ? (
                user.role === 'secretaria' ? (
                  <Navigate to="/dashboard" replace />
                ) : user.role === 'gestor_ubs' ? (
                  <Navigate to="/dashboard-ubs" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Routes>
      </main>
    </div>
  )
}

export default App

