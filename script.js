// ==========================================
// 1. MOBILE MENU TOGGLE & STICKY HEADER
// ==========================================
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
}

// Active NavLink Highlighting on Scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a.nav-link');

window.addEventListener('scroll', () => {
    // Sticky Header toggle
    if (header) {
        header.classList.toggle('sticky', window.scrollY > 50);
    }

    // Scroll active link detection
    let current = '';
    sections.forEach(sec => {
        const sectionTop = sec.offsetTop;
        const sectionHeight = sec.offsetHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = sec.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// ==========================================
// 2. COPY TO CLIPBOARD EMAIL CTA
// ==========================================
const copyEmailBtn = document.getElementById('copy-email-btn');
if (copyEmailBtn) {
    const copyText = copyEmailBtn.querySelector('.btn-text');
    const copyIcon = document.getElementById('copy-icon');

    copyEmailBtn.addEventListener('click', () => {
        const email = 'aadityasrinivasan079@gmail.com';
        navigator.clipboard.writeText(email).then(() => {
            copyEmailBtn.classList.add('copied');
            if (copyText) copyText.textContent = 'Email Copied!';
            if (copyIcon) {
                copyIcon.className = 'bx bx-check';
            }

            // Restore original CTA button state after 2.5s
            setTimeout(() => {
                copyEmailBtn.classList.remove('copied');
                if (copyText) copyText.textContent = 'Copy Email';
                if (copyIcon) {
                    copyIcon.className = 'bx bx-copy';
                }
            }, 2500);
        }).catch(err => {
            console.error('Failed to copy email: ', err);
        });
    });
}

// ==========================================
// 3. ADVANCED DETONATION SEQUENCE (CHOKER TOGGLE)
// ==========================================
const chokerToggle = document.getElementById('choker-toggle');
const flashOverlay = document.getElementById('detonation-flash');
const body = document.body;
const cafeHeroImage = document.getElementById('cafe-hero-image');
const bombHeroImage = document.getElementById('bomb-hero-image');
const footerBadge = document.querySelector('.footer-badge');

let isBombMode = false;

if (chokerToggle && flashOverlay) {
    chokerToggle.addEventListener('click', () => {
        // 1. Trigger Screen Flash Overlay
        flashOverlay.classList.remove('flash-active');
        void flashOverlay.offsetWidth; // Force CSS reflow to restart animation
        flashOverlay.classList.add('flash-active');

        // 2. Trigger Structural Screen Shake
        body.classList.remove('shake-active');
        void body.offsetWidth; // Force reflow
        body.classList.add('shake-active');

        // Auditory Detonation Distortion: Pitch-drop/glitch the BGM during the flash
        const bgmPlayer = document.getElementById('bgm-player');
        if (bgmPlayer && !bgmPlayer.paused) {
            const originalRate = bgmPlayer.playbackRate;
            const originalVol = bgmPlayer.volume;
            
            // Drop playback speed and volume simulating explosion shockwave compression
            bgmPlayer.playbackRate = 0.45;
            bgmPlayer.volume = originalVol * 0.2;
            
            // Glitch slide back to normal
            setTimeout(() => {
                let interval = setInterval(() => {
                    if (bgmPlayer.playbackRate < originalRate) {
                        bgmPlayer.playbackRate += 0.05;
                    }
                    if (bgmPlayer.volume < originalVol) {
                        bgmPlayer.volume += 0.05;
                    }
                    
                    if (bgmPlayer.playbackRate >= originalRate && bgmPlayer.volume >= originalVol) {
                        bgmPlayer.playbackRate = originalRate;
                        bgmPlayer.volume = originalVol;
                        clearInterval(interval);
                    }
                }, 30);
            }, 550);
        }

        // Clean up classes after animations conclude
        setTimeout(() => {
            body.classList.remove('shake-active');
        }, 550);

        setTimeout(() => {
            flashOverlay.classList.remove('flash-active');
        }, 800);

        // 3. Swap Active Modes & States (Immediate styling swap behind the flash cover)
        setTimeout(() => {
            isBombMode = !isBombMode;
            
            if (isBombMode) {
                body.classList.remove('cafe-mode');
                body.classList.add('bomb-mode');
                
                if (cafeHeroImage && bombHeroImage) {
                    cafeHeroImage.classList.remove('active');
                    bombHeroImage.classList.add('active');
                }

                if (footerBadge) {
                    footerBadge.textContent = '[ STATUS: BOMB_DEVIL_ACTIVE ]';
                }
            } else {
                body.classList.remove('bomb-mode');
                body.classList.add('cafe-mode');
                
                if (cafeHeroImage && bombHeroImage) {
                    bombHeroImage.classList.remove('active');
                    cafeHeroImage.classList.add('active');
                }

                if (footerBadge) {
                    footerBadge.textContent = '[ STATUS: STEADY_APRICOT ]';
                }
            }
        }, 150); // Small offset so swap happens exactly when screen goes white
    });
}

// ==========================================
// 4. DUAL ENGINE PARTICLE SYSTEM (CANVAS)
// ==========================================
const canvas = document.getElementById('ambient-canvas');
let mouseX = 0;
let mouseY = 0;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleCount = 45;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Optimize density for display sizes
        if (window.innerWidth < 768) {
            particleCount = 18;
        } else {
            particleCount = 45;
        }
        initParticles();
    }
    
    window.addEventListener('resize', resizeCanvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (window.innerWidth < 768) {
        particleCount = 18;
    }

    // Interactive Particle Blueprint
    class InteractiveParticle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            // General coordinate sizing
            this.radius = Math.random() * 4 + 2;
            
            if (isBombMode) {
                // Sparks rise from bottom up
                this.x = Math.random() * canvas.width;
                this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = -(Math.random() * 1.8 + 0.8);
                
                // Nuclear orange/red embers
                this.hue = Math.random() > 0.45 ? Math.random() * 15 + 10 : Math.random() * 20 + 35; // Red/Orange/Yellow
                this.lightness = Math.random() * 30 + 50; // Spark glowing brightness
                this.baseAlpha = Math.random() * 0.7 + 0.3;
                this.alpha = this.baseAlpha;
                this.decay = Math.random() * 0.008 + 0.003;
            } else {
                // Apricot flower petals fall from top down
                this.x = Math.random() * canvas.width;
                this.y = initial ? Math.random() * canvas.height : -20;
                this.vx = Math.random() * 0.8 + 0.2; // Soft diagonal breeze drift
                this.vy = Math.random() * 1.0 + 0.5; // Weightless slide down
                
                // Lilac pink flower tone
                this.hue = Math.random() > 0.6 ? 335 : 345; // Soft apricot pinks
                this.baseAlpha = Math.random() * 0.45 + 0.18;
                this.alpha = this.baseAlpha;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.015;
                
                // Drift variables
                this.waveOffset = Math.random() * Math.PI * 2;
                this.waveSpeed = Math.random() * 0.01 + 0.005;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = this.alpha;
            
            if (isBombMode) {
                // Draw crackling sparks (glowing diamonds)
                ctx.beginPath();
                ctx.moveTo(0, -this.radius * 1.2);
                ctx.lineTo(this.radius * 0.7, 0);
                ctx.lineTo(0, this.radius * 1.2);
                ctx.lineTo(-this.radius * 0.7, 0);
                ctx.closePath();
                ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.lightness}%, ${this.alpha})`;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 55%, 0.8)`;
                ctx.shadowBlur = 12;
                ctx.fill();
            } else {
                // Draw rotating organic flower petals
                ctx.rotate(this.rotation);
                ctx.beginPath();
                // Custom heart/petal path geometry
                ctx.ellipse(0, 0, this.radius * 1.6, this.radius, 0, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 85%, 82%, ${this.alpha})`;
                ctx.fill();
                
                // Add soft petal shadow
                ctx.strokeStyle = `hsla(${this.hue}, 90%, 72%, ${this.alpha * 0.5})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
            ctx.restore();
        }

        update() {
            if (isBombMode) {
                // Rise Upwards
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;

                // Repel violently from hover cursor (fleeing sparks)
                if (canHover) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        const force = (150 - dist) / 150;
                        this.x -= (dx / dist) * force * 3.5;
                        this.y -= (dy / dist) * force * 3.5;
                        this.alpha = Math.min(this.alpha + 0.05, 1.0);
                    }
                }

                // Reset when dead or offscreen
                if (this.alpha <= 0 || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.reset();
                }
            } else {
                // Fall Downwards
                this.rotation += this.rotSpeed;
                this.waveOffset += this.waveSpeed;
                
                // Organic side-to-side wavy breeze drift
                const wind = Math.sin(this.waveOffset) * 0.4;
                
                this.x += this.vx + wind;
                this.y += this.vy;

                // Soft cursor repulsion (petals getting brushed away)
                if (canHover) {
                    const dx = mouseX - this.x;
                    const dy = mouseY - this.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 120) {
                        const force = (120 - dist) / 120;
                        this.x -= (dx / dist) * force * 1.5;
                        this.y -= (dy / dist) * force * 1.5;
                    }
                }

                // Reset when falling off screen borders
                if (this.y > canvas.height + 10 || this.x > canvas.width + 10 || this.x < -10) {
                    this.reset();
                }
            }
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new InteractiveParticle());
        }
    }
    
    initParticles();

    // High refresh animation loop
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Mode-specific line grids or connectors
        if (!isBombMode) {
            // Draw extremely soft, elegant connecting threads in Cafe mode (constellations)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        const opacity = ((130 - dist) / 130) * 0.08 * Math.min(particles[i].alpha, particles[j].alpha);
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(217, 70, 239, ${opacity})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
        }

        requestAnimationFrame(animateParticles);
    }
    
    requestAnimationFrame(animateParticles);

    // Dynamic mode shift canvas wipe listener
    chokerToggle.addEventListener('click', () => {
        // Instant shock wipe: make current particles scatter/combust
        particles.forEach(p => {
            p.vx *= 5;
            p.vy *= 5;
            if (!isBombMode) {
                p.alpha = 0; // instantly dissolve
            }
        });
    });
}

