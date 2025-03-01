# AI-Powered Document Management System

A modern document management system that uses AI to automatically classify, analyze, and extract information from various document types.

## Features

- 📄 Support for multiple file formats (PDF, DOC, DOCX, images)
- 🤖 AI-powered document analysis and classification
- 🔍 OCR for image-based documents
- 🏷️ Automatic metadata extraction and tagging
- 🔎 Full-text search capabilities
- 📊 Document insights and analytics
- 🎯 Industry-specific document organization

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ai-doc-management-system.git
cd ai-doc-management-system
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your configuration:
```env
PORT=3001
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

4. Create the uploads directory:
```bash
mkdir uploads
```

## Running the Application

1. Start the backend server:
```bash
npm run server
```

2. In a new terminal, start the frontend development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Upload Documents:
   - Drag and drop files into the upload area
   - Click to select files from your computer
   - Supported formats: PDF, DOC, DOCX, PNG, JPG, JPEG

2. View and Analyze:
   - View document contents and AI-generated insights
   - See automatic categorization and entity extraction
   - Check sentiment analysis and confidence scores

3. Search and Filter:
   - Use the search bar to find documents
   - Filter by document categories
   - Sort by various criteria

## Technology Stack

- Frontend:
  - React
  - Tailwind CSS
  - Tesseract.js (OCR)
  - Lucide React (Icons)

- Backend:
  - Express.js
  - OpenAI API
  - Multer (File uploads)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 