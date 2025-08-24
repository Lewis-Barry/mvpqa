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
        title: "Episode 1: Intune, Windows Management",
        date: "2025-10-01",
        description: "Explore Microsoft Intune with MVPs. Live demos and Q&A.",
        link: "https://events.teams.microsoft.com/event/f4e305c8-f7da-408d-a784-2b5f746271da@76264e2c-041e-4a52-b145-9f4bc624270c"
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
    }
];

// Render webinar cards
function renderWebinars() {
    const grid = document.getElementById('webinarGrid');
    const today = new Date();
    
    // Clear existing content
    grid.innerHTML = '';
    
    webinars.forEach(webinar => {
        const eventDate = new Date(webinar.date);
        const isPast = eventDate < today;
        const isTBD = webinar.description.includes("Not yet decided");
        
        // Determine card class
        let cardClass = 'webinar-card';
        if (isPast) cardClass += ' past';
        else if (isTBD) cardClass += ' tbd';  
        else cardClass += ' upcoming';
        
        // Create card element
        const card = document.createElement('div');
        card.className = cardClass;
        
        // Format date
        const formattedDate = eventDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long', 
            day: 'numeric'
        });
        
        // Build card HTML
        let cardHTML = `
            <h3>${webinar.title}</h3>
            <div class="webinar-date">${formattedDate}</div>
            <div class="webinar-description">${webinar.description}</div>
        `;
        
        // Add appropriate button/status
        if (isTBD) {
            cardHTML += `<div class="webinar-status tbd">Details coming soon. Stay tuned!</div>`;
        } else if (isPast) {
            cardHTML += `
                <a href="${webinar.link}" class="btn btn-primary" style="opacity: 0.6; pointer-events: none;">
                    Event Ended
                </a>
                <div class="webinar-status past">This event has concluded</div>
            `;
        } else {
            cardHTML += `<a href="${webinar.link}" class="btn btn-primary">Register Now</a>`;
        }
        
        card.innerHTML = cardHTML;
        grid.appendChild(card);
    });
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

// Initialize webinars and registration links on page load
document.addEventListener('DOMContentLoaded', () => {
    renderWebinars();
    updateRegistrationLinks();
    initializeContactModal();
});