# MedPal AI Pipeline Testing Suite

A comprehensive testing framework for MedPal's AI-powered medication scanning and analysis system. This suite tests the complete pipeline from image capture to user-friendly medication information delivery.

## 🔄 Pipeline Overview

MedPal's AI pipeline transforms prescription images into comprehensive, easy-to-understand medication information through a sophisticated multi-step process:

```
📱 Image Capture → 🔍 OCR Extraction → 🧠 AI Analysis → 📋 User-Friendly Info
    (Camera)       (Google Vision)    (Gemini AI)     (Enhanced Output)
```

### Pipeline Stages

1. **📷 Image Capture**: User points camera at prescription label/bottle
2. **🔍 OCR Processing**: Google Cloud Vision API extracts all text from image
3. **🧠 AI Analysis**: Google Gemini AI parses and enriches the raw text
4. **📋 Information Delivery**: Structured, user-friendly medication data

## 🧪 Test Scripts Overview

### Core Testing Scripts

| Script | Purpose | Output |
|--------|---------|---------|
| `test-vision-api.js` | Tests OCR functionality only | Raw text extraction |
| `test-gemini-api.js` | Tests basic AI parsing | Simple medication data |
| `test-enhanced-gemini.js` | Tests comprehensive AI analysis | Full medication information |
| `test-full-pipeline.js` | Tests complete basic pipeline | End-to-end basic flow |
| `test-enhanced-full-pipeline.js` | Tests complete enhanced pipeline | End-to-end enhanced flow |

### Utility Scripts

| Script | Purpose |
|--------|---------|
| `test-pipeline-without-vision.js` | Simulates pipeline without Vision API |
| `test-vision-with-service-account.js` | Alternative Vision API authentication |

## 🆕 Enhanced Features

The enhanced pipeline provides comprehensive medication information suitable for all ages:

### 📋 Information Categories

- **💊 Basic Info**: Name, dosage, schedule
- **🎯 Purpose**: What the medicine treats (simple explanation)
- **🔧 Mechanism**: How it works in your body
- **⚠️ Side Effects**: Common and serious reactions
- **🤝 Interactions**: Food, drink, and drug interactions
- **💡 Safety Tips**: Best practices for taking medication
- **📞 Emergency Guidance**: When to call doctor or seek help

### 🎯 Language Features

- **5th grade reading level** - accessible to all ages
- **Friendly terminology** - "tummy ache" vs "gastrointestinal distress"
- **Clear emergency instructions** - when to call 911
- **Practical advice** - everyday tips for safe medication use

## 🚀 Quick Start Guide

### Prerequisites

1. **Environment Setup**:
   ```bash
   # Copy environment template
   cp .env.example .env
   
   # Add your API keys to .env
   GOOGLE_VISION_API_KEY=your_vision_api_key_here
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

2. **Install Dependencies**:
   ```bash
   # From project root
   npm install dotenv @google/generative-ai
   ```

3. **API Configuration**:
   - Enable Google Cloud Vision API in your Google Cloud Console
   - Enable billing for Vision API (required even for free tier)
   - Ensure API keys have proper permissions

### Basic Testing

```bash
cd test-ai-pipeline

# Test individual components
node test-vision-api.js sample-images/prescription-test.JPG
node test-enhanced-gemini.js --file sample-ocr-text.txt

