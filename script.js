// Mobile Navigation Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get all "navbar-burger" elements
  const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

  // Check if there are any navbar burgers
  if (navbarBurgers.length > 0) {
    // Add a click event on each of them
    navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const targetElement = document.getElementById(target);

        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        if (targetElement) {
          el.classList.toggle('is-active');
          targetElement.classList.toggle('is-active');
        }
      });
    });
  }
});

// Email Signup Form Functionality
document.addEventListener('DOMContentLoaded', function() {
  const emailSignupForm = document.querySelector('.email-signup-form');
  const emailSignupButton = document.getElementById('email-signup-btn');
  const emailInput = document.getElementById('email-input');
  const feedbackDiv = document.getElementById('signup-feedback');
  const errorDiv = document.getElementById('email-input-error');

  if (emailSignupForm && emailSignupButton && emailInput) {
    
    // Field-level error display functions
    function showFieldError(message) {
      emailInput.classList.add('is-danger');
      emailInput.setAttribute('aria-invalid', 'true');
      if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('is-hidden');
      }
    }
    
    function clearFieldError() {
      emailInput.classList.remove('is-danger');
      emailInput.setAttribute('aria-invalid', 'false');
      if (errorDiv) {
        errorDiv.textContent = '';
        errorDiv.classList.add('is-hidden');
      }
    }
    
    // Real-time validation on blur
    emailInput.addEventListener('blur', function() {
      const validation = validateEmailInput(this.value);
      if (!validation.isValid) {
        showFieldError(validation.message);
      } else {
        clearFieldError();
      }
    });
    
    // Clear error on input
    emailInput.addEventListener('input', function() {
      if (this.classList.contains('is-danger')) {
        clearFieldError();
      }
      // Clear feedback when user starts typing
      if (feedbackDiv && feedbackDiv.textContent) {
        feedbackDiv.innerHTML = '';
        feedbackDiv.className = '';
      }
    });
    
    // Handle form submission
    emailSignupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleEmailSignup();
    });
    
    // Handle button click (backup for accessibility)
    emailSignupButton.addEventListener('click', function(e) {
      e.preventDefault();
      handleEmailSignup();
    });
  }
  
  function handleEmailSignup() {
    const email = emailInput.value.trim();
    
    // Clear previous feedback
    if (feedbackDiv) {
      feedbackDiv.innerHTML = '';
      feedbackDiv.className = '';
    }
    
    // Validate email using enhanced validation
    const validation = validateEmailInput(email);
    
    if (!validation.isValid) {
      showFieldError(validation.message);
      showFeedback(validation.message, 'error');
      emailInput.focus();
      return;
    } else {
      clearFieldError();
    }
    
    // Show suggestion if there's a potential typo
    if (validation.suggestion) {
      showFeedback(validation.suggestion, 'warning');
      return;
    }
    
    // Simulate signup process
    emailSignupButton.textContent = 'Signing up...';
    emailSignupButton.disabled = true;
    emailInput.disabled = true;
    
    // Simulate API call delay
    setTimeout(() => {
      showFeedback('Thank you! You\'ve been added to the waitlist. We\'ll send you updates about Lingle.', 'success');
      emailInput.value = '';
      emailSignupButton.textContent = 'Sign up';
      emailSignupButton.disabled = false;
      emailInput.disabled = false;
    }, 1500);
  }
});

// Email validation function
function isValidEmail(email) {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}

// Additional validation functions
function validateEmailInput(email) {
  const trimmedEmail = email.trim();
  
  // Check if empty
  if (!trimmedEmail) {
    return { isValid: false, message: 'Please enter an email address.' };
  }
  
  // Check minimum length
  if (trimmedEmail.length < 5) {
    return { isValid: false, message: 'Email address is too short.' };
  }
  
  // Check maximum length
  if (trimmedEmail.length > 254) {
    return { isValid: false, message: 'Email address is too long.' };
  }
  
  // Check basic format
  if (!isValidEmail(trimmedEmail)) {
    return { isValid: false, message: 'Please enter a valid email address.' };
  }
  
  // Check for common typos
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com'];
  const emailParts = trimmedEmail.split('@');
  if (emailParts.length === 2) {
    const domain = emailParts[1].toLowerCase();
    const suggestions = [];
    
    // Check for close matches to common domains
    commonDomains.forEach(commonDomain => {
      if (domain !== commonDomain && isCloseTo(domain, commonDomain)) {
        suggestions.push(commonDomain);
      }
    });
    
    if (suggestions.length > 0) {
      return { 
        isValid: true, 
        suggestion: `Did you mean ${emailParts[0]}@${suggestions[0]}?` 
      };
    }
  }
  
  return { isValid: true };
}

// Helper function to check if two strings are close (for typo detection)
function isCloseTo(str1, str2) {
  if (Math.abs(str1.length - str2.length) > 2) return false;
  
  let differences = 0;
  const maxLen = Math.max(str1.length, str2.length);
  
  for (let i = 0; i < maxLen; i++) {
    if (str1[i] !== str2[i]) {
      differences++;
      if (differences > 2) return false;
    }
  }
  
  return differences <= 2 && differences > 0;
}

