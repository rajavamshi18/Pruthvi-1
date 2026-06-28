// Google Apps Script Web App URL to store customer inquiries in your Google Sheet.
// Paste your Web App URL here after deploying your Apps Script!
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqE8fKubGiIjnLcVJaLJu33xGsNYGJLyw_tVZ76Ms43qvrLRshKCEkYsCWFtfqTLamYw/exec';

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

});


