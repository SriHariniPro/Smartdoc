import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Configuration, OpenAIApi } from 'openai';
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

// Configure OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.use(cors());
app.use(express.json());

// Process document with AI
async function processDocumentWithAI(text, documentType) {
  try {
    const prompt = `Analyze the following ${documentType} document and provide:
    1. Main categories it belongs to
    2. Key entities mentioned
    3. Overall sentiment
    4. Important dates and numbers
    5. Key topics discussed

    Document text:
    ${text.substring(0, 1000)}... // Truncate for API limits
    `;

    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt,
      max_tokens: 500,
      temperature: 0.3,
    });

    const analysis = completion.data.choices[0].text;
    
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
    console.error('Error processing document with AI:', error);
    throw error;
  }
}

// Helper functions for parsing AI response
function extractCategories(analysis) {
  // Simple mock implementation - in production, use proper NLP
  const categories = ['Document'];
  if (analysis.toLowerCase().includes('legal')) categories.push('Legal');
  if (analysis.toLowerCase().includes('medical')) categories.push('Medical');
  if (analysis.toLowerCase().includes('financial')) categories.push('Financial');
  if (analysis.toLowerCase().includes('business')) categories.push('Business');
  return categories;
}

function extractEntities(analysis) {
  // Mock implementation - in production, use Named Entity Recognition
  return ['Company Names', 'Dates', 'Amounts'];
}

function determineSentiment(analysis) {
  // Mock implementation - in production, use sentiment analysis
  return 'neutral';
}

function detectLanguage(text) {
  // Mock implementation - in production, use language detection
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
  console.log(`Server running on port ${port}`);
}); 