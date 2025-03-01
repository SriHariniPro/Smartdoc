import React, { useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import Tesseract from 'tesseract.js';

const DocumentUpload = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const processDocument = async (file) => {
    try {
      setUploading(true);
      setError(null);

      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type);

      // Upload to backend
      const response = await fetch('http://localhost:3001/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload document');
      }

      const result = await response.json();

      // Perform OCR if it's an image
      if (file.type.startsWith('image/')) {
        const ocrResult = await Tesseract.recognize(file, 'eng');
        const extractedText = ocrResult.data.text;
        
        onUploadComplete({
          file,
          metadata: result.metadata,
          extractedText,
          type: 'image',
          timestamp: new Date().toISOString(),
        });
      } else {
        // Handle other document types
        const reader = new FileReader();
        reader.onload = async (e) => {
          onUploadComplete({
            file,
            metadata: result.metadata,
            content: e.target.result,
            type: file.type,
            timestamp: new Date().toISOString(),
          });
        };
        reader.readAsText(file);
      }
    } catch (err) {
      setError('Error processing document. Please try again.');
      console.error('Document processing error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processDocument(files[0]);
    }
  };

  return (
    <div 
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <div className="flex flex-col items-center space-y-4">
        <Upload className="w-12 h-12 text-gray-400" />
        <div className="text-xl font-medium">Drop documents here or click to upload</div>
        <p className="text-sm text-gray-500">
          Supports PDF, DOC, DOCX, and image files
        </p>
        <input
          type="file"
          className="hidden"
          onChange={(e) => e.target.files[0] && processDocument(e.target.files[0])}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        />
        {uploading && (
          <div className="flex items-center space-x-2 text-blue-600">
            <FileText className="animate-pulse" />
            <span>Processing document...</span>
          </div>
        )}
        {error && (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentUpload; 