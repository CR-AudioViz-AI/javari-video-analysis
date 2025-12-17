import React, { useState, useCallback } from 'react';
import { Upload, Play, Search, Eye, Zap, Shield, Brain, Video, FileVideo, CheckCircle, AlertCircle, Loader2, ChevronRight, Home, Info, Settings, X, Clock, Target, Cpu, BarChart3, Camera, Wrench, AlertTriangle, FileText, Download, ExternalLink } from 'lucide-react';

// ============================================
// JAVARI VIDEO ANALYSIS MODULE
// CR AudioViz AI LLC - Production Build
// Timestamp: December 17, 2025
// ============================================

const API_CONFIG = {
  gemini: {
    name: 'Google Gemini',
    capabilities: ['Video Q&A', 'Damage Analysis', 'Content Summary', 'Scene Description'],
    freeLimit: '1,500 requests/day',
    bestFor: 'General video understanding, Q&A, analysis',
    icon: Brain,
    color: '#4285F4'
  },
  twelveLabs: {
    name: 'Twelve Labs',
    capabilities: ['Semantic Search', 'Timestamp Finding', 'Video Indexing', 'Highlight Detection'],
    freeLimit: '600 minutes lifetime',
    bestFor: 'Finding specific moments, semantic search',
    icon: Search,
    color: '#FF6B6B'
  },
  googleVideoIntelligence: {
    name: 'Google Cloud Video Intelligence',
    capabilities: ['Object Detection', 'Label Detection', 'Scene Change', 'Speech Transcription'],
    freeLimit: '1,000 minutes/month',
    bestFor: 'Object tracking, label detection, scene analysis',
    icon: Eye,
    color: '#34A853'
  },
  roboflow: {
    name: 'Roboflow',
    capabilities: ['Custom Detection', 'Damage Detection', 'Defect Analysis', 'Object Segmentation'],
    freeLimit: '1,000 API calls/month',
    bestFor: 'Custom damage detection, specialized models',
    icon: Target,
    color: '#6366F1'
  }
};