// Show feedback function
function showFeedback(message, type) {
  const feedbackDiv = document.getElementById('signup-feedback');
  if (feedbackDiv) {
    feedbackDiv.innerHTML = message;
    
    // Set appropriate classes based on feedback type
    switch(type) {
      case 'success':
        feedbackDiv.className = 'notification is-success';
        break;
      case 'error':
        feedbackDiv.className = 'notification is-danger';
        break;
      case 'warning':
        feedbackDiv.className = 'notification is-warning';
        break;
      default:
        feedbackDiv.className = 'notification is-info';
    }
    
    feedbackDiv.style.marginTop = '15px';
    feedbackDiv.style.fontSize = '0.9rem';
    feedbackDiv.style.borderRadius = '6px';
    
    // Add smooth appearance animation
    feedbackDiv.style.opacity = '0';
    feedbackDiv.style.transform = 'translateY(-10px)';
    feedbackDiv.style.transition = 'all 0.3s ease';
    
    // Trigger animation
    setTimeout(() => {
      feedbackDiv.style.opacity = '1';
      feedbackDiv.style.transform = 'translateY(0)';
    }, 10);
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        if (feedbackDiv.className.includes('is-success')) {
          feedbackDiv.style.opacity = '0';
          feedbackDiv.style.transform = 'translateY(-10px)';
          setTimeout(() => {
            feedbackDiv.innerHTML = '';
            feedbackDiv.className = '';
          }, 300);
        }
      }, 5000);
    }
  }
}

// Interactive Language Learning Preview Widget Functions

// Daily Journal functionality
let journalPrompts = [
  "Describe your ideal weekend",
  "What makes you happy?",
  "Tell us about your favorite food",
  "Describe your dream vacation",
  "What did you learn today?"
];

let journalFeedbacks = [
  "Great use of descriptive language! Consider adding more varied sentence structures.",
  "Excellent emotional expression! Try using more specific adjectives.",
  "Wonderful detail! Consider adding sensory descriptions.",
  "Beautiful imagery! Try connecting ideas with transition words.",
  "Thoughtful reflection! Consider expanding on your examples."
];

function tryJournal() {
  const journalText = document.getElementById('journal-text');
  const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
  
  // Simulate user input
  journalText.style.color = '#333';
  journalText.style.fontStyle = 'normal';
  journalText.textContent = 'I love spending weekends reading books in the park and discovering new stories...';
  
  // Update prompt
  const promptElement = journalText.closest('.journal-demo').querySelector('p');
  promptElement.innerHTML = `<strong>Today's Prompt:</strong> ${randomPrompt}`;
  
  // Update AI feedback
  setTimeout(() => {
    const feedbackElement = document.querySelector('.ai-feedback p');
    const randomFeedback = journalFeedbacks[Math.floor(Math.random() * journalFeedbacks.length)];
    feedbackElement.innerHTML = `<strong>AI Feedback:</strong> ${randomFeedback}`;
    
    // Add visual feedback animation
    const feedbackDiv = document.querySelector('.ai-feedback');
    feedbackDiv.style.background = '#e8f6f3';
    feedbackDiv.style.border = '2px solid #48c78e';
    feedbackDiv.style.animation = 'pulse 0.5s ease-in-out';
  }, 800);
}

// Translation Game functionality
let translationPhrases = [
  { english: "Good morning!", spanish: "Buenos días", options: ["Buenos días", "Buenas noches", "Buenas tardes"], correct: 0 },
  { english: "How are you?", spanish: "¿Cómo estás?", options: ["¿Dónde estás?", "¿Cómo estás?", "¿Qué tal?"], correct: 1 },
  { english: "Thank you very much", spanish: "Muchas gracias", options: ["De nada", "Por favor", "Muchas gracias"], correct: 2 },
  { english: "See you later", spanish: "Hasta luego", options: ["Hasta luego", "Hasta mañana", "Hasta pronto"], correct: 0 },
  { english: "I love this!", spanish: "¡Me encanta esto!", options: ["Me gusta", "¡Me encanta esto!", "No me gusta"], correct: 1 }
];

let currentPhraseIndex = 0;
let gameScore = 480;
let gameStreak = 3;

function startGame() {
  currentPhraseIndex = Math.floor(Math.random() * translationPhrases.length);
  const phrase = translationPhrases[currentPhraseIndex];
  
  // Update phrase to translate
  document.getElementById('phrase-to-translate').textContent = phrase.english;
  
  // Update options
  const options = document.querySelectorAll('.translation-option');
  options.forEach((option, index) => {
    option.textContent = String.fromCharCode(65 + index) + ') ' + phrase.options[index];
    option.className = 'button is-small translation-option';
    option.style.backgroundColor = '';
    option.style.color = '';
    option.disabled = false;
  });
  
  // Reset progress bar
  const progressBar = document.querySelector('.progress-bar');
  progressBar.style.width = '60%';
  
  // Update button text
  const startButton = document.querySelector('.column.is-4:nth-child(2) .button.is-success');
  startButton.textContent = 'Next Question';
}

