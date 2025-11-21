# Troubleshooting Guide

## Network Error When Creating Customer

If you're getting a "network error" when trying to create a customer, follow these steps:

### 1. Check if Backend is Running
- Ensure your Spring Boot application is running
- Check that it's running on port 8080
- Look for startup messages in your IDE console

### 2. Verify Backend URL
- Open browser Developer Tools (F12)
- Go to Network tab
- Try creating a customer again
- Check the failed request URL - it should be `http://localhost:8080/customer/create`

### 3. Check CORS Configuration
- Open browser console (F12 → Console tab)
- Look for CORS-related errors
- Ensure backend `WebConfig.java` allows `http://localhost:3000`

### 4. Test Backend Directly
Open a new terminal and test the endpoint directly:
```bash
curl -X POST http://localhost:8080/customer/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name":"Test User","email":"test@example.com","phone":"1234567890"}'
```

### 5. Check Authentication
- Ensure you're logged in
- Check if access token exists in localStorage (F12 → Application → Local Storage)
- Try logging out and logging back in

### 6. Common Issues

#### Backend Not Running
**Symptom**: Network error, connection refused
**Solution**: Start your Spring Boot application

#### Wrong Port
**Symptom**: Network error, connection refused
**Solution**: Verify backend is on port 8080, or update `API_BASE_URL` in `frontend/src/services/api.js`

#### CORS Error
**Symptom**: CORS policy error in console
**Solution**: Check `WebConfig.java` allows your frontend origin

#### Authentication Required
**Symptom**: 401 Unauthorized
**Solution**: Login again to get a fresh token

### 7. Debug Steps

1. **Open Browser Console** (F12)
2. **Check Network Tab**:
   - Look for the failed request
   - Check Request URL
   - Check Response (if any)
   - Check Headers

3. **Check Console for Errors**:
   - Look for detailed error messages
   - Check for CORS errors
   - Check for authentication errors

4. **Verify API Configuration**:
   - Check `frontend/src/services/api.js`
   - Ensure `API_BASE_URL` is correct
   - Verify `withCredentials: true` is set

### 8. Quick Test

Run this in browser console to test backend connectivity:
```javascript
fetch('http://localhost:8080/customer/list', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
  }
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

If this fails, the backend is not accessible.

