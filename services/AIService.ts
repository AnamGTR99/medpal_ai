import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG, VISION_API_ENDPOINT } from '../config';

export interface ScannedData {
  name: string;
  dosage: string;
  summary: string;
  schedule: string[]; // Array of times, e.g., ["09:00 AM", "09:00 PM"]
}

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(API_CONFIG.GOOGLE_GEMINI_API_KEY);

export async function processImage(base64Image: string): Promise<ScannedData | null> {
  try {
    // Check if API keys are configured
    if (API_CONFIG.GOOGLE_VISION_API_KEY.includes('YOUR_') || API_CONFIG.GOOGLE_GEMINI_API_KEY.includes('YOUR_')) {
      console.warn('⚠️ API keys not configured. Please set up your API keys in config.ts');
      // Return demo data for testing purposes
      return {
        name: "DEMO MEDICATION",
        dosage: "10mg",
        summary: "This is demo data - please configure your API keys",
        schedule: ["09:00 AM", "09:00 PM"]
      };
    }

    // Step 1: Google Cloud Vision API Call (OCR)
    console.log('🔍 Starting OCR with Google Vision API...');
    
    const visionResponse = await fetch(`${VISION_API_ENDPOINT}?key=${API_CONFIG.GOOGLE_VISION_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        requests: [{
          image: { content: base64Image },
          features: [{ type: 'TEXT_DETECTION' }]
        }]
      })
    });

    if (!visionResponse.ok) {
      throw new Error(`Vision API error: ${visionResponse.status}`);
    }

    const visionData = await visionResponse.json();
    const rawText = visionData.responses?.[0]?.fullTextAnnotation?.text;

    if (!rawText) {
      throw new Error('No text detected in image');
    }

    console.log('✅ OCR completed. Raw text:', rawText);

    // Step 2: Google Gemini API Call (Parsing)
    console.log('🧠 Starting AI parsing with Gemini...');
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `You are a medical information parser. Analyze the OCR text from a prescription label and extract the medication's name, dosage, and intake schedule into a structured JSON object. Today's date is August 31, 2025. Infer schedule times from phrases like 'morning' (09:00), 'after lunch' (13:00), 'night' (21:00), or 'twice a day' (09:00, 21:00). Your entire response must be ONLY the JSON object.

**JSON Output Requirements:**
- "name": The medication name.
- "dosage": The dosage string (e.g., "20mg").
- "summary": A simple, one-sentence summary of what the medication is typically for.
- "schedule": An array of time strings in "HH:MM AM/PM" format.

**Input Text:**
${rawText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('🤖 AI Response:', text);

    // Parse the JSON response
    const cleanedText = text.replace(/```json|```/g, '').trim();
    const parsedData: ScannedData = JSON.parse(cleanedText);

    console.log('✅ Successfully parsed medication data:', parsedData);
    
    return parsedData;

  } catch (error) {
    console.error('❌ Error processing image:', error);
    return null;
  }
}