function selectTranslation(button, isCorrect) {
  const phrase = translationPhrases[currentPhraseIndex];
  const allButtons = document.querySelectorAll('.translation-option');
  
  // Disable all buttons
  allButtons.forEach(btn => btn.disabled = true);
  
  if (isCorrect || button.textContent.includes(phrase.spanish)) {
    // Correct answer
    button.style.backgroundColor = '#48c78e';
    button.style.color = 'white';
    gameScore += 20;
    gameStreak += 1;
    
    // Update progress bar
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = '80%';
  } else {
    // Wrong answer
    button.style.backgroundColor = '#ff6b6b';
    button.style.color = 'white';
    
    // Show correct answer
    allButtons.forEach((btn, index) => {
      if (btn.textContent.includes(phrase.spanish)) {
        btn.style.backgroundColor = '#48c78e';
        btn.style.color = 'white';
      }
    });
    
    gameStreak = 0;
    // Progress bar stays the same or decreases slightly
    const progressBar = document.querySelector('.progress-bar');
    progressBar.style.width = '40%';
  }
  
  // Update score and streak
  document.getElementById('game-score').textContent = gameScore;
  document.getElementById('game-streak').textContent = gameStreak;
  
  // Auto-advance to next question after 2 seconds
  setTimeout(() => {
    startGame();
  }, 2000);
}

// Smart Feedback functionality
let feedbackExamples = [
  {
    original: "I are going to the store yesterday.",
    corrected: "I went to the store yesterday.",
    explanation: "Changed 'are going' to 'went' for past tense consistency with 'yesterday'"
  },
  {
    original: "She don't like pizza very much.",
    corrected: "She doesn't like pizza very much.",
    explanation: "Changed 'don't' to 'doesn't' for subject-verb agreement with third person singular"
  },
  {
    original: "There is many students in the class.",
    corrected: "There are many students in the class.",
    explanation: "Changed 'is' to 'are' because 'students' is plural"
  },
  {
    original: "I have been lived here for five years.",
    corrected: "I have lived here for five years.",
    explanation: "Removed 'been' to use correct present perfect tense structure"
  },
  {
    original: "He more taller than his brother.",
    corrected: "He is taller than his brother.",
    explanation: "Added 'is' and removed 'more' for correct comparative adjective structure"
  }
];

function showFeedback() {
  const randomExample = feedbackExamples[Math.floor(Math.random() * feedbackExamples.length)];
  
  // Update original text
  const originalText = document.querySelector('.original-text p');
  originalText.textContent = randomExample.original;
  
  // Update corrected text
  const correctedText = document.querySelector('.corrected-text p');
  correctedText.textContent = randomExample.corrected;
  
  // Update explanation
  const explanation = document.querySelector('.feedback-explanation p');
  explanation.innerHTML = `<strong>Grammar Fix:</strong> ${randomExample.explanation}`;
  
  // Add animation effect
  const feedbackDemo = document.querySelector('.feedback-demo');
  feedbackDemo.style.border = '2px solid #3e8ed0';
  feedbackDemo.style.animation = 'slideIn 0.5s ease-out';
  
  // Update feedback stats with random results
  const stats = document.querySelectorAll('.feedback-stats .column span');
  const statuses = ['✓ Grammar', '✓ Vocabulary', '! Style'];
  const colors = ['has-text-success', 'has-text-info', 'has-text-warning'];
  
  stats.forEach((stat, index) => {
    stat.className = colors[index];
    stat.textContent = statuses[index];
  });
  
  // Change button text
  const feedbackButton = document.querySelector('.column.is-4:nth-child(3) .button.is-danger');
  feedbackButton.textContent = 'Try Another';
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.02); }
    100% { transform: scale(1); }
  }
  
  @keyframes slideIn {
    0% { transform: translateX(-10px); opacity: 0; }
    100% { transform: translateX(0); opacity: 1; }
  }
  
  .preview-widget:hover {
    transform: translateY(-5px) !important;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
  }
  
  .translation-option:hover:not(:disabled) {
    background-color: #f5f5f5 !important;
    transform: translateY(-1px);
  }
  
  .translation-option:disabled {
    cursor: not-allowed;
  }
  
  .progress-bar {
    transition: width 0.5s ease-in-out;
  }
  
  .journal-input {
    transition: all 0.3s ease;
  }
  
  .journal-input:hover {
    border-color: #3e8ed0 !important;
  }
