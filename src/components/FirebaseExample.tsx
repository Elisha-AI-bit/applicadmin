import React, { useState } from 'react';
import { useFileUpload, useCollection } from '../hooks/useFirebase';

const FirebaseExample: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const { upload, uploading, error: uploadError } = useFileUpload();
  const { documents: items, add, loading, error } = useCollection('examples');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let fileUrl = '';
      
      // Upload file if selected
      if (file) {
        fileUrl = await upload(file, `examples/${Date.now()}-${file.name}`);
      }
      
      // Add document to Firestore
      await add({
        title,
        description,
        fileUrl,
        fileName: file?.name || '',
        createdAt: new Date().toISOString()
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setFile(null);
      (e.target as HTMLFormElement).reset();
      
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  };

  const handleDelete = async (itemId: string) => {
    try {
      // For now, we'll just log the deletion
      // In a real app, you'd use the useDocument hook to delete
      console.log('Deleting item:', itemId);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Firebase Storage & Sync Example</h1>
      
      {/* Upload Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File (Optional)
            </label>
            <input
              type="file"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={uploading || loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {uploading ? 'Uploading...' : 'Add Item'}
          </button>
          
          {(uploadError || error) && (
            <div className="text-red-600 text-sm mt-2">
              {uploadError || error}
            </div>
          )}
        </form>
      </div>
      
      {/* Items List */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Items ({items.length})</h2>
        
        {loading ? (
          <div className="text-center py-4">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-4 text-gray-500">No items yet</div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
                
                {item.fileUrl && (
                  <div className="mt-3">
                    <a
                      href={item.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      View File: {item.fileName}
                    </a>
                  </div>
                )}
                
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FirebaseExample;
