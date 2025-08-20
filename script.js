// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggle.innerHTML = mainNav.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });
}

// Tab functionality for categories
const tabBtns = document.querySelectorAll('.tab-btn');
if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            
            // Get the appropriate cards container
            let cardsContainer;
            if (document.querySelector('.categories-grid')) {
                cardsContainer = document.querySelector('.categories-grid');
            } else if (document.querySelector('.products-grid')) {
                cardsContainer = document.querySelector('.products-grid');
            }
            
            if (cardsContainer) {
                const cards = cardsContainer.querySelectorAll('.category-card, .product-card');
                
                // Show/hide cards based on category
                cards.forEach(card => {
                    if (category === 'all' || card.dataset.category === category) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
}

// Smooth scrolling for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Form Validation
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const message = document.getElementById('message');
        let valid = true;
        
        // Reset errors
        document.querySelectorAll('.error').forEach(el => el.remove());
        
        // Name validation
        if (!name.value.trim()) {
            valid = false;
            showError(name, 'Name is required');
        }
        
        // Email validation
        if (!email.value.trim()) {
            valid = false;
            showError(email, 'Email is required');
        } else if (!isValidEmail(email.value)) {
            valid = false;
            showError(email, 'Please enter a valid email');
        }
        
        // Message validation
        if (!message.value.trim()) {
            valid = false;
            showError(message, 'Message is required');
        }
        
        if (valid) {
            // In a real implementation, you would submit the form here
            alert('Form submitted successfully! We will contact you soon.');
            contactForm.reset();
        }
    });
}

function showError(input, message) {
    const error = document.createElement('div');
    error.className = 'error';
    error.style.color = 'red';
    error.style.fontSize = '14px';
    error.style.marginTop = '5px';
    error.textContent = message;
    input.parentNode.appendChild(error);
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    // Products page specific functionality
    if (document.querySelector('.products-grid')) {
        // Add to cart functionality
        const addToCartBtns = document.querySelectorAll('.btn-primary');
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('.product-title').textContent;
                
                // Create notification
                const notification = document.createElement('div');
                notification.textContent = `Added ${productName} to cart!`;
                notification.style.position = 'fixed';
                notification.style.bottom = '20px';
                notification.style.right = '20px';
                notification.style.backgroundColor = 'var(--secondary)';
                notification.style.color = 'white';
                notification.style.padding = '15px 25px';
                notification.style.borderRadius = '4px';
                notification.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
                notification.style.zIndex = '1000';
                notification.style.transition = 'transform 0.3s ease';
                notification.style.transform = 'translateY(100px)';
                
                document.body.appendChild(notification);
                
                // Animate in
                setTimeout(() => {
                    notification.style.transform = 'translateY(0)';
                }, 10);
                
                // Remove after 3 seconds
                setTimeout(() => {
                    notification.style.transform = 'translateY(100px)';
                    setTimeout(() => {
                        document.body.removeChild(notification);
                    }, 300);
                }, 3000);
            });
        });
        
        // Wishlist functionality
        const wishlistBtns = document.querySelectorAll('.btn-icon');
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon.classList.contains('far')) {
                    icon.classList.replace('far', 'fas');
                    icon.style.color = 'var(--secondary)';
                } else {
                    icon.classList.replace('fas', 'far');
                    icon.style.color = '';
                }
            });
        });
    }
});