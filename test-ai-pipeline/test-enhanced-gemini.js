#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Load environment variables from parent directory
require('dotenv').config({ path: '../.env' });

const API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

/**
 * Enhanced Gemini API test with comprehensive medication information
 * Includes: simple explanation, side effects, interactions, and safety info
 */
async function testEnhancedGeminiAPI(rawText) {
  try {
    console.log('🧠 Testing Enhanced Gemini API...');
    
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
    console.log('🔗 Initializing Enhanced Gemini API...');
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Enhanced prompt for comprehensive medication information
    const enhancedPrompt = `You are a helpful medical assistant. Analyze the OCR text from a prescription label and provide comprehensive, easy-to-understand medication information. Use simple language that anyone can understand, including children and elderly patients.

**Instructions:**
- Extract medication details and provide helpful information
- Use simple, clear language (5th grade reading level)
- Include important safety information
- Today's date is August 31, 2025
- Convert schedule phrases to specific times: 'morning' (8:00 AM), 'afternoon' (2:00 PM), 'evening' (6:00 PM), 'night' (10:00 PM), 'twice daily' (8:00 AM, 8:00 PM)
- Your response must be ONLY a JSON object

**Required JSON Format:**
{
  "name": "Medication name",
  "dosage": "Dose amount (e.g., 500mg)",
  "schedule": ["8:00 AM", "8:00 PM"],
  "whatItDoes": "Simple explanation of what this medicine treats (1-2 sentences)",
  "howItHelps": "Easy explanation of how the medicine works in your body",
  "commonSideEffects": [
    "Most common side effects in simple terms",
    "Use everyday language, not medical jargon"
  ],
  "seriousSideEffects": [
    "Warning signs that need immediate medical attention",
    "When to call a doctor or go to hospital"
  ],
  "interactions": [
    "Foods, drinks, or other medicines to avoid or be careful with",
    "Simple warnings about mixing with other things"
  ],
  "importantTips": [
    "Easy-to-follow advice about taking this medicine",
    "Helpful reminders for best results"
  ],
  "whenToCallDoctor": [
    "Clear signs that mean you should contact your doctor",
    "Simple warning signs to watch for"
  ]
}

**OCR Text to Analyze:**
${rawText}

Remember: Use simple, friendly language that a 10-year-old could understand, but include all important medical safety information.`;

    console.log('🤖 Making Enhanced Gemini API request...');
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    console.log('🤖 Raw Enhanced Gemini Response:');
    console.log('=' .repeat(50));
    console.log(text);
    console.log('=' .repeat(50));

    // Try to parse the JSON response
    const cleanedText = text.replace(/```json|```/g, '').trim();
    
    let parsedData;
    try {
      parsedData = JSON.parse(cleanedText);
      console.log('✅ Successfully parsed Enhanced JSON:');
      console.log(JSON.stringify(parsedData, null, 2));
    } catch (parseError) {
      console.log('⚠️ Failed to parse as JSON, but got response');
      parsedData = {
        error: 'Failed to parse JSON',
        rawResponse: text,
        cleanedText: cleanedText
      };
    }

    // Display user-friendly summary
    if (parsedData && !parsedData.error) {
      console.log('\n📋 USER-FRIENDLY SUMMARY:');
      console.log('=' .repeat(50));
      console.log(`💊 Medicine: ${parsedData.name} (${parsedData.dosage})`);
      console.log(`⏰ When to take: ${parsedData.schedule?.join(', ') || 'As needed'}`);
      console.log(`🎯 What it does: ${parsedData.whatItDoes}`);
      console.log(`🔧 How it helps: ${parsedData.howItHelps}`);
      
      if (parsedData.commonSideEffects?.length > 0) {
        console.log(`⚠️ Common side effects:`);
        parsedData.commonSideEffects.forEach(effect => console.log(`   • ${effect}`));
      }
      
      if (parsedData.importantTips?.length > 0) {
        console.log(`💡 Important tips:`);
        parsedData.importantTips.forEach(tip => console.log(`   • ${tip}`));
      }
    }

    // Save results to output file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(__dirname, 'outputs', `enhanced-gemini-${timestamp}.json`);
    
    const output = {
      timestamp: new Date().toISOString(),
      inputText: rawText,
      rawResponse: text,
      cleanedResponse: cleanedText,
      parsedData: parsedData,
      success: !!parsedData && !parsedData.error,
      enhancedFeatures: [
        'Simple language for all ages',
        'Comprehensive side effects',
        'Drug interactions',
        'Safety tips',
        'When to call doctor'
      ]
    };

    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    console.log(`\n💾 Enhanced results saved to: ${outputFile}`);

    return parsedData;

  } catch (error) {
    console.error('❌ Enhanced Gemini API test failed:', error.message);
    return null;
  }
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node test-enhanced-gemini.js "<raw-text>"');
    console.log('  node test-enhanced-gemini.js --file <text-file>');
    console.log('Example:');
    console.log('  node test-enhanced-gemini.js --file sample-ocr-text.txt');
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

  testEnhancedGeminiAPI(rawText);
}

module.exports = { testEnhancedGeminiAPI };