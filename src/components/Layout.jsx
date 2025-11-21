import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowLeftRight,
  BookOpen,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const Layout = ({ children }) => {
  const { logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/customers', icon: Users, label: 'Customers' },
    { path: '/accounts', icon: CreditCard, label: 'Accounts' },
    { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
    { path: '/ledger', icon: BookOpen, label: 'Ledger' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-slate-200 z-40" aria-label="Sidebar">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
            LedgerCore
          </h1>
          <p className="text-sm text-slate-500 mt-1">Banking System</p>
        </div>

        <nav className="p-4 space-y-2" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg"
      >
        {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
          <aside
            className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-40"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-200">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                LedgerCore
              </h1>
              <p className="text-sm text-slate-500 mt-1">Banking System</p>
            </div>

            <nav className="p-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main content */}
      <main id="main-content" className="lg:ml-64 p-6 lg:p-8" role="main">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  )
}

export default Layout