`;
document.head.appendChild(style);

// Initialize the demo widgets on page load
document.addEventListener('DOMContentLoaded', function() {
  // Set up initial game state
  if (document.getElementById('phrase-to-translate')) {
    startGame();
  }
  
  // Initialize testimonials carousel
  if (document.getElementById('testimonialsContainer')) {
    initializeTestimonialsCarousel();
  }
});

// Testimonials Carousel Functionality
let currentTestimonialIndex = 0;
const totalTestimonials = 3;
let testimonialInterval;

function initializeTestimonialsCarousel() {
  // Start auto-rotation
  startTestimonialAutoRotation();
  
  // Add hover pause functionality
  const testimonialContainer = document.getElementById('testimonialsContainer');
  if (testimonialContainer) {
    testimonialContainer.addEventListener('mouseenter', pauseTestimonialAutoRotation);
    testimonialContainer.addEventListener('mouseleave', startTestimonialAutoRotation);
  }
}

function startTestimonialAutoRotation() {
  // Clear any existing interval
  if (testimonialInterval) {
    clearInterval(testimonialInterval);
  }
  
  // Auto-advance every 6 seconds
  testimonialInterval = setInterval(() => {
    changeTestimonial(1);
  }, 6000);
}

function pauseTestimonialAutoRotation() {
  if (testimonialInterval) {
    clearInterval(testimonialInterval);
    testimonialInterval = null;
  }
}

function changeTestimonial(direction) {
  const container = document.getElementById('testimonialsContainer');
  if (!container) return;
  
  // Update current index
  currentTestimonialIndex += direction;
  
  // Handle wraparound
  if (currentTestimonialIndex >= totalTestimonials) {
    currentTestimonialIndex = 0;
  } else if (currentTestimonialIndex < 0) {
    currentTestimonialIndex = totalTestimonials - 1;
  }
  
  // Apply transform
  const translateX = -(currentTestimonialIndex * 100);
  container.style.transform = `translateX(${translateX}%)`;
  
  // Update dots
  updateTestimonialDots();
  
  // Add animation effect to the active testimonial
  animateTestimonialEntry();
}

function currentTestimonial(index) {
  const container = document.getElementById('testimonialsContainer');
  if (!container) return;
  
  // Pause auto-rotation when user manually navigates
  pauseTestimonialAutoRotation();
  
  // Set current index (convert from 1-based to 0-based)
  currentTestimonialIndex = index - 1;
  
  // Apply transform
  const translateX = -(currentTestimonialIndex * 100);
  container.style.transform = `translateX(${translateX}%)`;
  
  // Update dots
  updateTestimonialDots();
  
  // Add animation effect
  animateTestimonialEntry();
  
  // Resume auto-rotation after 10 seconds
  setTimeout(() => {
    startTestimonialAutoRotation();
  }, 10000);
}

function updateTestimonialDots() {
  const dots = document.querySelectorAll('.dot');
  dots.forEach((dot, index) => {
    if (index === currentTestimonialIndex) {
      dot.classList.add('active');
      dot.style.backgroundColor = '#3e8ed0';
    } else {
      dot.classList.remove('active');
      dot.style.backgroundColor = '#bbb';
    }
  });
}

function animateTestimonialEntry() {
  // Get the currently visible testimonial card
  const cards = document.querySelectorAll('.testimonial-card');
  const activeCard = cards[currentTestimonialIndex];
  
  if (activeCard) {
    // Add entrance animation
    const content = activeCard.querySelector('.testimonial-content');
    const avatar = activeCard.querySelector('.avatar-circle');
    
    if (content) {
      content.style.animation = 'testimonialSlideIn 0.6s ease-out';
    }
    
    if (avatar) {
      avatar.style.animation = 'testimonialBounceIn 0.8s ease-out';
    }
    
    // Remove animation classes after animation completes
    setTimeout(() => {
      if (content) content.style.animation = '';
      if (avatar) avatar.style.animation = '';
    }, 800);
  }
}

// Add testimonial-specific CSS animations
const testimonialStyle = document.createElement('style');
testimonialStyle.textContent = `
  @keyframes testimonialSlideIn {
    0% { 
      transform: translateY(20px); 
      opacity: 0; 
    }
    100% { 
      transform: translateY(0); 
      opacity: 1; 
    }
  }
  
  @keyframes testimonialBounceIn {
    0% { 
      transform: scale(0.8); 
      opacity: 0; 
    }
    50% { 
      transform: scale(1.05); 
      opacity: 0.8; 
    }
    100% { 
      transform: scale(1); 
      opacity: 1; 
    }
  }
  
  .testimonials-container {
    overflow: hidden;
    position: relative;
  }
  
  .testimonial-card {
    flex-shrink: 0;
  }
  
  .testimonial-nav-btn:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(62, 142, 208, 0.3);
  }
  
  .testimonial-nav-btn:active {
    transform: scale(0.95);
  }
  
  .dot {
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .dot:hover {
    transform: scale(1.2);
  }
  
  .achievement-stat {
    transition: all 0.3s ease;
  }
  
  .achievement-stat:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(0,0,0,0.12);
  }
  
  .social-proof-box {
    transition: all 0.3s ease;
  }
  
  .social-proof-box:hover {
    transform: translateY(-2px);
    box-shadow: 0 15px 40px rgba(0,0,0,0.12);
  }
  
  .testimonial-badges .tag {
    transition: all 0.2s ease;
  }
  
  .testimonial-badges .tag:hover {
    transform: translateY(-1px);
  }
  
  .metric-item {
    transition: all 0.3s ease;
  }
  
  .metric-item:hover {
    transform: scale(1.05);
  }
  
  /* Smooth testimonial transitions */
  .testimonials-container {
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  /* Loading animation for stats */
  @keyframes countUp {
    0% { 
      transform: translateY(20px); 
      opacity: 0; 
    }
    100% { 
      transform: translateY(0); 
      opacity: 1; 
    }
  }
  
  .stat-number {
    animation: countUp 0.8s ease-out;
  }
  
  /* Social proof indicators animation */
  .social-indicator {
    transition: all 0.3s ease;
  }
  
  .social-indicator:hover {
    transform: translateY(-2px);
  }
`;
document.head.appendChild(testimonialStyle);

// Add interactive number counting animation on scroll
function animateStatsOnScroll() {
  const stats = document.querySelectorAll('.stat-number');
  const options = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const stat = entry.target;
        const finalValue = stat.textContent;
        
        // Only animate numbers (not text like "4.9★")
        if (/^\d+$/.test(finalValue.replace(/,/g, ''))) {
          animateNumber(stat, 0, parseInt(finalValue.replace(/,/g, '')), 2000);
        }
        
        observer.unobserve(stat);
      }
    });
  }, options);
  
  stats.forEach(stat => observer.observe(stat));
}

function animateNumber(element, start, end, duration) {
  const startTime = performance.now();
  const range = end - start;
  
  function updateNumber(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (range * easeOut));
    
    // Format number with commas for large numbers
    element.textContent = current.toLocaleString();
    
    if (progress < 1) {
      requestAnimationFrame(updateNumber);
    } else {
      // Ensure final value is set correctly
      element.textContent = end.toLocaleString();
    }
  }
  
  requestAnimationFrame(updateNumber);
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add a small delay to ensure all elements are rendered
  setTimeout(() => {
    animateStatsOnScroll();
  }, 500);
});

// Social Media Sharing Functions
function shareOnTwitter(text, url) {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
  window.open(twitterUrl, '_blank', 'width=550,height=420');
}

function shareOnFacebook(url) {
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  window.open(facebookUrl, '_blank', 'width=580,height=296');
}

function shareOnWhatsApp(text) {
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, '_blank');
}

function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(function() {
    // Update button text temporarily
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="icon" style="font-size: 1rem;">✓</span><span>Copied!</span>';
    button.style.backgroundColor = '#48c78e';
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.backgroundColor = '';
    }, 2000);
  }).catch(function(err) {
    console.error('Could not copy text: ', err);
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    const originalText = button.innerHTML;
    button.innerHTML = '<span class="icon" style="font-size: 1rem;">✓</span><span>Copied!</span>';
    button.style.backgroundColor = '#48c78e';
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.backgroundColor = '';
    }, 2000);
  });
}

// Success Story Sharing Functions
function shareSuccessStory(platform) {
  const stories = [
    "🚀 Just improved my Spanish writing by 87% in 6 weeks with Lingle's AI feedback! The daily journal prompts kept me engaged. #LanguageLearning #AI",
    "🎮 Lingle's translation games are addictive! Improved my French pronunciation by 60% while having fun. Perfect for busy students! #LearnFrench #Lingle",
    "🤖 The AI feedback in Lingle is incredibly detailed. Unlike other apps, it explains WHY my German grammar is wrong. Went from beginner to B1 in 8 weeks! #LearnGerman"
  ];
  
  const randomStory = stories[Math.floor(Math.random() * stories.length)];
  const url = 'https://getlingle.com';
  
  switch(platform) {
    case 'twitter':
      shareOnTwitter(randomStory, url);
      break;
    case 'facebook':
      shareOnFacebook(url);
      break;
    case 'linkedin':
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      window.open(linkedinUrl, '_blank', 'width=520,height=570');
      break;
  }
}

// Social Media Opening Functions
function openSocialMedia(platform) {
  const socialUrls = {
    twitter: 'https://twitter.com/LingleLabs',
    instagram: 'https://instagram.com/linglelabs',
    linkedin: 'https://linkedin.com/company/lingle-labs',
    tiktok: 'https://tiktok.com/@linglelabs',
    youtube: 'https://youtube.com/@LingleLabs'
  };
  
  if (socialUrls[platform]) {
    window.open(socialUrls[platform], '_blank');
  }
}

// Enhanced Newsletter Signup Functionality
document.addEventListener('DOMContentLoaded', function() {
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterSubmitBtn = document.getElementById('newsletter-submit');
  const newsletterEmailInput = document.getElementById('newsletter-email');
  const newsletterNameInput = document.getElementById('newsletter-name');
  const newsletterLanguageSelect = document.getElementById('newsletter-language');
  const newsletterFeedback = document.getElementById('newsletter-feedback');
  const newsletterEmailError = document.getElementById('newsletter-email-error');

  if (newsletterForm && newsletterSubmitBtn && newsletterEmailInput) {
    
    // Real-time email validation
    newsletterEmailInput.addEventListener('blur', function() {
      const validation = validateEmailInput(this.value);
      if (!validation.isValid && this.value.trim()) {
        showNewsletterFieldError(validation.message);
      } else {
        clearNewsletterFieldError();
      }
    });
    
    // Clear error on input
    newsletterEmailInput.addEventListener('input', function() {
      if (this.classList.contains('is-danger')) {
        clearNewsletterFieldError();
      }
      clearNewsletterFeedback();
    });
    
    // Handle form submission
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleNewsletterSignup();
    });
  }
  
  function showNewsletterFieldError(message) {
    newsletterEmailInput.classList.add('is-danger');
    if (newsletterEmailError) {
      newsletterEmailError.textContent = message;
      newsletterEmailError.classList.remove('is-hidden');
    }
  }
  
  function clearNewsletterFieldError() {
    newsletterEmailInput.classList.remove('is-danger');
    if (newsletterEmailError) {
      newsletterEmailError.textContent = '';
      newsletterEmailError.classList.add('is-hidden');
    }
  }
  
  function clearNewsletterFeedback() {
    if (newsletterFeedback && newsletterFeedback.textContent) {
      newsletterFeedback.innerHTML = '';
      newsletterFeedback.className = '';
    }
  }
  
  function handleNewsletterSignup() {
    const email = newsletterEmailInput.value.trim();
    const name = newsletterNameInput ? newsletterNameInput.value.trim() : '';
    const language = newsletterLanguageSelect ? newsletterLanguageSelect.value : '';
    
    // Clear previous feedback
    clearNewsletterFeedback();
    
    // Validate email
    const validation = validateEmailInput(email);
    
    if (!validation.isValid) {
      showNewsletterFieldError(validation.message);
      showNewsletterFeedback(validation.message, 'error');
      newsletterEmailInput.focus();
      return;
    } else {
      clearNewsletterFieldError();
    }
    
    // Show suggestion if there's a potential typo
    if (validation.suggestion) {
      showNewsletterFeedback(`${validation.suggestion} Click submit again to continue with ${email}`, 'warning');
      return;
    }
    
    // Show loading state
    newsletterSubmitBtn.disabled = true;
    newsletterSubmitBtn.innerHTML = '<span class="icon"><i>⏳</i></span><span>Subscribing...</span>';
    newsletterEmailInput.disabled = true;
    if (newsletterNameInput) newsletterNameInput.disabled = true;
    if (newsletterLanguageSelect) newsletterLanguageSelect.disabled = true;
    
    // Simulate newsletter signup API call
    setTimeout(() => {
      const personalizedMessage = name 
        ? `Thank you, ${name}! Welcome to the Lingle community!` 
        : 'Thank you! Welcome to the Lingle community!';
      
      const languageMessage = language 
        ? ` We'll send you personalized tips for learning ${getLanguageName(language)}.` 
        : ' We\'ll send you our best language learning tips and updates.';
      
      const fullMessage = personalizedMessage + languageMessage + ' Check your email for your free resources!';
      
      showNewsletterFeedback(fullMessage, 'success');
      
      // Reset form
      newsletterForm.reset();
      
      // Re-enable form
      newsletterSubmitBtn.disabled = false;
      newsletterSubmitBtn.innerHTML = '<span class="icon"><i>🚀</i></span><span>Get My Free Resources</span>';
      newsletterEmailInput.disabled = false;
      if (newsletterNameInput) newsletterNameInput.disabled = false;
      if (newsletterLanguageSelect) newsletterLanguageSelect.disabled = false;
      
      // Track signup (you can add analytics here)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'newsletter_signup', {
          'event_category': 'engagement',
          'event_label': language || 'unknown'
        });
      }
      
    }, 2000);
  }
  
  function showNewsletterFeedback(message, type) {
    if (newsletterFeedback) {
      newsletterFeedback.innerHTML = message;
      
      switch(type) {
        case 'success':
          newsletterFeedback.className = 'notification is-success';
          break;
        case 'error':
          newsletterFeedback.className = 'notification is-danger';
          break;
        case 'warning':
          newsletterFeedback.className = 'notification is-warning';
          break;
        default:
          newsletterFeedback.className = 'notification is-info';
      }
      
      newsletterFeedback.style.marginTop = '20px';
      newsletterFeedback.style.borderRadius = '8px';
      newsletterFeedback.style.opacity = '0';
      newsletterFeedback.style.transform = 'translateY(-10px)';
      newsletterFeedback.style.transition = 'all 0.3s ease';
      
      // Trigger animation
      setTimeout(() => {
        newsletterFeedback.style.opacity = '1';
        newsletterFeedback.style.transform = 'translateY(0)';
      }, 10);
      
      // Auto-hide success messages after 8 seconds
      if (type === 'success') {
        setTimeout(() => {
          if (newsletterFeedback.className.includes('is-success')) {
            newsletterFeedback.style.opacity = '0';
            newsletterFeedback.style.transform = 'translateY(-10px)';
            setTimeout(() => {
              newsletterFeedback.innerHTML = '';
              newsletterFeedback.className = '';
            }, 300);
          }
        }, 8000);
      }
    }
  }
  
  function getLanguageName(code) {
    const languages = {
      'spanish': 'Spanish',
      'french': 'French', 
      'german': 'German',
      'italian': 'Italian',
      'portuguese': 'Portuguese',
      'chinese': 'Chinese',
      'japanese': 'Japanese',
      'korean': 'Korean',
      'other': 'your target language'
    };
    return languages[code] || 'your target language';
  }
});

