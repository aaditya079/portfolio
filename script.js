// mobile menu
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');

if (menuIcon && navbar) {
    menuIcon.onclick = () => {
        menuIcon.classList.toggle('bx-x');
        navbar.classList.toggle('active');
    };
}

// active link highlight on scroll
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a.nav-link');

window.addEventListener('scroll', () => {
    if (header) {
        header.classList.toggle('sticky', window.scrollY > 50);
    }

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

// copy email clip cta
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

            setTimeout(() => {
                copyEmailBtn.classList.remove('copied');
                if (copyText) copyText.textContent = 'Copy Email';
                if (copyIcon) {
                    copyIcon.className = 'bx bx-copy';
                }
            }, 2500);
        }).catch(err => {
            console.error('Copy failed: ', err);
        });
    });
}

// choker detonation toggle sequence
const chokerToggle = document.getElementById('choker-toggle');
const flashOverlay = document.getElementById('detonation-flash');
const body = document.body;
const cafeHeroImage = document.getElementById('cafe-hero-image');
const bombHeroImage = document.getElementById('bomb-hero-image');
const footerBadge = document.querySelector('.footer-badge');

let isBombMode = false;

if (chokerToggle && flashOverlay) {
    chokerToggle.addEventListener('click', () => {
        // screen flash
        flashOverlay.classList.remove('flash-active');
        void flashOverlay.offsetWidth;
        flashOverlay.classList.add('flash-active');

        // screen shake
        body.classList.remove('shake-active');
        void body.offsetWidth;
        body.classList.add('shake-active');

        // audio glitch on pull
        const bgmPlayer = document.getElementById('bgm-player');
        if (bgmPlayer && !bgmPlayer.paused) {
            const originalRate = bgmPlayer.playbackRate;
            const originalVol = bgmPlayer.volume;
            
            bgmPlayer.playbackRate = 0.45;
            bgmPlayer.volume = originalVol * 0.2;
            
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

        setTimeout(() => {
            body.classList.remove('shake-active');
        }, 550);

        setTimeout(() => {
            flashOverlay.classList.remove('flash-active');
        }, 800);

        // mode swap behind flash
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
        }, 150);
    });
}

