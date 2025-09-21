document.addEventListener('DOMContentLoaded', function() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    function addToCart(item) {
        cart.push(item);
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    function addToWishlist(item) {
        wishlist.push(item);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    function removeFromWishlist(name) {
        wishlist = wishlist.filter(i => i.name !== name);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }

    // Reusable function to close overlays
    function closeOverlay(element, toggleElement = null) {
        element.classList.remove('active');
        document.body.style.overflow = '';
        if (toggleElement) {
            toggleElement.setAttribute('aria-expanded', 'false');
        }
        // Restore focus to the element that opened the overlay if needed
    }

    // Reusable debounce function
    function debounce(fn, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    }

    // Mobile menu functionality
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        // Create close button for mobile menu
        const closeButton = document.createElement('button');
        closeButton.className = 'mobile-close-btn';
        closeButton.setAttribute('aria-label', 'Close menu');
        closeButton.innerHTML = '<i class="fas fa-times"></i>'; // Assumes Font Awesome; fallback below
        if (typeof window.FontAwesome === 'undefined') {
            closeButton.textContent = 'Close'; // Fallback if Font Awesome not loaded
        }
        // Hide by default to prevent showing on desktop
        closeButton.style.display = 'none';
        mainNav.appendChild(closeButton);

        // ARIA setup
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-controls', mainNav.id);

        menuToggle.addEventListener('click', function() {
            mainNav.classList.add('active');
            menuToggle.setAttribute('aria-expanded', 'true');
            closeButton.style.display = 'block'; // Show close button when menu opens
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });

        closeButton.addEventListener('click', function() {
            closeOverlay(mainNav, menuToggle);
            closeButton.style.display = 'none'; // Hide close button when menu closes
        });

        // Close menu when clicking on a link
        const navLinks = mainNav.querySelectorAll('a'); // Scoped query for performance
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeOverlay(mainNav, menuToggle);
                closeButton.style.display = 'none';
            });
        });

        // Close menu when clicking outside (debounced for performance)
        document.addEventListener('click', debounce(function(event) {
            if (!menuToggle.contains(event.target) && 
                !mainNav.contains(event.target) &&
                mainNav.classList.contains('active')) {
                closeOverlay(mainNav, menuToggle);
                closeButton.style.display = 'none';
            }
        }, 100));
    } else {
        console.warn('Mobile menu elements are missing.');
    }


    // Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.mainNav');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Close mobile menu when a link is clicked
