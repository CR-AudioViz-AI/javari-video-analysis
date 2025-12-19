// ============================================
// JAVARI VIDEO ANALYSIS TOOL
// CR AudioViz AI, LLC | December 17, 2025
// 
// Purpose: AI-powered video analysis for property inspection,
// damage detection, content search, and more.
// 
// APIs: Google Gemini (primary), Twelve Labs, Roboflow, 
//       Google Cloud Video Intelligence
// ============================================

import React, { useState, useCallback, useRef } from 'react';
import {
  Upload, Video, Play, Loader2, AlertCircle, CheckCircle,
  Shield, Search, Eye, FileVideo, Brain, Clock, Cpu,
  Home, Info, Settings, ChevronRight, Download, Copy,
  BarChart3, Target, Sparkles, Zap, X, ExternalLink,
  Camera, Building, Car, Package, Users, MessageSquare,
  RefreshCw, HelpCircle, Award
} from 'lucide-react';

// ============================================
// CONFIGURATION
// ============================================

const API_CONFIG = {
  gemini: {
    name: 'Google Gemini 2.0',
    description: 'Native video understanding with 1M token context',
    capabilities: ['Video Q&A', 'Damage Analysis', 'Content Summary', 'Scene Description'],
    freeLimit: '1,500 requests/day',
    maxVideoSize: '100MB',
    maxDuration: '1 hour',
    bestFor: 'General video understanding, property inspection, Q&A',
    icon: Brain,
    color: '#4285F4',
    gradient: 'linear-gradient(135deg, #4285F4 0%, #34A853 100%)'
  },
  twelveLabs: {
    name: 'Twelve Labs',
    description: 'Semantic video search and timestamp finding',
    capabilities: ['Semantic Search', 'Timestamp Finding', 'Video Indexing', 'Highlight Detection'],
    freeLimit: '600 minutes lifetime',
    maxVideoSize: '2GB',
    maxDuration: '2 hours',
    bestFor: 'Finding specific moments, semantic search, video indexing',
    icon: Search,
    color: '#FF6B6B',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
  },
  googleVideoIntelligence: {
    name: 'Google Cloud Video Intelligence',
    description: 'Object detection and label analysis',
    capabilities: ['Object Detection', 'Label Detection', 'Scene Change', 'Shot Detection'],
    freeLimit: '1,000 minutes/month',
    maxVideoSize: '100MB',
    maxDuration: '2 hours',
    bestFor: 'Object tracking, label detection, scene analysis',
    icon: Eye,
    color: '#34A853',
    gradient: 'linear-gradient(135deg, #34A853 0%, #4285F4 100%)'
  },
  roboflow: {
    name: 'Roboflow',
    description: 'Custom AI detection models',
    capabilities: ['Custom Detection', 'Damage Detection', 'Defect Analysis', 'Object Segmentation'],
    freeLimit: '1,000 API calls/month',
    maxVideoSize: '100MB',
    maxDuration: '30 minutes',
    bestFor: 'Custom damage detection, specialized models, defect analysis',
    icon: Target,
    color: '#6366F1',
    gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
  }
};

