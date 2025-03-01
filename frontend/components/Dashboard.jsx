import React, { useState } from 'react';
import { Search, Filter, SortAsc, Folder } from 'lucide-react';
import DocumentUpload from './DocumentUpload';
import DocumentViewer from './DocumentViewer';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  const handleUploadComplete = (docData) => {
    const newDoc = {
      id: Date.now(),
      ...docData,
    };
    setDocuments([newDoc, ...documents]);
    setSelectedDocument(newDoc);
  };

  const filteredDocuments = documents.filter(doc => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        doc.file.name.toLowerCase().includes(searchLower) ||
        (doc.metadata.categories.some(cat => cat.toLowerCase().includes(searchLower))) ||
        (doc.extractedText && doc.extractedText.toLowerCase().includes(searchLower))
      );
    }
    if (filter !== 'all') {
      return doc.metadata.categories.includes(filter);
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r">
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">AI Doc Manager</h1>
          <DocumentUpload onUploadComplete={handleUploadComplete} />
        </div>

        {/* Filters */}
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters</span>
          </div>
          <select
            className="w-full p-2 border rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Documents</option>
            <option value="Legal">Legal</option>
            <option value="Medical">Medical</option>
            <option value="Financial">Financial</option>
            <option value="Business">Business</option>
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Search Bar */}
        <div className="bg-white p-4 border-b">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search documents..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <SortAsc className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document List and Viewer */}
        <div className="flex-1 flex overflow-hidden">
          {/* Document List */}
          <div className="w-80 border-r bg-white overflow-auto">
            {filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Folder className="w-12 h-12 mb-2" />
                <p>No documents found</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${
                      selectedDocument?.id === doc.id ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <h3 className="font-medium mb-1">{doc.file.name}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-2">
                        {new Date(doc.timestamp).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                        {doc.metadata.categories[0]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Viewer */}
          <div className="flex-1 overflow-hidden">
            <DocumentViewer document={selectedDocument} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 