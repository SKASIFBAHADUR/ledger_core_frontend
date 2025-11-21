# Quick Start Guide

## Getting Started

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

## First Steps

1. **Register a new account** or **login** if you already have one
2. **Create a customer** from the Customers page
3. **Create an account** for that customer from the Accounts page
4. **Process transactions** (deposit, withdraw, or transfer) from the Transactions page
5. **View ledger entries** from the Ledger page

## Backend Requirements

Make sure your Spring Boot backend is running on `http://localhost:8080` before using the frontend.

## Troubleshooting

- **CORS errors?** Make sure your backend CORS configuration allows `http://localhost:3000`
- **401 errors?** Check that you're logged in and your JWT token is valid
- **Connection refused?** Ensure your backend server is running on port 8080

## Features

✅ Modern, responsive UI with Tailwind CSS
✅ JWT authentication with automatic token refresh
✅ Customer management (CRUD operations)
✅ Account management
✅ Transaction processing (deposit, withdraw, transfer)
✅ Ledger viewing
✅ Mobile-friendly design

Enjoy your banking application! 🎉