// ==========================================
// 5. PREMIUM MAGNETIC DUAL CURSOR
// ==========================================
const cursor = document.getElementById('custom-cursor');
const cursorTrail = document.getElementById('custom-cursor-trail');

if (canHover && cursor && cursorTrail) {
    let cursorX = 0, cursorY = 0;
    let trailX = 0, trailY = 0;
    
    cursor.style.opacity = '0';
    cursorTrail.style.opacity = '0';

    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorTrail.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorTrail.style.opacity = '0';
    });

    // Interpolation (lerp) for physics cursor delay
    function tickCursor() {
        // Fast tracking dot (35% snap lerp)
        cursorX += (mouseX - cursorX) * 0.35;
        cursorY += (mouseY - cursorY) * 0.35;

        // Fluid outer ring spring delay (15% lerp)
        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        cursorTrail.style.left = `${trailX}px`;
        cursorTrail.style.top = `${trailY}px`;

        requestAnimationFrame(tickCursor);
    }
    requestAnimationFrame(tickCursor);

    // Expand cursor ring on interactive element hover
    const hoverSelectors = 'a, button, .choker-toggle-wrapper, .card-glass, .tags span, .social-link-btn';
    
    function initCursorHovers() {
        const hoverables = document.querySelectorAll(hoverSelectors);
        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('hovered');
                cursorTrail.classList.add('hovered');
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('hovered');
                cursorTrail.classList.remove('hovered');
            });
        });
    }

    initCursorHovers();
    window.addEventListener('DOMContentLoaded', initCursorHovers);
}

