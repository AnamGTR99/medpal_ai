#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { testVisionAPI } = require('./test-vision-api');
const { testGeminiAPI } = require('./test-gemini-api');

// Load environment variables from parent directory
require('dotenv').config({ path: '../.env' });

/**
 * Test the complete AI pipeline: Image → Vision API → Gemini API → Structured Data
 * Usage: node test-full-pipeline.js <image-path>
 */
async function testFullPipeline(imagePath) {
  try {
    console.log('🚀 Testing Full AI Pipeline...');
    console.log('=' .repeat(60));
    
    const startTime = Date.now();

    // Step 1: Google Vision API (OCR)
    console.log('\n📖 STEP 1: Google Vision API (OCR)');
    console.log('-' .repeat(40));
    const rawText = await testVisionAPI(imagePath);
    
    if (!rawText) {
      throw new Error('❌ Failed to extract text from image');
    }

    // Step 2: Google Gemini API (Parsing)
    console.log('\n🧠 STEP 2: Google Gemini API (Parsing)');
    console.log('-' .repeat(40));
    const parsedData = await testGeminiAPI(rawText);

    if (!parsedData) {
      throw new Error('❌ Failed to parse text with Gemini');
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Final Results
    console.log('\n✅ PIPELINE COMPLETE!');
    console.log('=' .repeat(60));
    console.log(`⏱️ Total processing time: ${totalTime}ms`);
    
    if (parsedData.error) {
      console.log('⚠️ Pipeline completed with parsing errors');
    } else {
      console.log('🎉 Pipeline completed successfully!');
      console.log('\n📋 Final Medication Data:');
      console.log('- Name:', parsedData.name);
      console.log('- Dosage:', parsedData.dosage);
      console.log('- Summary:', parsedData.summary);
      console.log('- Schedule:', parsedData.schedule?.join(', '));
    }

    // Save complete pipeline results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(__dirname, 'outputs', `full-pipeline-${timestamp}.json`);
    
    const pipelineOutput = {
      timestamp: new Date().toISOString(),
      imagePath,
      processingTimeMs: totalTime,
      steps: {
        step1_vision: {
          success: !!rawText,
          rawText: rawText
        },
        step2_gemini: {
          success: !!parsedData && !parsedData.error,
          parsedData: parsedData
        }
      },
      finalResult: parsedData,
      success: !!parsedData && !parsedData.error
    };

    fs.writeFileSync(outputFile, JSON.stringify(pipelineOutput, null, 2));
    console.log(`\n💾 Complete pipeline results saved to: ${outputFile}`);

    return pipelineOutput;

  } catch (error) {
    console.error('\n❌ Pipeline test failed:', error.message);
    return null;
  }
}

// Batch testing function
async function testMultipleImages(imageDir) {
  console.log(`🗂️ Testing multiple images from: ${imageDir}`);
  
  if (!fs.existsSync(imageDir)) {
    console.error(`❌ Directory not found: ${imageDir}`);
    return;
  }

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
  const imageFiles = fs.readdirSync(imageDir)
    .filter(file => imageExtensions.some(ext => file.toLowerCase().endsWith(ext)))
    .map(file => path.join(imageDir, file));

  if (imageFiles.length === 0) {
    console.log('❌ No image files found in directory');
    return;
  }

  console.log(`📸 Found ${imageFiles.length} image(s) to test:`);
  imageFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${path.basename(file)}`);
  });

  const results = [];
  
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    console.log(`\n${'='.repeat(80)}`);
    console.log(`🖼️ Testing Image ${i + 1}/${imageFiles.length}: ${path.basename(imageFile)}`);
    console.log('=' .repeat(80));
    
    const result = await testFullPipeline(imageFile);
    results.push({
      imagePath: imageFile,
      result: result
    });

    // Add a small delay between tests
    if (i < imageFiles.length - 1) {
      console.log('\n⏳ Waiting 2 seconds before next test...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Summary
  const successCount = results.filter(r => r.result?.success).length;
  console.log(`\n${'='.repeat(80)}`);
  console.log('📊 BATCH TESTING SUMMARY');
  console.log('=' .repeat(80));
  console.log(`✅ Successful: ${successCount}/${results.length}`);
  console.log(`❌ Failed: ${results.length - successCount}/${results.length}`);

  return results;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage:');
    console.log('  node test-full-pipeline.js <image-path>');
    console.log('  node test-full-pipeline.js --batch <image-directory>');
    console.log('Examples:');
    console.log('  node test-full-pipeline.js sample-images/prescription.jpg');
    console.log('  node test-full-pipeline.js --batch sample-images/');
    process.exit(1);
  }

  if (args[0] === '--batch') {
    const imageDir = args[1] || path.join(__dirname, 'sample-images');
    testMultipleImages(imageDir);
  } else {
    const imagePath = args[0];
    testFullPipeline(imagePath);
  }
}

module.exports = { testFullPipeline, testMultipleImages };