# Test complete enhanced pipeline
node test-enhanced-full-pipeline.js sample-images/prescription-test.JPG
```

## 📖 Detailed Usage Guide

### 1. Individual Component Testing

#### Vision API OCR Testing
```bash
node test-vision-api.js <image-path>
```
**Purpose**: Test Google Cloud Vision API text extraction
**Output**: Raw OCR text and confidence scores
**Use Case**: Debugging OCR accuracy issues

#### Enhanced Gemini AI Testing
```bash
node test-enhanced-gemini.js "<raw-text>"
node test-enhanced-gemini.js --file sample-ocr-text.txt
```
**Purpose**: Test comprehensive medication analysis
**Output**: Detailed medication information with safety data
**Use Case**: Testing AI parsing accuracy and completeness

### 2. Complete Pipeline Testing

#### Enhanced Full Pipeline
```bash
node test-enhanced-full-pipeline.js <image-path>
```
**Purpose**: Test complete Image → OCR → Enhanced AI → Output flow
**Output**: Comprehensive medication information
**Use Case**: End-to-end system validation

#### Batch Testing
```bash
node test-enhanced-full-pipeline.js --batch sample-images/
```
**Purpose**: Test multiple prescription images at once
**Output**: Success/failure summary across multiple images
**Use Case**: System reliability testing

### 3. Development & Debugging

#### Simulated Pipeline (No Vision API)
```bash
node test-pipeline-without-vision.js
```
**Purpose**: Test AI parsing without needing Vision API
**Output**: Multiple test scenarios with simulated OCR
**Use Case**: Development when Vision API is unavailable

## 📊 Expected Output Formats

### Basic Medication Data (Legacy)
```json
{
  "name": "Amoxicillin",
  "dosage": "500mg",
  "summary": "Antibiotic for bacterial infections",
  "schedule": ["8:00 AM", "8:00 PM"]
}
```

### Enhanced Medication Data (Comprehensive)
```json
{
  "name": "Amoxicillin Capsules",
  "dosage": "500mg",
  "schedule": ["8:00 AM", "8:00 PM"],
  "whatItDoes": "Amoxicillin is an antibiotic that fights off bacteria causing infections. It helps you get better when you have an infection like an ear infection or a sore throat.",
  "howItHelps": "It works by killing the bacteria that are making you sick. This helps your body get better faster.",
  "commonSideEffects": [
    "Some people get a tummy ache or diarrhea.",
    "You might also feel a little sick to your stomach."
  ],
  "seriousSideEffects": [
    "If you have a rash, trouble breathing, or your face or throat swells up, call 911 or go to the hospital right away. This could be a serious allergic reaction."
  ],
  "interactions": [
    "Tell your doctor about all the medicines you are taking, including vitamins. Some medicines don't work well together.",
    "It's okay to eat with amoxicillin."
  ],
  "importantTips": [
    "Take your amoxicillin exactly as your doctor told you. Don't stop taking it early, even if you feel better. Finish all the medicine.",
    "Always take this medicine with a glass of water.",
    "Store your medicine in a cool, dry place, away from kids."
  ],
  "whenToCallDoctor": [
    "Call your doctor if you still feel sick after finishing the medicine, your symptoms get worse, or you notice any new symptoms."
  ]
}
```

## 🔧 Advanced Configuration

### Environment Variables

| Variable | Purpose | Required |
|----------|---------|----------|
| `GOOGLE_VISION_API_KEY` | Google Cloud Vision API access | Yes |
| `GOOGLE_GEMINI_API_KEY` | Google AI Studio API access | Yes |
| `GOOGLE_APPLICATION_CREDENTIALS` | Service account JSON path | Optional |

### API Key Setup

#### Google Cloud Vision API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Cloud Vision API
3. Create API key or service account
4. Enable billing (required for Vision API)

#### Google Gemini API
1. Go to [Google AI Studio](https://ai.google.dev/)
2. Create new API key
3. No billing required for Gemini

### Service Account Authentication (Recommended for Production)
```bash
# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="path/to/service-account-key.json"

# Or add to .env file
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json