// Enhanced Interactive Widget Functions with Better Error Handling
function tryJournal() {
  try {
    const journalText = document.getElementById('journal-text');
    if (!journalText) return;
    
    const randomPrompt = journalPrompts[Math.floor(Math.random() * journalPrompts.length)];
    
    // Simulate user input with typing effect
    journalText.style.color = '#333';
    journalText.style.fontStyle = 'normal';
    
    const fullText = 'I love spending weekends reading books in the park and discovering new stories that transport me to different worlds...';
    typeText(journalText, fullText, 50);
    
    // Update prompt
    const promptElement = journalText.closest('.journal-demo').querySelector('p');
    if (promptElement) {
      promptElement.innerHTML = `<strong>Today's Prompt:</strong> ${randomPrompt}`;
    }
    
    // Update AI feedback with delay
    setTimeout(() => {
      const feedbackElement = document.querySelector('.ai-feedback p');
      if (feedbackElement) {
        const randomFeedback = journalFeedbacks[Math.floor(Math.random() * journalFeedbacks.length)];
        feedbackElement.innerHTML = `<strong>AI Feedback:</strong> ${randomFeedback}`;
        
        // Add visual feedback animation
        const feedbackDiv = document.querySelector('.ai-feedback');
        if (feedbackDiv) {
          feedbackDiv.style.background = '#e8f6f3';
          feedbackDiv.style.border = '2px solid #48c78e';
          feedbackDiv.style.animation = 'pulse 0.5s ease-in-out';
        }
      }
    }, 1500);
  } catch (error) {
    console.error('Error in tryJournal:', error);
  }
}

