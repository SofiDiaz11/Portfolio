document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.icon');
    const themeText = themeToggle.querySelector('.text');

    const getSystenTheme = () => { 
        return window.matchMedia ('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const savedTheme = localStorage.getItem('theme') || getSystenTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeButton(savedTheme);

    themeToggle.addEventListener('click', () => {
        themeToggle.classList.add('changing');

        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton(newTheme);

        setTimeout(() => {
            themeToggle.classList.remove('changing');
        }, 300);

        console.log(`Theme Changed to: ${newTheme}`);
    });

    // === update theme button appearance
    function updateThemeButton(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');

        }
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {

        if (!localStorage.getItem('theme')) {
            const sysremTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute ('data-theme', sysremTheme);
            console.log('System theme changed to: ${sysremTheme}');
        }
    }); 

    // === Keyboard Shortcut for Theme Toggle (Ctrl+Shift+D or Cmd+Shift+D) ===
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            themeToggle.click();
            console.log('Theme toggled via keyboard shortcut');
        }
    });

    // === Smooth Scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }); 

    // === Change header style when scrolling
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if(window.scrollY > 50) 
            header.classList.add('scrolled');
        else {
             header.classList.remove('scrolled');
        }
    });
    
    // === Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);

            if (data.name && data.email && data.subject && data.message) {
                console.log('Form Data:', data);
                alert('Thank you for your message! We will get back to you soon.');
                contactForm.reset();
            } else {
                alert('Please fill in all fields.');
            }
    });
    }   
});
