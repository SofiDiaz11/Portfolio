document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.icon');
    const themeText = themeToggle.querySelector('.text');

    //Nombre de función
    const getSystemTheme = () => { 
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    const savedTheme = localStorage.getItem('theme') || getSystemTheme();
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

        console.log(`Theme changed to: ${newTheme}`);
    });

    // === Update theme button appearance ===
    function updateThemeButton(theme) {
        if (theme === 'dark') {
            themeIcon.textContent = '☀️';
            themeText.textContent = 'Light';
            themeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            themeIcon.textContent = '🌙';
            themeText.textContent = 'Dark';
            themeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    //Template literal y nombre de variable
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            const systemTheme = e.matches ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', systemTheme);
            updateThemeButton(systemTheme);
            console.log(`System theme changed to: ${systemTheme}`);
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

    // === Smooth Scrolling for internal links ===
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

    // === Change header style when scrolling ===
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    
    // === Contact Form Handling ===
    const contactForm = document.getElementById('contactForm');
    
    // CORRECCIÓN 4: Verificación de existencia del formulario
    if (!contactForm) {
        console.log('Contact form not found on this page');
        return;
    }

    const submitButton = contactForm.querySelector('.btn-primary');
    const submitText = submitButton.querySelector('.btn-text');

    const fields = {
        name: contactForm.querySelector('#name'),
        email: contactForm.querySelector('#email'),
        subject: contactForm.querySelector('#subject'),
        message: contactForm.querySelector('#message')
    };

    let isSubmitting = false;

    const validationRules = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-ZÀ-ÿ\s]+$/,
            messages: {
                required: 'Please enter your name',
                minLength: 'Name must be at least 2 characters',
                maxLength: 'Name cannot exceed 50 characters',
                pattern: 'Please use only letters and spaces'
            }
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            messages: {
                required: 'Please enter your email',
                pattern: 'Please enter a valid email address'
            }
        },
        subject: {
            required: true,
            minLength: 5,
            maxLength: 100,
            messages: {
                required: 'Please enter a subject',
                minLength: 'Subject must be at least 5 characters',
                maxLength: 'Subject cannot exceed 100 characters'
            }
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 1000,
            messages: {
                required: 'Please enter your message',
                minLength: 'Message must be at least 10 characters',
                maxLength: 'Message cannot exceed 1000 characters'
            }
        }
    };

    // Function to validate a field
    function validateField(fieldName, value) {
        const rules = validationRules[fieldName];

        if (rules.required && (!value || value.trim() === '')) {
            return { isValid: false, message: rules.messages.required };
        }

        if (!value || value.trim() === '') {
            return { isValid: true, message: '' };
        }

        const trimmedValue = value.trim();

        //Propiedad y acceso a messages
        if (rules.minLength && trimmedValue.length < rules.minLength) {
            return { isValid: false, message: rules.messages.minLength }; 
        }

        if (rules.maxLength && trimmedValue.length > rules.maxLength) {
            return { isValid: false, message: rules.messages.maxLength };
        }

        if (rules.pattern && !rules.pattern.test(trimmedValue)) {
            return { isValid: false, message: rules.messages.pattern };
        }

        return { isValid: true, message: '' };
    }

    function showFieldError(fieldName, message) {
        const field = fields[fieldName];
        const formGroup = field.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');

        if (!errorElement) { 
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }

        if (message) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
            field.classList.add('error');
            formGroup.classList.add('has-error');
        } else {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
            field.classList.remove('error');
            formGroup.classList.remove('has-error');

            if (field.value.trim()) {
                field.classList.add('valid');
                formGroup.classList.add('has-success');
            }
        }
    }

    function validateAllFields() {
        let allValid = true;

        Object.keys(fields).forEach(fieldName => {
            const validation = validateField(fieldName, fields[fieldName].value);
            showFieldError(fieldName, validation.isValid ? '' : validation.message);

            if (!validation.isValid) {
                allValid = false;
            }
        });

        updateSubmitButton(allValid);
        return allValid;
    }

    function updateSubmitButton(isValid) {
        if (isValid && !isSubmitting) {
            submitButton.disabled = false;
            submitButton.classList.remove('disabled');
        } else {
            submitButton.disabled = true;
            submitButton.classList.add('disabled');
        }
    }

    // Form status functions
    function setLoadingState() {
        isSubmitting = true; 
        submitText.textContent = 'Sending...';
        submitButton.disabled = true;
        submitButton.classList.add('loading');

        if (typeof gsap !== 'undefined') {
            gsap.to(submitButton, {scale: 0.95, duration: 0.1});
        }
    }
    
    function setSuccessState() {
        submitText.textContent = 'Message Sent!';
        submitButton.classList.remove('loading');
        submitButton.classList.add('success');
        
        if (typeof gsap !== 'undefined') {
            gsap.to(submitButton, {
                scale: 1,
                duration: 0.2,
                ease: 'back.out(1.2)'
            });
        }

        showNotification('Your message has been sent successfully! I\'ll get back to you soon.', 'success');

        setTimeout(() => {
            resetForm();
        }, 3000);
    }

    function setErrorState() {
        isSubmitting = false;
        submitText.textContent = 'Failed to Send';
        submitButton.classList.remove('loading');
        submitButton.classList.add('error');

        showNotification('Sorry, there was an error sending your message. Please try again.', 'error');

        setTimeout(() => {
            submitText.textContent = 'Submit';
            submitButton.classList.remove('error');
            updateSubmitButton(validateAllFields());
        }, 3000);
    }

    function resetForm() {
        isSubmitting = false;
        contactForm.reset();

        // Clean visual status 
        Object.keys(fields).forEach(fieldName => {
            const field = fields[fieldName];
            const formGroup = field.closest('.form-group');

            field.classList.remove('error', 'valid');
            formGroup.classList.remove('has-error', 'has-success');

            const errorElement = formGroup.querySelector('.error-message');
            if (errorElement) {
                errorElement.classList.remove('show');
                errorElement.textContent = '';
            }
        });

        // Button reset
        submitText.textContent = 'Submit';
        submitButton.classList.remove('success', 'error', 'loading', 'disabled');
        submitButton.disabled = true;
    }

    function showNotification(message, type = 'info') {
        const existing = document.querySelector('.form-notification');
        if (existing) {
            existing.remove();
        }

        // New notification
        const notification = document.createElement('div');
        notification.className = `form-notification ${type}`;
        notification.textContent = message;

        contactForm.parentNode.insertBefore(notification, contactForm.nextSibling);

        // Animation
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(notification,
                {opacity: 0, y: 20},
                {opacity: 1, y: 0, duration: 0.3}
            );
        }

        // Auto-remove
        setTimeout(() => {
            if (notification.parentNode) {
                if (typeof gsap !== 'undefined') {
                    gsap.to(notification, {
                        opacity: 0,
                        y: -20,
                        duration: 0.3, 
                        onComplete: () => notification.remove()
                    });
                } else {
                    notification.remove();
                }
            }
        }, 5000);
    }

   async function submitForm(formData) {
    try {
        // Crear FormData en lugar de URLSearchParams
        const formBody = new FormData();
        formBody.append('form-name', 'contact');
        formBody.append('name', formData.name);
        formBody.append('email', formData.email);
        formBody.append('subject', formData.subject);
        formBody.append('message', formData.message);

        const response = await fetch('/', {
            method: 'POST',
            body: formBody
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server response:', errorText);
            throw new Error(`Server responded with ${response.status}`);
        }

        return { success: true };
    } catch (error) {
        console.error('Form submission error details:', error);
        throw error;
    }
}

    // Add event listeners to form fields
    Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];

        field.addEventListener('blur', () => {
            if (field.classList.contains('error')) {
                const validation = validateField(fieldName, field.value);
                if (validation.isValid) {
                    showFieldError(fieldName, '');
                }
            }
            updateSubmitButton(validateAllFields());
        });

        // Character counter
        if (validationRules[fieldName].maxLength) {
           field.addEventListener('input', () => {
                updateCharacterCount(fieldName);
           }); 
        }      
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (isSubmitting) return;

        if (!validateAllFields()) {
            showNotification('Please correct the errors above before submitting.', 'error');

            const firstError = contactForm.querySelector('.has-error input, .has-error textarea');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({behavior: 'smooth', block: 'center'});
            }
            return;
        }

        // Acceso a los valores de los campos
        const formData = {
            name: fields.name.value.trim(),
            email: fields.email.value.trim(),
            subject: fields.subject.value.trim(),
            message: fields.message.value.trim(),
            timestamp: new Date().toISOString()
        };

        console.log('Submitting form:', formData);

        setLoadingState();

        try {
            await submitForm(formData);
            setSuccessState();
        } catch (error) {
            console.error('Form submission error:', error);
            setErrorState();
        }
    });

    function updateCharacterCount(fieldName) {
        const field = fields[fieldName];
        const formGroup = field.closest('.form-group');
        const maxLength = validationRules[fieldName].maxLength;
        const currentLength = field.value.length;

        let counter = formGroup.querySelector('.character-count');
        if (!counter) {
            counter = document.createElement('span');
            counter.className = 'character-count';
            formGroup.appendChild(counter);
        }

        counter.textContent = `${currentLength}/${maxLength}`;

        counter.classList.remove('warning', 'error');
        if (currentLength > maxLength * 0.8) {
            counter.classList.add('warning');
        }
        if (currentLength > maxLength) {
            counter.classList.add('error');
        }
    }

    // Initialize submit button state
    updateSubmitButton(false);

    console.log('Form validation initialized successfully');
});