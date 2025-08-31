#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: '../.env' });

// Alternative Vision API test using service account
// This approach is more reliable than API keys for Vision API

/**
 * Instructions for setting up service account authentication:
 * 
 * 1. Go to Google Cloud Console > IAM & Admin > Service Accounts
 * 2. Create a new service account
 * 3. Grant it "Cloud Vision API User" role
 * 4. Download the JSON key file
 * 5. Add GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json to .env
 * 6. Or set the environment variable: export GOOGLE_APPLICATION_CREDENTIALS="path/to/key.json"
 */

async function testVisionWithServiceAccount(imagePath) {
  try {
    console.log('🔍 Testing Google Vision API with Service Account...');
    
    // Check if we have Google Cloud client library
    let vision;
    try {
      vision = require('@google-cloud/vision');
    } catch (error) {
      console.log('❌ @google-cloud/vision not installed');
      console.log('📦 To install: npm install @google-cloud/vision');
      console.log('📚 Or continue using API key method once billing is enabled');
      return null;
    }

    console.log(`📁 Image path: ${imagePath}`);
    
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`❌ Image file not found: ${imagePath}`);
    }

    // Create Vision client
    const client = new vision.ImageAnnotatorClient();

    console.log('🌐 Making Vision API request with service account...');
    
    // Perform text detection
    const [result] = await client.textDetection(imagePath);
    const detections = result.textAnnotations;
    
    if (!detections || detections.length === 0) {
      console.log('⚠️ No text detected in image');
      return null;
    }

    const rawText = detections[0].description;
    
    console.log('✅ Vision API successful!');
    console.log('📝 Extracted text:');
    console.log('=' .repeat(50));
    console.log(rawText);
    console.log('=' .repeat(50));

    // Save results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(__dirname, 'outputs', `vision-service-account-${timestamp}.json`);
    
    const output = {
      timestamp: new Date().toISOString(),
      imagePath,
      rawText,
      detectionCount: detections.length,
      authMethod: 'service-account'
    };

    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    console.log(`💾 Results saved to: ${outputFile}`);

    return rawText;

  } catch (error) {
    console.error('❌ Vision API with service account failed:', error.message);
    
    if (error.message.includes('GOOGLE_APPLICATION_CREDENTIALS')) {
      console.log('\n💡 Setup Instructions:');
      console.log('1. Create service account in Google Cloud Console');
      console.log('2. Download JSON key file');
      console.log('3. Set GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json in .env');
    }
    
    return null;
  }
}

// Main execution
if (require.main === module) {
  const imagePath = process.argv[2];
  
  if (!imagePath) {
    console.log('Usage: node test-vision-with-service-account.js <image-path>');
    process.exit(1);
  }

  testVisionWithServiceAccount(imagePath);
}

module.exports = { testVisionWithServiceAccount };