document.querySelectorAll('.mainNav a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Set active navigation link based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.mainNav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        }
    });
});




    // Lightbox functionality - FIXED FOR PRODUCT PAGE
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    const productImages = document.querySelectorAll('.product-img');

    if (lightbox && lightboxImg && lightboxClose && lightboxPrev && lightboxNext) {
        // ARIA setup for lightbox
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-labelledby', 'lightbox-title'); // Assume a title element or add one

        let currentImageIndex = 0;
        const images = Array.from(productImages).map(container => {
            const img = container.querySelector('img');
            return img ? img.src : null;
        }).filter(src => src); // Filter out nulls

        // Add click event to each product image container
        productImages.forEach((container, index) => {
            container.addEventListener('click', () => {
                if (images[index]) {
                    currentImageIndex = index;
                    openLightbox(images[currentImageIndex]);
                }
            });
        });

        // Handle image loading errors
        lightboxImg.addEventListener('error', () => {
            lightboxImg.src = '/path/to/fallback-image.jpg'; // Replace with actual fallback
            console.warn('Failed to load lightbox image');
        });

        /**
         * Opens the lightbox with the specified image source.
         * @param {string} imageSrc - The URL of the image to display.
         */
        function openLightbox(imageSrc) {
            lightboxImg.src = imageSrc;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
            lightboxClose.focus(); // Focus on close button for accessibility
            // Basic focus trap: Add event listener to trap focus
            document.addEventListener('keydown', trapFocus);
        }

        // Close lightbox
        function closeLightbox() {
            closeOverlay(lightbox);
            // Remove focus trap
            document.removeEventListener('keydown', trapFocus);
        }

        // Basic focus trapping function
        function trapFocus(e) {
            if (e.key === 'Tab') {
                const focusableElements = lightbox.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const first = focusableElements[0];
                const last = focusableElements[focusableElements.length - 1];

                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        }

        // Navigation functions
        function showPrevImage() {
            currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
            lightboxImg.src = images[currentImageIndex];
        }

        function showNextImage() {
            currentImageIndex = (currentImageIndex + 1) % images.length;
            lightboxImg.src = images[currentImageIndex];
        }

        // Event listeners for lightbox
        lightboxClose.addEventListener('click', closeLightbox);
        lightboxPrev.addEventListener('click', showPrevImage);
        lightboxNext.addEventListener('click', showNextImage);

        // Close lightbox when clicking outside the image
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            }
        });
    } else {
        console.warn('Lightbox elements are missing.');
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
                // Directly query the grid (assuming only one per page; adjust selector if needed for multiple grids)
                const cardsContainer = document.querySelector('.categories-grid') || document.querySelector('.products-grid');
                if (cardsContainer) {
                    const cardSelector = cardsContainer.classList.contains('categories-grid') ? '.category-card' : '.product-card';
                    const cards = cardsContainer.querySelectorAll(cardSelector);
                   // const cards = cardsContainer.querySelectorAll('.category-card');
                    // Show/hide cards based on category
                    cards.forEach(card => {
                        card.style.display = (category === 'all' || card.dataset.category === category) ? '' : 'none';
                    });
                }
            });
        });
    }

    // Smooth scrolling for navigation
    const smoothLinks = document.querySelectorAll('a[href^="#"]');
    if (smoothLinks.length > 0) {
        smoothLinks.forEach(anchor => {
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
    }

    // Form Validation
    const contactForm = document.getElementById('contactForm');
    const submitButton = contactForm ? contactForm.querySelector('button[type="submit"]') : null;
    if (contactForm && submitButton) {
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
                // Disable button to show loading state
                submitButton.disabled = true;
                submitButton.textContent = 'Submitting...'; // Assume button has text

                // Simulate real submission with fetch (replace '/submit-form' with actual endpoint)
                const formData = new FormData(contactForm);
                fetch('/submit-form', { // Replace with real URL
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('Form submitted successfully! We will contact you soon.');
                        contactForm.reset();
                    } else {
                        showError(contactForm, 'Submission failed. Please try again.');
                    }
                })
                .catch(() => {
                    showError(contactForm, 'An error occurred. Please try again.');
                })
                .finally(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Submit'; // Reset button text
                });
            }
        });
    } else {
        console.warn('Contact form or submit button is missing.');
    }

    /**
     * Shows an error message for a form input.
     * @param {HTMLElement} input - The input element.
     * @param {string} message - The error message.
     */
    function showError(input, message) {
        const errorId = `${input.id}-error`;
        const error = document.createElement('div');
        error.className = 'error';
        error.id = errorId;
        error.style.color = 'red';
        error.style.fontSize = '14px';
        error.style.marginTop = '5px';
        error.textContent = message;
        input.setAttribute('aria-describedby', errorId);
        input.parentNode.appendChild(error);
    }

    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Set current year in footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn('Current year span is missing.');
    }

    // Products page specific functionality
    const productsGrid = document.querySelector('.products-grid');
    if (productsGrid) {
        // Add to cart functionality
        const addToCartBtns = productsGrid.querySelectorAll('.btn-primary'); // Scoped query
        addToCartBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const productCard = this.closest('.product-card');
                const productName = productCard.querySelector('.product-title').textContent;
                const productPrice = productCard.querySelector('.current-price').textContent.replace('$', '').replace(',', '');

                addToCart({name: productName, price: productPrice});

                // Dispatch custom event for extensibility
                const addEvent = new CustomEvent('addToCart', { detail: { productName } });
                document.dispatchEvent(addEvent);

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
        const wishlistBtns = productsGrid.querySelectorAll('.btn-icon'); // Scoped query
        wishlistBtns.forEach(btn => {
            const productCard = btn.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent;
            const icon = btn.querySelector('i');

            // Set initial state
            if (wishlist.some(item => item.name === productName)) {
                icon.classList.replace('far', 'fas');
                icon.style.color = 'var(--secondary)';
            }

            btn.addEventListener('click', function() {
                if (icon.classList.contains('far')) {
                    icon.classList.replace('far', 'fas');
                    icon.style.color = 'var(--secondary)';
                    addToWishlist({name: productName});
                } else {
                    icon.classList.replace('fas', 'far');
                    icon.style.color = '';
                    removeFromWishlist(productName);
                }

                // Dispatch custom event for extensibility
                const wishlistEvent = new CustomEvent('toggleWishlist', { detail: { added: icon.classList.contains('fas') } });
                document.dispatchEvent(wishlistEvent);
            });
        });
    }

    // WhatsApp link handler
    const whatsappLink = document.getElementById('whatsapp-link');
    if (whatsappLink) {
        whatsappLink.addEventListener('click', (e) => {
            e.preventDefault();
            const phone = '1234567890'; // International format without +
            let message = 'Hello, I am interested in:\n\nCart:\n';
            cart.forEach(item => message += `- ${item.name} - $${item.price}\n`);
            message += '\nWishlist:\n';
            wishlist.forEach(item => message += `- ${item.name}\n`);

            if (cart.length === 0 && wishlist.length === 0) {
                message = "Hello, I'd like to inquire about your products.";
            }

            const encoded = encodeURIComponent(message);
            whatsappLink.href = `https://wa.me/${phone}?text=${encoded}`;
            setTimeout(() => {
                window.open(whatsappLink.href, '_blank');
            }, 0);
        });
    }

    // Optional: Cleanup function for event listeners (useful in SPAs)
    // Call this if the page unloads or script re-runs
    // window.addEventListener('beforeunload', cleanup);
    function cleanup() {
        // Remove all added event listeners here
        // For example:
        if (menuToggle) menuToggle.removeEventListener('click', /* handler */);
        // etc. (requires storing handlers)
    }
});