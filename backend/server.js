import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Configure Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);

app.use(cors());
app.use(express.json());

// Process document with Gemini AI
async function processDocumentWithAI(text, documentType) {
  try {
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Analyze the following ${documentType} document and provide:
    1. Main categories it belongs to
    2. Key entities mentioned
    3. Overall sentiment
    4. Important dates and numbers
    5. Key topics discussed

    Document text:
    ${text.substring(0, 1000)}... // Truncate for API limits
    
    Please format the response in a structured way that can be easily parsed.`;

    // Generate content
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = response.text();
    
    // Parse the AI response into structured data
    const categories = extractCategories(analysis);
    const entities = extractEntities(analysis);
    const sentiment = determineSentiment(analysis);
    
    return {
      categories,
      entities,
      sentiment,
      confidence: 0.85, // Mock confidence score
      language: detectLanguage(text),
    };
  } catch (error) {
    console.error('Error processing document with Gemini AI:', error);
    throw error;
  }
}

// Helper functions for parsing AI response
function extractCategories(analysis) {
  // Simple implementation - in production, use proper NLP
  const categories = ['Document'];
  if (analysis.toLowerCase().includes('legal')) categories.push('Legal');
  if (analysis.toLowerCase().includes('medical')) categories.push('Medical');
  if (analysis.toLowerCase().includes('financial')) categories.push('Financial');
  if (analysis.toLowerCase().includes('business')) categories.push('Business');
  return categories;
}

function extractEntities(analysis) {
  // Implementation for entity extraction
  const entities = [];
  const entityMatches = analysis.match(/entities:.*?((?:\n|$))/i);
  if (entityMatches) {
    const entityList = entityMatches[0].split(':')[1].trim();
    entities.push(...entityList.split(',').map(e => e.trim()));
  }
  return entities.length > 0 ? entities : ['Company Names', 'Dates', 'Amounts'];
}

function determineSentiment(analysis) {
  // Implementation for sentiment analysis
  if (analysis.toLowerCase().includes('positive')) return 'positive';
  if (analysis.toLowerCase().includes('negative')) return 'negative';
  return 'neutral';
}

function detectLanguage(text) {
  // Implementation for language detection
  return 'en';
}

// API Endpoints
app.post('/api/documents/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const documentType = req.body.type || 'general';

    // In production, use proper text extraction based on file type
    const text = "Mock extracted text from document";
    
    const metadata = await processDocumentWithAI(text, documentType);

    res.json({
      success: true,
      metadata,
      file: {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
      }
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({
      success: false,
      error: 'Error processing document'
    });
  }
});

app.listen(port, () => {
  console.log(Server running on port ${port});
});
