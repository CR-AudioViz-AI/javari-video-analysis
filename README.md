# Javari Video Analysis

AI-powered video analysis tool for property inspection, damage detection, content search, and more.

**Part of the CR AudioViz AI Platform**  
*"Your Story. Our Design"*

---

## 🎯 Features

- **Property Damage Inspection** - Analyze roof, siding, or structural damage from drone/camera footage
- **Vehicle Damage Assessment** - Detect dents, scratches, and damage on vehicles
- **Content Search & Moments** - Find specific moments, objects, or actions within videos
- **Object Detection & Tracking** - Track and identify objects, people, or vehicles across video
- **Video Summary & Analysis** - Generate comprehensive summaries with key moments
- **Custom Video Query** - Ask any question about your video content

---

## 🤖 AI Engines

This tool leverages **4 leading AI services** with smart routing:

| Engine | Best For | Free Tier |
|--------|----------|-----------|
| **Google Gemini 2.0** | General video understanding, Q&A | 1,500 requests/day |
| **Twelve Labs** | Semantic search, timestamp finding | 600 minutes lifetime |
| **Google Cloud Video Intelligence** | Object detection, scene analysis | 1,000 minutes/month |
| **Roboflow** | Custom damage detection | 1,000 calls/month |

### Smart API Routing

```
Property Damage → Gemini (primary) → Roboflow (fallback)
Vehicle Damage  → Roboflow (primary) → Gemini (fallback)
Semantic Search → Twelve Labs (primary) → Gemini (fallback)
Object Tracking → Video Intelligence (primary) → Gemini (fallback)
Content Summary → Gemini (primary) → Twelve Labs (fallback)
Custom Query    → Gemini (primary) → Twelve Labs (fallback)
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/CR-AudioViz-AI/javari-video-analysis.git
cd javari-video-analysis

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your API keys
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

## 🔑 API Keys Required

Get your API keys from these dashboards:

1. **Google Gemini**: https://aistudio.google.com/apikey
2. **Twelve Labs**: https://playground.twelvelabs.io
3. **Google Cloud Video Intelligence**: https://console.cloud.google.com/apis/library/videointelligence.googleapis.com
4. **Roboflow**: https://app.roboflow.com/settings/api

---

## 📁 Project Structure

```
javari-video-analysis/
├── index.html          # Entry HTML
├── package.json        # Dependencies
├── vite.config.js      # Vite configuration
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
├── README.md           # This file
└── src/
    ├── main.jsx        # React entry point
    ├── App.jsx         # Main application component
    └── styles.css      # All styles
```

---

## 🎨 Tech Stack

- **Framework**: React 18 + Vite
- **Styling**: Custom CSS with CSS Variables
- **Icons**: Lucide React
- **Database**: Supabase (optional, for saving results)

---

## 📊 Credit System

| Analysis Type | Credits |
|---------------|---------|
| Property Damage Inspection | 5 |
| Vehicle Damage Assessment | 4 |
| Content Search & Moments | 3 |
| Object Detection & Tracking | 4 |
| Video Summary & Analysis | 2 |
| Custom Video Query | 3 |

---

## 🛠️ Development

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 📋 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Vercel

```
VITE_GEMINI_API_KEY=your_key
VITE_TWELVE_LABS_API_KEY=your_key
VITE_GOOGLE_CLOUD_API_KEY=your_key
VITE_ROBOFLOW_API_KEY=your_key
VITE_ROBOFLOW_WORKSPACE=your_workspace
```

---

## 📜 License

Copyright © 2025 CR AudioViz AI, LLC. All rights reserved.

**EIN**: 93-4520864

---

## 🤝 Support

For issues or questions:
- Email: support@craudiovizai.com
- Website: https://craudiovizai.com

---

*Built with ❤️ by CR AudioViz AI, LLC*
