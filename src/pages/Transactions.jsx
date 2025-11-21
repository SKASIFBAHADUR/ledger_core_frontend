import { useState } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { ArrowDownCircle, ArrowUpCircle, ArrowLeftRight, CheckCircle } from 'lucide-react'
import usePageMetadata from '../hooks/usePageMetadata'

const Transactions = () => {
  const [activeTab, setActiveTab] = useState('deposit')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [formData, setFormData] = useState({
    accountId: '',
    amount: '',
    reference: '',
    fromAccountId: '',
    toAccountId: '',
  })
  usePageMetadata({
    title: 'Process Transactions',
    description:
      'Execute deposits, withdrawals, and transfers securely within the LedgerCore Banking transaction engine.',
    keywords: 'LedgerCore transactions, banking transfers, deposit funds, withdraw funds',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const idempotencyKey = `idemp-${Date.now()}-${Math.random()}`
      let response

      let url
      if (activeTab === 'deposit') {
        url = `/transactions/deposit/${formData.accountId}/${formData.amount}`
        if (formData.reference) {
          url += `?reference=${encodeURIComponent(formData.reference)}`
        }
        response = await api.post(url, {}, {
          headers: { 'Idempotency-Key': idempotencyKey },
        })
      } else if (activeTab === 'withdraw') {
        url = `/transactions/withdraw/${formData.accountId}/${formData.amount}`
        if (formData.reference) {
          url += `?reference=${encodeURIComponent(formData.reference)}`
        }
        response = await api.post(url, {}, {
          headers: { 'Idempotency-Key': idempotencyKey },
        })
      } else if (activeTab === 'transfer') {
        url = `/transactions/transfer/${formData.fromAccountId}/${formData.toAccountId}/${formData.amount}`
        if (formData.reference) {
          url += `?reference=${encodeURIComponent(formData.reference)}`
        }
        response = await api.post(url, {}, {
          headers: { 'Idempotency-Key': idempotencyKey },
        })
      }

      setResult({ success: true, data: response.data })
      setFormData({
        accountId: '',
        amount: '',
        reference: '',
        fromAccountId: '',
        toAccountId: '',
      })
    } catch (error) {
      setResult({
        success: false,
        error: error.response?.data?.message || error.message || 'Transaction failed',
      })
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'deposit', label: 'Deposit', icon: ArrowDownCircle, color: 'text-green-600' },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUpCircle, color: 'text-red-600' },
    { id: 'transfer', label: 'Transfer', icon: ArrowLeftRight, color: 'text-blue-600' },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Transactions</h1>
          <p className="text-slate-600">Process deposits, withdrawals, and transfers</p>
        </div>

        <div className="card">
          {/* Tabs */}
          <div className="flex space-x-2 mb-6 border-b border-slate-200">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setResult(null)
                    setFormData({
                      accountId: '',
                      amount: '',
                      reference: '',
                      fromAccountId: '',
                      toAccountId: '',
                    })
                  }}
                  className={`flex items-center space-x-2 px-6 py-3 border-b-2 transition-colors ${
                    isActive
                      ? 'border-primary-600 text-primary-600 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? tab.color : ''}`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'transfer' ? (
              <>
                <div>
                  <label className="label">From Account ID</label>
                  <input
                    type="text"
                    value={formData.fromAccountId}
                    onChange={(e) =>
                      setFormData({ ...formData, fromAccountId: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter source account ID"
                    required
                  />
                </div>
                <div>
                  <label className="label">To Account ID</label>
                  <input
                    type="text"
                    value={formData.toAccountId}
                    onChange={(e) =>
                      setFormData({ ...formData, toAccountId: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter destination account ID"
                    required
                  />
                </div>
              </>
            ) : (
              <div>
                <label className="label">Account ID</label>
                <input
                  type="text"
                  value={formData.accountId}
                  onChange={(e) => setFormData({ ...formData, accountId: e.target.value })}
                  className="input-field"
                  placeholder="Enter account ID"
                  required
                />
              </div>
            )}

            <div>
              <label className="label">Amount</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-field"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="label">Reference (Optional)</label>
              <input
                type="text"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                className="input-field"
                placeholder="Transaction reference"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Process ${tabs.find((t) => t.id === activeTab)?.label}`}
            </button>
          </form>

          {/* Result */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-lg ${
                result.success
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {result.success ? (
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Transaction Successful!</span>
                  </div>
                  {result.data && (
                    <div className="text-sm text-green-700 space-y-1">
                      <p>Transaction ID: {result.data.id}</p>
                      <p>Type: {result.data.type}</p>
                      <p>Amount: ${result.data.amount}</p>
                      <p>Status: {result.data.status}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-red-700">
                  <p className="font-semibold">Transaction Failed</p>
                  <p className="text-sm mt-1">{result.error}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}

export default Transactions