function typeText(element, text, delay = 50) {
  element.textContent = '';
  let i = 0;
  
  const typeTimer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(typeTimer);
    }
  }, delay);
}

function startGame() {
  try {
    currentPhraseIndex = Math.floor(Math.random() * translationPhrases.length);
    const phrase = translationPhrases[currentPhraseIndex];
    
    // Update phrase to translate
    const phraseElement = document.getElementById('phrase-to-translate');
    if (phraseElement) {
      phraseElement.textContent = phrase.english;
    }
    
    // Update options
    const options = document.querySelectorAll('.translation-option');
    options.forEach((option, index) => {
      if (phrase.options[index]) {
        option.textContent = String.fromCharCode(65 + index) + ') ' + phrase.options[index];
        option.className = 'button is-small translation-option';
        option.style.backgroundColor = '';
        option.style.color = '';
        option.disabled = false;
      }
    });
    
    // Reset progress bar
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
      progressBar.style.width = '60%';
    }
    
    // Update button text
    const startButton = document.querySelector('.column.is-4:nth-child(2) .button.is-success');
    if (startButton) {
      startButton.textContent = 'Next Question';
    }
  } catch (error) {
    console.error('Error in startGame:', error);
  }
}

function selectTranslation(button, isCorrect) {
  try {
    const phrase = translationPhrases[currentPhraseIndex];
    const allButtons = document.querySelectorAll('.translation-option');
    
    // Disable all buttons
    allButtons.forEach(btn => btn.disabled = true);
    
    const buttonText = button.textContent.toLowerCase();
    const correctAnswer = phrase.spanish.toLowerCase();
    const isAnswerCorrect = isCorrect || buttonText.includes(correctAnswer);
    
    if (isAnswerCorrect) {
      // Correct answer
      button.style.backgroundColor = '#48c78e';
      button.style.color = 'white';
      gameScore += 20;
      gameStreak += 1;
      
      // Update progress bar
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.width = '80%';
      }
      
      // Show success feedback
      showGameFeedback('Correct! Great job! 🎉', 'success');
    } else {
      // Wrong answer
      button.style.backgroundColor = '#ff6b6b';
      button.style.color = 'white';
      
      // Show correct answer
      allButtons.forEach((btn) => {
        if (btn.textContent.toLowerCase().includes(correctAnswer)) {
          btn.style.backgroundColor = '#48c78e';
          btn.style.color = 'white';
        }
      });
      
      gameStreak = 0;
      // Progress bar decreases
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.width = '40%';
      }
      
      // Show incorrect feedback
      showGameFeedback(`Not quite! The correct answer is "${phrase.spanish}"`, 'error');
    }
    
    // Update score and streak
    const scoreElement = document.getElementById('game-score');
    const streakElement = document.getElementById('game-streak');
    if (scoreElement) scoreElement.textContent = gameScore;
    if (streakElement) streakElement.textContent = gameStreak;
    
    // Auto-advance to next question after 2.5 seconds
    setTimeout(() => {
      startGame();
    }, 2500);
  } catch (error) {
    console.error('Error in selectTranslation:', error);
  }
}

