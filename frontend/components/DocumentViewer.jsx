import React from 'react';
import { Tag, Calendar, FileText, Brain, BarChart } from 'lucide-react';

const DocumentViewer = ({ document }) => {
  if (!document) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select a document to view</p>
      </div>
    );
  }

  const { metadata, content, extractedText, type, timestamp } = document;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      {/* Document Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{document.file.name}</h2>
          <span className="text-sm text-gray-500">
            <Calendar className="inline w-4 h-4 mr-1" />
            {new Date(timestamp).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Document Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="prose max-w-none">
            {type === 'image' ? extractedText : content}
          </div>
        </div>

        {/* AI Insights Sidebar */}
        <div className="w-80 border-l bg-gray-50 p-4 overflow-auto">
          <h3 className="font-semibold flex items-center mb-4">
            <Brain className="w-4 h-4 mr-2" />
            AI Insights
          </h3>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {metadata.categories.map((category, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  <Tag className="inline w-3 h-3 mr-1" />
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Entities */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Detected Entities</h4>
            <ul className="space-y-2">
              {metadata.entities.map((entity, index) => (
                <li key={index} className="flex items-center text-sm">
                  <FileText className="w-4 h-4 mr-2 text-gray-500" />
                  {entity}
                </li>
              ))}
            </ul>
          </div>

          {/* Analysis */}
          <div className="mb-6">
            <h4 className="text-sm font-medium mb-2">Analysis</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Sentiment</span>
                <span className="capitalize">{metadata.sentiment}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Confidence</span>
                <div className="flex items-center">
                  <BarChart className="w-4 h-4 mr-1 text-green-500" />
                  {(metadata.confidence * 100).toFixed(1)}%
                </div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Language</span>
                <span className="uppercase">{metadata.language}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer; 