const ANALYSIS_TASKS = {
  property_damage: {
    id: 'property_damage',
    name: 'Property Damage Inspection',
    description: 'Analyze roof, siding, or structural damage from drone/camera footage',
    icon: Shield,
    color: '#EF4444',
    primaryAPI: 'gemini',
    fallbackAPI: 'roboflow',
    creditCost: 5,
    prompts: {
      gemini: `You are an expert property inspector analyzing video footage for damage assessment. 

Analyze this video thoroughly and provide:

1. **OVERALL CONDITION** (1-10 scale with reasoning)
   - Rate the overall condition and explain why

2. **DAMAGE IDENTIFIED** (List each with severity: Critical/Moderate/Minor)
   - Location in frame (use timestamps if visible)
   - Type of damage
   - Severity level
   - Recommended action

3. **AREAS OF CONCERN**
   - Potential issues that need monitoring
   - Areas that should be professionally inspected

4. **POSITIVE OBSERVATIONS**
   - Areas in good condition
   - Recent repairs or maintenance visible

5. **RECOMMENDATIONS**
   - Immediate actions needed
   - Short-term repairs (1-3 months)
   - Long-term maintenance

6. **INSURANCE DOCUMENTATION NOTES**
   - Key timestamps to capture for claims
   - Evidence quality assessment

Be specific with timestamps and locations. If you cannot determine something clearly, say so.`
    }
  },
  vehicle_damage: {
    id: 'vehicle_damage',
    name: 'Vehicle Damage Assessment',
    description: 'Detect dents, scratches, and damage on vehicles',
    icon: Car,
    color: '#F59E0B',
    primaryAPI: 'roboflow',
    fallbackAPI: 'gemini',
    creditCost: 4,
    prompts: {
      gemini: `You are an expert auto body inspector analyzing video footage for vehicle damage.

Analyze this video and provide:

1. **VEHICLE IDENTIFICATION**
   - Make/Model if visible
   - Color
   - Approximate year range

2. **DAMAGE ASSESSMENT**
   For each damage found:
   - Location (front, rear, driver side, etc.)
   - Type (dent, scratch, crack, rust, etc.)
   - Severity (Minor/Moderate/Severe)
   - Estimated repair type needed
   - Timestamp where visible

3. **CONDITION RATING** (1-10)
   - Overall exterior condition
   - Paint condition
   - Glass/windows condition

4. **REPAIR RECOMMENDATIONS**
   - Priority repairs
   - Estimated complexity (DIY/Body Shop/Specialist)

5. **INSURANCE NOTES**
   - Pre-existing vs recent damage indicators
   - Documentation suggestions

Be precise with locations using clock positions (e.g., "3 o'clock on rear bumper").`
    }
  },
  content_search: {
    id: 'content_search',
    name: 'Content Search & Moments',
    description: 'Find specific moments, objects, or actions within videos',
    icon: Search,
    color: '#8B5CF6',
    primaryAPI: 'gemini',
    fallbackAPI: 'twelveLabs',
    creditCost: 3,
    prompts: {
      gemini: `Analyze this video and identify all key moments, objects, and actions.

Provide a detailed breakdown:

1. **TIMELINE OF KEY MOMENTS**
   - Timestamp | Event/Action | Description
   - List chronologically

2. **OBJECTS DETECTED**
   - Object type
   - First appearance timestamp
   - Frequency throughout video

3. **PEOPLE/SUBJECTS**
   - Number of people
   - Actions performed
   - Interactions observed

4. **SCENE CHANGES**
   - Location changes
   - Lighting changes
   - Time of day changes

5. **NOTABLE AUDIO** (if applicable)
   - Speech detected
   - Background sounds
   - Music

6. **SUMMARY**
   - 2-3 sentence video summary
   - Main theme/purpose of video`
    }
  },
  object_tracking: {
    id: 'object_tracking',
    name: 'Object Detection & Tracking',
    description: 'Track and identify objects, people, or vehicles across video',
    icon: Eye,
    color: '#10B981',
    primaryAPI: 'googleVideoIntelligence',
    fallbackAPI: 'gemini',
    creditCost: 4,
    prompts: {
      gemini: `Perform detailed object detection and tracking on this video.

Identify and track:

1. **ALL OBJECTS DETECTED**
   | Object | First Seen | Last Seen | Movement Pattern |
   List every distinct object

2. **PEOPLE TRACKING**
   - Number of individuals
   - Entry/exit times
   - Movement paths
   - Interactions

3. **VEHICLE TRACKING** (if applicable)
   - Type, color, direction
   - Entry/exit timestamps
   - License plate visibility (yes/no)

4. **STATIONARY OBJECTS**
   - Background elements
   - Fixed installations
   - Furniture/equipment

5. **MOTION ANALYSIS**
   - Primary movement directions
   - Speed estimates (slow/normal/fast)
   - Unusual movements

6. **OBJECT RELATIONSHIPS**
   - Proximity patterns
   - Interactions between objects`
    }
  },
  content_summary: {
    id: 'content_summary',
    name: 'Video Summary & Analysis',
    description: 'Generate comprehensive summary with key moments and insights',
    icon: FileVideo,
    color: '#06B6D4',
    primaryAPI: 'gemini',
    fallbackAPI: 'twelveLabs',
    creditCost: 2,
    prompts: {
      gemini: `Provide a comprehensive analysis of this video:

1. **EXECUTIVE SUMMARY** (2-3 sentences)
   - What is this video about?
   - Main purpose/message

2. **KEY MOMENTS WITH TIMESTAMPS**
   | Timestamp | Description | Importance |
   List the most significant moments

3. **CONTENT BREAKDOWN**
   - Main subjects/topics covered
   - Visual style and quality
   - Pacing and structure

4. **TECHNICAL ASSESSMENT**
   - Video quality (resolution estimate)
   - Lighting conditions
   - Audio quality (if applicable)
   - Camera work (steady/shaky, angles used)

5. **AUDIENCE & PURPOSE**
   - Intended audience
   - Content category (educational, entertainment, documentary, etc.)
   - Suggested use cases

6. **NOTABLE OBSERVATIONS**
   - Interesting details
   - Potential concerns
   - Recommendations for improvement`
    }
  },
  custom_query: {
    id: 'custom_query',
    name: 'Custom Video Query',
    description: 'Ask any question about your video content',
    icon: MessageSquare,
    color: '#EC4899',
    primaryAPI: 'gemini',
    fallbackAPI: 'twelveLabs',
    creditCost: 3,
    prompts: {}
  }
};