function showGameFeedback(message, type) {
  // Create or find feedback element
  let feedbackElement = document.querySelector('.game-feedback');
  if (!feedbackElement) {
    feedbackElement = document.createElement('div');
    feedbackElement.className = 'game-feedback';
    feedbackElement.style.position = 'absolute';
    feedbackElement.style.top = '10px';
    feedbackElement.style.left = '50%';
    feedbackElement.style.transform = 'translateX(-50%)';
    feedbackElement.style.zIndex = '1000';
    feedbackElement.style.padding = '10px 15px';
    feedbackElement.style.borderRadius = '20px';
    feedbackElement.style.fontSize = '0.9rem';
    feedbackElement.style.fontWeight = '600';
    feedbackElement.style.transition = 'all 0.3s ease';
    
    const gameDemo = document.querySelector('.game-demo');
    if (gameDemo) {
      gameDemo.style.position = 'relative';
      gameDemo.appendChild(feedbackElement);
    }
  }
  
  feedbackElement.textContent = message;
  
  if (type === 'success') {
    feedbackElement.style.backgroundColor = '#48c78e';
    feedbackElement.style.color = 'white';
  } else {
    feedbackElement.style.backgroundColor = '#ff6b6b';
    feedbackElement.style.color = 'white';
  }
  
  feedbackElement.style.opacity = '1';
  feedbackElement.style.transform = 'translateX(-50%) translateY(0)';
  
  // Hide after 2 seconds
  setTimeout(() => {
    feedbackElement.style.opacity = '0';
    feedbackElement.style.transform = 'translateX(-50%) translateY(-10px)';
  }, 2000);
}

