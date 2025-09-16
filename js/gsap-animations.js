if (typeof gsap !== 'undefined') {
    console.log('GSAP is loaded successfully.');
     
    if (window.matchMedia('prefers-reduced-motion: reduce)').matches) {
        gsap.globalTimeline.timeScale(0); // Slow down animations for reduced motion preference
        console.log('Animations disabled - use prefers-reduced-motion');
    }

    gsap.registerPlugin(ScrollTrigger);

    //scroll reveal
    const revealConfig = {
        distance: '50px',
        duration: 0.8,
        ease: 'power2.out',
        threshold: 0.1
    };

    //section titles 
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.fromTo(title,
            {
                opacity: 0,
                y:30,
                scale: 0.95
            },
            {
                opacity: 1,
                y:0,
                scale: 1,
                scrollTrigger: {
                    trigger: title,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                }
            }
        );
    });

    //About section
    const aboutTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.about',
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play none none reverse'
        }
    });

    aboutTimeline.fromTo('.about-text',
        { opacity: 0, x: -40}, 
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' }
    )
    .fromTo('.about-image',
        { opacity: 0, x: 40}, 
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
    );

    //Projects cards 
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.fromTo(card,
            { opacity: 0, 
                y: 30, 
                scale: 0.95 
            },
            {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.7,
                ease: 'back.out(1.2)',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                delay: index * 0.1 // Effecto escalonado
            }
        );
    });

    //Contact section
    const formTimeline = gsap.timeline({
        scrollTrigger: {
            trigger: '.contact-form',
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
        }
    });

    formTimeline.fromTo('.contact-content p',
            { opacity: 0, y: 20}, 
            { opacity: 1, y: 0, duration: 0.6}
            )

            .fromTo ('.form-group',
            { opacity: 0, y: 30}, 
            { opacity: 1, 
                y: 0, 
                duration: 0.5, 
                stagger: 0.1,
                ease: 'power2.out'
             },
            '-=0.3'
            )
            
    //Footer
    gsap.fromTo('.social-links .social-link',
        {
            opacity: 0,
            y: 20,
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: 'footer',
                start: 'top 90%',
                toggleActions: 'play none none reverse'
            }
        }
    ); 

     // Parallax sutil para el hero
    gsap.to('.hero-content', {
        yPercent: -20,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1 // Animación ligada al scroll
        }
    });
    
    // Fade out gradual del hero al hacer scroll
    gsap.to('.hero::before', {
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1
        }
    });
    
    // ===== ANIMACIONES DE HOVER MEJORADAS =====
    
    // Project cards con hover más dinámico
    gsap.utils.toArray('.project-card').forEach(card => {
        const tl = gsap.timeline({ paused: true });
        
        tl.to(card, {
            y: -15,
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
        })
        .to(card.querySelector('.project-title'), {
            color: 'var(--accent-red)',
            duration: 0.2
        }, 0);
        
        card.addEventListener('mouseenter', () => tl.play());
        card.addEventListener('mouseleave', () => tl.reverse());
    });
    
    // Skills track - pausa más suave al hover
    const skillsTrack = document.querySelector('.skills-track');
    if (skillsTrack) {
        skillsTrack.addEventListener('mouseenter', () => {
            gsap.to(skillsTrack, { animationPlayState: 'paused', duration: 0.3 });
        });
        
        skillsTrack.addEventListener('mouseleave', () => {
            gsap.to(skillsTrack, { animationPlayState: 'running', duration: 0.3 });
        });
    }
    
    // ===== NAVEGACIÓN SCROLL SPY =====
    
    // Actualizar navegación activa según sección visible
    const sections = gsap.utils.toArray('section[id]');
    const navLinks = gsap.utils.toArray('.nav-links a');
    
    sections.forEach(section => {
        ScrollTrigger.create({
            trigger: section,
            start: 'top 50%',
            end: 'bottom 50%',
            onEnter: () => updateActiveNav(section.id),
            onEnterBack: () => updateActiveNav(section.id)
        });
    });
    
    function updateActiveNav(activeId) {
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${activeId}`) {
                link.classList.add('active');
                
                // Pequeña animación para el link activo
                gsap.fromTo(link, 
                    { scale: 1 },
                    { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 }
                );
            }
        });
    }
    
    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    // Refresh ScrollTrigger al cambiar tamaño de ventana
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });
    
    // Debug mode (activar en desarrollo)
    const debugMode = false; // Cambiar a true para ver markers
    if (debugMode) {
        ScrollTrigger.defaults({ markers: true });
    }
    
    console.log('GSAP scroll animations initialized');
    
} else {
    console.error('GSAP not loaded. Please include GSAP CDN in your HTML.');
}

// ===== INTEGRACIÓN CON THEME TOGGLE =====

// Asegurar que las animaciones respeten el cambio de tema
document.addEventListener('themeChanged', () => {
    // Refresh para recalcular posiciones después del cambio de tema
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
});


// CSS adicional que debes agregar para usuarios sin JS
const noJSFallback = `
<noscript>
<style>
    .section-title,
    .about-text,
    .about-image,
    .project-card,
    .form-group,
    .social-link {
        opacity: 1 !important;
        transform: none !important;
    }
</style>
</noscript> 
`; 