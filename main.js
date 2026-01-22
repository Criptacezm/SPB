// ============================================
// SMART PLANT BOX - MAIN JAVASCRIPT
// Lambda.ai Inspired Design with Lenis Smooth Scroll
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Add loading class for blur animation
    document.body.classList.add('loading');
    
    // Initialize all modules
    initPreloader();
    initLenisSmoothScroll();
    initNavigation();
    initDropdownMenus();
    initAccordion();
    initParticles();
    initChatWidget();
    initScrollAnimations();
    initVideoAutoPlay();
    initTextBlurAnimation();
});

// ============================================
// TEXT BLUR LOADING ANIMATION
// ============================================
function initTextBlurAnimation() {
    // Remove loading class after a short delay for the blur-to-clear effect
    setTimeout(function() {
        document.body.classList.remove('loading');
        
        // Add staggered reveal to elements
        const elements = document.querySelectorAll('h1, h2, h3, h4, p, span, a, img, .feature-card, .pricing-card, .gallery-item');
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * 0.02}s`;
        });
    }, 600);
}

// ============================================
// PRELOADER
// ============================================
function initPreloader() {
    const preloader = document.getElementById('preloader');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            preloader.classList.add('hidden');
        }, 500);
    });
    
    // Fallback - hide preloader after 3 seconds
    setTimeout(function() {
        preloader.classList.add('hidden');
    }, 3000);
}

// ============================================
// LENIS SMOOTH SCROLL (Caleb Raney Style)
// ============================================
function initLenisSmoothScroll() {
    // Initialize Lenis with buttery smooth settings
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
        lerp: 0.1, // Lower = smoother, higher = snappier
        wheelMultiplier: 1,
    });

    // RAF loop for smooth scrolling
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Handle anchor links with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerHeight = document.getElementById('header').offsetHeight;
                
                lenis.scrollTo(target, {
                    offset: -headerHeight,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });

                // Close mobile menu if open
                const mobileMenu = document.querySelector('.mobile-nav-menu');
                if (mobileMenu) {
                    mobileMenu.style.display = 'none';
                }
            }
        });
    });

    // Store lenis instance globally for other uses
    window.lenis = lenis;
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
    const header = document.getElementById('header');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Header scroll behavior
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.background = 'rgba(10, 10, 10, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'var(--color-bg)';
            header.style.backdropFilter = 'none';
        }
    });
    
    // Mobile menu toggle
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Create mobile menu if it doesn't exist
            let mobileMenu = document.querySelector('.mobile-nav-menu');
            
            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-nav-menu';
                mobileMenu.innerHTML = navMenu.innerHTML;
                mobileMenu.style.cssText = `
                    position: fixed;
                    top: 70px;
                    left: 0;
                    width: 100%;
                    background: var(--color-bg-elevated);
                    border-bottom: 1px solid var(--color-border);
                    padding: var(--spacing-lg);
                    display: none;
                    flex-direction: column;
                    gap: var(--spacing-md);
                    z-index: 999;
                `;
                
                // Style the links
                const links = mobileMenu.querySelectorAll('a');
                links.forEach(link => {
                    link.style.cssText = `
                        display: block;
                        padding: var(--spacing-sm) 0;
                        font-size: 0.875rem;
                        font-weight: 500;
                        letter-spacing: 0.1em;
                        color: var(--color-text-secondary);
                        border-bottom: 1px solid var(--color-border);
                    `;
                });
                
                document.body.appendChild(mobileMenu);
            }
            
            mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
}

// ============================================
// LAMBDA.AI STYLE DROPDOWN MENUS
// ============================================
function initDropdownMenus() {
    const dropdowns = document.querySelectorAll('.nav-dropdown');
    
    dropdowns.forEach(dropdown => {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (!trigger || !menu) return;
        
        // Keyboard accessibility
        trigger.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menu.classList.toggle('active');
            }
            if (e.key === 'Escape') {
                menu.classList.remove('active');
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                menu.classList.remove('active');
            }
        });

        // Close dropdown when clicking a link inside
        const links = menu.querySelectorAll('.dropdown-link');
        links.forEach(link => {
            link.addEventListener('click', function() {
                menu.classList.remove('active');
            });
        });
    });
}

// ============================================
// ACCORDION
// ============================================
function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        const toggle = item.querySelector('.accordion-toggle');
        
        header.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all items
            accordionItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.accordion-toggle').textContent = '+';
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                toggle.textContent = '−';
            }
        });
    });
}

// ============================================
// FLOATING PARTICLES
// ============================================
function initParticles() {
    const particleContainers = document.querySelectorAll('.floating-particles, .floating-dots');
    
    particleContainers.forEach(container => {
        createParticles(container, 20);
    });
}

function createParticles(container, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        
        const size = Math.random() * 4 + 2;
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        // Random color
        const colors = ['#22c55e', '#a855f7', '#3b82f6', '#e8e4d9'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${x}%;
            top: ${y}%;
            opacity: ${Math.random() * 0.5 + 0.1};
            animation: particleFloat ${duration}s ease-in-out ${delay}s infinite;
            pointer-events: none;
        `;
        
        container.appendChild(particle);
    }
    
    // Add animation keyframes if not already present
    if (!document.querySelector('#particle-styles')) {
        const style = document.createElement('style');
        style.id = 'particle-styles';
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% {
                    transform: translate(0, 0) scale(1);
                    opacity: 0.2;
                }
                25% {
                    transform: translate(20px, -30px) scale(1.2);
                    opacity: 0.5;
                }
                50% {
                    transform: translate(-10px, -60px) scale(0.8);
                    opacity: 0.3;
                }
                75% {
                    transform: translate(15px, -30px) scale(1.1);
                    opacity: 0.4;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// CHAT WIDGET - Enhanced Professional UI
// ============================================
function initChatWidget() {
    const chatToggle = document.getElementById('chat-toggle');
    const chatBox = document.getElementById('chat-box');
    const chatClose = document.getElementById('chat-close');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input-field');
    const chatMessages = document.getElementById('chat-messages');
    
    if (!chatToggle || !chatBox) return;
    
    // Toggle chat
    chatToggle.addEventListener('click', function() {
        chatBox.classList.toggle('hidden');
        if (!chatBox.classList.contains('hidden')) {
            chatInput.focus();
        }
    });
    
    // Close chat
    chatClose.addEventListener('click', function() {
        chatBox.classList.add('hidden');
    });
    
    // Handle form submission
    chatForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message with animation
        addMessage(message, 'user');
        chatInput.value = '';
        
        // Show typing indicator
        showTypingIndicator();
        
        // Simulate bot response
        setTimeout(function() {
            removeTypingIndicator();
            const responses = [
                "Thanks for your interest in the Smart Plant Box! How can I help you today?",
                "Great question! The Smart Plant Box uses advanced sensors to monitor soil moisture, temperature, and humidity.",
                "Our automatic watering system ensures your plants get exactly the right amount of water.",
                "You can control everything from our mobile app, even when you're away from home.",
                "Would you like to know more about our pricing options?"
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            addMessage(randomResponse, 'bot');
        }, 1200 + Math.random() * 800);
    });
    
    // Auto-resize textarea
    chatInput.addEventListener('input', function() {
        this.style.height = '44px';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
    
    function addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        if (type === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C12 8 16 12 22 12C16 12 12 16 12 22C12 16 8 12 2 12C8 12 12 8 12 2Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                </div>
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${text}</p>
                </div>
            `;
        }
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C12 8 16 12 22 12C16 12 12 16 12 22C12 16 8 12 2 12C8 12 12 8 12 2Z" stroke="currentColor" stroke-width="2"/>
                </svg>
            </div>
            <div class="message-content">
                <p style="display: flex; gap: 4px; padding: 12px 16px;">
                    <span class="typing-dot" style="width: 8px; height: 8px; background: var(--color-text-muted); border-radius: 50%; animation: typingBounce 1.4s ease-in-out infinite;"></span>
                    <span class="typing-dot" style="width: 8px; height: 8px; background: var(--color-text-muted); border-radius: 50%; animation: typingBounce 1.4s ease-in-out 0.2s infinite;"></span>
                    <span class="typing-dot" style="width: 8px; height: 8px; background: var(--color-text-muted); border-radius: 50%; animation: typingBounce 1.4s ease-in-out 0.4s infinite;"></span>
                </p>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Add typing animation if not exists
        if (!document.querySelector('#typing-styles')) {
            const style = document.createElement('style');
            style.id = 'typing-styles';
            style.textContent = `
                @keyframes typingBounce {
                    0%, 60%, 100% {
                        transform: translateY(0);
                    }
                    30% {
                        transform: translateY(-4px);
                    }
                }
                @keyframes chatSlideDown {
                    from {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    to {
                        opacity: 0;
                        transform: translateY(20px) scale(0.95);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    function removeTypingIndicator() {
        const typingIndicator = chatMessages.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animateElements = document.querySelectorAll(
        '.feature-card, .pricing-card, .gallery-item, .accordion-item, .developer-card'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ============================================
// VIDEO AUTO-PLAY ON SCROLL
// ============================================
function initVideoAutoPlay() {
    const video = document.getElementById('spb-video');
    
    if (!video) return;
    
    const videoObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Video starts playing when 30% visible
    };
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Section is visible - play the video
                video.play().catch(err => {
                    console.log('Video autoplay prevented:', err);
                });
            } else {
                // Section is not visible - pause the video
                video.pause();
            }
        });
    }, videoObserverOptions);
    
    // Observe the security section (parent of video)
    const securitySection = document.getElementById('security');
    if (securitySection) {
        videoObserver.observe(securitySection);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
