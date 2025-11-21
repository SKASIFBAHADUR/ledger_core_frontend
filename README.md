# LedgerCore Banking Frontend

A modern, beautiful React frontend for the LedgerCore Banking System.

## Features

- 🔐 **Authentication** - Secure login and registration with JWT tokens
- 👥 **Customer Management** - Create, view, update, and delete customers
- 💳 **Account Management** - Create and manage customer accounts
- 💰 **Transactions** - Process deposits, withdrawals, and transfers
- 📊 **Ledger Viewing** - View transaction ledger entries by account or reference
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile Friendly** - Fully responsive design that works on all devices

## Tech Stack

- **React 18** - UI library
- **React Router** - Routing
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons

## Prerequisites

- Node.js 16+ and npm/yarn/pnpm

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Backend Configuration

Make sure your backend is running on `http://localhost:8080`. The frontend is configured to communicate with the backend API.

If your backend runs on a different port, update the `API_BASE_URL` in `src/services/api.js`.

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable components
│   │   ├── Layout.jsx   # Main layout with sidebar
│   │   └── PrivateRoute.jsx
│   ├── contexts/        # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/           # Page components
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Customers.jsx
│   │   ├── Accounts.jsx
│   │   ├── Transactions.jsx
│   │   └── Ledger.jsx
│   ├── services/        # API services
│   │   └── api.js
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Features Overview

### Authentication
- Login with email and password
- Registration for new users
- JWT token management with automatic refresh
- Secure logout

### Dashboard
- Overview statistics
- Quick access to main features
- System status information

### Customer Management
- Create new customers
- View customer list
- Edit customer information
- Delete customers
- Search functionality

### Account Management
- Create accounts for customers
- View all accounts with balance information
- Delete accounts
- Support for Savings and Current account types

### Transactions
- Deposit money to accounts
- Withdraw money from accounts
- Transfer money between accounts
- Idempotency key support
- Transaction reference support

### Ledger
- Search ledger entries by account number
- Search ledger entries by transaction reference
- View detailed transaction history

## Styling

The application uses Tailwind CSS with a custom color scheme. The primary color is a beautiful blue gradient that creates a professional banking application feel.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is part of the LedgerCore Banking System.

