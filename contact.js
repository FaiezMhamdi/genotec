// contact.js - Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const faqItems = document.querySelectorAll('.faq-item');
    const userTypeRadios = document.querySelectorAll('input[name="userType"]');
    const erasmusGroup = document.getElementById('erasmusGroup');
    const generalGroup = document.getElementById('generalGroup');
    const subjectSelect = document.getElementById('subject');

    // User type selector change handler
    userTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            handleUserTypeChange(this.value);
            clearError(document.getElementById('userType'));
        });
    });

    function handleUserTypeChange(userType) {
        if (userType === 'Erasmus Student') {
            // Show Erasmus subjects, hide general subjects
            erasmusGroup.style.display = 'block';
            generalGroup.style.display = 'none';
            // Reset subject selection
            subjectSelect.value = '';
        } else if (userType === 'Particular') {
            // Show general subjects, hide Erasmus subjects
            erasmusGroup.style.display = 'none';
            generalGroup.style.display = 'block';
            // Reset subject selection
            subjectSelect.value = '';
        }
    }

    // Form validation — let browser submit to FormSubmit on success
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
            }
        });

        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
    }

    // FAQ toggle functionality
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', function() {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current item
                item.classList.toggle('active');
            });
        });
    }

    function validateForm() {
        let isValid = true;
        const fields = [
            { id: 'userType', validator: validateUserType },
            { id: 'name', validator: validateRequired },
            { id: 'email', validator: validateEmail },
            { id: 'subject', validator: validateRequired },
            { id: 'message', validator: validateRequired }
        ];

        fields.forEach(field => {
            const element = document.getElementById(field.id);
            if (!element) {
                console.error('validateForm: element not found for id "' + field.id + '"');
                isValid = false;
                return;
            }
            if (!field.validator(element)) {
                isValid = false;
            }
        });

        return isValid;
    }

    function validateField(field) {
        let isValid = true;
        
        switch(field.type) {
            case 'email':
                isValid = validateEmail(field);
                break;
            case 'select-one':
                isValid = validateRequired(field);
                break;
            case 'radio':
                isValid = validateUserType(field);
                break;
            default:
                isValid = validateRequired(field);
        }
        
        return isValid;
    }

    function validateUserType(field) {
        const checkedRadio = document.querySelector('input[name="userType"]:checked');
        const isValid = !!checkedRadio;
        
        if (!isValid) {
            showError(field, 'Please select your type');
        } else {
            clearError(field);
        }
        
        return isValid;
    }

    function validateRequired(field) {
        const value = field.value.trim();
        const isValid = value !== '';
        
        if (!isValid) {
            showError(field, 'This field is required');
        } else {
            clearError(field);
        }
        
        return isValid;
    }

    function validateEmail(field) {
        const value = field.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value);
        
        if (!isValid && value !== '') {
            showError(field, 'Please enter a valid email address');
        } else if (value === '') {
            showError(field, 'Email address is required');
        } else {
            clearError(field);
        }
        
        return isValid;
    }

    function showError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    function clearError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            if (!href || !/^#[\w-]+$/.test(href)) return;
            const target = document.getElementById(href.slice(1));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});
