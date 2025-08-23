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
}

// Carousel scroll buttons
document.getElementById('carouselLeft').onclick = () => {
    document.getElementById('carouselTrack').scrollBy({ left: -320, behavior: 'smooth' });
};
document.getElementById('carouselRight').onclick = () => {
    document.getElementById('carouselTrack').scrollBy({ left: 320, behavior: 'smooth' });
};

// Update all registration links with the latest event URL
function updateRegistrationLinks() {
    const registrationLinks = document.querySelectorAll('a[href="#register"]');
    registrationLinks.forEach(link => {
        link.href = CONFIG.latestEventURL;
    });
}

// Initialize carousel and registration links on page load
document.addEventListener('DOMContentLoaded', () => {
    renderCarousel();
    updateRegistrationLinks();
});