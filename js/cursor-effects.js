const hasMouseSupport = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (hasMouseSupport && typeof gsap !== 'undefined') {
    
    // ===== Crear elementos del cursor
    
    // Cursor principal (punto pequeño)
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);
    
    // Cursor follower (círculo que sigue) - VARIABLE CORREGIDA
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    document.body.appendChild(cursorFollower);
    
    // ===== VARIABLES DE CONTROL =====
    
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    let isClicking = false;
    
    // ===== MOVIMIENTO DEL CURSOR (CORREGIDO) =====
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Cursor principal - movimiento inmediato
        gsap.to(cursor, {
            x: mouseX,
            y: mouseY,
            duration: 0,
            ease: 'none'
        });
        
        // Cursor follower - movimiento suave con delay
        gsap.to(cursorFollower, {
            x: mouseX,
            y: mouseY,
            duration: 0.3,
            ease: 'power2.out'
        });
    });
    
    // ===== ESTADOS DEL CURSOR (CORREGIDO) =====
    
    // Al hacer click
    document.addEventListener('mousedown', () => {
        isClicking = true;
        gsap.to(cursor, {
            scale: 0.7,
            duration: 0.1
        });
        gsap.to(cursorFollower, {
            scale: 0.8,
            duration: 0.1
        });
    });
    
    document.addEventListener('mouseup', () => {
        isClicking = false;
        gsap.to(cursor, {
            scale: 1,
            duration: 0.2,
            ease: 'back.out(1.2)'
        });
        gsap.to(cursorFollower, {
            scale: 1,
            duration: 0.2,
            ease: 'back.out(1.2)'
        });
    });
    
    // ===== HOVER EFFECTS EN ELEMENTOS ESPECÍFICOS (CORREGIDO) =====
    
    const hoverElements = document.querySelectorAll('a, button, .project-card, .skill-item, .theme-toggle');
    
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            isHovering = true;
            
            // Cursor principal se hace más pequeño
            gsap.to(cursor, {
                scale: 0.5,
                duration: 0.2
            });
            
            // Cursor follower se hace más grande
            gsap.to(cursorFollower, {
                scale: 1.5,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        element.addEventListener('mouseleave', () => {
            isHovering = false;
            
            // Volver al estado normal
            gsap.to(cursor, {
                scale: 1,
                duration: 0.2
            });
            
            gsap.to(cursorFollower, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    // ===== EFECTOS ESPECIALES POR ELEMENTO =====
    
    // Theme toggle - cursor cambia de color
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-theme');
            cursorFollower.classList.add('cursor-theme');
        });
        
        themeToggle.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-theme');
            cursorFollower.classList.remove('cursor-theme');
        });
    }
    
    // Hero section - cursor más grande y translúcido
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => {
            gsap.to(cursorFollower, {
                scale: 2,
                opacity: 0.3,
                duration: 0.4
            });
        });
        
        heroSection.addEventListener('mouseleave', () => {
            gsap.to(cursorFollower, {
                scale: 1,
                opacity: 0.8,
                duration: 0.4
            });
        });
    }
    
    // ===== OCULTAR CURSOR AL SALIR DE LA VENTANA =====
    
    document.addEventListener('mouseleave', () => {
        gsap.to([cursor, cursorFollower], {
            opacity: 0,
            duration: 0.2
        });
    });
    
    document.addEventListener('mouseenter', () => {
        gsap.to([cursor, cursorFollower], {
            opacity: 1,
            duration: 0.2
        });
    });
    
    // ===== ADAPTACIÓN AL SCROLL =====
    
    window.addEventListener('scroll', () => {
        // Reducir opacidad ligeramente durante scroll
        gsap.to([cursor, cursorFollower], {
            opacity: 0.6,
            duration: 0.1
        });
        
        // Volver a normal después del scroll
        clearTimeout(window.scrollTimeout);
        window.scrollTimeout = setTimeout(() => {
            gsap.to([cursor, cursorFollower], {
                opacity: 1,
                duration: 0.2
            });
        }, 150);
    });
    
    console.log('Custom cursor effects initialized successfully');
    
} else if (!hasMouseSupport) {
    console.log('Touch device detected - cursor effects disabled');
} else {
    console.log('GSAP not available - cursor effects disabled');
}