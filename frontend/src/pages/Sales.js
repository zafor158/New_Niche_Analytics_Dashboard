import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Filter, Calendar, DollarSign } from 'lucide-react';

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSale, setEditingSale] = useState(null);
  const [filters, setFilters] = useState({
    bookId: '',
    platform: '',
    startDate: '',
    endDate: ''
  });
  const [formData, setFormData] = useState({
    bookId: '',
    date: '',
    units: '',
    revenue: '',
    royalty: '',
    platform: ''
  });

  useEffect(() => {
    fetchSales();
    fetchBooks();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchSales = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.bookId) params.append('bookId', filters.bookId);
      if (filters.platform) params.append('platform', filters.platform);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      
      const response = await api.get(`/api/sales?${params.toString()}`);
      setSales(response.data.sales);
    } catch (error) {
      console.error('Error fetching sales:', error);
      toast.error('Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await api.get('/api/books');
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingSale) {
        await api.put(`/api/sales/${editingSale.id}`, formData);
        toast.success('Sale updated successfully');
      } else {
        await api.post('/api/sales', formData);
        toast.success('Sale created successfully');
      }
      
      setShowModal(false);
      setEditingSale(null);
      resetForm();
      fetchSales();
    } catch (error) {
      console.error('Error saving sale:', error);
      toast.error('Failed to save sale');
    }
  };

  const handleEdit = (sale) => {
    setEditingSale(sale);
    setFormData({
      bookId: sale.bookId,
      date: new Date(sale.date).toISOString().split('T')[0],
      units: sale.units.toString(),
      revenue: sale.revenue.toString(),
      royalty: sale.royalty.toString(),
      platform: sale.platform
    });
    setShowModal(true);
  };

  const handleDelete = async (saleId) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await api.delete(`/api/sales/${saleId}`);
        toast.success('Sale deleted successfully');
        fetchSales();
      } catch (error) {
        console.error('Error deleting sale:', error);
        toast.error('Failed to delete sale');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      bookId: '',
      date: '',
      units: '',
      revenue: '',
      royalty: '',
      platform: ''
    });
    setEditingSale(null);
  };

  const clearFilters = () => {
    setFilters({
      bookId: '',
      platform: '',
      startDate: '',
      endDate: ''
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your sales records
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Sale
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="card-body">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 mr-2 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="form-label">Book</label>
              <select
                name="bookId"
                value={filters.bookId}
                onChange={handleFilterChange}
                className="input"
              >
                <option value="">All Books</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="form-label">Platform</label>
              <input
                type="text"
                name="platform"
                value={filters.platform}
                onChange={handleFilterChange}
                className="input"
                placeholder="e.g., Amazon KDP"
              />
            </div>
            
            <div>
              <label className="form-label">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
            
            <div>
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="input"
              />
            </div>
          </div>
          
          <div className="mt-4">
            <button
              onClick={clearFilters}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Book
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Platform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Units
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Royalty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.length > 0 ? (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(sale.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.book?.title || 'Unknown Book'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.platform}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.units}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-600" />
                        {formatCurrency(sale.revenue)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-blue-600" />
                        {formatCurrency(sale.royalty)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(sale)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sale.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                    No sales found. Add some sales or upload CSV files to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingSale ? 'Edit Sale' : 'Add New Sale'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Book *</label>
                  <select
                    name="bookId"
                    required
                    className="input"
                    value={formData.bookId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a book</option>
                    {books.map((book) => (
                      <option key={book.id} value={book.id}>
                        {book.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="form-label">Date *</label>
                  <input
                    type="date"
                    name="date"
                    required
                    className="input"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="form-label">Platform *</label>
                  <input
                    type="text"
                    name="platform"
                    required
                    className="input"
                    value={formData.platform}
                    onChange={handleInputChange}
                    placeholder="e.g., Amazon KDP"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Units *</label>
                    <input
                      type="number"
                      name="units"
                      required
                      min="0"
                      className="input"
                      value={formData.units}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>
                  
                  <div>
                    <label className="form-label">Revenue *</label>
                    <input
                      type="number"
                      name="revenue"
                      required
                      min="0"
                      step="0.01"
                      className="input"
                      value={formData.revenue}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="form-label">Royalty *</label>
                  <input
                    type="number"
                    name="royalty"
                    required
                    min="0"
                    step="0.01"
                    className="input"
                    value={formData.royalty}
                    onChange={handleInputChange}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingSale ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;
