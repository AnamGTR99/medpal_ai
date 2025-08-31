#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { testVisionAPI } = require('./test-vision-api');
const { testEnhancedGeminiAPI } = require('./test-enhanced-gemini');

// Load environment variables from parent directory
require('dotenv').config({ path: '../.env' });

/**
 * Test the enhanced full AI pipeline: Image → Vision API → Enhanced Gemini API → Comprehensive Medication Data
 * Usage: node test-enhanced-full-pipeline.js <image-path>
 */
async function testEnhancedFullPipeline(imagePath) {
  try {
    console.log('🚀 Testing Enhanced Full AI Pipeline...');
    console.log('=' .repeat(80));
    console.log('📋 New Features: Simple language, side effects, interactions, safety tips');
    console.log('=' .repeat(80));
    
    const startTime = Date.now();

    // Step 1: Google Vision API (OCR)
    console.log('\n📖 STEP 1: Google Vision API (OCR)');
    console.log('-' .repeat(50));
    const rawText = await testVisionAPI(imagePath);
    
    if (!rawText) {
      throw new Error('❌ Failed to extract text from image');
    }

    // Step 2: Enhanced Google Gemini API (Comprehensive Parsing)
    console.log('\n🧠 STEP 2: Enhanced Google Gemini API (Comprehensive Analysis)');
    console.log('-' .repeat(50));
    const enhancedData = await testEnhancedGeminiAPI(rawText);

    if (!enhancedData) {
      throw new Error('❌ Failed to parse text with Enhanced Gemini');
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Enhanced Results Display
    console.log('\n✅ ENHANCED PIPELINE COMPLETE!');
    console.log('=' .repeat(80));
    console.log(`⏱️ Total processing time: ${totalTime}ms`);
    
    if (enhancedData.error) {
      console.log('⚠️ Pipeline completed with parsing errors');
    } else {
      console.log('🎉 Enhanced pipeline completed successfully!');
      
      // Detailed medication information display
      console.log('\n📋 COMPREHENSIVE MEDICATION INFORMATION:');
      console.log('=' .repeat(60));
      
      // Basic Info
      console.log(`💊 Medication: ${enhancedData.name}`);
      console.log(`💉 Dosage: ${enhancedData.dosage}`);
      console.log(`⏰ Schedule: ${enhancedData.schedule?.join(', ') || 'As needed'}`);
      
      // What it does
      console.log(`\n🎯 What this medicine does:`);
      console.log(`   ${enhancedData.whatItDoes}`);
      console.log(`\n🔧 How it helps you:`);
      console.log(`   ${enhancedData.howItHelps}`);
      
      // Side Effects
      if (enhancedData.commonSideEffects?.length > 0) {
        console.log(`\n⚠️ Common side effects you might notice:`);
        enhancedData.commonSideEffects.forEach(effect => console.log(`   • ${effect}`));
      }
      
      if (enhancedData.seriousSideEffects?.length > 0) {
        console.log(`\n🚨 Serious side effects - get help immediately:`);
        enhancedData.seriousSideEffects.forEach(effect => console.log(`   • ${effect}`));
      }
      
      // Interactions
      if (enhancedData.interactions?.length > 0) {
        console.log(`\n🤝 Things to be careful about:`);
        enhancedData.interactions.forEach(interaction => console.log(`   • ${interaction}`));
      }
      
      // Important Tips
      if (enhancedData.importantTips?.length > 0) {
        console.log(`\n💡 Important tips for taking this medicine:`);
        enhancedData.importantTips.forEach(tip => console.log(`   • ${tip}`));
      }
      
      // When to call doctor
      if (enhancedData.whenToCallDoctor?.length > 0) {
        console.log(`\n📞 When to call your doctor:`);
        enhancedData.whenToCallDoctor.forEach(reason => console.log(`   • ${reason}`));
      }
    }

    // Save comprehensive pipeline results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(__dirname, 'outputs', `enhanced-full-pipeline-${timestamp}.json`);
    
    const pipelineOutput = {
      timestamp: new Date().toISOString(),
      imagePath,
      processingTimeMs: totalTime,
      pipelineVersion: 'enhanced',
      features: [
        'Simple language for all ages',
        'Comprehensive side effects',
        'Drug interactions',
        'Safety tips',
        'Emergency guidance',
        'When to call doctor'
      ],
      steps: {
        step1_vision: {
          success: !!rawText,
          rawText: rawText
        },
        step2_enhanced_gemini: {
          success: !!enhancedData && !enhancedData.error,
          enhancedData: enhancedData
        }
      },
      finalResult: enhancedData,
      success: !!enhancedData && !enhancedData.error
    };

    fs.writeFileSync(outputFile, JSON.stringify(pipelineOutput, null, 2));
    console.log(`\n💾 Complete enhanced pipeline results saved to: ${outputFile}`);

    return pipelineOutput;

  } catch (error) {
    console.error('\n❌ Enhanced pipeline test failed:', error.message);
    return null;
  }
}

// Batch testing with enhanced features
async function testMultipleImagesEnhanced(imageDir) {
  console.log(`🗂️ Testing multiple images with enhanced pipeline from: ${imageDir}`);
  
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

  console.log(`📸 Found ${imageFiles.length} image(s) for enhanced testing:`);
  imageFiles.forEach((file, index) => {
    console.log(`  ${index + 1}. ${path.basename(file)}`);
  });

  const results = [];
  
  for (let i = 0; i < imageFiles.length; i++) {
    const imageFile = imageFiles[i];
    console.log(`\n${'='.repeat(100)}`);
    console.log(`🖼️ Enhanced Testing Image ${i + 1}/${imageFiles.length}: ${path.basename(imageFile)}`);
    console.log('=' .repeat(100));
    
    const result = await testEnhancedFullPipeline(imageFile);
    results.push({
      imagePath: imageFile,
      result: result
    });

    // Add delay between tests
    if (i < imageFiles.length - 1) {
      console.log('\n⏳ Waiting 3 seconds before next enhanced test...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Enhanced Summary
  const successCount = results.filter(r => r.result?.success).length;
  console.log(`\n${'='.repeat(100)}`);
  console.log('📊 ENHANCED BATCH TESTING SUMMARY');
  console.log('=' .repeat(100));
  console.log(`✅ Successful enhanced analyses: ${successCount}/${results.length}`);
  console.log(`❌ Failed analyses: ${results.length - successCount}/${results.length}`);
  console.log(`🆕 Enhanced features: Simple language, side effects, interactions, safety tips`);

  return results;
}

// Main execution
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Enhanced AI Pipeline Usage:');
    console.log('  node test-enhanced-full-pipeline.js <image-path>');
    console.log('  node test-enhanced-full-pipeline.js --batch <image-directory>');
    console.log('Examples:');
    console.log('  node test-enhanced-full-pipeline.js sample-images/prescription-test.JPG');
    console.log('  node test-enhanced-full-pipeline.js --batch sample-images/');
    console.log('\n🆕 Enhanced Features:');
    console.log('  • Simple language for all ages');
    console.log('  • Comprehensive side effects');
    console.log('  • Drug interactions & warnings');
    console.log('  • Important safety tips');
    console.log('  • When to call doctor guidance');
    process.exit(1);
  }

  if (args[0] === '--batch') {
    const imageDir = args[1] || path.join(__dirname, 'sample-images');
    testMultipleImagesEnhanced(imageDir);
  } else {
    const imagePath = args[0];
    testEnhancedFullPipeline(imagePath);
  }
}

module.exports = { testEnhancedFullPipeline, testMultipleImagesEnhanced };