function showFeedback() {
  try {
    const randomExample = feedbackExamples[Math.floor(Math.random() * feedbackExamples.length)];
    
    // Update original text
    const originalText = document.querySelector('.original-text p');
    if (originalText) {
      originalText.textContent = randomExample.original;
    }
    
    // Update corrected text
    const correctedText = document.querySelector('.corrected-text p');
    if (correctedText) {
      correctedText.textContent = randomExample.corrected;
    }
    
    // Update explanation
    const explanation = document.querySelector('.feedback-explanation p');
    if (explanation) {
      explanation.innerHTML = `<strong>Grammar Fix:</strong> ${randomExample.explanation}`;
    }
    
    // Add animation effect
    const feedbackDemo = document.querySelector('.feedback-demo');
    if (feedbackDemo) {
      feedbackDemo.style.border = '2px solid #3e8ed0';
      feedbackDemo.style.animation = 'slideIn 0.5s ease-out';
    }
    
    // Update feedback stats with random results
    const stats = document.querySelectorAll('.feedback-stats .column span');
    if (stats.length >= 3) {
      const statuses = ['✓ Grammar', '✓ Vocabulary', '! Style'];
      const colors = ['has-text-success', 'has-text-info', 'has-text-warning'];
      
      stats.forEach((stat, index) => {
        if (index < 3) {
          stat.className = colors[index];
          stat.textContent = statuses[index];
        }
      });
    }
    
    // Change button text
    const feedbackButton = document.querySelector('.column.is-4:nth-child(3) .button.is-danger');
    if (feedbackButton) {
      feedbackButton.textContent = 'Try Another';
    }
  } catch (error) {
    console.error('Error in showFeedback:', error);
  }
}

// Global Error Handler for better debugging
window.addEventListener('error', function(e) {
  console.error('Global error caught:', e.error);
});

// Validation function to check if all required elements exist
function validatePageElements() {
  console.log('Validating page elements...');
  
  // Check if required arrays exist
  if (typeof journalPrompts === 'undefined') {
    console.warn('journalPrompts array not found');
  }
  
  if (typeof journalFeedbacks === 'undefined') {
    console.warn('journalFeedbacks array not found');
  }
  
  if (typeof translationPhrases === 'undefined') {
    console.warn('translationPhrases array not found');
  }
  
  if (typeof feedbackExamples === 'undefined') {
    console.warn('feedbackExamples array not found');
  }
  
  // Check if interactive elements exist
  const journalText = document.getElementById('journal-text');
  if (!journalText) {
    console.warn('journal-text element not found');
  }
  
  const phraseElement = document.getElementById('phrase-to-translate');
  if (!phraseElement) {
    console.warn('phrase-to-translate element not found');
  }
  
  console.log('Element validation complete');
}

// Enhanced initialization
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    validatePageElements();
    animateStatsOnScroll();
  }, 1000);
});