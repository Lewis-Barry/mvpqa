// Configuration
const CONFIG = {
    latestEventURL: 'https://events.teams.microsoft.com/event/f4e305c8-f7da-408d-a784-2b5f746271da@76264e2c-041e-4a52-b145-9f4bc624270c'
};

// Dark mode toggle functionality
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Check for saved theme preference or respect OS preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    body.classList.add('dark-mode');
    themeToggle.textContent = '☀️';
} else {
    themeToggle.textContent = '🌙';
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '🌙';
    }
});

// FAQ accordion functionality
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const answer = question.nextElementSibling;
        const isOpen = answer.style.display === 'block';
        
        // Close all answers
        document.querySelectorAll('.faq-answer').forEach(ans => {
            ans.style.display = 'none';
        });
        document.querySelectorAll('.faq-question span').forEach(span => {
            span.textContent = '+';
        });
        
        // Open clicked answer if it was closed
        if (!isOpen) {
            answer.style.display = 'block';
            question.querySelector('span').textContent = '-';
        }
    });
});

// Initialize FAQ - close all answers
document.querySelectorAll('.faq-answer').forEach(answer => {
    answer.style.display = 'none';
});

// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        window.scrollTo({
            top: targetElement.offsetTop - 70,
            behavior: 'smooth'
        });
    });
});

// Webinar event data
const webinars = [
    {
        title: " Episode 1: Intune, Windows Management",
        date: "2025-10-01",
        description: "Explore Microsoft Intune with MVPs. Live demos and Q&A.",
        link: CONFIG.latestEventURL
    },
    {
        title: "TBD",
        date: "2025-11-01",
        description: "Not yet decided",
        link: "#register"
    },
        {
        title: "TBD",
        date: "2025-12-01",
        description: "Not yet decided",
        link: "#register"
    },
];

// Carousel state
let currentIndex = 0;
let cardsPerView = 1;

// Calculate cards per view based on screen size and container width
function calculateCardsPerView() {
    const container = document.querySelector('.carousel-container');
    const cardWidth = 320;
    const gap = 20;
    const minVisibleWidth = 100; // Minimum width needed to see that a card exists
    
    if (!container) return 1;
    
    const containerWidth = container.offsetWidth;
    
    // Calculate how many complete cards can fit
    const completeCards = Math.floor((containerWidth + gap) / (cardWidth + gap));
    
    // Check if we have room for a partial card that's meaningfully visible
    const remainingSpace = containerWidth - (completeCards * (cardWidth + gap) - gap);
    const canShowPartial = remainingSpace >= minVisibleWidth;
    
    // If we can show a meaningful partial card, allow scrolling
    // Otherwise, stick to complete cards only
    if (canShowPartial && completeCards < webinars.length) {
        // Enable scrolling mode for this case
        return 'scroll';
    }
    
    return Math.max(1, completeCards);
}

// Update carousel indicators
function updateIndicators() {
    const indicatorsContainer = document.getElementById('carouselIndicators');
    
    // Don't show indicators in scroll mode
    if (cardsPerView === 'scroll') {
        indicatorsContainer.innerHTML = '';
        return;
    }
    
    const totalSlides = Math.max(1, Math.ceil(webinars.length / cardsPerView));
    
    indicatorsContainer.innerHTML = '';
    
    // Only show indicators if there are multiple slides
    if (totalSlides > 1) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
            dot.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(dot);
        }
    }
}

// Update button states
function updateButtons() {
    const leftBtn = document.getElementById('carouselLeft');
    const rightBtn = document.getElementById('carouselRight');
    
    // In scroll mode, button states are handled by scroll event listener
    if (cardsPerView === 'scroll') {
        return;
    }
    
    const maxIndex = Math.max(0, webinars.length - cardsPerView);
    
    leftBtn.disabled = currentIndex <= 0;
    rightBtn.disabled = currentIndex >= maxIndex;
}

// Go to specific slide
function goToSlide(index) {
    const track = document.getElementById('carouselTrack');
    const maxIndex = Math.max(0, webinars.length - cardsPerView);
    
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    
    const cardWidth = 320;
    const gap = 20;
    const offset = currentIndex * (cardWidth + gap);
    
    track.style.transform = `translateX(-${offset}px)`;
    
    updateButtons();
    updateIndicators();
}

