# Javari Video Analysis

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCR-AudioViz-AI%2Fjavari-video-analysis&env=VITE_GEMINI_API_KEY,VITE_TWELVE_LABS_API_KEY,VITE_GOOGLE_CLOUD_API_KEY,VITE_ROBOFLOW_API_KEY&envDescription=API%20keys%20for%20video%20analysis%20services&project-name=javari-video-analysis&repository-name=javari-video-analysis)

**AI-Powered Video Analysis for Property Inspection, Damage Assessment, and Content Understanding**

Built by CR AudioViz AI LLC • Part of the Javari AI Ecosystem

---

## 🎯 Overview

Javari Video Analysis is an intelligent video processing system that leverages **4 leading AI providers** to deliver comprehensive analysis of video content. Whether you're inspecting roof damage from drone footage, assessing vehicle damage, or searching for specific moments in video, Javari automatically routes your request to the optimal AI service.

### Integrated AI Services

| Service | Free Tier | Best For |
|---------|-----------|----------|
| **Google Gemini** | 1,500 requests/day | General video Q&A, damage analysis |
| **Twelve Labs** | 600 minutes lifetime | Semantic search, timestamp finding |
| **Google Cloud Video Intelligence** | 1,000 min/month | Object detection, label detection |
| **Roboflow** | 14-day trial + free tier | Custom damage detection models |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- API keys from each service (see Setup Guide below)

### Installation

```bash
# Clone or copy the project
cd javari-video-analysis

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Add your API keys to .env
nano .env

# Start development server
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

---

## 🔑 API Setup Guide

### 1. Google Gemini (Required)
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key" → Create new key
3. Add to `.env` as `VITE_GEMINI_API_KEY`

### 2. Twelve Labs (Recommended)
1. Go to [Twelve Labs Playground](https://playground.twelvelabs.io)
2. Sign up → Settings → Copy API Key
3. Add to `.env` as `VITE_TWELVE_LABS_API_KEY`

### 3. Google Cloud Video Intelligence (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Enable Video Intelligence API
3. Create credentials → API Key
4. Add to `.env` as `VITE_GOOGLE_CLOUD_API_KEY`

### 4. Roboflow (Optional)
1. Go to [Roboflow](https://app.roboflow.com)
2. Sign up → Settings → API Keys
3. Generate Private API Key
4. Add to `.env` as `VITE_ROBOFLOW_API_KEY`

---

## 📋 Full Capabilities

### 🏠 Property & Damage Inspection
- Roof damage detection (shingles, flashing, gutters)
- Structural damage assessment
- Water damage identification
- Debris and wear pattern analysis
- Insurance documentation support
- Drone footage optimization

### 🚗 Vehicle Analysis
- Dent and body damage detection
- Scratch and paint damage assessment
- Collision damage evaluation
- Parts identification
- Repair cost estimation support

### 🔍 Content Search & Discovery
- Semantic video search
- Timestamp-based moment finding
- Object and person tracking
- Scene change detection
- Highlight reel generation
- Natural language queries

### 📊 Analysis & Reporting
- Comprehensive video summaries
- Object detection and labeling
- Activity and action recognition
- Quality assessment
- Metadata extraction
- Exportable reports

### 🎯 Custom Detection (via Roboflow)
- Train custom detection models
- Industry-specific detection
- Defect analysis
- Quality control inspection
- Safety compliance checking

### 💬 Interactive Q&A
- Ask any question about video content
- Multi-turn conversations
- Context-aware responses
- Detailed explanations

---

## 🏗️ Architecture

### Smart API Routing

Javari automatically selects the optimal AI service based on task type:

```
Property Damage → Gemini (primary) → Roboflow (fallback)
Vehicle Damage  → Roboflow (primary) → Gemini (fallback)
Semantic Search → Twelve Labs (primary) → Gemini (fallback)
Object Tracking → Video Intelligence (primary) → Gemini (fallback)
Content Summary → Gemini (primary) → Twelve Labs (fallback)
Custom Query    → Gemini (primary) → Twelve Labs (fallback)
```

### Project Structure

```
javari-video-analysis/
├── src/
│   ├── App.jsx           # Main application component
│   ├── main.jsx          # React entry point
│   └── styles.css        # Complete styling
├── index.html            # HTML entry point
├── package.json          # Dependencies
├── vite.config.js        # Build configuration
├── .env.example          # Environment template
└── README.md             # Documentation
```

---

## 🎨 Features

### User Interface
- **Dark theme** with electric blue accents
- **Drag-and-drop** video upload
- **Real-time preview** of uploaded videos
- **Task selection cards** with API indicators
- **Custom query input** for open-ended questions
- **Manual API override** option
- **Detailed results** with findings, metadata, and recommendations

### Three Main Pages
1. **Analyze** - Upload and process videos
2. **About** - Complete documentation and capabilities
3. **APIs** - Service status and configuration

---

## 📱 Supported Formats

| Format | Extension | Max Duration |
|--------|-----------|--------------|
| MP4 | .mp4 | 1-4 hours* |
| MOV | .mov | 1-4 hours* |
| AVI | .avi | 1-4 hours* |
| WebM | .webm | 1-4 hours* |
| MKV | .mkv | 1-4 hours* |

*Duration limits vary by API service

### Limits
- **Max file size:** 100MB (configurable)
- **Resolution:** Up to 4K
- **Frame rate:** 24-60 fps optimal

---

## 🔒 Security

- Videos processed in real-time, not stored permanently
- API keys stored in environment variables
- All transmissions encrypted via HTTPS/TLS
- No sensitive data logged

### Best Practices
```bash
# Never commit .env files
echo ".env" >> .gitignore

# Use environment variables in production
# Vercel: Settings → Environment Variables
# Railway: Variables tab
# Netlify: Site settings → Environment
```

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy --prod
```

### Railway
```bash
railway init
railway up
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

---

## 📈 Usage Examples

### Roof Damage Inspection
```javascript
// Upload drone footage
// Select "Property Damage Inspection"
// Receive detailed report:
// - Identified damage locations
// - Severity ratings (minor/moderate/severe)
// - Repair recommendations
// - Insurance documentation notes
```

### Semantic Video Search
```javascript
// Upload surveillance footage
// Select "Semantic Video Search"
// Query: "Find when the red car enters the parking lot"
// Receive: Timestamps with confidence scores
```

### Custom Query
```javascript
// Upload any video
// Select "Custom Video Query"
// Ask: "How many people are visible? What are they doing?"
// Receive: Detailed natural language response
```

---

## 🛠️ Development

### Local Development
```bash
npm run dev
# Opens http://localhost:3000
```

### Building
```bash
npm run build
# Output in /dist
```

### Linting
```bash
npm run lint
```

---

## 📞 Support

- **Documentation:** Built into the app (About page)
- **Issues:** Contact CR AudioViz AI support
- **API Issues:** Check individual service status pages

---

## 📄 License

MIT License - CR AudioViz AI LLC

---

## 🙏 Credits

Powered by:
- [Google Gemini](https://ai.google.dev/)
- [Twelve Labs](https://twelvelabs.io/)
- [Google Cloud Video Intelligence](https://cloud.google.com/video-intelligence)
- [Roboflow](https://roboflow.com/)

Built with:
- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Lucide Icons](https://lucide.dev/)

---

**Version:** 1.0.0  
**Last Updated:** December 17, 2025  
**Author:** CR AudioViz AI LLC
