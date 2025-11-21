const TOKEN_KEY = 'accessToken'

const getStorage = () => {
  if (typeof window === 'undefined') return null
  return window.sessionStorage
}

export const getAccessToken = () => {
  const storage = getStorage()
  return storage ? storage.getItem(TOKEN_KEY) : null
}

export const setAccessToken = (token) => {
  const storage = getStorage()
  if (!storage || !token) return
  storage.setItem(TOKEN_KEY, token)
}

export const clearAccessToken = () => {
  const storage = getStorage()
  if (!storage) return
  storage.removeItem(TOKEN_KEY)
}

