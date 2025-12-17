# Javari Video Analysis

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCR-AudioViz-AI%2Fjavari-video-analysis)

**AI-Powered Video Analysis for Property Inspection, Damage Assessment, and Content Understanding**

Built by CR AudioViz AI LLC • Part of the Javari AI Ecosystem

## Features

- 🎬 **Video Upload & Analysis** - Process drone footage, security cameras, or any video content
- 🔍 **Smart API Routing** - Automatically selects the optimal AI service for each task
- 🏠 **Property Damage Detection** - Identify roof damage, structural issues, and wear
- 🔎 **Content Search** - Find specific moments using natural language
- 📊 **Detailed Reports** - Export comprehensive analysis results

## Integrated AI Services

| Service | Use Case | Free Tier |
|---------|----------|-----------|
| **Google Gemini** | General video Q&A, damage analysis | 1,500 req/day |
| **Twelve Labs** | Semantic search, timestamp finding | 600 min lifetime |
| **Google Cloud Video Intelligence** | Object detection, labels | 1,000 min/month |
| **Roboflow** | Custom detection models | 1,000 calls/month |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
git clone https://github.com/CR-AudioViz-AI/javari-video-analysis.git
cd javari-video-analysis
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Environment Variables

Create a `.env` file with your API keys:

```env
VITE_GEMINI_API_KEY=your_gemini_key
VITE_TWELVE_LABS_API_KEY=your_twelve_labs_key
VITE_GOOGLE_CLOUD_API_KEY=your_google_cloud_key
VITE_ROBOFLOW_API_KEY=your_roboflow_key
```

## License

MIT © CR AudioViz AI, LLC

---

**"Your Story. Our Design."**  
Everyone connects. Everyone wins.
