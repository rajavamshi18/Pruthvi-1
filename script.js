// Google Apps Script Web App URL to store customer inquiries in your Google Sheet.
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxqE8fKubGiIjnLcVJaLJu33xGsNYGJLyw_tVZ76Ms43qvrLRshKCEkYsCWFtfqTLamYw/exec';

/* ============================================================
   DEVICE DETECTION via User-Agent String
   Detects: iPhone, Android phone, iPad, tablet, desktop
   Adds CSS classes to <body> for device-specific styling
   ============================================================ */
(function detectDevice() {
    const ua = navigator.userAgent;

    const isIphone   = /iPhone/i.test(ua);
    const isIpad     = /iPad/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid  = /Android/i.test(ua);
    const isMobile   = /Mobi|Android|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    const isTablet   = isIpad || (/Tablet|iPad/i.test(ua)) || (isAndroid && !/Mobi/i.test(ua));
    const isTouch    = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

    const body = document.documentElement; // apply to <html> so CSS sees it early

    if (isMobile && !isTablet) {
        body.classList.add('is-mobile');
        body.setAttribute('data-device', isIphone ? 'iphone' : 'android-phone');
    } else if (isTablet) {
        body.classList.add('is-tablet');
        body.setAttribute('data-device', isIpad ? 'ipad' : 'android-tablet');
    } else {
        body.classList.add('is-desktop');
        body.setAttribute('data-device', 'desktop');
    }

    if (isTouch) body.classList.add('is-touch');

    // Log device for debugging (remove in production if desired)
    console.info('[MR Construction] Device detected:', body.getAttribute('data-device'),
        '| Touch:', isTouch, '| UA:', ua.substring(0, 80));
})();


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

    if (slider && afterImg && sliderBar) {
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
            afterImg.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
        };

        const startSliding = (e) => {
            isSliding = true;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            moveSlider(clientX);
            // Prevent text selection or page scrolling while dragging
            if (e.cancelable) {
                e.preventDefault();
            }
        };

        const stopSliding = () => {
            isSliding = false;
        };

        const handleSliding = (e) => {
            if (!isSliding) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            moveSlider(clientX);
            // Prevent scrolling on touch devices during sliding
            if (e.touches && e.cancelable) {
                e.preventDefault();
            }
        };

        // Desktop Events
        slider.addEventListener('mousedown', startSliding);
        window.addEventListener('mousemove', handleSliding);
        window.addEventListener('mouseup', stopSliding);

        // Mobile/Touch Events
        slider.addEventListener('touchstart', startSliding, { passive: false });
        window.addEventListener('touchmove', handleSliding, { passive: false });
        window.addEventListener('touchend', stopSliding);
        window.addEventListener('touchcancel', stopSliding);
    }

});

/* ==========================================================================
   5. Basketball WhatsApp Goal Animation
   ========================================================================== */
function playBasketballAnimation() {
    const ball = document.createElement('div');
    ball.innerHTML = '<i class="fa-solid fa-basketball"></i>';
    ball.style.position = 'fixed';
    ball.style.fontSize = '45px';
    ball.style.color = '#ff6b00';
    ball.style.zIndex = '99999';
    ball.style.pointerEvents = 'none';
    ball.style.filter = 'drop-shadow(0 10px 15px rgba(0,0,0,0.4))';
    ball.style.transition = 'opacity 0.2s';
    document.body.appendChild(ball);

    // Initial position (top left, off screen)
    let x = -60;
    let y = 100;
    
    // Target is WhatsApp icon
    let targetX = window.innerWidth - 80;
    let targetY = window.innerHeight - 80;
    
    // 2.5 seconds of bouncing
    let totalFrames = 2.5 * 60;
    let vx = (targetX - x) / totalFrames;
    let vy = 0;
    let gravity = 0.6;
    let bounce = -0.75;
    let rotation = 0;

    let startTime = Date.now();
    let phase = 'bounce';
    
    function animate() {
        let elapsed = Date.now() - startTime;
        
        if (phase === 'bounce') {
            vy += gravity;
            x += vx;
            y += vy;
            rotation += 8;

            // Floor collision
            if (y > window.innerHeight - 70) {
                y = window.innerHeight - 70;
                vy *= bounce;
            }
            
            // Switch to suck phase at 2500ms
            if (elapsed > 2500) {
                phase = 'suck';
                startTime = Date.now();
            }
            
            ball.style.transform = `rotate(${rotation}deg)`;
            ball.style.left = x + 'px';
            ball.style.top = y + 'px';
            
            requestAnimationFrame(animate);
            
        } else if (phase === 'suck') {
            let suckElapsed = Date.now() - startTime;
            let duration = 500; // 0.5s to get sucked in
            let progress = Math.min(suckElapsed / duration, 1);
            
            let ease = progress * progress * progress; // Cubic ease in
            
            let finalX = window.innerWidth - 75;
            let finalY = window.innerHeight - 75;
            
            let currentX = x + (finalX - x) * ease;
            let currentY = y + (finalY - y) * ease;
            rotation += 15;
            
            let scale = 1;
            if (progress > 0.5) {
                scale = 1 - ((progress - 0.5) * 2);
            }
            
            ball.style.transform = `rotate(${rotation}deg) scale(${scale})`;
            ball.style.left = currentX + 'px';
            ball.style.top = currentY + 'px';
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                ball.remove();
                // Shake WhatsApp icon
                let waIcon = document.querySelector('.whatsapp-float');
                if(waIcon) {
                    let oldTrans = waIcon.style.transition;
                    waIcon.style.transition = 'transform 0.1s';
                    waIcon.style.transform = 'scale(1.3) rotate(-15deg)';
                    setTimeout(() => {
                        waIcon.style.transform = 'scale(1.1) rotate(15deg)';
                        setTimeout(() => {
                            waIcon.style.transform = '';
                            setTimeout(() => {
                                waIcon.style.transition = oldTrans;
                            }, 50);
                        }, 100);
                    }, 100);
                }
            }
        }
    }
    
    animate();
}

// Play once after 1.5 seconds
setTimeout(playBasketballAnimation, 1500);
