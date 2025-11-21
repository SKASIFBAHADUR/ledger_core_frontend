import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import api from '../services/api'
import { Plus, Edit, Trash2, Search, UserPlus } from 'lucide-react'
import usePageMetadata from '../hooks/usePageMetadata'

const Customers = () => {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  usePageMetadata({
    title: 'Customer Directory',
    description:
      'Create, search, and manage LedgerCore Banking customers with compliant contact records.',
    keywords: 'LedgerCore customers, banking CRM, manage banking clients',
  })

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken')
    if (!token) {
      alert('Please login first to access customer management')
      window.location.href = '/login'
      return
    }
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/customer/list')
      setCustomers(response.data || [])
    } catch (error) {
      console.error('Error fetching customers:', error)
      alert('Error fetching customers: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingCustomer) {
        await api.put(`/customer/update/${editingCustomer.id}`, formData)
      } else {
        await api.post('/customer/create', formData)
      }
      setShowModal(false)
      setFormData({ name: '', email: '', phone: '' })
      setEditingCustomer(null)
      fetchCustomers()
    } catch (error) {
      console.error('Error saving customer:', error)
      
      // More detailed error handling
      let errorMessage = 'Error saving customer: '
      
      if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage += 'Cannot connect to backend server. Please ensure:\n'
        errorMessage += '1. Backend is running on http://localhost:8080\n'
        errorMessage += '2. No firewall is blocking the connection\n'
        errorMessage += '3. Check browser console for CORS errors'
      } else if (error.response) {
        // Server responded with error status
        errorMessage += error.response.data?.message || 
                       error.response.data?.error || 
                       `Server error (${error.response.status})`
      } else if (error.request) {
        // Request was made but no response received
        errorMessage += 'No response from server. Backend may not be running.'
      } else {
        errorMessage += error.message || 'Unknown error occurred'
      }
      
      alert(errorMessage)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return
    try {
      await api.delete(`/customer/delete/${id}`)
      fetchCustomers()
    } catch (error) {
      console.error('Error deleting customer:', error)
      alert('Error deleting customer: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleEdit = (customer) => {
    setEditingCustomer(customer)
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
    })
    setShowModal(true)
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 mb-2">Customers</h1>
            <p className="text-slate-600">Manage your banking customers</p>
          </div>
          <button
            onClick={() => {
              setEditingCustomer(null)
              setFormData({ name: '', email: '', phone: '' })
              setShowModal(true)
            }}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Customer</span>
          </button>
        </div>

        <div className="card">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search customers..."
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
          ) : filteredCustomers.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600 mb-4">No customers found</p>
              <button onClick={() => setShowModal(true)} className="btn-primary">
                Add Your First Customer
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">Phone</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="py-3 px-4">{customer.name}</td>
                      <td className="py-3 px-4">{customer.email}</td>
                      <td className="py-3 px-4">{customer.phone}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(customer)}
                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="label">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {editingCustomer ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false)
                    setEditingCustomer(null)
                    setFormData({ name: '', email: '', phone: '' })
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

export default Customers

