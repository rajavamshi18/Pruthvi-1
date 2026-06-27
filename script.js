// Google Apps Script Web App URL to store customer inquiries in your Google Sheet.
// Paste your Web App URL here after deploying your Apps Script!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbx7dqjKD85YbaJQiI_l9nMViZ_r1Et_e_RlLzFlxehUuINPWLzpnTzt8IjIcQsLkhZZ3A/exec';

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Header Scroll effect & Mobile Toggle Menu
       ========================================================================== */
    const header = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open');
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('open');
        });
    });


    /* ==========================================================================
       2. Dynamic Mouse 3D Tilt Effect on Hero Card
       ========================================================================== */
    const heroCard = document.getElementById('heroVisualCard');
    
    if (heroCard) {
        const visualContainer = document.querySelector('.hero-visual-container');
        
        visualContainer.addEventListener('mousemove', (e) => {
            const rect = visualContainer.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate within container
            const y = e.clientY - rect.top;  // y coordinate within container
            
            // Calculate relative offset from center (-0.5 to 0.5)
            const xc = (x / rect.width) - 0.5;
            const yc = (y / rect.height) - 0.5;
            
            // Limit maximum rotation angle to 20deg
            const maxRotation = 20;
            const rotateY = xc * maxRotation;
            const rotateX = -yc * maxRotation; // Negative to tilt forward/backward intuitively
            
            heroCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        visualContainer.addEventListener('mouseleave', () => {
            // Smooth recovery to default tilt
            heroCard.style.transform = `rotateX(10deg) rotateY(-15deg)`;
        });
    }


    /* ==========================================================================
       3. 3D Rotating Portfolio Carousel
       ========================================================================== */
    const carousel = document.getElementById('showcaseCarousel');
    const items = document.querySelectorAll('.carousel-item-3d');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (carousel && items.length > 0) {
        const itemCount = items.length;
        const angleUnit = 360 / itemCount;
        
        // Calculate appropriate radius for 3D spacing depending on viewport width
        let tzRadius = 280; 
        const adjustRadius = () => {
            if (window.innerWidth < 480) {
                tzRadius = 200;
            } else if (window.innerWidth < 768) {
                tzRadius = 240;
            } else {
                tzRadius = 280;
            }
            updateItemTransforms();
        };

        let currentAngle = 0;
        
        // Position items radially in 3D space
        function updateItemTransforms() {
            items.forEach((item, index) => {
                const itemAngle = index * angleUnit;
                // Add transform-style preserve-3d components
                item.style.transform = `rotateY(${itemAngle}deg) translateZ(${tzRadius}px)`;
            });
        }
        
        // Initialize position
        adjustRadius();
        window.addEventListener('resize', adjustRadius);
        
        // Rotation trigger function
        const rotateCarousel = () => {
            carousel.style.transform = `rotateY(${currentAngle}deg)`;
            
            // Apply scale/blur effects dynamically based on proximity to viewport
            items.forEach((item, index) => {
                // Determine item rotation angle relative to current view angle
                const rawAngle = (index * angleUnit) + currentAngle;
                const normalizeAngle = Math.abs(rawAngle % 360);
                
                // If index angle matches front perspective (0, 360)
                if (normalizeAngle < 45 || normalizeAngle > 315) {
                    item.style.filter = 'blur(0px) brightness(100%)';
                    item.style.opacity = '1';
                    item.style.zIndex = '10';
                } else if (normalizeAngle > 135 && normalizeAngle < 225) {
                    item.style.filter = 'blur(4px) brightness(40%)';
                    item.style.opacity = '0.35';
                    item.style.zIndex = '1';
                } else {
                    item.style.filter = 'blur(2px) brightness(70%)';
                    item.style.opacity = '0.7';
                    item.style.zIndex = '5';
                }
            });
        };
        
        prevBtn.addEventListener('click', () => {
            currentAngle += angleUnit;
            rotateCarousel();
        });
        
        nextBtn.addEventListener('click', () => {
            currentAngle -= angleUnit;
            rotateCarousel();
        });
        
        // Auto-run trigger occasionally
        rotateCarousel();
    }


    /* ==========================================================================
       4. Before/After Renovation Slider
       ========================================================================== */
    const slider = document.getElementById('beforeAfterSlider');
    const afterImg = document.getElementById('afterImage');
    const sliderBar = document.getElementById('sliderBar');
    
    if (slider) {
        let isSliding = false;
        
        const moveSlider = (clientX) => {
            const rect = slider.getBoundingClientRect();
            let positionX = clientX - rect.left;
            
            // Restrain boundaries (0% to 100%)
            if (positionX < 0) positionX = 0;
            if (positionX > rect.width) positionX = rect.width;
            
            const percentage = (positionX / rect.width) * 100;
            
            // Apply coordinates to slide components
            sliderBar.style.left = `${percentage}%`;
            afterImg.style.width = `${percentage}%`;
        };
        
        // Desktop mouse inputs
        slider.addEventListener('mousedown', () => {
            isSliding = true;
        });
        
        window.addEventListener('mouseup', () => {
            isSliding = false;
        });
        
        slider.addEventListener('mousemove', (e) => {
            if (!isSliding) return;
            moveSlider(e.clientX);
        });
        
        // Touch mobile inputs
        slider.addEventListener('touchstart', () => {
            isSliding = true;
        });
        
        window.addEventListener('touchend', () => {
            isSliding = false;
        });
        
        slider.addEventListener('touchmove', (e) => {
            if (!isSliding) return;
            if (e.touches.length > 0) {
                moveSlider(e.touches[0].clientX);
            }
        });
    }


    /* ==========================================================================
       5. Native Glassmorphic Form Submission to Google Sheet (via Apps Script)
       ========================================================================== */
    const contactForm = document.getElementById('consultationForm');
    
    if (contactForm) {
        const clientName = document.getElementById('clientName');
        const clientEmail = document.getElementById('clientEmail');
        const projectType = document.getElementById('projectType');
        const projectMessage = document.getElementById('projectMessage');
        const submitBtn = document.getElementById('submitFormBtn');
        
        const nameError = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const typeError = document.getElementById('typeError');
        const messageError = document.getElementById('messageError');
        
        const validateEmail = (email) => {
            const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        };
        
        const clearErrors = () => {
            nameError.style.display = 'none';
            emailError.style.display = 'none';
            typeError.style.display = 'none';
            messageError.style.display = 'none';
        };
        
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();
            
            let isValid = true;
            
            // Name Check
            if (clientName.value.trim().length < 3) {
                nameError.style.display = 'block';
                isValid = false;
            }
            
            // Email Check
            if (!validateEmail(clientEmail.value.trim())) {
                emailError.style.display = 'block';
                isValid = false;
            }
            
            // Service Selection Check
            if (projectType.value === "") {
                typeError.style.display = 'block';
                isValid = false;
            }
            
            // Message Check
            if (projectMessage.value.trim().length < 10) {
                messageError.style.display = 'block';
                isValid = false;
            }
            
            if (isValid) {
                // Check if the URL is still the default placeholder
                if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
                    alert("Developer Note: Form is validated, but the Google Apps Script Web App URL has not been set yet. Please paste your URL at the top of script.js.");
                    return;
                }
                
                // Save the name before form reset
                const savedName = clientName.value;
                
                // Generate unique Inquiry ID: MRC-YYYYMMDD-HHMMSS-XXXX
                const now = new Date();
                const datePart = now.getFullYear().toString() +
                    String(now.getMonth() + 1).padStart(2, '0') +
                    String(now.getDate()).padStart(2, '0');
                const timePart = String(now.getHours()).padStart(2, '0') +
                    String(now.getMinutes()).padStart(2, '0') +
                    String(now.getSeconds()).padStart(2, '0');
                const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
                const inquiryId = `MRC-${datePart}-${timePart}-${randomPart}`;
                
                // Inject the ID into the hidden form field so it goes to the spreadsheet
                document.getElementById('inquiryIdField').value = inquiryId;
                
                // Show sending state
                submitBtn.disabled = true;
                submitBtn.textContent = ' Sending Inquiries...';
                const spinIcon = document.createElement('i');
                spinIcon.className = 'fa-solid fa-circle-notch fa-spin';
                submitBtn.insertBefore(spinIcon, submitBtn.firstChild);
                
                // Create a hidden iframe to receive the form response
                const iframeName = 'hidden_iframe_' + Date.now();
                const hiddenIframe = document.createElement('iframe');
                hiddenIframe.name = iframeName;
                hiddenIframe.style.display = 'none';
                document.body.appendChild(hiddenIframe);
                
                // Temporarily set the form to submit to Google Apps Script via the hidden iframe
                contactForm.action = GOOGLE_SCRIPT_URL;
                contactForm.method = 'POST';
                contactForm.target = iframeName;
                
                // Listen for iframe load (means Google received and processed the data)
                hiddenIframe.addEventListener('load', function() {
                    // Show premium success overlay with Inquiry ID
                    const overlay = document.getElementById('successOverlay');
                    const card = document.getElementById('successCard');
                    const nameSpan = document.getElementById('successName');
                    const idSpan = document.getElementById('successId');
                    
                    nameSpan.textContent = savedName;
                    idSpan.textContent = inquiryId;
                    overlay.style.display = 'flex';
                    
                    // Trigger entrance animation
                    setTimeout(() => {
                        card.style.transform = 'scale(1)';
                        card.style.opacity = '1';
                    }, 10);
                    contactForm.reset();
                    
                    // Push labels back down
                    document.querySelectorAll('.form-label').forEach(label => {
                        label.style.top = '10px';
                        label.style.fontSize = '1rem';
                    });
                    
                    // Restore button state
                    submitBtn.disabled = false;
                    submitBtn.textContent = ' Send Inquiry';
                    const planeIcon = document.createElement('i');
                    planeIcon.className = 'fa-solid fa-paper-plane';
                    submitBtn.insertBefore(planeIcon, submitBtn.firstChild);
                    
                    // Remove the hidden iframe after a short delay
                    setTimeout(() => { hiddenIframe.remove(); }, 1000);
                    
                    // Clean up form attributes
                    contactForm.removeAttribute('action');
                    contactForm.removeAttribute('target');
                });
                
                // Actually submit the form natively (this sends the POST to the iframe)
                contactForm.submit();
            }
        });
        
        // Remove error displays on immediate focus inputs
        clientName.addEventListener('input', () => { if (clientName.value.trim().length >= 3) nameError.style.display = 'none'; });
        clientEmail.addEventListener('input', () => { if (validateEmail(clientEmail.value.trim())) emailError.style.display = 'none'; });
        projectType.addEventListener('change', () => { if (projectType.value !== "") typeError.style.display = 'none'; });
        projectMessage.addEventListener('input', () => { if (projectMessage.value.trim().length >= 10) messageError.style.display = 'none'; });
    }
});
