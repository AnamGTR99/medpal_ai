import { GoogleGenerativeAI } from '@google/generative-ai';
import { API_CONFIG, VISION_API_ENDPOINT } from '../config';
import { ScannedData } from '../types';

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
        doses: "1 Pill",
        instructions: "after meal",
        frequency: "Twice Daily",
        treatment: "Demo condition - please configure your API keys",
        sideEffects: "Demo side effects",
        detailedDescription: "This is demo data - please configure your API keys in config.ts",
        imageUri: ""
      };
    }

    // Step 1: Google Cloud Vision API Call (OCR)
    console.log('🔍 Starting OCR with Google Vision API...');
    console.log('📊 Base64 image length:', base64Image ? base64Image.length : 'null');
    console.log('📊 Base64 starts with:', base64Image ? base64Image.substring(0, 50) + '...' : 'null');
    
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

    console.log('📡 Vision API response status:', visionResponse.status);

    if (!visionResponse.ok) {
      const errorText = await visionResponse.text();
      console.error('❌ Vision API error details:', errorText);
      throw new Error(`Vision API error: ${visionResponse.status} - ${errorText}`);
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
    
    const prompt = `You are analyzing text from a scanned image. Extract information about the product and provide relevant health/usage details.

**Instructions:**
1. Identify the product from the text
2. Provide health benefits, uses, or effects if any exist
3. Include potential side effects or risks if applicable
4. Your response must ALWAYS be ONLY a valid JSON object

**Required JSON Fields (always include):**
- "name": Product name from the text
- "doses": Dose/serving info if applicable, otherwise "Not specified"
- "instructions": Usage instructions if mentioned, otherwise empty string
- "frequency": How often to use/take if mentioned, otherwise "Not specified" 
- "treatment": What it helps with, treats, or is used for (be specific about actual benefits)
- "sideEffects": Any potential side effects, risks, or warnings (be realistic about actual risks)
- "detailedDescription": Full description including purpose, benefits, and any precautions

**Examples:**

**Prescription medication:**
{
  "name": "Aspirin",
  "doses": "100mg",
  "instructions": "with food", 
  "frequency": "Daily",
  "treatment": "Pain relief, heart disease prevention, inflammation reduction",
  "sideEffects": "Stomach irritation, bleeding risk, allergic reactions",
  "detailedDescription": "Aspirin is a pain reliever and anti-inflammatory medication used for headaches, heart disease prevention, and reducing inflammation."
}

**Health product (e.g., vitamins, supplements):**
{
  "name": "Vitamin C Tablets",
  "doses": "1000mg",
  "instructions": "with water",
  "frequency": "Daily", 
  "treatment": "Immune system support, antioxidant protection, wound healing",
  "sideEffects": "Stomach upset if taken on empty stomach, kidney stones with excessive use",
  "detailedDescription": "Vitamin C supplement that supports immune function and provides antioxidant benefits."
}

**Consumable with health effects:**
{
  "name": "ZYN Nicotine Pouches",
  "doses": "Not specified",
  "instructions": "",
  "frequency": "Not specified",
  "treatment": "Nicotine delivery, smoking cessation aid",
  "sideEffects": "Mouth irritation, nausea, dizziness, headache, increased blood pressure, addiction potential",
  "detailedDescription": "Smokeless nicotine pouches that deliver nicotine without tobacco, used as an alternative to smoking or for nicotine replacement."
}

**Regular consumer product:**
{
  "name": "Spring Water",
  "doses": "Not specified",
  "instructions": "",
  "frequency": "Not specified", 
  "treatment": "Hydration, essential for body functions",
  "sideEffects": "None under normal consumption",
  "detailedDescription": "Natural spring water for hydration and supporting normal bodily functions."
}

**Input Text:**
${rawText}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('🤖 AI Response:', text);

    // Parse the JSON response with better error handling
    let cleanedText = text.replace(/```json|```/g, '').trim();
    
    // Remove any markdown formatting
    if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/```[\w]*\n?/g, '').replace(/```/g, '').trim();
    }
    
    console.log('🧹 Cleaned AI Response:', cleanedText);
    
    if (!cleanedText || cleanedText === '{}') {
      throw new Error('Empty or invalid AI response');
    }
    
    const parsedData: ScannedData = JSON.parse(cleanedText);
    
    // Validate required fields and provide defaults if missing
    if (!parsedData.name) {
      parsedData.name = "Unknown Product";
    }
    if (!parsedData.doses) {
      parsedData.doses = "Not specified";
    }
    if (!parsedData.frequency) {
      parsedData.frequency = "Not specified";
    }
    if (!parsedData.treatment) {
      parsedData.treatment = "Not specified";
    }
    if (!parsedData.sideEffects) {
      parsedData.sideEffects = "Not specified";
    }
    if (!parsedData.detailedDescription) {
      parsedData.detailedDescription = "No description available";
    }
    if (!parsedData.instructions) {
      parsedData.instructions = "";
    }

    console.log('✅ Successfully parsed medication data:', parsedData);
    
    return parsedData;

  } catch (error) {
    console.error('❌ Error processing image:', error);
    return null;
  }
}