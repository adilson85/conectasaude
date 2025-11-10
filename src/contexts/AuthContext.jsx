import { createContext, useContext, useState, useEffect } from 'react'
import mockUsers from '../data/mockUsers.json'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('conecta_saude_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        localStorage.removeItem('conecta_saude_user')
      }
    }
    setLoading(false)
  }, [])

  const login = (email, senha) => {
    // Buscar usuário nos dados mock
    const usuario = mockUsers.find(
      u => u.email === email && u.senha === senha
    )

    if (usuario) {
      // Remove a senha antes de salvar
      const { senha: _, ...usuarioSemSenha } = usuario
      setUser(usuarioSemSenha)
      localStorage.setItem('conecta_saude_user', JSON.stringify(usuarioSemSenha))
      return { success: true, user: usuarioSemSenha }
    }

    return { success: false, error: 'Credenciais inválidas' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('conecta_saude_user')
  }

  const hasPermission = (permission) => {
    if (!user) return false
    return user.permissoes.includes(permission)
  }

  const value = {
    user,
    loading,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
