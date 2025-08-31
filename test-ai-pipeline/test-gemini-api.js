#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables from parent directory
require('dotenv').config({ path: '../.env' });

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

/**
 * Test Google Gemini API with OCR text
 * Usage: node test-gemini-api.js "<raw-text>" or node test-gemini-api.js --file <text-file>
 */
async function testGeminiAPI(rawText) {
  try {
    console.log('🧠 Testing Google Gemini API...');
    
    if (!API_KEY || API_KEY.includes('YOUR_')) {
      throw new Error('❌ GOOGLE_GEMINI_API_KEY not configured in .env file');
    }

    if (!rawText || rawText.trim().length === 0) {
      throw new Error('❌ No text provided for parsing');
    }

    console.log('📝 Input text:');
    console.log('=' .repeat(30));
    console.log(rawText);
    console.log('=' .repeat(30));

    // Initialize Gemini AI
    console.log('🔗 Initializing Gemini API...');
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create the prompt
    const prompt = `You are a medical information parser. Analyze the OCR text from a prescription label and extract the medication's name, dosage, and intake schedule into a structured JSON object. Today's date is August 31, 2025. Infer schedule times from phrases like 'morning' (09:00), 'after lunch' (13:00), 'night' (21:00), or 'twice a day' (09:00, 21:00). Your entire response must be ONLY the JSON object.

**JSON Output Requirements:**
- "name": The medication name.
- "dosage": The dosage string (e.g., "20mg").
- "summary": A simple, one-sentence summary of what the medication is typically for.
- "schedule": An array of time strings in "HH:MM AM/PM" format.

**Input Text:**
${rawText}`;

    console.log('🤖 Making Gemini API request...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('🤖 Raw Gemini Response:');
    console.log('=' .repeat(40));
    console.log(text);
    console.log('=' .repeat(40));

    // Try to parse the JSON response
    const cleanedText = text.replace(/```json|```/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanedText);
      console.log('✅ Successfully parsed JSON:');
      console.log(JSON.stringify(parsedData, null, 2));
    } catch (parseError) {
      console.log('⚠️ Failed to parse as JSON, but got response');
      parsedData = {
        error: 'Failed to parse JSON',
        rawResponse: text,
        cleanedText: cleanedText
      };
    }

    // Save results to output file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(__dirname, 'outputs', `gemini-api-output-${timestamp}.json`);
    
    const output = {
      timestamp: new Date().toISOString(),
      inputText: rawText,
      rawResponse: text,
      cleanedResponse: cleanedText,
      parsedData: parsedData,
      success: !!parsedData && !parsedData.error
    };

    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    console.log(`💾 Results saved to: ${outputFile}`);

    return parsedData;

  } catch (error) {
    console.error('❌ Gemini API test failed:', error.message);
    return null;
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node test-gemini-api.js "<raw-text>"');
    console.log('  node test-gemini-api.js --file <text-file>');
    console.log('Example:');
    console.log('  node test-gemini-api.js "Amoxicillin 500mg Take twice daily"');
    console.log('  node test-gemini-api.js --file sample-ocr-text.txt');
    process.exit(1);
  }

  let rawText;
  
  if (args[0] === '--file') {
    const textFile = args[1];
    if (!textFile || !fs.existsSync(textFile)) {
      console.error('❌ Text file not found:', textFile);
      process.exit(1);
    }
    rawText = fs.readFileSync(textFile, 'utf8');
  } else {
    rawText = args.join(' ');
  }

  testGeminiAPI(rawText);
}

module.exports = { testGeminiAPI };