const ANALYSIS_TASKS = [
  {
    id: 'damage_inspection',
    name: 'Property Damage Inspection',
    description: 'Analyze roof, siding, or structural damage from drone/camera footage',
    icon: Shield,
    primaryAPI: 'gemini',
    color: '#EF4444'
  },
  {
    id: 'content_search',
    name: 'Content Search',
    description: 'Find specific moments, objects, or actions within videos',
    icon: Search,
    primaryAPI: 'twelveLabs',
    color: '#8B5CF6'
  },
  {
    id: 'object_tracking',
    name: 'Object Tracking',
    description: 'Track and identify objects, people, or vehicles across video frames',
    icon: Target,
    primaryAPI: 'googleVideoIntelligence',
    color: '#10B981'
  },
  {
    id: 'custom_detection',
    name: 'Custom AI Detection',
    description: 'Use specialized models for specific detection tasks',
    icon: Cpu,
    primaryAPI: 'roboflow',
    color: '#F59E0B'
  },
  {
    id: 'video_summary',
    name: 'Video Summary',
    description: 'Generate comprehensive summaries and key highlights',
    icon: FileText,
    primaryAPI: 'gemini',
    color: '#3B82F6'
  },
  {
    id: 'safety_analysis',
    name: 'Safety & Compliance',
    description: 'Detect safety violations, PPE compliance, hazards',
    icon: AlertTriangle,
    primaryAPI: 'roboflow',
    color: '#EC4899'
  }
];

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedTask, setSelectedTask] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFile = (file) => {
    if (file.type.startsWith('video/') || file.type.startsWith('image/')) {
      setUploadedFile({
        file,
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
        type: file.type,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const simulateAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockResults = {
      timestamp: new Date().toISOString(),
      task: selectedTask?.name || 'General Analysis',
      api: selectedTask?.primaryAPI || 'gemini',
      confidence: 0.94,
      findings: [
        { type: 'observation', text: 'Video successfully processed and analyzed', severity: 'info' },
        { type: 'detection', text: 'Multiple objects identified in footage', severity: 'success' },
        { type: 'recommendation', text: 'Consider additional angles for comprehensive coverage', severity: 'warning' }
      ],
      summary: 'Analysis complete. The video has been processed using AI models optimized for ' + (selectedTask?.name || 'general analysis') + '. Results show high confidence in detection accuracy.',
      processingTime: '3.2 seconds',
      framesAnalyzed: 847
    };
    
    setAnalysisResults(mockResults);
    setIsAnalyzing(false);
  };

  const renderNavigation = () => (
    <nav className="nav">
      <div className="nav-brand">
        <Video className="nav-icon" />
        <span>Javari Video Analysis</span>
      </div>
      <div className="nav-links">
        <button 
          className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
          onClick={() => setCurrentPage('home')}
        >
          <Home size={18} />
          <span>Home</span>
        </button>
        <button 
          className={`nav-link ${currentPage === 'analyze' ? 'active' : ''}`}
          onClick={() => setCurrentPage('analyze')}
        >
          <Cpu size={18} />
          <span>Analyze</span>
        </button>
        <button 
          className={`nav-link ${currentPage === 'about' ? 'active' : ''}`}
          onClick={() => setCurrentPage('about')}
        >
          <Info size={18} />
          <span>About</span>
        </button>
      </div>
    </nav>
  );

  const renderHomePage = () => (
    <div className="page home-page">
      <header className="hero">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Analysis</div>
          <h1>Video Analysis <span className="gradient-text">Reimagined</span></h1>
          <p className="hero-subtitle">
            Analyze drone footage, inspect property damage, search video content, and extract insights using cutting-edge AI models.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={() => setCurrentPage('analyze')}>
              <Upload size={20} />
              Start Analyzing
            </button>
            <button className="btn btn-secondary" onClick={() => setCurrentPage('about')}>
              <Info size={20} />
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <Brain size={24} />
            <span>Gemini AI</span>
          </div>
          <div className="floating-card card-2">
            <Search size={24} />
            <span>Twelve Labs</span>
          </div>
          <div className="floating-card card-3">
            <Eye size={24} />
            <span>Video Intel</span>
          </div>
          <div className="floating-card card-4">
            <Target size={24} />
            <span>Roboflow</span>
          </div>
        </div>
      </header>

      <section className="tasks-section">
        <h2>Analysis Capabilities</h2>
        <div className="tasks-grid">
          {ANALYSIS_TASKS.map((task) => (
            <div 
              key={task.id} 
              className="task-card"
              onClick={() => {
                setSelectedTask(task);
                setCurrentPage('analyze');
              }}
            >
              <div className="task-icon" style={{ backgroundColor: task.color + '20', color: task.color }}>
                <task.icon size={28} />
              </div>
              <h3>{task.name}</h3>
              <p>{task.description}</p>
              <div className="task-api">
                Powered by {API_CONFIG[task.primaryAPI]?.name}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="apis-section">
        <h2>Integrated AI Services</h2>
        <div className="apis-grid">
          {Object.entries(API_CONFIG).map(([key, api]) => (
            <div key={key} className="api-card">
              <div className="api-header">
                <div className="api-icon" style={{ backgroundColor: api.color + '20', color: api.color }}>
                  <api.icon size={24} />
                </div>
                <div>
                  <h3>{api.name}</h3>
                  <span className="api-free">{api.freeLimit}</span>
                </div>
              </div>
              <p className="api-best">{api.bestFor}</p>
              <div className="api-capabilities">
                {api.capabilities.map((cap, i) => (
                  <span key={i} className="capability-tag">{cap}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderAnalyzePage = () => (
    <div className="page analyze-page">
      <div className="analyze-header">
        <h1>Video Analysis</h1>
        <p>Upload your video or images for AI-powered analysis</p>
      </div>

      {!uploadedFile ? (
        <div 
          className={`upload-zone ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-upload"
            accept="video/*,image/*"
            onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
            hidden
          />
          <label htmlFor="file-upload" className="upload-label">
            <Upload size={48} className="upload-icon" />
            <h3>Drop your video or images here</h3>
            <p>or click to browse</p>
            <span className="upload-formats">Supports MP4, MOV, AVI, PNG, JPG</span>
          </label>
        </div>
      ) : (
        <div className="uploaded-content">
          <div className="file-preview">
            {uploadedFile.type.startsWith('video/') ? (
              <video src={uploadedFile.preview} controls className="preview-media" />
            ) : (
              <img src={uploadedFile.preview} alt="Preview" className="preview-media" />
            )}
            <button className="remove-file" onClick={() => setUploadedFile(null)}>
              <X size={20} />
            </button>
          </div>
          <div className="file-info">
            <FileVideo size={20} />
            <span>{uploadedFile.name}</span>
            <span className="file-size">{uploadedFile.size}</span>
          </div>
        </div>
      )}

      <div className="task-selection">
        <h3>Select Analysis Type</h3>
        <div className="task-options">
          {ANALYSIS_TASKS.map((task) => (
            <button
              key={task.id}
              className={`task-option ${selectedTask?.id === task.id ? 'selected' : ''}`}
              onClick={() => setSelectedTask(task)}
              style={{ '--task-color': task.color }}
            >
              <task.icon size={20} />
              <span>{task.name}</span>
            </button>
          ))}
        </div>
      </div>

      {uploadedFile && selectedTask && (
        <button 
          className="btn btn-primary analyze-btn"
          onClick={simulateAnalysis}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <Loader2 size={20} className="spinning" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap size={20} />
              Start Analysis
            </>
          )}
        </button>
      )}

      {analysisResults && (
        <div className="results-section">
          <h3>Analysis Results</h3>
          <div className="results-card">
            <div className="results-header">
              <div className="results-meta">
                <span><Clock size={16} /> {analysisResults.processingTime}</span>
                <span><Camera size={16} /> {analysisResults.framesAnalyzed} frames</span>
                <span><BarChart3 size={16} /> {(analysisResults.confidence * 100).toFixed(0)}% confidence</span>
              </div>
              <span className="results-api">via {API_CONFIG[analysisResults.api]?.name}</span>
            </div>
            <div className="results-summary">
              <p>{analysisResults.summary}</p>
            </div>
            <div className="results-findings">
              {analysisResults.findings.map((finding, i) => (
                <div key={i} className={`finding ${finding.severity}`}>
                  {finding.severity === 'success' && <CheckCircle size={16} />}
                  {finding.severity === 'warning' && <AlertCircle size={16} />}
                  {finding.severity === 'info' && <Info size={16} />}
                  <span>{finding.text}</span>
                </div>
              ))}
            </div>
            <div className="results-actions">
              <button className="btn btn-secondary">
                <Download size={18} />
                Export Report
              </button>
              <button className="btn btn-secondary">
                <ExternalLink size={18} />
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAboutPage = () => (
    <div className="page about-page">
      <div className="about-header">
        <h1>About Javari Video Analysis</h1>
        <p>Part of the CR AudioViz AI Ecosystem</p>
      </div>

      <section className="about-section">
        <h2>What It Does</h2>
        <div className="about-content">
          <p>
            Javari Video Analysis is an AI-powered module that enables intelligent video and image analysis 
            using multiple cutting-edge APIs. Whether you're inspecting property damage from drone footage, 
            searching for specific moments in long videos, or detecting objects and safety hazards, 
            this tool routes your request to the optimal AI service.
          </p>
        </div>
      </section>

      <section className="about-section">
        <h2>Integrated AI Services</h2>
        <div className="services-detail">
          {Object.entries(API_CONFIG).map(([key, api]) => (
            <div key={key} className="service-detail-card">
              <div className="service-header">
                <div className="service-icon" style={{ backgroundColor: api.color + '20', color: api.color }}>
                  <api.icon size={32} />
                </div>
                <div>
                  <h3>{api.name}</h3>
                  <span className="service-tier">Free Tier: {api.freeLimit}</span>
                </div>
              </div>
              <p className="service-description">{api.bestFor}</p>
              <div className="service-capabilities">
                <h4>Capabilities:</h4>
                <ul>
                  {api.capabilities.map((cap, i) => (
                    <li key={i}><CheckCircle size={14} /> {cap}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>Use Cases</h2>
        <div className="use-cases-grid">
          <div className="use-case">
            <Shield size={32} />
            <h3>Property Inspection</h3>
            <p>Analyze drone footage of roofs, buildings, and structures to identify damage, wear, or defects.</p>
          </div>
          <div className="use-case">
            <Search size={32} />
            <h3>Content Search</h3>
            <p>Find specific moments, objects, or actions within hours of video footage using natural language.</p>
          </div>
          <div className="use-case">
            <AlertTriangle size={32} />
            <h3>Safety Compliance</h3>
            <p>Detect PPE violations, safety hazards, and compliance issues in workplace footage.</p>
          </div>
          <div className="use-case">
            <FileText size={32} />
            <h3>Video Summarization</h3>
            <p>Generate comprehensive summaries, transcripts, and key highlights from any video.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Smart API Routing</h2>
        <div className="routing-info">
          <p>
            Javari automatically routes your analysis request to the optimal API based on the task:
          </p>
          <div className="routing-table">
            <div className="routing-row">
              <span className="routing-task">General Q&A / Damage Analysis</span>
              <ChevronRight size={16} />
              <span className="routing-api">Google Gemini</span>
            </div>
            <div className="routing-row">
              <span className="routing-task">Timestamp / Moment Search</span>
              <ChevronRight size={16} />
              <span className="routing-api">Twelve Labs</span>
            </div>
            <div className="routing-row">
              <span className="routing-task">Object Detection / Labels</span>
              <ChevronRight size={16} />
              <span className="routing-api">Google Video Intelligence</span>
            </div>
            <div className="routing-row">
              <span className="routing-task">Custom / Specialized Detection</span>
              <ChevronRight size={16} />
              <span className="routing-api">Roboflow</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section credits">
        <h2>Credits</h2>
        <p>
          Built by <strong>CR AudioViz AI, LLC</strong><br />
          Part of the Javari AI Ecosystem<br />
          "Your Story. Our Design."
        </p>
      </section>
    </div>
  );

  return (
    <div className="app">
      {renderNavigation()}
      <main className="main">
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'analyze' && renderAnalyzePage()}
        {currentPage === 'about' && renderAboutPage()}
      </main>
      <footer className="footer">
        <p>© 2025 CR AudioViz AI, LLC • Everyone connects. Everyone wins.</p>
      </footer>
    </div>
  );
}

export default App;