// ==========================================
// 6. 3D CARD HOVER TILT WITH SPECULAR GLOW SHINE
// ==========================================
if (canHover) {
    const glassCards = document.querySelectorAll('.card-glass');

    glassCards.forEach(card => {
        // Inject shine overlay if missing
        if (!card.querySelector('.shine')) {
            const shineDiv = document.createElement('div');
            shineDiv.className = 'shine';
            card.appendChild(shineDiv);
        }

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const px = (x / rect.width) - 0.5;
            const py = (y / rect.height) - 0.5;

            // Fluid 3D rotation (up to 8 degrees limit)
            const tiltX = -py * 8;
            const tiltY = px * 8;

            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.setProperty('--shine-x', `${x}px`);
            card.style.setProperty('--shine-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.setProperty('--shine-x', '0px');
            card.style.setProperty('--shine-y', '0px');
        });
    });
}

// ==========================================
// 7. SCROLL REVEAL (ELEGANT SLIDE IN TRANSITIONS)
// ==========================================
if (typeof ScrollReveal !== 'undefined') {
    ScrollReveal({ 
        reset: false,
        distance: '40px',
        duration: 1000,
        delay: 50,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)' // Clean spatial curve
    });

    ScrollReveal().reveal('.section-badge, .subtitle, .codename-badge', { origin: 'bottom', delay: 100 });
    ScrollReveal().reveal('.home-content h1, .section-title', { origin: 'bottom', delay: 180 });
    ScrollReveal().reveal('.role, .description, .action-group', { origin: 'bottom', delay: 260 });
    ScrollReveal().reveal('.home-image', { origin: 'right', delay: 350 });
    ScrollReveal().reveal('.about-text', { origin: 'left', delay: 150 });
    ScrollReveal().reveal('.skill-category', { origin: 'bottom', interval: 100 });
    ScrollReveal().reveal('.timeline-item', { origin: 'bottom', interval: 120 });
    ScrollReveal().reveal('.project-card', { origin: 'bottom', interval: 120 });
}

