import axios from 'axios'
import { getAccessToken, setAccessToken, clearAccessToken } from '../utils/tokenStorage'

const API_BASE_URL = 'https://ledger-core-backend.onrender.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for httpOnly cookies
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add access token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Log network errors for debugging
    if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
      console.error('Network Error Details:', {
        url: originalRequest?.url,
        baseURL: originalRequest?.baseURL,
        method: originalRequest?.method,
        message: error.message,
        code: error.code
      })
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const response = await axios.post(
          `${API_BASE_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const { accessToken } = response.data
        setAccessToken(accessToken)
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        clearAccessToken()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api