// Render carousel cards
function renderCarousel() {
    const track = document.getElementById('carouselTrack');
    const today = new Date();
    track.innerHTML = '';
    
    webinars.forEach(event => {
        const eventDate = new Date(event.date);
        const faded = eventDate < today;
        const anticipating = event.description.includes("Not yet decided");
        const card = document.createElement('div');
        card.className = 'carousel-card' +
            (faded ? ' faded' : '') +
            (anticipating ? ' anticipating' : '');
        card.innerHTML = `
            <h3>${event.title}</h3>
            <p><strong>Date:</strong> ${eventDate.toLocaleDateString()}</p>
            <p>${event.description}</p>
            ${
                anticipating
                ? `<div class="anticipating-msg">Details coming soon. Stay tuned!</div>`
                : `<a href="${event.link}" class="btn btn-primary"${faded ? ' style="pointer-events:none;opacity:0.6;"' : ''}>${faded ? 'Event Ended' : 'Register'}</a>`
            }
        `;
        track.appendChild(card);
    });
    
    // Update carousel state
    cardsPerView = calculateCardsPerView();
    
    // Apply appropriate CSS class based on mode
    if (cardsPerView === 'scroll') {
        track.classList.add('scroll-mode');
    } else {
        track.classList.remove('scroll-mode');
    }
    
    updateButtons();
    updateIndicators();
}

// Enhanced carousel navigation with smooth transitions
function initializeCarousel() {
    const leftBtn = document.getElementById('carouselLeft');
    const rightBtn = document.getElementById('carouselRight');
    const carouselTrack = document.getElementById('carouselTrack');
    
    // Check if we should use scroll mode
    const shouldUseScrollMode = () => {
        return window.innerWidth <= 480 || cardsPerView === 'scroll';
    };
    
    leftBtn.addEventListener('click', () => {
        if (shouldUseScrollMode()) {
            carouselTrack.scrollBy({ left: -340, behavior: 'smooth' });
        } else {
            goToSlide(currentIndex - 1);
        }
    });
    
    rightBtn.addEventListener('click', () => {
        if (shouldUseScrollMode()) {
            carouselTrack.scrollBy({ left: 340, behavior: 'smooth' });
        } else {
            goToSlide(currentIndex + 1);
        }
    });
    
    // Touch/swipe support for mobile
    let startX = 0;
    let isDragging = false;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    }, { passive: true });
    
    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        // Don't prevent default on scroll mode to allow native scrolling
        if (!shouldUseScrollMode()) {
            e.preventDefault();
        }
    }, { passive: false });
    
    carouselTrack.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        // Only handle swipe gestures in pagination mode
        if (shouldUseScrollMode()) return;
        
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        const threshold = 50;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                goToSlide(currentIndex + 1);
            } else {
                goToSlide(currentIndex - 1);
            }
        }
    }, { passive: true });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const carousel = document.getElementById('webinar-carousel');
        const rect = carousel.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isInView) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                if (shouldUseScrollMode()) {
                    carouselTrack.scrollBy({ left: -340, behavior: 'smooth' });
                } else {
                    goToSlide(currentIndex - 1);
                }
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                if (shouldUseScrollMode()) {
                    carouselTrack.scrollBy({ left: 340, behavior: 'smooth' });
                } else {
                    goToSlide(currentIndex + 1);
                }
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        const oldCardsPerView = cardsPerView;
        cardsPerView = calculateCardsPerView();
        
        if (oldCardsPerView !== cardsPerView) {
            currentIndex = 0;
            if (!shouldUseScrollMode() && typeof cardsPerView === 'number') {
                goToSlide(0);
            } else {
                // Reset transform for scroll mode
                carouselTrack.style.transform = 'translateX(0px)';
            }
            updateIndicators();
            updateButtons();
        }
    });
    
    // Update scroll buttons
    const updateScrollButtons = () => {
        if (shouldUseScrollMode()) {
            leftBtn.disabled = carouselTrack.scrollLeft <= 5; // Small tolerance
            rightBtn.disabled = carouselTrack.scrollLeft >= carouselTrack.scrollWidth - carouselTrack.clientWidth - 5;
        }
    };
    
    // Listen for scroll events in scroll mode
    carouselTrack.addEventListener('scroll', updateScrollButtons);
    
    // Initial button state update
    setTimeout(() => {
        updateScrollButtons();
        updateButtons();
    }, 100);
}

// Update all registration links with the latest event URL
function updateRegistrationLinks() {
    const registrationLinks = document.querySelectorAll('a[href="#register"]');
    registrationLinks.forEach(link => {
        link.href = CONFIG.latestEventURL;
    });
}

// Contact Modal functionality
function initializeContactModal() {
    const contactLink = document.querySelector('nav a[href="#contact"]');
    const modal = document.getElementById('contactModal');
    const modalClose = document.getElementById('modalClose');
    
    // Open modal when contact link is clicked
    if (contactLink) {
        contactLink.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    }
    
    // Close modal when close button is clicked
    modalClose.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    });
    
    // Close modal when clicking outside the modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
    
    // Close modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    });
}

// Initialize carousel and registration links on page load
document.addEventListener('DOMContentLoaded', () => {
    renderCarousel();
    initializeCarousel();
    updateRegistrationLinks();
    initializeContactModal();
});