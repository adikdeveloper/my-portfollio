// Loading animation
window.addEventListener('load', () => {
    const loading = document.querySelector('.loading');
    loading.style.display = 'none';
});

// Mobile menu
const menuToggle = document.querySelector('.menu-toggle-btn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// Close menu when clicking nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

// Skills progress animation
const skillItems = document.querySelectorAll('.skill-item');

const observerOptions = {
    threshold: 0.5
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBar = entry.target.querySelector('.progress');
            const progress = progressBar.getAttribute('data-progress');
            progressBar.style.width = `${progress}%`;
        }
    });
}, observerOptions);

skillItems.forEach(item => observer.observe(item));

// Project filters
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        
        const filter = button.getAttribute('data-filter');
        
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Contact form validation
const contactForm = document.querySelector('.contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Basic validation
    if (validateForm()) {
        // Here you can add your form submission logic
        alert('Xabar muvaffaqiyatli yuborildi!');
        contactForm.reset();
    }
});

function validateForm() {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Name validation
    if (nameInput.value.trim() === '') {
        showError(nameInput, 'Iltimos, ismingizni kiriting');
        isValid = false;
    } else {
        removeError(nameInput);
    }
    
    // Email validation
    if (!emailRegex.test(emailInput.value)) {
        showError(emailInput, 'Iltimos, to\'g\'ri email kiriting');
        isValid = false;
    } else {
        removeError(emailInput);
    }
    
    // Message validation
    if (messageInput.value.trim() === '') {
        showError(messageInput, 'Iltimos, xabar matnini kiriting');
        isValid = false;
    } else {
        removeError(messageInput);
    }
    
    return isValid;
}

function showError(input, message) {
    const wrapper = input.parentElement;
    const existingError = wrapper.querySelector('.error-message');
    
    if (!existingError) {
        const errorMessage = document.createElement('span');
        errorMessage.className = 'error-message';
        errorMessage.textContent = message;
        wrapper.appendChild(errorMessage);
    }
    
    input.classList.add('error');
}

function removeError(input) {
    const wrapper = input.parentElement;
    const errorMessage = wrapper.querySelector('.error-message');
    
    if (errorMessage) {
        wrapper.removeChild(errorMessage);
    }
    
    input.classList.remove('error');
}

// Scroll to top button
const scrollTopBtn = document.querySelector('.scroll-top');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 200) {
        scrollTopBtn.classList.add('active');
    } else {
        scrollTopBtn.classList.remove('active');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Theme toggle
const themeBtn = document.querySelector('.theme-btn');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');

// Apply theme on load
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

themeBtn.addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' 
        ? 'light' 
        : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    const icon = themeBtn.querySelector('i');
    if (theme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// Animation on scroll
const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');

const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1
});

animatedElements.forEach(element => {
    animationObserver.observe(element);
});