import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, BookOpen, Calendar, Hash } from 'lucide-react';

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    description: '',
    publishedAt: ''
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/api/books');
      setBooks(response.data.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingBook) {
        await api.put(`/api/books/${editingBook.id}`, formData);
        toast.success('Book updated successfully');
      } else {
        await api.post('/api/books', formData);
        toast.success('Book created successfully');
      }
      
      setShowModal(false);
      setEditingBook(null);
      setFormData({
        title: '',
        isbn: '',
        description: '',
        publishedAt: ''
      });
      fetchBooks();
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error('Failed to save book: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      isbn: book.isbn || '',
      description: book.description || '',
      publishedAt: book.publishedAt ? new Date(book.publishedAt).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book? This will also delete all associated sales data.')) {
      try {
        await api.delete(`/api/books/${bookId}`);
        toast.success('Book deleted successfully');
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
        toast.error('Failed to delete book');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      isbn: '',
      description: '',
      publishedAt: ''
    });
    setEditingBook(null);
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
          <h1 className="text-2xl font-bold text-gray-900">Books</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your book catalog
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
          Add Book
        </button>
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="card">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {book.title}
                    </h3>
                    
                    {book.isbn && (
                      <div className="flex items-center text-sm text-gray-500 mb-1">
                        <Hash className="h-4 w-4 mr-1" />
                        {book.isbn}
                      </div>
                    )}
                    
                    {book.publishedAt && (
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(book.publishedAt).toLocaleDateString()}
                      </div>
                    )}
                    
                    {book.description && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {book.description}
                      </p>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {book._count?.sales || 0} sales
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => handleEdit(book)}
                    className="btn-secondary text-sm"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(book.id)}
                    className="btn-danger text-sm"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No books</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first book.
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingBook ? 'Edit Book' : 'Add New Book'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="form-label">Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    className="input"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Book title"
                  />
                </div>
                
                <div>
                  <label className="form-label">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    className="input"
                    value={formData.isbn}
                    onChange={handleInputChange}
                    placeholder="ISBN (optional)"
                  />
                </div>
                
                <div>
                  <label className="form-label">Published Date</label>
                  <input
                    type="date"
                    name="publishedAt"
                    className="input"
                    value={formData.publishedAt}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    className="input"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Book description (optional)"
                  />
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    {editingBook ? 'Update' : 'Create'}
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

export default Books;