# Test with service account
node test-vision-with-service-account.js sample-images/prescription-test.JPG
```

## 🧪 Test Cases & Scenarios

### Supported Image Formats
- `.jpg`, `.jpeg` - Most common prescription photos
- `.png` - High-quality scans
- `.gif`, `.bmp` - Alternative formats

### Test Image Requirements
**Good test images should have:**
- ✅ Clear, readable text
- ✅ Good lighting and contrast
- ✅ Medication name visible
- ✅ Dosage information present
- ✅ Instructions/schedule readable
- ✅ Image size under 10MB

**Avoid:**
- ❌ Blurry or out-of-focus images
- ❌ Poor lighting (too dark/bright)
- ❌ Heavily curved bottles
- ❌ Partially obscured text
- ❌ Very small text (zoom in first)

### Sample Test Scenarios

#### 1. Common Antibiotics
```
Input: "Amoxicillin 500mg, Take twice daily"
Expected: Comprehensive antibiotic information with bacterial infection guidance
```

#### 2. Pain Medications
```
Input: "Ibuprofen 200mg, Take as needed for pain"
Expected: Pain relief info with safety warnings about dosage limits
```

#### 3. Chronic Disease Medications
```
Input: "Metformin 500mg, Take with breakfast and dinner"
Expected: Diabetes medication info with dietary guidance
```

#### 4. Complex Schedules
```
Input: "Take one tablet in morning and two at bedtime"
Expected: Proper time conversion (8:00 AM, 10:00 PM)
```

## 📁 File Structure

```
test-ai-pipeline/
├── README.md                           # This comprehensive guide
├── sample-images/                      # Test prescription images
│   └── prescription-test.JPG           # Sample prescription image
├── sample-ocr-text.txt                 # Sample OCR text for testing
├── outputs/                            # Test results and logs
│   ├── vision-api-output-*.json        # Vision API test results
│   ├── gemini-api-output-*.json        # Gemini API test results
│   ├── enhanced-gemini-*.json          # Enhanced Gemini results
│   ├── full-pipeline-*.json            # Basic pipeline results
│   └── enhanced-full-pipeline-*.json   # Enhanced pipeline results
├── test-vision-api.js                  # Vision API OCR testing
├── test-gemini-api.js                  # Basic Gemini AI testing
├── test-enhanced-gemini.js             # Enhanced Gemini AI testing
├── test-full-pipeline.js               # Complete basic pipeline
├── test-enhanced-full-pipeline.js      # Complete enhanced pipeline
├── test-pipeline-without-vision.js     # Simulated pipeline testing
└── test-vision-with-service-account.js # Alternative Vision API auth
```

## 🚨 Troubleshooting Guide

### Common Issues & Solutions

#### 1. Vision API Errors

**Error**: `API_KEY_SERVICE_BLOCKED`
```
Solution:
1. Check API key restrictions in Google Cloud Console
2. Ensure billing is enabled for your project
3. Verify Vision API is enabled
```

**Error**: `PERMISSION_DENIED`
```
Solution:
1. Enable Cloud Vision API in Google Cloud Console
2. Wait 2-3 minutes for propagation
3. Check project permissions
```

**Error**: `No text detected in image`
```
Solution:
1. Ensure image has clear, readable text
2. Check image quality and lighting
3. Try with different image format
4. Resize image if too large (>10MB)
```

#### 2. Gemini API Errors

**Error**: `API_KEY not configured`
```
Solution:
1. Verify GOOGLE_GEMINI_API_KEY in .env file
2. Check API key is valid in Google AI Studio
3. Ensure no extra spaces or quotes in .env
```

**Error**: `JSON parse error`
```
Solution:
1. Check Gemini response format
2. Try with simpler input text
3. Review prompt engineering
```

#### 3. File System Errors

**Error**: `Image file not found`
```
Solution:
1. Check file path is correct
2. Ensure file exists in sample-images/
3. Use absolute path if needed
```

**Error**: `Permission denied`
```
Solution:
1. Make scripts executable: chmod +x *.js
2. Check directory permissions
3. Run from correct directory
```

### Performance Optimization

#### Speed Improvements
- Use smaller, optimized images (compress if >2MB)
- Batch multiple tests with delays
- Cache results for repeated testing
- Use service account auth for faster Vision API calls

#### Accuracy Improvements
- Ensure high-contrast, clear images
- Good lighting conditions
- Avoid curved surfaces when possible
- Zoom in on medication labels before capture

## 📊 Testing Metrics & Benchmarks

### Expected Performance
- **Vision API OCR**: 2-4 seconds per image
- **Gemini AI Analysis**: 1-3 seconds per request
- **Total Pipeline**: 3-7 seconds end-to-end
- **Accuracy**: >95% for clear, well-lit prescription images

### Success Criteria
- ✅ Correct medication name extraction
- ✅ Accurate dosage identification
- ✅ Proper schedule time conversion
- ✅ Comprehensive safety information
- ✅ Age-appropriate language
- ✅ Emergency guidance included

## 🔄 Integration with MedPal App

### Production Implementation
The test scripts validate the AI pipeline that will be integrated into the MedPal React Native app:

1. **Camera Integration**: `services/AIService.ts` uses the same pipeline
2. **Error Handling**: Production code includes user-friendly error messages
3. **Offline Support**: App falls back to demo data when APIs unavailable
4. **Caching**: Results cached locally for offline access

### Data Flow
```
App Camera → Base64 Image → AIService.processImage() → 
Vision API → Raw Text → Gemini API → Enhanced Data → 
User Interface Display
```

## 📝 Contributing & Development

### Adding New Test Cases
1. Add test images to `sample-images/`
2. Create corresponding OCR text files
3. Update test scenarios in scripts
4. Document expected outputs

### Modifying AI Prompts
1. Edit prompts in `test-enhanced-gemini.js`
2. Test with various medication types
3. Validate output format consistency
4. Update production `AIService.ts` accordingly

### Performance Testing
```bash
# Run batch tests for performance analysis
node test-enhanced-full-pipeline.js --batch sample-images/

# Monitor outputs/ directory for timing data
# Analyze success rates across different image types
```

## 🔒 Security & Privacy

### Data Handling
- Images processed in memory only
- No persistent storage of prescription images
- API keys stored securely in .env (gitignored)
- Test outputs contain no personal information

### API Security
- API keys restricted to specific services
- Service account authentication recommended for production
- Regular key rotation advised
- Monitor API usage in Google Cloud Console

## 📞 Support & Resources

### Documentation Links
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)
- [Google Gemini AI](https://ai.google.dev/docs)
- [MedPal Project Repository](../README.md)

### Getting Help
- Check troubleshooting section above
- Review API documentation for specific errors
- Test individual components before full pipeline
- Use simulated pipeline for development

---

**🎯 Ready to test?** Start with `node test-enhanced-full-pipeline.js sample-images/prescription-test.JPG` and watch MedPal's AI transform prescription images into comprehensive, user-friendly medication information!