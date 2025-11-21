// Utility to check backend connectivity
export const checkBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:8080/actuator/health', {
      method: 'GET',
      credentials: 'include',
    })
    return { connected: response.ok, status: response.status }
  } catch (error) {
    return { connected: false, error: error.message }
  }
}

export const testApiConnection = async (api) => {
  try {
    // Try to access a public endpoint or check if we can reach the server
    const response = await api.get('/customer/list')
    return { connected: true, authenticated: true }
  } catch (error) {
    if (error.code === 'ERR_NETWORK') {
      return { connected: false, authenticated: false, error: 'Backend not reachable' }
    } else if (error.response?.status === 401) {
      return { connected: true, authenticated: false, error: 'Not authenticated' }
    } else {
      return { connected: true, authenticated: true, error: error.message }
    }
  }
}

