// contact.js - Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
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

    // Form validation and submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm()) {
                submitFormWithFeedback();
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

    function submitFormWithFeedback() {
        const submitBtn = contactForm.querySelector('.submit-btn');
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const userType = document.querySelector('input[name="userType"]:checked').value;
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;

        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        // Prepare FormSubmit data
        const formData = new FormData();
        formData.append('userType', userType);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('subject', subject);
        formData.append('message', message);
        formData.append('_subject', `New Mectrion Contact Request - ${userType}`);
        formData.append('_template', 'table');
        formData.append('_captcha', 'false');

        // Send to FormSubmit
        fetch('https://formsubmit.co/faiezmhamdi5@gmail.com', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                // Show success message with details
                showSuccessMessage(name, email, userType, subject, message);
                // Reset form
                contactForm.reset();
                resetFormState();
            } else {
                throw new Error('Form submission failed');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error sending your message. Please try again.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        });
    }

    function showSuccessMessage(name, email, userType, subject, message) {
        // Hide form
        contactForm.style.display = 'none';
        
        // Show success message
        successMessage.classList.add('show');

        // Display submission details
        const submissionDetails = document.getElementById('submissionDetails');
        submissionDetails.innerHTML = `
            <div class="detail-item">
                <strong>Name:</strong> ${escapeHtml(name)}
            </div>
            <div class="detail-item">
                <strong>Email:</strong> ${escapeHtml(email)}
            </div>
            <div class="detail-item">
                <strong>Type:</strong> ${escapeHtml(userType)}
            </div>
            <div class="detail-item">
                <strong>Subject:</strong> ${escapeHtml(subject)}
            </div>
            <div class="detail-item">
                <strong>Message Preview:</strong> 
                <p class="message-preview">${escapeHtml(message.substring(0, 150))}${message.length > 150 ? '...' : ''}</p>
            </div>
            <button type="button" class="btn btn-primary reset-form-btn" onclick="location.reload();">
                <i class="fas fa-redo"></i> Send Another Message
            </button>
        `;

        // Scroll to success message
        setTimeout(() => {
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    }

    function resetFormState() {
        const submitBtn = contactForm.querySelector('.submit-btn');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        
        // Reset user type selection
        document.querySelectorAll('input[name="userType"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Reset subject dropdown to show general options
        erasmusGroup.style.display = 'none';
        generalGroup.style.display = 'block';
    }

    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
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
