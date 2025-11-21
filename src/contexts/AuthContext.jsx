import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { getAccessToken, setAccessToken, clearAccessToken } from '../utils/tokenStorage'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      setUser({ authenticated: true })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const formData = new URLSearchParams()
      formData.append('email', email)
      formData.append('password', password)

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })

      const { accessToken } = response.data
      setAccessToken(accessToken)
      setUser({ authenticated: true, email })
      return { success: true }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Login failed'
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData)
      return { success: true, data: response.data }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                           error.response?.data?.error || 
                           error.message || 
                           'Registration failed'
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAccessToken()
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

