#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load environment variables from parent directory
require('dotenv').config({ path: '../.env' });

const API_KEY = process.env.GOOGLE_VISION_API_KEY;
const VISION_API_ENDPOINT = 'https://vision.googleapis.com/v1/images:annotate';

/**
 * Test Google Vision API with a sample image
 * Usage: node test-vision-api.js <image-path>
 */
async function testVisionAPI(imagePath) {
  try {
    console.log('🔍 Testing Google Vision API...');
    console.log(`📁 Image path: ${imagePath}`);
    
    if (!API_KEY || API_KEY.includes('YOUR_')) {
      throw new Error('❌ GOOGLE_VISION_API_KEY not configured in .env file');
    }

    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`❌ Image file not found: ${imagePath}`);
    }

    // Read and encode image to base64
    console.log('📖 Reading and encoding image...');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    console.log(`📊 Image size: ${imageBuffer.length} bytes`);
    console.log(`📊 Base64 length: ${base64Image.length} characters`);

    // Prepare Vision API request
    const requestBody = {
      requests: [{
        image: { content: base64Image },
        features: [{ type: 'TEXT_DETECTION' }]
      }]
    };

    console.log('🌐 Making Vision API request...');
    const response = await fetch(`${VISION_API_ENDPOINT}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`❌ Vision API error: ${response.status} - ${errorText}`);
    }

    const visionData = await response.json();
    
    // Extract text from response
    const rawText = visionData.responses?.[0]?.fullTextAnnotation?.text;
    const textAnnotations = visionData.responses?.[0]?.textAnnotations;

    if (!rawText) {
      console.log('⚠️ No text detected in image');
      return null;
    }

    console.log('✅ Vision API successful!');
    console.log('📝 Extracted text:');
    console.log('=' .repeat(50));
    console.log(rawText);
    console.log('=' .repeat(50));

    // Save results to output file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(__dirname, 'outputs', `vision-api-output-${timestamp}.json`);
    
    const output = {
      timestamp: new Date().toISOString(),
      imagePath,
      rawText,
      fullResponse: visionData,
      textAnnotations: textAnnotations?.length || 0
    };

    fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
    console.log(`💾 Results saved to: ${outputFile}`);

    return rawText;

  } catch (error) {
    console.error('❌ Vision API test failed:', error.message);
    return null;
  }
}

// Main execution
if (require.main === module) {
  const imagePath = process.argv[2];
  
  if (!imagePath) {
    console.log('Usage: node test-vision-api.js <image-path>');
    console.log('Example: node test-vision-api.js sample-images/prescription.jpg');
    process.exit(1);
  }

  testVisionAPI(imagePath);
}

module.exports = { testVisionAPI };