// API Routing Logic
const API_ROUTING = {
  property_damage: { primary: 'gemini', fallback: 'roboflow' },
  vehicle_damage: { primary: 'roboflow', fallback: 'gemini' },
  content_search: { primary: 'gemini', fallback: 'twelveLabs' },
  object_tracking: { primary: 'googleVideoIntelligence', fallback: 'gemini' },
  content_summary: { primary: 'gemini', fallback: 'twelveLabs' },
  custom_query: { primary: 'gemini', fallback: 'twelveLabs' }
};

// ============================================
// MAIN APPLICATION COMPONENT
// ============================================

export default function JavariVideoAnalysis() {
  // State Management
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTask, setSelectedTask] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [videoDuration, setVideoDuration] = useState(null);
  const [customQuery, setCustomQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [selectedAPI, setSelectedAPI] = useState('auto');
  const [error, setError] = useState(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showAPIInfo, setShowAPIInfo] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);

  // Handle video file selection
  const handleVideoUpload = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        setError('Please upload a valid video file (MP4, MOV, AVI, WebM)');
        return;
      }
      // Validate file size (100MB limit)
      if (file.size > 100 * 1024 * 1024) {
        setError('File size exceeds 100MB limit. Please use a smaller video or compress it.');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError(null);
      setAnalysisResult(null);
    }
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      if (file.size > 100 * 1024 * 1024) {
        setError('File size exceeds 100MB limit');
        return;
      }
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setError(null);
      setAnalysisResult(null);
    } else {
      setError('Please drop a valid video file');
    }
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  // Get video duration when loaded
  const handleVideoLoaded = useCallback(() => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  }, []);

  // Format duration to mm:ss
  const formatDuration = (seconds) => {
    if (!seconds) return '--:--';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // Convert video to base64 for Gemini API
  const videoToBase64 = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Analyze video with selected API
  const analyzeVideo = async () => {
    if (!videoFile || !selectedTask) return;
    
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setAnalysisProgress(10);

    try {
      const task = ANALYSIS_TASKS[selectedTask];
      const routing = API_ROUTING[selectedTask];
      const apiToUse = selectedAPI === 'auto' ? routing.primary : selectedAPI;
      
      setAnalysisProgress(20);

      // For demo/prototype - simulate API call
      // In production, this would call the actual APIs
      const result = await simulateAPICall(task, apiToUse, videoFile, customQuery);
      
      setAnalysisProgress(100);
      setAnalysisResult({
        task: selectedTask,
        api: apiToUse,
        timestamp: new Date().toISOString(),
        videoName: videoFile.name,
        videoDuration: videoDuration,
        videoSize: videoFile.size,
        data: result
      });

    } catch (err) {
      console.error('Analysis error:', err);
      setError(err.message || 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  // Simulate API call (replace with actual API integration)
  const simulateAPICall = async (task, apiName, file, query) => {
    // Simulate processing time
    await new Promise(resolve => {
      let progress = 20;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 90) {
          clearInterval(interval);
          setAnalysisProgress(90);
          resolve();
        } else {
          setAnalysisProgress(progress);
        }
      }, 500);
    });

    // Return simulated results based on task type
    const apiConfig = API_CONFIG[apiName];
    
    if (task.id === 'property_damage') {
      return {
        summary: `Analysis complete using ${apiConfig.name}. Video "${file.name}" has been analyzed for property damage.`,
        overallCondition: {
          score: 7.5,
          label: 'Good',
          description: 'Property shows normal wear with some areas requiring attention.'
        },
        damageItems: [
          {
            id: 1,
            location: 'Northeast corner of roof',
            type: 'Shingle damage',
            severity: 'Moderate',
            timestamp: '0:12',
            description: 'Several shingles show signs of lifting and wear',
            recommendation: 'Professional inspection recommended within 30 days'
          },
          {
            id: 2,
            location: 'Gutter - East side',
            type: 'Debris accumulation',
            severity: 'Minor',
            timestamp: '0:34',
            description: 'Leaves and debris visible in gutter section',
            recommendation: 'Schedule gutter cleaning'
          }
        ],
        positiveObservations: [
          'Flashing around chimney appears intact',
          'No visible water damage or staining',
          'Ridge cap shingles in good condition'
        ],
        recommendations: {
          immediate: ['Clear gutter debris'],
          shortTerm: ['Schedule professional roof inspection'],
          longTerm: ['Consider preventive shingle replacement in 2-3 years']
        },
        confidence: 0.87
      };
    }

    if (task.id === 'custom_query') {
      return {
        summary: `Analysis of "${file.name}" for query: "${query}"`,
        answer: `Based on the video analysis, here is what I found regarding your question "${query}": The video shows [detailed analysis would appear here based on actual API response]. Key observations include visual elements, timing, and contextual information relevant to your query.`,
        confidence: 0.82,
        relatedTimestamps: ['0:05', '0:23', '0:45']
      };
    }

    // Default response for other task types
    return {
      summary: `Analysis complete using ${apiConfig.name}. Your video "${file.name}" has been processed.`,
      keyFindings: [
        'Video successfully analyzed',
        'Content identified and categorized',
        'Key moments detected'
      ],
      timestamps: [
        { time: '0:00', event: 'Video start' },
        { time: '0:15', event: 'Key moment detected' },
        { time: '0:30', event: 'Scene change' }
      ],
      confidence: 0.85
    };
  };

  // Copy results to clipboard
  const copyResults = () => {
    if (analysisResult) {
      const text = JSON.stringify(analysisResult, null, 2);
      navigator.clipboard.writeText(text);
    }
  };

  // Export results as JSON
  const exportResults = () => {
    if (analysisResult) {
      const blob = new Blob([JSON.stringify(analysisResult, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `javari-analysis-${Date.now()}.json`;
      a.click();
    }
  };

  // Reset analysis
  const resetAnalysis = () => {
    setVideoFile(null);
    setVideoPreview(null);
    setVideoDuration(null);
    setSelectedTask(null);
    setCustomQuery('');
    setAnalysisResult(null);
    setError(null);
    setSelectedAPI('auto');
  };

  // ============================================
  // RENDER: HOME PAGE
  // ============================================
  
  if (currentPage === 'home') {
    return (
      <div className="app">
        {/* Navigation */}
        <nav className="nav">
          <div className="nav-brand">
            <Sparkles size={24} />
            <span>Javari Video Analysis</span>
          </div>
          <div className="nav-links">
            <button className="nav-link active" onClick={() => setCurrentPage('home')}>
              <Home size={18} /> Home
            </button>
            <button className="nav-link" onClick={() => setCurrentPage('analyze')}>
              <Video size={18} /> Analyze
            </button>
            <button className="nav-link" onClick={() => setShowAPIInfo(true)}>
              <Info size={18} /> API Info
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <div className="hero-content">
            <div className="hero-badge">
              <Zap size={14} /> Powered by 4 AI Engines
            </div>
            <h1>AI-Powered Video Analysis</h1>
            <p className="hero-subtitle">
              Property inspection, damage detection, content search, and more.
              Upload your video and let Javari AI analyze it with Google Gemini, 
              Twelve Labs, Roboflow, and Google Cloud Video Intelligence.
            </p>
            <div className="hero-actions">
              <button className="btn btn-primary btn-lg" onClick={() => setCurrentPage('analyze')}>
                <Upload size={20} /> Upload Video
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => setShowAPIInfo(true)}>
                <Info size={20} /> Learn More
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">1,500+</span>
                <span className="stat-label">Daily analyses free</span>
              </div>
              <div className="stat">
                <span className="stat-value">4</span>
                <span className="stat-label">AI engines</span>
              </div>
              <div className="stat">
                <span className="stat-value">6</span>
                <span className="stat-label">Analysis types</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <Video size={48} />
              <span>Drop your video here</span>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features">
          <h2>What Can Javari Analyze?</h2>
          <div className="features-grid">
            {Object.entries(ANALYSIS_TASKS).map(([key, task]) => {
              const IconComponent = task.icon;
              return (
                <div 
                  key={key} 
                  className="feature-card"
                  onClick={() => {
                    setSelectedTask(key);
                    setCurrentPage('analyze');
                  }}
                >
                  <div className="feature-icon" style={{ backgroundColor: task.color + '20', color: task.color }}>
                    <IconComponent size={24} />
                  </div>
                  <h3>{task.name}</h3>
                  <p>{task.description}</p>
                  <div className="feature-meta">
                    <span className="credit-cost">{task.creditCost} credits</span>
                    <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* API Providers */}
        <section className="api-providers">
          <h2>Powered By Leading AI</h2>
          <div className="providers-grid">
            {Object.entries(API_CONFIG).map(([key, api]) => {
              const IconComponent = api.icon;
              return (
                <div key={key} className="provider-card">
                  <div className="provider-icon" style={{ background: api.gradient }}>
                    <IconComponent size={28} color="white" />
                  </div>
                  <h4>{api.name}</h4>
                  <p>{api.description}</p>
                  <span className="provider-free">{api.freeLimit}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <Sparkles size={20} />
              <span>CR AudioViz AI</span>
            </div>
            <p>"Your Story. Our Design" | EIN: 93-4520864</p>
            <p className="footer-copyright">© 2025 CR AudioViz AI, LLC. All rights reserved.</p>
          </div>
        </footer>

        {/* API Info Modal */}
        {showAPIInfo && (
          <div className="modal-overlay" onClick={() => setShowAPIInfo(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2><Info size={24} /> API Information</h2>
                <button className="modal-close" onClick={() => setShowAPIInfo(false)}>
                  <X size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="api-info-grid">
                  {Object.entries(API_CONFIG).map(([key, api]) => {
                    const IconComponent = api.icon;
                    return (
                      <div key={key} className="api-info-card">
                        <div className="api-info-header" style={{ background: api.gradient }}>
                          <IconComponent size={32} color="white" />
                          <h3>{api.name}</h3>
                        </div>
                        <div className="api-info-body">
                          <p><strong>Best For:</strong> {api.bestFor}</p>
                          <p><strong>Free Tier:</strong> {api.freeLimit}</p>
                          <p><strong>Max Video:</strong> {api.maxVideoSize}</p>
                          <p><strong>Max Duration:</strong> {api.maxDuration}</p>
                          <div className="capabilities">
                            <strong>Capabilities:</strong>
                            <ul>
                              {api.capabilities.map((cap, i) => (
                                <li key={i}>{cap}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ============================================
  // RENDER: ANALYZE PAGE
  // ============================================

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-brand">
          <Sparkles size={24} />
          <span>Javari Video Analysis</span>
        </div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => setCurrentPage('home')}>
            <Home size={18} /> Home
          </button>
          <button className="nav-link active" onClick={() => setCurrentPage('analyze')}>
            <Video size={18} /> Analyze
          </button>
          <button className="nav-link" onClick={() => setShowAPIInfo(true)}>
            <Info size={18} /> API Info
          </button>
        </div>
      </nav>

      <main className="main">
        {/* Video Upload Section */}
        <section className="upload-section">
          <h2><Upload size={24} /> Upload Video</h2>
          
          <div 
            className={`upload-zone ${videoFile ? 'has-video' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => !videoFile && fileInputRef.current?.click()}
          >
            {videoPreview ? (
              <div className="video-preview">
                <video 
                  ref={videoRef}
                  src={videoPreview} 
                  controls 
                  onLoadedMetadata={handleVideoLoaded}
                />
                <div className="video-info">
                  <span className="video-name">{videoFile.name}</span>
                  <div className="video-meta">
                    <span><Clock size={14} /> {formatDuration(videoDuration)}</span>
                    <span><Package size={14} /> {formatFileSize(videoFile.size)}</span>
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={(e) => {
                    e.stopPropagation();
                    resetAnalysis();
                  }}>
                    <X size={16} /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="upload-prompt">
                <Upload size={48} />
                <h3>Drop your video here</h3>
                <p>or click to browse</p>
                <span className="upload-formats">MP4, MOV, AVI, WebM • Max 100MB</span>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              style={{ display: 'none' }}
            />
          </div>
        </section>

        {/* Task Selection */}
        <section className="task-section">
          <h2><Target size={24} /> Select Analysis Type</h2>
          <div className="task-grid">
            {Object.entries(ANALYSIS_TASKS).map(([key, task]) => {
              const IconComponent = task.icon;
              return (
                <button
                  key={key}
                  className={`task-card ${selectedTask === key ? 'selected' : ''}`}
                  onClick={() => setSelectedTask(key)}
                  style={{ '--task-color': task.color }}
                >
                  <div className="task-icon">
                    <IconComponent size={24} />
                  </div>
                  <div className="task-content">
                    <h4>{task.name}</h4>
                    <p>{task.description}</p>
                  </div>
                  <div className="task-meta">
                    <span className="credit-badge">{task.creditCost} credits</span>
                    {selectedTask === key && <CheckCircle size={20} />}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Custom Query Input (for custom_query task) */}
        {selectedTask === 'custom_query' && (
          <section className="query-section">
            <h2><MessageSquare size={24} /> Your Question</h2>
            <textarea
              className="query-input"
              placeholder="Ask anything about your video... e.g., 'What color is the car?' or 'Are there any people visible?'"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              rows={3}
            />
          </section>
        )}

        {/* API Selection */}
        <section className="api-section">
          <h2><Cpu size={24} /> API Selection</h2>
          <div className="api-selector">
            <label className={`api-option ${selectedAPI === 'auto' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="api"
                value="auto"
                checked={selectedAPI === 'auto'}
                onChange={(e) => setSelectedAPI(e.target.value)}
              />
              <Zap size={20} />
              <div>
                <strong>Auto (Recommended)</strong>
                <span>Smart routing based on task type</span>
              </div>
            </label>
            {Object.entries(API_CONFIG).map(([key, api]) => {
              const IconComponent = api.icon;
              return (
                <label key={key} className={`api-option ${selectedAPI === key ? 'selected' : ''}`}>
                  <input
                    type="radio"
                    name="api"
                    value={key}
                    checked={selectedAPI === key}
                    onChange={(e) => setSelectedAPI(e.target.value)}
                  />
                  <IconComponent size={20} style={{ color: api.color }} />
                  <div>
                    <strong>{api.name}</strong>
                    <span>{api.freeLimit}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {/* Error Display */}
        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
            <button onClick={() => setError(null)}><X size={18} /></button>
          </div>
        )}

        {/* Analyze Button */}
        <section className="action-section">
          <button
            className="btn btn-primary btn-xl analyze-btn"
            onClick={analyzeVideo}
            disabled={!videoFile || !selectedTask || isAnalyzing || (selectedTask === 'custom_query' && !customQuery.trim())}
          >
            {isAnalyzing ? (
              <>
                <Loader2 size={24} className="spinner" />
                Analyzing... {Math.round(analysisProgress)}%
              </>
            ) : (
              <>
                <Play size={24} />
                Analyze Video
              </>
            )}
          </button>
          
          {isAnalyzing && (
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${analysisProgress}%` }} />
            </div>
          )}
        </section>

        {/* Results Section */}
        {analysisResult && (
          <section className="results-section">
            <div className="results-header">
              <h2><BarChart3 size={24} /> Analysis Results</h2>
              <div className="results-actions">
                <button className="btn btn-sm" onClick={copyResults}>
                  <Copy size={16} /> Copy
                </button>
                <button className="btn btn-sm" onClick={exportResults}>
                  <Download size={16} /> Export JSON
                </button>
                <button className="btn btn-sm btn-secondary" onClick={resetAnalysis}>
                  <RefreshCw size={16} /> New Analysis
                </button>
              </div>
            </div>

            <div className="results-meta">
              <span className="meta-item">
                <Cpu size={14} />
                {API_CONFIG[analysisResult.api]?.name || analysisResult.api}
              </span>
              <span className="meta-item">
                <Clock size={14} />
                {new Date(analysisResult.timestamp).toLocaleString()}
              </span>
              <span className="meta-item">
                <Video size={14} />
                {analysisResult.videoName}
              </span>
            </div>

            <div className="results-content">
              {/* Summary Card */}
              <div className="result-card summary-card">
                <h3><Award size={20} /> Summary</h3>
                <p>{analysisResult.data.summary}</p>
                {analysisResult.data.confidence && (
                  <div className="confidence-meter">
                    <span>Confidence:</span>
                    <div className="meter">
                      <div 
                        className="meter-fill" 
                        style={{ width: `${analysisResult.data.confidence * 100}%` }}
                      />
                    </div>
                    <span>{Math.round(analysisResult.data.confidence * 100)}%</span>
                  </div>
                )}
              </div>

              {/* Damage Items (for property/vehicle damage) */}
              {analysisResult.data.damageItems && (
                <div className="result-card damage-card">
                  <h3><Shield size={20} /> Damage Detected</h3>
                  <div className="damage-list">
                    {analysisResult.data.damageItems.map((item) => (
                      <div key={item.id} className={`damage-item severity-${item.severity.toLowerCase()}`}>
                        <div className="damage-header">
                          <span className="damage-location">{item.location}</span>
                          <span className={`severity-badge ${item.severity.toLowerCase()}`}>
                            {item.severity}
                          </span>
                        </div>
                        <p className="damage-type">{item.type}</p>
                        <p className="damage-desc">{item.description}</p>
                        <div className="damage-meta">
                          <span><Clock size={12} /> {item.timestamp}</span>
                          <span className="recommendation">{item.recommendation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overall Condition */}
              {analysisResult.data.overallCondition && (
                <div className="result-card condition-card">
                  <h3><Target size={20} /> Overall Condition</h3>
                  <div className="condition-score">
                    <div className="score-circle">
                      <span className="score-value">{analysisResult.data.overallCondition.score}</span>
                      <span className="score-max">/10</span>
                    </div>
                    <div className="score-label">{analysisResult.data.overallCondition.label}</div>
                  </div>
                  <p>{analysisResult.data.overallCondition.description}</p>
                </div>
              )}

              {/* Positive Observations */}
              {analysisResult.data.positiveObservations && (
                <div className="result-card positive-card">
                  <h3><CheckCircle size={20} /> Positive Observations</h3>
                  <ul>
                    {analysisResult.data.positiveObservations.map((obs, i) => (
                      <li key={i}>{obs}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {analysisResult.data.recommendations && (
                <div className="result-card recommendations-card">
                  <h3><HelpCircle size={20} /> Recommendations</h3>
                  <div className="recommendations-grid">
                    <div className="rec-group">
                      <h4>Immediate</h4>
                      <ul>
                        {analysisResult.data.recommendations.immediate.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rec-group">
                      <h4>Short-Term (1-3 months)</h4>
                      <ul>
                        {analysisResult.data.recommendations.shortTerm.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="rec-group">
                      <h4>Long-Term</h4>
                      <ul>
                        {analysisResult.data.recommendations.longTerm.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Custom Query Answer */}
              {analysisResult.data.answer && (
                <div className="result-card answer-card">
                  <h3><MessageSquare size={20} /> Answer</h3>
                  <p>{analysisResult.data.answer}</p>
                  {analysisResult.data.relatedTimestamps && (
                    <div className="related-timestamps">
                      <strong>Related timestamps:</strong>
                      {analysisResult.data.relatedTimestamps.map((ts, i) => (
                        <span key={i} className="timestamp-badge">{ts}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Key Findings */}
              {analysisResult.data.keyFindings && (
                <div className="result-card findings-card">
                  <h3><Search size={20} /> Key Findings</h3>
                  <ul>
                    {analysisResult.data.keyFindings.map((finding, i) => (
                      <li key={i}>{finding}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Timestamps */}
              {analysisResult.data.timestamps && (
                <div className="result-card timestamps-card">
                  <h3><Clock size={20} /> Timeline</h3>
                  <div className="timeline">
                    {analysisResult.data.timestamps.map((ts, i) => (
                      <div key={i} className="timeline-item">
                        <span className="timeline-time">{ts.time}</span>
                        <span className="timeline-event">{ts.event}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <Sparkles size={20} />
            <span>CR AudioViz AI</span>
          </div>
          <p>"Your Story. Our Design" | EIN: 93-4520864</p>
        </div>
      </footer>

      {/* API Info Modal */}
      {showAPIInfo && (
        <div className="modal-overlay" onClick={() => setShowAPIInfo(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><Info size={24} /> API Information</h2>
              <button className="modal-close" onClick={() => setShowAPIInfo(false)}>
                <X size={24} />
              </button>
            </div>
            <div className="modal-body">
              <div className="api-info-grid">
                {Object.entries(API_CONFIG).map(([key, api]) => {
                  const IconComponent = api.icon;
                  return (
                    <div key={key} className="api-info-card">
                      <div className="api-info-header" style={{ background: api.gradient }}>
                        <IconComponent size={32} color="white" />
                        <h3>{api.name}</h3>
                      </div>
                      <div className="api-info-body">
                        <p><strong>Best For:</strong> {api.bestFor}</p>
                        <p><strong>Free Tier:</strong> {api.freeLimit}</p>
                        <p><strong>Max Video:</strong> {api.maxVideoSize}</p>
                        <p><strong>Max Duration:</strong> {api.maxDuration}</p>
                        <div className="capabilities">
                          <strong>Capabilities:</strong>
                          <ul>
                            {api.capabilities.map((cap, i) => (
                              <li key={i}>{cap}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
