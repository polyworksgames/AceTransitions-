// ===== MOBILE NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
});

// ===== EMAILJS INITIALIZATION =====
// Initialize EmailJS with your public key
if (typeof emailjs !== 'undefined') {
    emailjs.init('ldFc3kaycY8hJJKhy');
    console.log('✅ EmailJS initialized successfully!');
} else {
    console.error('❌ EmailJS library not loaded!');
}

// ===== FORM HANDLING =====
const contactForm = document.querySelector('.contact-form .form');

if (contactForm) {
    console.log('✅ Contact form found!');
} else {
    console.error('❌ Contact form NOT found!');
}

contactForm?.addEventListener('submit', function (e) {
    e.preventDefault();
    console.log('📧 Form submission started...');

    // Get form data
    const name = this.querySelector('input[type="text"]').value;
    const email = this.querySelector('input[type="email"]').value;
    const phone = this.querySelector('input[type="tel"]').value;
    const service = this.querySelector('select').value;
    const message = this.querySelector('textarea').value;

    // Simple validation
    if (!name || !email || !message) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }

    if (!isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    // Prepare form submission
    const submitButton = this.querySelector('.btn-primary');
    const originalText = submitButton.textContent;

    submitButton.textContent = 'Sending...';
    submitButton.disabled = true;

    // EmailJS parameters
    const templateParams = {
        from_name: name,
        from_email: email,
        phone: phone || 'Not provided',
        service_interest: service,
        message: message
    };

    // Send email using EmailJS
    console.log('📤 Sending email with params:', templateParams);
    emailjs.send('service_jpgg8a6', 'template_roubhwk', templateParams)
        .then((response) => {
            console.log('✅ Email sent successfully!', response);
            showNotification('Thank you! Your message has been sent. We\'ll get back to you soon.', 'success');
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        })
        .catch((error) => {
            console.error('❌ EmailJS Error:', error);
            console.error('Error details:', {
                status: error.status,
                text: error.text,
                message: error.message
            });
            showNotification('Sorry, there was an error sending your message. Please try again.', 'error');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
});

// ===== UTILITY FUNCTIONS =====
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        backgroundColor: type === 'success' ? '#10B981' : '#EF4444',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)'
    });

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll(
        '.service-card, .mentor-card, .testimonial-card, .stat-item'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, suffix, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
            element.textContent = Math.floor(current) + suffix;
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Animate counters when they come into view
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const text = element.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));
            const suffix = text.replace(/[0-9]/g, '');

            if (number) {
                animateCounter(element, number, suffix);
                counterObserver.unobserve(element);
            }
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-item h4, .hero-card h3');
    statNumbers.forEach(stat => {
        counterObserver.observe(stat);
    });
});



// ===== LAZY LOADING IMAGES =====
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
});

// ===== ACCESSIBILITY IMPROVEMENTS =====
document.addEventListener('DOMContentLoaded', () => {
    // Add keyboard navigation for hamburger menu
    hamburger?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            hamburger.click();
        }
    });

    // Add focus trap for mobile menu
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            hamburger?.focus();
        }
    });
});

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Use throttled scroll for navbar effect
const throttledScroll = throttle(() => {
    if (window.scrollY > 100) {
        navbar?.classList.add('scrolled');
    } else {
        navbar?.classList.remove('scrolled');
    }
}, 100);

window.addEventListener('scroll', throttledScroll);

// ===== PRELOADER (optional) =====
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth entrance animation to hero content
    const heroContent = document.querySelector('.hero-content');
    const heroImage = document.querySelector('.hero-image');

    if (heroContent && heroImage) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroImage.style.opacity = '0';
        heroImage.style.transform = 'translateY(30px)';

        setTimeout(() => {
            heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroImage.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';

            setTimeout(() => {
                heroImage.style.opacity = '1';
                heroImage.style.transform = 'translateY(0)';
            }, 200);
        }, 300);
    }
});

console.log('🌟 ACE Transitions  website loaded successfully!');