// ==========================================
// 8. INTERACTIVE GLASSMORPHIC BGM PLAYER
// ==========================================
const musicWidget = document.getElementById('music-widget');
const bgmPlayer = document.getElementById('bgm-player');
const playBtn = document.getElementById('music-play-btn');
const playIcon = document.getElementById('music-play-icon');
const volumeSlider = document.getElementById('music-volume-slider');
const volumeIcon = document.getElementById('music-volume-icon');
const discToggle = document.getElementById('music-disc-toggle');
const pulsePrompt = document.getElementById('music-pulse-prompt');

if (musicWidget && bgmPlayer && playBtn) {
    // Set standard default starting volume
    bgmPlayer.volume = 0.5;
    
    let isPlaying = false;
    let initialUserInteraction = false;
    
    // Play / Pause toggle function
    function togglePlayback() {
        if (isPlaying) {
            bgmPlayer.pause();
            isPlaying = false;
            musicWidget.classList.remove('playing');
            playIcon.className = 'bx bx-play';
        } else {
            bgmPlayer.play().then(() => {
                isPlaying = true;
                initialUserInteraction = true;
                musicWidget.classList.add('playing');
                playIcon.className = 'bx bx-pause';
                pulsePrompt.classList.remove('visible');
            }).catch(err => {
                console.log("Autoplay blocked by browser policy. Prompting click.", err);
            });
        }
    }
    
    // Bind click events on disc and play button
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent expanding the panel on control click
        togglePlayback();
    });
    
    discToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlayback();
        musicWidget.classList.toggle('expanded');
    });

    // Handle clicks inside widget itself (expansion behavior)
    musicWidget.addEventListener('click', () => {
        musicWidget.classList.add('expanded');
    });
    
    // Collapse when mouse leaves
    musicWidget.addEventListener('mouseleave', () => {
        musicWidget.classList.remove('expanded');
    });
    
    // Volume slider control
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const vol = parseFloat(e.target.value);
            bgmPlayer.volume = vol;
            
            // Dynamic volume icon state
            if (vol === 0) {
                volumeIcon.className = 'bx bx-volume-mute';
            } else if (vol < 0.4) {
                volumeIcon.className = 'bx bx-volume-low';
            } else {
                volumeIcon.className = 'bx bx-volume-full';
            }
        });
        
        // Prevent slider clicks from triggering disc toggles
        volumeSlider.addEventListener('click', (e) => e.stopPropagation());
    }

    // Try immediate native autoplay on load
    bgmPlayer.play().then(() => {
        isPlaying = true;
        initialUserInteraction = true;
        musicWidget.classList.add('playing');
        playIcon.className = 'bx bx-pause';
        pulsePrompt.classList.remove('visible');
    }).catch(err => {
        console.log("Immediate autoplay blocked by browser policy. Setting up seamless micro-interaction listeners.", err);
    });
    
    // Browser Autoplay Workaround Prompt:
    // Display the pulse prompt after a tiny delay if the track is still paused
    setTimeout(() => {
        if (!initialUserInteraction && bgmPlayer.paused) {
            pulsePrompt.classList.add('visible');
        }
    }, 2800);
    
    // Global fallback autoplay click & interaction listeners:
    // Plays the music automatically on any minimal interaction (mouse move, tap, keypress, etc.)
    function triggerAutoplayOnInteraction() {
        if (!initialUserInteraction) {
            bgmPlayer.play().then(() => {
                isPlaying = true;
                initialUserInteraction = true;
                musicWidget.classList.add('playing');
                playIcon.className = 'bx bx-pause';
                pulsePrompt.classList.remove('visible');
                
                // Dissolve listeners once active
                removeAutoplayListeners();
            }).catch(() => {
                // If still blocked, wait for explicit play btn click
            });
        }
    }

    const autoplayEvents = ['click', 'scroll', 'keydown', 'touchstart', 'pointerdown', 'mousemove'];
    
    function addAutoplayListeners() {
        autoplayEvents.forEach(evt => {
            document.addEventListener(evt, triggerAutoplayOnInteraction, { passive: true });
        });
    }

    function removeAutoplayListeners() {
        autoplayEvents.forEach(evt => {
            document.removeEventListener(evt, triggerAutoplayOnInteraction);
        });
    }
    
    addAutoplayListeners();
}
