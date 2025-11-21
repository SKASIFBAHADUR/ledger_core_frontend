import { useState } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { Search, BookOpen, FileText } from 'lucide-react'
import usePageMetadata from '../hooks/usePageMetadata'

const Ledger = () => {
  const [searchType, setSearchType] = useState('account')
  const [searchValue, setSearchValue] = useState('')
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(false)
  usePageMetadata({
    title: 'Ledger Insights',
    description:
      'Analyze LedgerCore Banking ledger entries by account or transaction reference for full auditability.',
    keywords: 'LedgerCore ledger, banking audit trail, ledger search, financial compliance',
  })

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchValue.trim()) return

    setLoading(true)
    try {
      let response
      if (searchType === 'account') {
        response = await api.get(`/ledger/account/${searchValue}`)
      } else {
        response = await api.get(`/ledger/reference/${searchValue}`)
      }
      setEntries(response.data || [])
    } catch (error) {
      console.error('Error fetching ledger entries:', error)
      alert('Error fetching ledger entries: ' + (error.response?.data?.message || error.message))
      setEntries([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Ledger</h1>
          <p className="text-slate-600">View transaction ledger entries</p>
        </div>

        <div className="card">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="label">Search Type</label>
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value)
                    setEntries([])
                  }}
                  className="input-field"
                >
                  <option value="account">By Account</option>
                  <option value="reference">By Reference</option>
                </select>
              </div>
              <div className="flex-2">
                <label className="label">
                  {searchType === 'account' ? 'Account Number' : 'Reference ID'}
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="input-field"
                    placeholder={
                      searchType === 'account'
                        ? 'Enter account number'
                        : 'Enter transaction reference'
                    }
                    required
                  />
                  <button type="submit" className="btn-primary flex items-center space-x-2">
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="card">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          </div>
        ) : entries.length === 0 && searchValue ? (
          <div className="card">
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No ledger entries found</p>
            </div>
          </div>
        ) : entries.length > 0 ? (
          <div className="card">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-bold text-slate-800">
                {entries.length} Ledger Entries Found
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Account</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr
                      key={index}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-sm">{entry.accountId}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            entry.entryType === 'DEBIT'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {entry.entryType}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">
                        {entry.amount?.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {entry.description || 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-600">
                        {entry.createdAt
                          ? new Date(entry.createdAt).toLocaleString()
                          : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">Enter a search term to view ledger entries</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default Ledger

