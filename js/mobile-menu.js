document.addEventListener('DOMContentLoaded', () => {

    // Menu elements
    const burger = document.querySelector('.burger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links li');
    const header = document.querySelector('header'); 
    const body = document.body;
    
    let isMenuOpen = false;
    
    // Check if elements exist
    if (!burger || !navLinks) {
        console.error('Menu elements not found. Check your HTML structure.');
        return;
    }
    
    // Menu toggle function
    function toggleMenu() {
        isMenuOpen = !isMenuOpen; 
        
        // Toggle classes
        burger.classList.toggle('active');
        navLinks.classList.toggle('nav-active');
        
        // Body scroll management
        if (isMenuOpen) {
            body.style.overflow = 'hidden';
            body.classList.add('menu-open');  
            header.classList.add('menu-open');
        } else {
            body.style.overflow = '';
            body.classList.remove('menu-open');  
            header.classList.remove('menu-open');
        }
        
        // Update ARIA attributes
        burger.setAttribute('aria-expanded', isMenuOpen ? 'true' : 'false');
        
        // Animate items with GSAP
        if (typeof gsap !== 'undefined') {
            if (isMenuOpen) {
                gsap.fromTo(navLinksItems, {
                    opacity: 0,
                    y: 50
                }, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    stagger: 0.1,
                    ease: 'power2.out',
                    delay: 0.2
                });
            }
        }
        
        console.log('Menu toggled. Open:', isMenuOpen); // DEBUG
    }
    
    // Event listeners
    burger.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Burger clicked'); // DEBUG
        toggleMenu();  
    });
    
    // Close menu when clicking on nav items
    navLinksItems.forEach(item => {
        item.addEventListener('click', () => {
            if (isMenuOpen) {
                console.log('Nav item clicked, closing menu'); // DEBUG
                toggleMenu();
            }
        });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !navLinks.contains(e.target) && !burger.contains(e.target)) {
            console.log('Clicked outside, closing menu'); // DEBUG
            toggleMenu();
        }
    });
    
    // Close with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            console.log('Escape pressed, closing menu'); // DEBUG
            toggleMenu();
        }
    });
    
    // Close on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && isMenuOpen) {
            console.log('Window resized, closing menu'); // DEBUG
            toggleMenu();
        }
    });
    
    // Accessibility setup
    burger.setAttribute('aria-label', 'Toggle navigation menu');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('role', 'button');
    burger.setAttribute('tabindex', '0');
    
    // Keyboard navigation for burger
    burger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            console.log('Burger activated with keyboard'); // DEBUG
            toggleMenu();
        }
    });
    
    // Focus trap functionality
    let focusableElements = [];
    let firstFocusableElement = null;
    let lastFocusableElement = null;
    
    function updateFocusableElements() {
        focusableElements = navLinks.querySelectorAll(
            'a, button, [tabindex]:not([tabindex="-1"])'
        );
        firstFocusableElement = focusableElements[0];
        lastFocusableElement = focusableElements[focusableElements.length - 1];
    }
    
    // Focus trap in menu - CÓDIGO CORREGIDO
    document.addEventListener('keydown', (e) => {
        if (!isMenuOpen || e.key !== 'Tab') return;
        
        updateFocusableElements();
        
        if (e.shiftKey) {
            // Shift + Tab (ir hacia atrás)
            if (document.activeElement === firstFocusableElement) {
                e.preventDefault();
                lastFocusableElement.focus();
            }
        } else {
            // Tab (ir hacia adelante)
            if (document.activeElement === lastFocusableElement) {
                e.preventDefault();
                firstFocusableElement.focus();
            }
        }
    });
    
    console.log('Mobile menu functionality initialized successfully');
    console.log('Burger element:', burger); // DEBUG
    console.log('NavLinks element:', navLinks); // DEBUG
});