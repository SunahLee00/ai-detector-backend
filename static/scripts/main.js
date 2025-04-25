/**
 * AI Content Detector - UI Implementation
 * Now with API integration
 */
const AIContentDetector = (() => {
  // DOM Elements
  const elements = {
    // Text Analysis Elements
    textArea: document.getElementById('text-to-analyze'),
    wordCountDisplay: document.querySelector('.word-count'),
    detectBtn: document.getElementById('detect-ai'),
    percentageDisplays: document.querySelectorAll('.percentage'),
    
    // Navigation Elements
    tryFreeBtn: document.querySelector('.btn-primary[onclick="scrollToAnalyze()"]'),
    howItWorksBtn: document.querySelector('.btn-outline[onclick="scrollToHowItWorks()"]')
  };

  /* ======================
   *  TEXT ANALYSIS UI & API
   * ====================== */
  const initTextAnalysis = () => {
    if (!elements.textArea || !elements.wordCountDisplay || !elements.detectBtn) return;

    elements.textArea.addEventListener('input', handleTextInput);
    elements.detectBtn.addEventListener('click', handleDetectionClick);
  };

  const handleTextInput = () => {
    const text = elements.textArea.value.trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    elements.wordCountDisplay.textContent = `${wordCount} words`;
    elements.detectBtn.disabled = wordCount < 80;
  };

  const handleDetectionClick = async () => {
    const text = elements.textArea.value.trim();
    if (!text || text.split(/\s+/).length < 80) return;

    // UI Loading state
    elements.detectBtn.disabled = true;
    elements.detectBtn.textContent = 'Analyzing...';
    
    try {
      // Call the backend API
      const response = await fetch('https://ai-detector-eub9.onrender.com/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: text })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      
      // Update UI with results
      updateResultsUI(data);
      
    } catch (error) {
      console.error('Detection error:', error);
      alert('Error analyzing text. Please try again.');
    } finally {
      elements.detectBtn.textContent = 'Detect AI';
      elements.detectBtn.disabled = elements.textArea.value.trim().split(/\s+/).length < 80;
    }
  };

  const updateResultsUI = (data) => {
    // Assuming the API returns percentages in this format:
    // {
    //   ai_generated: 75.3,
    //   ai_refined: 15.2,
    //   human_refined: 7.5,
    //   human_written: 2.0
    // }
    
    // Update each percentage display
    if (data.ai_generated !== undefined) {
      elements.percentageDisplays[0].textContent = data.ai_generated.toFixed(1);
    }
    if (data.ai_refined !== undefined) {
      elements.percentageDisplays[1].textContent = data.ai_refined.toFixed(1);
    }
    if (data.human_refined !== undefined) {
      elements.percentageDisplays[2].textContent = data.human_refined.toFixed(1);
    }
    if (data.human_written !== undefined) {
      elements.percentageDisplays[3].textContent = data.human_written.toFixed(1);
    }
  };

  /* ======================
   *  SMOOTH SCROLLING
   * ====================== */
  const initSmoothScrolling = () => {
    // Remove onclick handlers from HTML and use event listeners
    if (elements.tryFreeBtn) {
      elements.tryFreeBtn.removeAttribute('onclick');
      elements.tryFreeBtn.addEventListener('click', () => scrollToSection('analyze-text'));
    }
    
    if (elements.howItWorksBtn) {
      elements.howItWorksBtn.removeAttribute('onclick');
      elements.howItWorksBtn.addEventListener('click', () => scrollToSection('how-it-works'));
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const offset = -100; // Adjust for fixed header height
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    
    window.scrollTo({
      top: elementPosition + offset,
      behavior: "smooth"
    });
  };

  /* ======================
   *  INITIALIZATION
   * ====================== */
  const init = () => {
    initTextAnalysis();
    initSmoothScrolling();
  };

  // Public API
  return {
    init
  };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', AIContentDetector.init);