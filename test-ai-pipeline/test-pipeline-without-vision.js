#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { testGeminiAPI } = require('./test-gemini-api');

// Load environment variables from parent directory
require('dotenv').config({ path: '../.env' });

/**
 * Test pipeline using sample OCR text (bypassing Vision API)
 * This simulates what would happen after Vision API extracts text
 */
async function testPipelineWithoutVision() {
  try {
    console.log('🚀 Testing AI Pipeline (Simulated OCR + Real Gemini)');
    console.log('=' .repeat(60));
    
    // Load sample OCR text (simulates Vision API output)
    const ocrTextFile = path.join(__dirname, 'sample-ocr-text.txt');
    const rawText = fs.readFileSync(ocrTextFile, 'utf8');
    
    console.log('📖 SIMULATED STEP 1: Vision API (OCR)');
    console.log('-' .repeat(40));
    console.log('✅ Using sample OCR text (simulating Vision API):');
    console.log('📝 Extracted text:');
    console.log('=' .repeat(50));
    console.log(rawText);
    console.log('=' .repeat(50));

    const startTime = Date.now();

    // Step 2: Real Gemini API (Parsing)
    console.log('\n🧠 STEP 2: Google Gemini API (Parsing)');
    console.log('-' .repeat(40));
    const parsedData = await testGeminiAPI(rawText);

    if (!parsedData) {
      throw new Error('❌ Failed to parse text with Gemini');
    }

    const endTime = Date.now();
    const totalTime = endTime - startTime;

    // Final Results
    console.log('\n✅ SIMULATED PIPELINE COMPLETE!');
    console.log('=' .repeat(60));
    console.log(`⏱️ Gemini processing time: ${totalTime}ms`);
    
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

    // Test different OCR scenarios
    console.log('\n🧪 Testing Additional OCR Scenarios...');
    console.log('=' .repeat(60));

    const testCases = [
      {
        name: "Short Prescription",
        text: "Ibuprofen 200mg\nTake 1 tablet every 4-6 hours as needed"
      },
      {
        name: "Complex Schedule", 
        text: "Lisinopril 10mg\nTake one tablet in the morning\nFor high blood pressure\n30 day supply"
      },
      {
        name: "Multiple Times",
        text: "Metformin 500mg\nTake twice daily\nWith breakfast and dinner\n90 tablets"
      }
    ];

    const results = [];
    
    for (let i = 0; i < testCases.length; i++) {
      const testCase = testCases[i];
      console.log(`\n🔬 Test Case ${i + 1}: ${testCase.name}`);
      console.log('-' .repeat(30));
      console.log('Input:', testCase.text.replace(/\n/g, ' | '));
      
      const result = await testGeminiAPI(testCase.text);
      results.push({
        testCase: testCase.name,
        input: testCase.text,
        output: result,
        success: !result?.error
      });

      if (result && !result.error) {
        console.log('✅ Success:', result.name, '-', result.dosage);
      } else {
        console.log('❌ Failed to parse');
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Summary
    const successCount = results.filter(r => r.success).length;
    console.log(`\n📊 TEST SUMMARY`);
    console.log('=' .repeat(40));
    console.log(`✅ Successful parses: ${successCount + 1}/${results.length + 1}`);
    console.log(`❌ Failed parses: ${results.length - successCount}/${results.length + 1}`);

    // Save complete test results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(__dirname, 'outputs', `simulated-pipeline-${timestamp}.json`);
    
    const pipelineOutput = {
      timestamp: new Date().toISOString(),
      mainTest: {
        inputText: rawText,
        output: parsedData,
        processingTimeMs: totalTime,
        success: !!parsedData && !parsedData.error
      },
      additionalTests: results,
      summary: {
        totalTests: results.length + 1,
        successful: successCount + 1,
        failed: results.length - successCount
      }
    };

    fs.writeFileSync(outputFile, JSON.stringify(pipelineOutput, null, 2));
    console.log(`\n💾 Complete test results saved to: ${outputFile}`);

    return pipelineOutput;

  } catch (error) {
    console.error('\n❌ Simulated pipeline test failed:', error.message);
    return null;
  }
}

// Main execution
if (require.main === module) {
  testPipelineWithoutVision();
}

module.exports = { testPipelineWithoutVision };