// canvas particles (blossoms / sparks)
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

    class InteractiveParticle {
        constructor() {
            this.reset(true);
        }

        reset(initial = false) {
            this.radius = Math.random() * 4 + 2;
            
            if (isBombMode) {
                // rising sparks
                this.x = Math.random() * canvas.width;
                this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
                this.vx = (Math.random() - 0.5) * 1.5;
                this.vy = -(Math.random() * 1.8 + 0.8);
                
                this.hue = Math.random() > 0.45 ? Math.random() * 15 + 10 : Math.random() * 20 + 35;
                this.lightness = Math.random() * 30 + 50;
                this.baseAlpha = Math.random() * 0.7 + 0.3;
                this.alpha = this.baseAlpha;
                this.decay = Math.random() * 0.008 + 0.003;
            } else {
                // falling petals
                this.x = Math.random() * canvas.width;
                this.y = initial ? Math.random() * canvas.height : -20;
                this.vx = Math.random() * 0.8 + 0.2;
                this.vy = Math.random() * 1.0 + 0.5;
                
                this.hue = Math.random() > 0.6 ? 335 : 345;
                this.baseAlpha = Math.random() * 0.45 + 0.18;
                this.alpha = this.baseAlpha;
                this.rotation = Math.random() * Math.PI * 2;
                this.rotSpeed = (Math.random() - 0.5) * 0.015;
                
                this.waveOffset = Math.random() * Math.PI * 2;
                this.waveSpeed = Math.random() * 0.01 + 0.005;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.globalAlpha = this.alpha;
            
            if (isBombMode) {
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
                ctx.rotate(this.rotation);
                ctx.beginPath();
                ctx.ellipse(0, 0, this.radius * 1.6, this.radius, 0, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 85%, 82%, ${this.alpha})`;
                ctx.fill();
                
                ctx.strokeStyle = `hsla(${this.hue}, 90%, 72%, ${this.alpha * 0.5})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
            ctx.restore();
        }

        update() {
            if (isBombMode) {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;

                // cursor repel
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

                if (this.alpha <= 0 || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                    this.reset();
                }
            } else {
                this.rotation += this.rotSpeed;
                this.waveOffset += this.waveSpeed;
                
                const wind = Math.sin(this.waveOffset) * 0.4;
                
                this.x += this.vx + wind;
                this.y += this.vy;

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

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // lines linking petals
        if (!isBombMode) {
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

    chokerToggle.addEventListener('click', () => {
        particles.forEach(p => {
            p.vx *= 5;
            p.vy *= 5;
            if (!isBombMode) {
                p.alpha = 0;
            }
        });
    });
}

// custom cursor
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

    function tickCursor() {
        cursorX += (mouseX - cursorX) * 0.35;
        cursorY += (mouseY - cursorY) * 0.35;

        trailX += (mouseX - trailX) * 0.15;
        trailY += (mouseY - trailY) * 0.15;

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        cursorTrail.style.left = `${trailX}px`;
        cursorTrail.style.top = `${trailY}px`;

        requestAnimationFrame(tickCursor);
    }
    requestAnimationFrame(tickCursor);

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

// 3D card tilt
if (canHover) {
    const glassCards = document.querySelectorAll('.card-glass');

    glassCards.forEach(card => {
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

// ScrollReveal setup
if (typeof ScrollReveal !== 'undefined') {
    ScrollReveal({ 
        reset: false,
        distance: '40px',
        duration: 1000,
        delay: 50,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
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

// BGM Music Widget
const musicWidget = document.getElementById('music-widget');
const bgmPlayer = document.getElementById('bgm-player');
const playBtn = document.getElementById('music-play-btn');
const playIcon = document.getElementById('music-play-icon');
const volumeSlider = document.getElementById('music-volume-slider');
const volumeIcon = document.getElementById('music-volume-icon');
const discToggle = document.getElementById('music-disc-toggle');
const pulsePrompt = document.getElementById('music-pulse-prompt');

if (musicWidget && bgmPlayer && playBtn) {
    bgmPlayer.volume = 0.5;
    
    let isPlaying = false;
    let initialUserInteraction = false;
    
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
                console.log("Play failed: ", err);
            });
        }
    }
    
    playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlayback();
    });
    
    discToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        togglePlayback();
        musicWidget.classList.toggle('expanded');
    });

    musicWidget.addEventListener('click', () => {
        musicWidget.classList.add('expanded');
    });
    
    musicWidget.addEventListener('mouseleave', () => {
        musicWidget.classList.remove('expanded');
    });
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const vol = parseFloat(e.target.value);
            bgmPlayer.volume = vol;
            
            if (vol === 0) {
                volumeIcon.className = 'bx bx-volume-mute';
            } else if (vol < 0.4) {
                volumeIcon.className = 'bx bx-volume-low';
            } else {
                volumeIcon.className = 'bx bx-volume-full';
            }
        });
        
        volumeSlider.addEventListener('click', (e) => e.stopPropagation());
    }

    // native autoplay attempt
    bgmPlayer.play().then(() => {
        isPlaying = true;
        initialUserInteraction = true;
        musicWidget.classList.add('playing');
        playIcon.className = 'bx bx-pause';
        pulsePrompt.classList.remove('visible');
    }).catch(err => {
        console.log("Autoplay blocked. Setting fallback listeners.");
    });
    
    setTimeout(() => {
        if (!initialUserInteraction && bgmPlayer.paused) {
            pulsePrompt.classList.add('visible');
        }
    }, 2800);
    
    // global interaction triggers to simulate instant play
    function triggerAutoplayOnInteraction() {
        if (!initialUserInteraction) {
            bgmPlayer.play().then(() => {
                isPlaying = true;
                initialUserInteraction = true;
                musicWidget.classList.add('playing');
                playIcon.className = 'bx bx-pause';
                pulsePrompt.classList.remove('visible');
                removeAutoplayListeners();
            }).catch(() => {});
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
