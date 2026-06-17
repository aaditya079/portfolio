/*
 * REZE_OS v3.0 - Unified & Premium Script Engine
 * Integrates lofi vinyl synchronizer, canvas particle engine,
 * interactive terminal widget, 3D card tilt, custom cursor trail,
 * and cinematic detonator overrides.
 */

document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Core State & Global Selectors
    // ==========================================
    let isBombMode = false;
    let isCrtActive = false; // Scanlines inactive by default, toggleable
    const body = document.body;
    
    // Check if device supports hover interactions
    const canHover = window.matchMedia('(hover: hover)').matches || !('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // Mouse Coordinates
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const flashOverlay = document.getElementById('detonation-flash');
    const chokerToggle = document.getElementById('choker-toggle');
    const footerBadge = document.querySelector('.footer-badge');
    const systemClock = document.getElementById('system-clock');
    
    // ==========================================
    // 2. Navigation & Sticky Header Clock
    // ==========================================
    // Clock tick
    function updateClock() {
        if (systemClock) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false }) + ' LOCAL';
            systemClock.textContent = timeStr;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Mobile Navbar Toggle
    const menuIcon = document.getElementById('menu-icon');
    const navbar = document.getElementById('navbar-nav');
    const header = document.querySelector('.header');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        });
    }

    // Scroll Sticky Header & Nav Link Highlights
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky header
        if (header) {
            header.classList.toggle('sticky', window.scrollY > 50);
        }

        // Section link highlight
        let currentSectionId = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            const sectionHeight = sec.offsetHeight;
            // Highlight link if scroll position is within the section
            if (window.scrollY >= (sectionTop - 200)) {
                currentSectionId = sec.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar && navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                if (menuIcon) menuIcon.classList.remove('bx-x');
            }
        });
    });

    // Copy Email Functionality
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        const btnText = copyEmailBtn.querySelector('.btn-text');
        const copyIcon = document.getElementById('copy-icon');

        copyEmailBtn.addEventListener('click', () => {
            const email = 'aadityasrinivasan079@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                copyEmailBtn.classList.add('copied');
                if (btnText) btnText.textContent = 'Email Copied!';
                if (copyIcon) copyIcon.className = 'bx bx-check';

                setTimeout(() => {
                    copyEmailBtn.classList.remove('copied');
                    if (btnText) btnText.textContent = 'Copy Email';
                    if (copyIcon) copyIcon.className = 'bx bx-copy';
                }, 2500);
            }).catch(err => {
                console.error('Copy failed: ', err);
            });
        });
    }

    // ==========================================
    // 3. Detonator Theme Override Switcher
    // ==========================================
    function triggerDetonation() {
        if (!flashOverlay) return;

        // Flash and screen shake trigger
        flashOverlay.classList.remove('flash-active');
        void flashOverlay.offsetWidth; // Reflow trigger
        flashOverlay.classList.add('flash-active');

        body.classList.remove('shake-active');
        void body.offsetWidth; // Reflow trigger
        body.classList.add('shake-active');

        setTimeout(() => {
            body.classList.remove('shake-active');
        }, 550);

        setTimeout(() => {
            flashOverlay.classList.remove('flash-active');
        }, 800);

        // Swap state classes and text behind the flash
        setTimeout(() => {
            isBombMode = !isBombMode;
            const statusEl = document.querySelector('.system-status');
            
            if (isBombMode) {
                body.classList.remove('cafe-mode');
                body.classList.add('bomb-mode');
                
                if (statusEl) statusEl.textContent = '// STATE: VOLATILE';
                if (footerBadge) footerBadge.textContent = '[ STATUS: BOMB_DEVIL_ACTIVE ]';
                
                printLine('>>> WARNING: BOMB_DEVIL_CORE DETONATED. RADIATION VOLATILE.', 'error');
            } else {
                body.classList.remove('bomb-mode');
                body.classList.add('cafe-mode');
                
                if (statusEl) statusEl.textContent = '// STATE: NOMINAL';
                if (footerBadge) footerBadge.textContent = '[ STATUS: STEADY_APRICOT ]';
                
                printLine('>>> Core cooled. Reze-OS stabilized in Café Crossroads mode.', 'system');
            }
            
            // Recalculate particles for the new theme
            initParticles();
        }, 150);
    }

    if (chokerToggle) {
        chokerToggle.addEventListener('click', triggerDetonation);
    }

    // ==========================================
    // 4. CRT Overlay Manager
    // ==========================================
    const crtOverlay = document.getElementById('crt-overlay');
    const crtToggleBtn = document.getElementById('crt-toggle-btn');
    const crtBtnIcon = document.getElementById('crt-btn-icon');

    if (crtOverlay && crtToggleBtn) {
        // Toggle action
        crtToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isCrtActive = !isCrtActive;
            if (isCrtActive) {
                crtOverlay.classList.add('active');
                if (crtBtnIcon) crtBtnIcon.className = 'bx bx-tv';
                printLine('>>> Global CRT Scanline overlay enabled.', 'system');
            } else {
                crtOverlay.classList.remove('active');
                if (crtBtnIcon) crtBtnIcon.className = 'bx bx-desktop';
                printLine('>>> Global CRT Scanline overlay disabled.', 'system');
            }
        });
    }

    // ==========================================
    // 5. Interactive Particle Canvas Engine
    // ==========================================
    const canvas = document.getElementById('ambient-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let particleCount = 40;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particleCount = window.innerWidth < 768 ? 15 : 40;
            initParticles();
        }
        window.addEventListener('resize', resizeCanvas);
        
        // Initial setup
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particleCount = window.innerWidth < 768 ? 15 : 40;

        class Particle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.radius = Math.random() * 4 + 1.2;
                
                if (isBombMode) {
                    // Volatile rising sparks
                    this.type = 'spark';
                    this.x = Math.random() * canvas.width;
                    this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
                    this.vx = (Math.random() - 0.5) * 1.8;
                    this.vy = -(Math.random() * 2.2 + 0.8);
                    this.hue = Math.random() > 0.5 ? Math.random() * 15 + 12 : Math.random() * 20 + 38; // Red/Orange/Yellow
                    this.lightness = Math.random() * 30 + 55;
                    this.baseAlpha = Math.random() * 0.7 + 0.3;
                    this.alpha = this.baseAlpha;
                    this.decay = Math.random() * 0.007 + 0.003;
                } else {
                    // Falling cherry blossom petals and matrix binary elements
                    this.type = Math.random() > 0.45 ? 'petal' : 'binary';
                    this.x = Math.random() * canvas.width;
                    this.y = initial ? Math.random() * canvas.height : -20;
                    
                    if (this.type === 'petal') {
                        this.vx = Math.random() * 0.6 + 0.2;
                        this.vy = Math.random() * 1.0 + 0.4;
                        this.hue = Math.random() > 0.6 ? 335 : 348; // Amethyst pinks
                        this.baseAlpha = Math.random() * 0.4 + 0.15;
                        this.rotation = Math.random() * Math.PI * 2;
                        this.rotSpeed = (Math.random() - 0.5) * 0.015;
                        this.waveOffset = Math.random() * Math.PI * 2;
                        this.waveSpeed = Math.random() * 0.008 + 0.004;
                    } else {
                        this.vx = (Math.random() - 0.5) * 0.2;
                        this.vy = Math.random() * 1.0 + 0.5;
                        this.hue = 275; // Purple code
                        this.baseAlpha = Math.random() * 0.3 + 0.1;
                        this.binaryVal = Math.random() > 0.5 ? '1' : '0';
                    }
                    this.alpha = this.baseAlpha;
                }
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                
                if (this.type === 'spark') {
                    ctx.translate(this.x, this.y);
                    ctx.beginPath();
                    ctx.moveTo(0, -this.radius * 1.2);
                    ctx.lineTo(this.radius * 0.7, 0);
                    ctx.lineTo(0, this.radius * 1.2);
                    ctx.lineTo(-this.radius * 0.7, 0);
                    ctx.closePath();
                    ctx.fillStyle = `hsla(${this.hue}, 100%, ${this.lightness}%, ${this.alpha})`;
                    ctx.shadowColor = `hsla(${this.hue}, 100%, 55%, 0.8)`;
                    ctx.shadowBlur = 8;
                    ctx.fill();
                } else if (this.type === 'petal') {
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation);
                    ctx.beginPath();
                    ctx.ellipse(0, 0, this.radius * 1.6, this.radius, 0, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${this.hue}, 85%, 82%, ${this.alpha})`;
                    ctx.fill();
                    ctx.strokeStyle = `hsla(${this.hue}, 90%, 72%, ${this.alpha * 0.4})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                } else {
                    ctx.font = `${this.radius * 2.5 + 6}px monospace`;
                    ctx.fillStyle = `hsla(${this.hue}, 80%, 75%, ${this.alpha})`;
                    ctx.fillText(this.binaryVal, this.x, this.y);
                }
                ctx.restore();
            }

            update() {
                if (isBombMode) {
                    if (this.type !== 'spark') this.reset();
                    
                    this.x += this.vx;
                    this.y += this.vy;
                    this.alpha -= this.decay;

                    if (canHover) {
                        const dx = mouseX - this.x;
                        const dy = mouseY - this.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 130) {
                            const force = (130 - dist) / 130;
                            this.x -= (dx / dist) * force * 3.0;
                            this.y -= (dy / dist) * force * 3.0;
                            this.alpha = Math.min(this.alpha + 0.05, 1.0);
                        }
                    }

                    if (this.alpha <= 0 || this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
                        this.reset();
                    }
                } else {
                    if (this.type === 'spark') this.reset();

                    if (this.type === 'petal') {
                        this.rotation += this.rotSpeed;
                        this.waveOffset += this.waveSpeed;
                        const wind = Math.sin(this.waveOffset) * 0.3;
                        this.x += this.vx + wind;
                        this.y += this.vy;
                    } else {
                        this.x += this.vx;
                        this.y += this.vy;
                    }

                    if (canHover) {
                        const dx = mouseX - this.x;
                        const dy = mouseY - this.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist < 100) {
                            const force = (100 - dist) / 100;
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
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });

            // Draw connecting lines between petals for a premium cyber-organic look
            if (!isBombMode) {
                for (let i = 0; i < particles.length; i++) {
                    if (particles[i].type !== 'petal') continue;
                    for (let j = i + 1; j < particles.length; j++) {
                        if (particles[j].type !== 'petal') continue;
                        
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 100) {
                            const opacity = ((100 - dist) / 100) * 0.05 * Math.min(particles[i].alpha, particles[j].alpha);
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(217, 70, 239, ${opacity})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();

        // Speed up particles temporarily on switch click
        chokerToggle.addEventListener('click', () => {
            particles.forEach(p => {
                p.vx *= 3.5;
                p.vy *= 3.5;
                if (!isBombMode) p.alpha = 0;
            });
        });
    }

    // ==========================================
    // 6. Custom Trailing Cursor (Desktop Only)
    // ==========================================
    const cursor = document.getElementById('custom-cursor');
    const cursorTrail = document.getElementById('custom-cursor-trail');
    
    if (canHover && cursor && cursorTrail) {
        let cursorX = 0, cursorY = 0;
        let trailX = 0, trailY = 0;
        let cursorActive = false;
        
        cursor.style.opacity = '0';
        cursorTrail.style.opacity = '0';

        function showCursor() {
            if (!cursorActive) {
                cursor.style.opacity = '1';
                cursorTrail.style.opacity = '1';
                body.classList.add('custom-cursor-enabled');
                cursorActive = true;
            }
        }

        function hideCursor() {
            if (cursorActive) {
                cursor.style.opacity = '0';
                cursorTrail.style.opacity = '0';
                body.classList.remove('custom-cursor-enabled');
                cursorActive = false;
            }
        }

        document.addEventListener('mousemove', () => showCursor(), { passive: true });
        document.addEventListener('mouseenter', () => showCursor());
        document.addEventListener('mouseleave', () => hideCursor());
        document.addEventListener('touchstart', () => hideCursor(), { passive: true });

        function tickCursor() {
            cursorX += (mouseX - cursorX) * 0.32;
            cursorY += (mouseY - cursorY) * 0.32;

            trailX += (mouseX - trailX) * 0.12;
            trailY += (mouseY - trailY) * 0.12;

            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;

            requestAnimationFrame(tickCursor);
        }
        requestAnimationFrame(tickCursor);

        // Expand cursor ring on hovers
        const hoverables = 'a, button, .choker-toggle-wrapper, .card-glass, .tags span, .social-link-btn, input, .tags-cloud span';
        function initCursorHovers() {
            document.querySelectorAll(hoverables).forEach(el => {
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
    }

    // ==========================================
    // 7. Interactive 3D Perspective Card Tilt
    // ==========================================
    if (canHover) {
        const glassCards = document.querySelectorAll('.card-glass');
        glassCards.forEach(card => {
            // Append shine glare child div if not already present
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

                // Tilt angles
                const tiltX = -py * 7;
                const tiltY = px * 7;

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
    // 8. Interactive Terminal Engine
    // ==========================================
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    let cmdHistory = [];
    let historyIndex = -1;

    function printLine(text, type = '') {
        if (!terminalOutput) return;
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        terminalOutput.appendChild(line);
        // Autoscroll
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    // Booting Sequence Logs
    const bootLogs = [
        "REZE-OS [Version 3.0.1993]",
        "(c) Soviet Intelligence Agency. Local Shell Unlocked.",
        "",
        "Loading memory assets... SUCCESS",
        "Mounting portfolio database modules... OK",
        "Starting core shell listener guest@reze_os:~$",
        "",
        "Ready. Type 'help' to review shell protocols list."
    ];

    let bootLogIndex = 0;
    function playBootSequence() {
        if (bootLogIndex < bootLogs.length) {
            printLine(bootLogs[bootLogIndex], bootLogs[bootLogIndex].startsWith('(') ? 'system' : '');
            bootLogIndex++;
            setTimeout(playBootSequence, 60);
        }
    }
    playBootSequence();

    // Command Parser
    function processCommand(cmdText) {
        const rawCmd = cmdText.trim();
        if (!rawCmd) return;

        printLine(`guest@reze_os:~$ ${rawCmd}`, 'command');
        cmdHistory.push(rawCmd);
        historyIndex = cmdHistory.length;

        const tokens = rawCmd.split(' ');
        const cmd = tokens[0].toLowerCase();

        switch (cmd) {
            case 'help':
                printLine("Available commands for this terminal widget:");
                printLine("  about      - Core details of subject");
                printLine("  skills     - Display listing of technical stack");
                printLine("  projects   - Show featuring applications");
                printLine("  resume     - Fetch and download resume PDF");
                printLine("  detonate   - Trigger Bomb Devil mode shift override");
                printLine("  clear      - Empty console logs buffer");
                break;
            case 'about':
                printLine("PROFILE: Aaditya Srinivasan");
                printLine("ACADEMICS: B.Tech CS (AI & Data Science) at SRM Madurai.");
                printLine("FOCUS: Offline screen OCR indexing (ImgSeek), ML scratch building (Neuralis), and Flask telemetry dashboards.");
                break;
            case 'skills':
                printLine("// TECHNICAL STACK CAPABILITIES");
                printLine("  Languages:  [██████████████████  ] Python, SQL, C#, Java, JS");
                printLine("  AI/Data:    [████████████████    ] Pandas, NumPy, scikit-learn");
                printLine("  Frameworks: [██████████████      ] Django, Flask, Streamlit, Git");
                break;
            case 'projects':
                printLine("// FEATURED PROJECTS LIST");
                printLine("  1. ImgSeek (C# / WinRT OCR) - Desktop image OCR query local index.");
                printLine("  2. Steam Games EDA (Flask / Python) - Telemetry ApexCharts dataset hotfix.");
                printLine("  3. NEURALIS (Python / NumPy) - Dependency-free deep neural network simulator.");
                break;
            case 'resume':
                printLine("Initiating resume fetch protocol...", 'system');
                const downloadLink = document.getElementById('download-btn');
                if (downloadLink) {
                    downloadLink.click();
                    printLine("Download triggered successfully.", 'system');
                } else {
                    window.open('Aaditya_Srinivasan_Resume.pdf', '_blank');
                    printLine("Resume opened in a new tab.", 'system');
                }
                break;
            case 'detonate':
                printLine("VOLATILE OVERRIDE SIGNAL RECEIVED. IGNITING DETONATION...", 'error');
                triggerDetonation();
                break;
            case 'clear':
                if (terminalOutput) terminalOutput.innerHTML = '';
                break;
            default:
                printLine(`Command error: protocol '${cmd}' unrecognized. Type 'help'.`, 'error');
        }
    }

    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = terminalInput.value;
                processCommand(val);
                terminalInput.value = '';
            } else if (e.key === 'ArrowUp') {
                if (cmdHistory.length > 0 && historyIndex > 0) {
                    historyIndex--;
                    terminalInput.value = cmdHistory[historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
                    historyIndex++;
                    terminalInput.value = cmdHistory[historyIndex];
                } else {
                    historyIndex = cmdHistory.length;
                    terminalInput.value = '';
                }
                e.preventDefault();
            }
        });

        // Refocus input on panel clicks
        const termPanel = document.querySelector('.terminal-panel');
        if (termPanel) {
            termPanel.addEventListener('click', () => {
                terminalInput.focus();
            });
        }
    }

    // ==========================================
    // 9. Floating Vinyl Music Player Widget
    // ==========================================
    const musicWidget = document.getElementById('music-widget');
    const bgmPlayer = document.getElementById('bgm-player');
    const playBtn = document.getElementById('music-play-btn');
    const playIcon = document.getElementById('music-play-icon');
    const volumeSlider = document.getElementById('music-volume-slider');
    const volumeIcon = document.getElementById('music-volume-icon');
    const discToggle = document.getElementById('music-disc-toggle');
    const pulsePrompt = document.getElementById('music-pulse-prompt');
    
    if (bgmPlayer && musicWidget) {
        bgmPlayer.volume = 0.4;
        let isPlaying = false;
        let initialUserInteraction = false;

        function updatePlayerUI(playingState) {
            isPlaying = playingState;
            if (isPlaying) {
                musicWidget.classList.add('playing');
                if (playIcon) playIcon.className = 'bx bx-pause';
                if (pulsePrompt) pulsePrompt.classList.remove('visible');
            } else {
                musicWidget.classList.remove('playing');
                if (playIcon) playIcon.className = 'bx bx-play';
            }
        }

        function togglePlayback() {
            if (isPlaying) {
                bgmPlayer.pause();
                updatePlayerUI(false);
            } else {
                bgmPlayer.play().then(() => {
                    initialUserInteraction = true;
                    updatePlayerUI(true);
                }).catch(err => {
                    console.log("Autoplay block active:", err);
                });
            }
        }

        if (playBtn) playBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePlayback(); });
        if (discToggle) {
            discToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlayback();
                musicWidget.classList.toggle('expanded');
            });
        }

        // Expand player widget on cursor hover, contract on leave
        musicWidget.addEventListener('mouseenter', () => {
            musicWidget.classList.add('expanded');
        });

        musicWidget.addEventListener('mouseleave', () => {
            musicWidget.classList.remove('expanded');
        });

        // Volume control slider
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                const vol = parseFloat(e.target.value);
                bgmPlayer.volume = vol;

                let iconClass = 'bx bx-volume-full';
                if (vol === 0) iconClass = 'bx bx-volume-mute';
                else if (vol < 0.4) iconClass = 'bx bx-volume-low';
                
                if (volumeIcon) volumeIcon.className = iconClass;
            });
            volumeSlider.addEventListener('click', (e) => e.stopPropagation());
        }

        // Handle autoplay policy - listen for a gesture to trigger lofi lofi playback
        function triggerAutoplayOnGesture() {
            if (!initialUserInteraction) {
                bgmPlayer.play().then(() => {
                    initialUserInteraction = true;
                    updatePlayerUI(true);
                    removeAutoplayListeners();
                }).catch(() => {});
            }
        }

        const autoplayEvents = ['click', 'keydown', 'touchstart', 'pointerdown', 'scroll'];
        function addAutoplayListeners() {
            autoplayEvents.forEach(evt => {
                document.addEventListener(evt, triggerAutoplayOnGesture, { passive: true });
            });
        }
        function removeAutoplayListeners() {
            autoplayEvents.forEach(evt => {
                document.removeEventListener(evt, triggerAutoplayOnGesture);
            });
        }
        
        // Try playing immediately
        bgmPlayer.play().then(() => {
            initialUserInteraction = true;
            updatePlayerUI(true);
        }).catch(() => {
            addAutoplayListeners();
            // Show prompting tooltip bubble after delay if blocked
            setTimeout(() => {
                if (!initialUserInteraction && pulsePrompt) {
                    pulsePrompt.classList.add('visible');
                }
            }, 2000);
        });
    }

    // ==========================================
    // 10. ScrollReveal Integration (Premium Slides)
    // ==========================================
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('.section-badge', { origin: 'bottom', distance: '30px', duration: 800, delay: 50 });
        ScrollReveal().reveal('.section-title', { origin: 'bottom', distance: '30px', duration: 800, delay: 120 });
        ScrollReveal().reveal('.home-content, .bento-bio, .timeline-item:nth-child(odd) .timeline-info', { origin: 'left', distance: '40px', duration: 1000, delay: 200 });
        ScrollReveal().reveal('.home-terminal, .bento-languages, .bento-skills, .timeline-item:nth-child(even) .timeline-info', { origin: 'right', distance: '40px', duration: 1000, delay: 200 });
        ScrollReveal().reveal('.project-card, .bento-status-dashboard', { origin: 'bottom', distance: '40px', duration: 900, interval: 150, delay: 200 });
    }
});
