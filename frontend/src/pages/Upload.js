import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Upload as UploadIcon, Download, FileText, CheckCircle, AlertCircle } from 'lucide-react';

const Upload = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    fetchBooks();
    fetchPlatforms();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('/api/books');
      setBooks(response.data.books);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error('Failed to load books');
    }
  };

  const fetchPlatforms = async () => {
    try {
      const response = await axios.get('/api/upload/platforms');
      setPlatforms(response.data.platforms);
    } catch (error) {
      console.error('Error fetching platforms:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        setSelectedFile(file);
        setUploadResult(null);
      } else {
        toast.error('Please select a CSV file');
        e.target.value = '';
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a CSV file');
      return;
    }
    
    if (!selectedBook) {
      toast.error('Please select a book');
      return;
    }
    
    if (!selectedPlatform) {
      toast.error('Please select a platform');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', selectedFile);
    formData.append('bookId', selectedBook);
    formData.append('platform', selectedPlatform);

    try {
      setUploading(true);
      const response = await axios.post('/api/upload/csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setUploadResult(response.data);
      toast.success('CSV file uploaded and processed successfully!');
      
      // Reset form
      setSelectedFile(null);
      setSelectedBook('');
      setSelectedPlatform('');
      document.getElementById('csvFile').value = '';
      
    } catch (error) {
      console.error('Error uploading file:', error);
      const message = error.response?.data?.message || 'Failed to upload CSV file';
      toast.error(message);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const response = await axios.get('/api/upload/template', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sales_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Template downloaded successfully');
    } catch (error) {
      console.error('Error downloading template:', error);
      toast.error('Failed to download template');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Sales Data</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload CSV files with your sales data from various platforms
        </p>
      </div>

      {/* Upload Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Upload CSV File
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Select a CSV file containing your sales data
            </p>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="form-label">Book *</label>
                <select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="input"
                  required
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
                <label className="form-label">Platform *</label>
                <select
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">Select a platform</option>
                  {platforms.map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">CSV File *</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="csvFile"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="csvFile"
                          name="csvFile"
                          type="file"
                          accept=".csv"
                          className="sr-only"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">CSV files only</p>
                  </div>
                </div>
                {selectedFile && (
                  <div className="mt-2 flex items-center text-sm text-gray-600">
                    <FileText className="h-4 w-4 mr-2" />
                    {selectedFile.name}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={uploading || !selectedFile || !selectedBook || !selectedPlatform}
                className="btn-primary w-full"
              >
                {uploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload CSV
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Template and Instructions */}
        <div className="space-y-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                CSV Template
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Download a template to see the required format
              </p>
            </div>
            <div className="card-body">
              <div className="text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">CSV Template</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Download our template to see the required format for your CSV files.
                </p>
                <div className="mt-6">
                  <button
                    onClick={downloadTemplate}
                    className="btn-secondary"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                CSV Format Requirements
              </h3>
            </div>
            <div className="card-body">
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Required columns: <code className="bg-gray-100 px-1 rounded">date</code>, <code className="bg-gray-100 px-1 rounded">units</code>, <code className="bg-gray-100 px-1 rounded">revenue</code>, <code className="bg-gray-100 px-1 rounded">royalty</code></span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Date format: YYYY-MM-DD (e.g., 2024-01-15)</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Units must be whole numbers (0 or greater)</span>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Revenue and royalty must be decimal numbers (0.00 or greater)</span>
                </div>
                <div className="flex items-start">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Column names are case-insensitive (Date, date, DATE all work)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Results */}
      {uploadResult && (
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Upload Results
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {uploadResult.summary.createdSales}
                </div>
                <div className="text-sm text-gray-500">Sales Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {uploadResult.summary.totalRows}
                </div>
                <div className="text-sm text-gray-500">Total Rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {uploadResult.summary.errors}
                </div>
                <div className="text-sm text-gray-500">Errors</div>
              </div>
            </div>

            {uploadResult.errors && uploadResult.errors.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Errors:</h4>
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <ul className="text-sm text-red-700 space-y-1">
                    {uploadResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {uploadResult.sales && uploadResult.sales.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Created Sales:</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
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
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {uploadResult.sales.slice(0, 5).map((sale) => (
                        <tr key={sale.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(sale.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {sale.units}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(sale.revenue)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatCurrency(sale.royalty)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {uploadResult.sales.length > 5 && (
                    <p className="text-sm text-gray-500 mt-2">
                      ... and {uploadResult.sales.length - 5} more sales
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
