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
    const carouselContainer = document.querySelector('.showcase-container');
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
        
        // Touch swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Auto-play functionality
        let autoPlayInterval;
        
        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                currentAngle -= angleUnit;
                rotateCarousel();
            }, 1800);
        }
        
        function pauseAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        if (carouselContainer) {
            carouselContainer.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
                pauseAutoPlay();
            }, { passive: true });
            
            carouselContainer.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchEndX < touchStartX - 50) {
                    currentAngle -= angleUnit;
                    rotateCarousel();
                } else if (touchEndX > touchStartX + 50) {
                    currentAngle += angleUnit;
                    rotateCarousel();
                }
                startAutoPlay();
            }, { passive: true });

            // Pause auto-play on hover
            carouselContainer.addEventListener('mouseenter', pauseAutoPlay);
            carouselContainer.addEventListener('mouseleave', startAutoPlay);
        }
        
        // Initial setup
        rotateCarousel();
        startAutoPlay();
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
        const clientName    = document.getElementById('clientName');
        const clientEmail   = document.getElementById('clientEmail');
        const clientPhone   = document.getElementById('clientPhone');
        const projectType   = document.getElementById('projectType');
        const projectMessage = document.getElementById('projectMessage');
        const submitBtn     = document.getElementById('submitFormBtn');

        const nameError  = document.getElementById('nameError');
        const emailError = document.getElementById('emailError');
        const phoneError = document.getElementById('phoneError');

        const validateEmail = (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
        };

        const validatePhone = (phone) => {
            return /^\+?[\d\s\-]{10,}$/.test(String(phone).trim());
        };

        const showSuccess = (name, inquiryId) => {
            const overlay  = document.getElementById('successOverlay');
            const card     = document.getElementById('successCard');
            const nameSpan = document.getElementById('successName');
            const idSpan   = document.getElementById('successId');
            if (!overlay || !card || !nameSpan || !idSpan) return;
            nameSpan.textContent = name;
            idSpan.textContent   = inquiryId;
            overlay.style.display = 'flex';
            setTimeout(() => {
                card.style.transform = 'scale(1)';
                card.style.opacity   = '1';
            }, 10);
        };

        submitBtn.addEventListener('click', () => {

            // Clear previous errors
            [nameError, emailError, phoneError].forEach(el => { if (el) el.style.display = 'none'; });

            let isValid = true;

            if (clientName.value.trim().length < 3) {
                if (nameError) nameError.style.display = 'block';
                isValid = false;
            }
            if (!validateEmail(clientEmail.value.trim())) {
                if (emailError) emailError.style.display = 'block';
                isValid = false;
            }
            if (!validatePhone(clientPhone.value.trim())) {
                if (phoneError) phoneError.style.display = 'block';
                isValid = false;
            }

            if (!isValid) return;

            const savedName = clientName.value.trim();

            // Generate unique Inquiry ID: MRC-YYYYMMDD-HHMMSS-XXXX
            const now        = new Date();
            const datePart   = now.getFullYear().toString() + String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
            const timePart   = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0') + String(now.getSeconds()).padStart(2, '0');
            const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
            const inquiryId  = `MRC-${datePart}-${timePart}-${randomPart}`;

            // Update button to loading state
            submitBtn.disabled  = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

            // Build FormData payload
            const formData = new FormData();
            formData.append('Name',      clientName.value.trim());
            formData.append('Email',     clientEmail.value.trim());
            formData.append('Phone',     clientPhone.value.trim());
            formData.append('Service',   projectType ? projectType.value : 'Not Specified');
            formData.append('Message',   projectMessage ? projectMessage.value.trim() : '');
            formData.append('InquiryID', inquiryId);

            const onDone = () => {
                contactForm.reset();
                document.querySelectorAll('.form-label').forEach(label => label.removeAttribute('style'));
                submitBtn.disabled  = false;
                submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Inquiry';
                showSuccess(savedName, inquiryId);
            };

            // Send data to Google Apps Script
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode:   'no-cors',
                body:   formData
            }).then(onDone).catch(onDone);
        });

        // Live inline validation clearing
        if (clientName)  clientName.addEventListener('input',  () => { if (clientName.value.trim().length >= 3 && nameError)          nameError.style.display  = 'none'; });
        if (clientEmail) clientEmail.addEventListener('input', () => { if (validateEmail(clientEmail.value.trim()) && emailError)     emailError.style.display = 'none'; });
        if (clientPhone) clientPhone.addEventListener('input', () => { if (validatePhone(clientPhone.value.trim()) && phoneError)     phoneError.style.display = 'none'; });
    }
});


