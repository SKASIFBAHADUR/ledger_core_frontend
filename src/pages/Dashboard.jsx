import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import api from '../services/api'
import { Users, CreditCard, ArrowLeftRight, DollarSign, UserPlus } from 'lucide-react'
import usePageMetadata from '../hooks/usePageMetadata'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalAccounts: 0,
    totalTransactions: 0,
    totalBalance: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  usePageMetadata({
    title: 'Executive Dashboard',
    description:
      'Monitor customers, accounts, balances, and transaction throughput across the LedgerCore Banking platform in real time.',
    keywords: 'LedgerCore dashboard, banking KPIs, account totals, transaction totals',
  })

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await api.get('/dashboard/stats')
        const data = response.data || {}
        setStats({
          totalCustomers: data.totalCustomers ?? 0,
          totalAccounts: data.totalAccounts ?? 0,
          totalTransactions: data.totalTransactions ?? 0,
          totalBalance: data.totalBalance ?? 0,
        })
      } catch (err) {
        console.error('Error fetching dashboard stats:', err)
        setError('Unable to load live dashboard statistics. Please try again shortly.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Total Accounts',
      value: stats.totalAccounts,
      icon: CreditCard,
      color: 'bg-green-500',
      gradient: 'from-green-500 to-green-600',
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: ArrowLeftRight,
      color: 'bg-purple-500',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      title: 'Total Balance',
      value: stats.totalBalance,
      formatter: (value) =>
        value.toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        }),
      icon: DollarSign,
      color: 'bg-orange-500',
      gradient: 'from-orange-500 to-orange-600',
    },
  ]

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">Welcome to LedgerCore Banking System</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statCards.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className="card hover:shadow-xl transition-shadow duration-300 border-t-4 border-t-primary-500"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-slate-600 text-sm font-medium mb-1">{stat.title}</p>
                        <p className="text-3xl font-bold text-slate-800">
                          {stat.formatter ? stat.formatter(stat.value) : stat.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.gradient} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <Link
                    to="/customers"
                    className="block p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Manage Customers</span>
                    </div>
                  </Link>
                  <Link
                    to="/register"
                    className="block p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <UserPlus className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Create New Emp</span>
                    </div>
                  </Link>
                  <Link
                    to="/accounts"
                    className="block p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <CreditCard className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Manage Accounts</span>
                    </div>
                  </Link>
                  <Link
                    to="/transactions"
                    className="block p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <ArrowLeftRight className="w-5 h-5 text-primary-600" />
                      <span className="font-medium">Process Transactions</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="card">
                <h2 className="text-xl font-bold text-slate-800 mb-4">System Overview</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">System Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Last Sync</span>
                    <span className="text-slate-800 font-medium">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}

export default Dashboard

