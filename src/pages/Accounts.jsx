import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { Plus, Trash2, Search, CreditCard, DollarSign } from 'lucide-react'
import usePageMetadata from '../hooks/usePageMetadata'

const Accounts = () => {
  const [accounts, setAccounts] = useState([])
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    customerId: '',
    accountType: 'SAVINGS',
    balance: 0,
  })
  usePageMetadata({
    title: 'Account Management',
    description:
      'Open and monitor LedgerCore customer accounts with real-time balances and account insights.',
    keywords: 'LedgerCore accounts, open banking account, manage balances',
  })

  useEffect(() => {
    fetchAccounts()
    // In a real app, fetch customers list
  }, [])

  const fetchAccounts = async () => {
    try {
      setLoading(true)
      const response = await api.get('/account/list')
      setAccounts(response.data || [])
    } catch (error) {
      console.error('Error fetching accounts:', error)
      alert('Error fetching accounts: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post(`/account/create/${formData.customerId}`, {
        accountType: formData.accountType,
        balance: formData.balance,
      })
      setShowModal(false)
      setFormData({ customerId: '', accountType: 'SAVINGS', balance: 0 })
      fetchAccounts()
    } catch (error) {
      console.error('Error creating account:', error)
      alert('Error creating account: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleDelete = async (accountId) => {
    if (!window.confirm('Are you sure you want to delete this account?')) return
    try {
      await api.delete(`/account/delete/${accountId}`)
      fetchAccounts()
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Error deleting account: ' + (error.response?.data?.message || error.message))
    }
  }

  const filteredAccounts = accounts.filter(
    (account) =>
      account.accountNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.accountType?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Accounts</h1>
            <p className="text-slate-600">Manage customer accounts</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Account</span>
          </button>
        </div>

        <div className="card">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search accounts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          ) : filteredAccounts.length === 0 ? (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">No accounts found</p>
              <button onClick={() => setShowModal(true)} className="btn-primary">
                Create Your First Account
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAccounts.map((account) => (
                <div
                  key={account.id}
                  className="p-6 bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl border border-primary-200 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <CreditCard className="w-8 h-8 text-primary-600" />
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    {account.accountNumber}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3">{account.accountType}</p>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="text-2xl font-bold text-slate-800">
                      {account.balance?.toLocaleString('en-US', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Created: {new Date(account.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Create New Account</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Customer ID</label>
                <input
                  type="number"
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="input-field"
                  placeholder="Enter customer ID"
                  required
                />
              </div>
              <div>
                <label className="label">Account Type</label>
                <select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  className="input-field"
                >
                  <option value="SAVINGS">Savings</option>
                  <option value="CURRENT">Current</option>
                </select>
              </div>
              <div>
                <label className="label">Initial Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) =>
                    setFormData({ ...formData, balance: parseFloat(e.target.value) || 0 })
                  }
                  className="input-field"
                  min="0"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setFormData({ customerId: '', accountType: 'SAVINGS', balance: 0 })
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Accounts

