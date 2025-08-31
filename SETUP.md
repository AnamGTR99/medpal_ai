# MedPal Setup Guide

## Environment Variables Setup

To use the AI scanning features, you need to configure your Google AI API keys:

### 1. Get Your API Keys

- **Google Vision API**: Go to [Google Cloud Console](https://console.cloud.google.com/) and enable the Vision API
- **Google Gemini API**: Go to [Google AI Studio](https://ai.google.dev/) and get your API key

### 2. Configure Environment Variables

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and replace the placeholder values with your actual API keys:
   ```
   GOOGLE_VISION_API_KEY=your_actual_vision_api_key
   GOOGLE_GEMINI_API_KEY=your_actual_gemini_api_key
   ```

### 3. Run the App

```bash
npm start
```

## Important Notes

- The `.env` file is gitignored for security
- Never commit your actual API keys to version control
- You can use the same API key for both services if your Google Cloud project has both APIs enabled
- The app will show demo data if API keys are not configured