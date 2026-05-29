/*
 * REZE_OS v2.0 - Combined & Refined Script Engine
 * Integrates dual-view controls, double interactive terminal shells,
 * synchronized vinyl players, and cinematic detonator overrides.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Core State & Navigation Views
    let isPortfolioUnlocked = false;
    let isBombMode = false;
    let isCrtActive = true; // CRT scanner active by default
    const body = document.body;
    const canHover = window.matchMedia('(hover: hover)').matches || !('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // Global mouse tracking
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Elements Selectors
    const flashOverlay = document.getElementById('detonation-flash');
    const secureDashboard = document.getElementById('secure-dashboard-view');
    const fullPortfolio = document.getElementById('full-portfolio-view');
    const headerLockBtn = document.getElementById('header-lock-btn');
    const terminalLockBtn = document.getElementById('terminal-lock-btn');
    
    // 2. View Toggle Transitions
    function unlockPortfolio() {
        if (isPortfolioUnlocked) return;

        // Visual flash & screen shake
        if (flashOverlay) {
            flashOverlay.classList.remove('flash-active');
            void flashOverlay.offsetWidth;
            flashOverlay.classList.add('flash-active');
        }
        body.classList.remove('shake-active');
        void body.offsetWidth;
        body.classList.add('shake-active');

        setTimeout(() => {
            body.classList.remove('shake-active');
        }, 550);

        // Transition views behind the flash
        setTimeout(() => {
            isPortfolioUnlocked = true;
            body.classList.add('portfolio-unlocked');
            document.documentElement.classList.add('portfolio-unlocked');
            
            if (secureDashboard) {
                secureDashboard.classList.remove('view-active');
                secureDashboard.classList.add('view-hidden');
            }
            if (fullPortfolio) {
                fullPortfolio.classList.remove('view-hidden');
                fullPortfolio.classList.add('view-active');
            }

            // Scroll to home section top
            window.scrollTo(0, 0);

            // Print overrides in embedded console
            printLineEmbedded('>>> ACCESS COMPROMISED. SECURE OS SHELL CODE OVERRIDDEN.', 'system');
            printLineEmbedded('>>> Dossier file database unlocked. Scroll to explore.', 'system');
            printLineEmbedded('>>> Type "lock", "exit", or click header padlock to reboot shell.', 'system');

            // Force refocus on embedded console prompt
            const embeddedInput = document.getElementById('embedded-terminal-input');
            if (embeddedInput) {
                embeddedInput.value = '';
                embeddedInput.focus();
            }

            // Re-trigger scroll reveal animations
            if (typeof ScrollReveal !== 'undefined') {
                ScrollReveal().reveal('.section-badge, .subtitle, .codename-badge', { origin: 'bottom', delay: 80 });
                ScrollReveal().reveal('.home-content h1, .section-title', { origin: 'bottom', delay: 140 });
                ScrollReveal().reveal('.role, .description, .action-group', { origin: 'bottom', delay: 200 });
                ScrollReveal().reveal('.home-image', { origin: 'right', delay: 280 });
            }
        }, 150);
    }

    function lockPortfolio() {
        if (!isPortfolioUnlocked) return;

        // Visual flash & screen shake
        if (flashOverlay) {
            flashOverlay.classList.remove('flash-active');
            void flashOverlay.offsetWidth;
            flashOverlay.classList.add('flash-active');
        }
        body.classList.remove('shake-active');
        void body.offsetWidth;
        body.classList.add('shake-active');

        setTimeout(() => {
            body.classList.remove('shake-active');
        }, 550);

        // Transition views behind the flash
        setTimeout(() => {
            isPortfolioUnlocked = false;
            body.classList.remove('portfolio-unlocked');
            document.documentElement.classList.remove('portfolio-unlocked');
            
            if (secureDashboard) {
                secureDashboard.classList.remove('view-hidden');
                secureDashboard.classList.add('view-active');
            }
            if (fullPortfolio) {
                fullPortfolio.classList.remove('view-active');
                fullPortfolio.classList.add('view-hidden');
            }

            // Reset scroll positions
            window.scrollTo(0, 0);

            // Re-trigger standard logs in main cockpit terminal
            printLine('>>> SYSTEM BUFFER RESTORED. CORE LOCKED.', 'system');
            
            const termInput = document.getElementById('terminal-input');
            if (termInput) {
                termInput.value = '';
                termInput.focus();
            }
        }, 150);
    }

    // Connect trigger button overrides
    if (headerLockBtn) headerLockBtn.addEventListener('click', lockPortfolio);
    if (terminalLockBtn) terminalLockBtn.addEventListener('click', lockPortfolio);

    // Dynamic sticky header status clocks
    const crtOverlay = document.getElementById('crt-overlay');
    const crtToggleBtn = document.getElementById('crt-toggle-btn');
    const crtBtnIcon = document.getElementById('crt-btn-icon');
    
    if (crtOverlay) {
        if (isCrtActive) {
            crtOverlay.classList.add('active');
            if (crtBtnIcon) crtBtnIcon.className = 'bx bx-tv';
        }
        
        if (crtToggleBtn) {
            crtToggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                isCrtActive = !isCrtActive;
                if (isCrtActive) {
                    crtOverlay.classList.add('active');
                    crtBtnIcon.className = 'bx bx-tv';
                    printLine('>>> Global CRT Monitor overlay enabled.', 'system');
                } else {
                    crtOverlay.classList.remove('active');
                    crtBtnIcon.className = 'bx bx-desktop';
                    printLine('>>> Global CRT Monitor overlay disabled.', 'system');
                }
            });
        }
    }

    // Sticky Navigation links active highlight
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.navbar a.nav-link');
    const menuIcon = document.querySelector('#menu-icon');
    const navbar = document.querySelector('.navbar');
    const header = document.querySelector('.header');

    if (menuIcon && navbar) {
        menuIcon.onclick = () => {
            menuIcon.classList.toggle('bx-x');
            navbar.classList.toggle('active');
        };
    }

    window.addEventListener('scroll', () => {
        if (header) {
            header.classList.toggle('sticky', window.scrollY > 50);
        }

        if (!isPortfolioUnlocked) return; // scroll highlights only active in scroll mode
        
        let current = '';
        sections.forEach(sec => {
            const sectionTop = sec.offsetTop;
            const sectionHeight = sec.offsetHeight;
            if (window.scrollY >= (sectionTop - 180)) {
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

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar && navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                if (menuIcon) menuIcon.classList.remove('bx-x');
            }
        });
    });

    // Clock
    function updateClock() {
        const clockEl = document.getElementById('system-clock');
        if (clockEl) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-US', { hour12: false }) + ' LOCAL';
            clockEl.textContent = timeStr;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();

    // Copy email CTA
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (copyEmailBtn) {
        const copyText = copyEmailBtn.querySelector('.btn-text');
        const copyIcon = document.getElementById('copy-icon');

        copyEmailBtn.addEventListener('click', () => {
            const email = 'aadityasrinivasan079@gmail.com';
            navigator.clipboard.writeText(email).then(() => {
                copyEmailBtn.classList.add('copied');
                if (copyText) copyText.textContent = 'Email Copied!';
                if (copyIcon) copyIcon.className = 'bx bx-check';

                setTimeout(() => {
                    copyEmailBtn.classList.remove('copied');
                    if (copyText) copyText.textContent = 'Copy Email';
                    if (copyIcon) copyIcon.className = 'bx bx-copy';
                }, 2500);
            }).catch(err => {
                console.error('Copy failed: ', err);
            });
        });
    }

    // 3. Detonator Mode Switch Logic
    const chokerToggle = document.getElementById('choker-toggle');
    const cafeHeroImage = document.getElementById('cafe-hero-image');
    const bombHeroImage = document.getElementById('bomb-hero-image');
    const footerBadge = document.querySelector('.footer-badge');

    function triggerDetonation() {
        if (!flashOverlay) return;

        flashOverlay.classList.remove('flash-active');
        void flashOverlay.offsetWidth;
        flashOverlay.classList.add('flash-active');

        body.classList.remove('shake-active');
        void body.offsetWidth;
        body.classList.add('shake-active');

        setTimeout(() => {
            body.classList.remove('shake-active');
        }, 550);

        setTimeout(() => {
            flashOverlay.classList.remove('flash-active');
        }, 800);

        // Core mode swap behind flash
        setTimeout(() => {
            isBombMode = !isBombMode;
            const statusEl = document.querySelector('.system-status');
            
            if (isBombMode) {
                body.classList.remove('cafe-mode');
                body.classList.add('bomb-mode');
                
                if (statusEl) statusEl.textContent = '// STATE: VOLATILE';
                if (footerBadge) footerBadge.textContent = '[ STATUS: BOMB_DEVIL_ACTIVE ]';
                
                if (cafeHeroImage && bombHeroImage) {
                    cafeHeroImage.classList.remove('active');
                    bombHeroImage.classList.add('active');
                }

                printLine('>>> WARNING: BOMB_DEVIL_CORE DETONATED. RADIATION CRITICAL.', 'error');
                printLineEmbedded('>>> WARNING: BOMB_DEVIL_CORE DETONATED. RADIATION CRITICAL.', 'error');
            } else {
                body.classList.remove('bomb-mode');
                body.classList.add('cafe-mode');
                
                if (statusEl) statusEl.textContent = '// STATE: NOMINAL';
                if (footerBadge) footerBadge.textContent = '[ STATUS: STEADY_APRICOT ]';
                
                if (cafeHeroImage && bombHeroImage) {
                    bombHeroImage.classList.remove('active');
                    cafeHeroImage.classList.add('active');
                }

                printLine('>>> Radiation cleared. Reze-OS stabilized in Cafe Crossroads mode.', 'system');
                printLineEmbedded('>>> Radiation cleared. Reze-OS stabilized in Cafe Crossroads mode.', 'system');
            }
        }, 150);
    }

    if (chokerToggle) {
        chokerToggle.addEventListener('click', triggerDetonation);
    }

    // 4. Dual Canvas Ambient Particle Engine
    const canvas = document.getElementById('ambient-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let particleCount = 45;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            particleCount = window.innerWidth < 768 ? 18 : 45;
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
                this.radius = Math.random() * 4 + 1.5;
                
                if (isBombMode) {
                    this.type = 'spark';
                    this.x = Math.random() * canvas.width;
                    this.y = initial ? Math.random() * canvas.height : canvas.height + 20;
                    this.vx = (Math.random() - 0.5) * 1.5;
                    this.vy = -(Math.random() * 2.0 + 0.8);
                    this.hue = Math.random() > 0.45 ? Math.random() * 15 + 10 : Math.random() * 20 + 35; // Fire
                    this.lightness = Math.random() * 30 + 50;
                    this.baseAlpha = Math.random() * 0.7 + 0.3;
                    this.alpha = this.baseAlpha;
                    this.decay = Math.random() * 0.008 + 0.003;
                } else {
                    this.type = Math.random() > 0.4 ? 'petal' : 'binary';
                    this.x = Math.random() * canvas.width;
                    this.y = initial ? Math.random() * canvas.height : -20;
                    
                    if (this.type === 'petal') {
                        this.vx = Math.random() * 0.8 + 0.2;
                        this.vy = Math.random() * 1.0 + 0.5;
                        this.hue = Math.random() > 0.6 ? 335 : 345; // Pink
                        this.baseAlpha = Math.random() * 0.45 + 0.18;
                        this.rotation = Math.random() * Math.PI * 2;
                        this.rotSpeed = (Math.random() - 0.5) * 0.015;
                        this.waveOffset = Math.random() * Math.PI * 2;
                        this.waveSpeed = Math.random() * 0.01 + 0.005;
                    } else {
                        this.vx = (Math.random() - 0.5) * 0.2;
                        this.vy = Math.random() * 1.2 + 0.6;
                        this.hue = 280; // Violet code
                        this.baseAlpha = Math.random() * 0.35 + 0.12;
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
                    ctx.shadowBlur = 10;
                    ctx.fill();
                } else if (this.type === 'petal') {
                    ctx.translate(this.x, this.y);
                    ctx.rotate(this.rotation);
                    ctx.beginPath();
                    ctx.ellipse(0, 0, this.radius * 1.5, this.radius, 0, 0, Math.PI * 2);
                    ctx.fillStyle = `hsla(${this.hue}, 85%, 82%, ${this.alpha})`;
                    ctx.fill();
                    ctx.strokeStyle = `hsla(${this.hue}, 90%, 72%, ${this.alpha * 0.4})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                } else {
                    ctx.font = `${this.radius * 2.8 + 6}px monospace`;
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
                    if (this.type === 'spark') this.reset();

                    if (this.type === 'petal') {
                        this.rotation += this.rotSpeed;
                        this.waveOffset += this.waveSpeed;
                        const wind = Math.sin(this.waveOffset) * 0.35;
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

            if (!isBombMode) {
                for (let i = 0; i < particles.length; i++) {
                    if (particles[i].type !== 'petal') continue;
                    for (let j = i + 1; j < particles.length; j++) {
                        if (particles[j].type !== 'petal') continue;
                        
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 120) {
                            const opacity = ((120 - dist) / 120) * 0.07 * Math.min(particles[i].alpha, particles[j].alpha);
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
        requestAnimationFrame(animateParticles);

        chokerToggle.addEventListener('click', () => {
            particles.forEach(p => {
                p.vx *= 4;
                p.vy *= 4;
                if (!isBombMode) p.alpha = 0;
            });
        });
    }

    // 5. Custom Trailing cursor (Desktop)
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

        // Enable on mouse movement
        document.addEventListener('mousemove', () => {
            showCursor();
        }, { passive: true });

        document.addEventListener('mouseenter', () => {
            showCursor();
        });

        document.addEventListener('mouseleave', () => {
            hideCursor();
        });

        // Hide cursor if touch occurs to avoid glitches on touch devices/screens
        document.addEventListener('touchstart', () => {
            hideCursor();
        }, { passive: true });

        function tickCursor() {
            cursorX += (mouseX - cursorX) * 0.35;
            cursorY += (mouseY - cursorY) * 0.35;

            trailX += (mouseX - trailX) * 0.15;
            trailY += (mouseY - trailY) * 0.15;

            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            cursorTrail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;

            requestAnimationFrame(tickCursor);
        }
        requestAnimationFrame(tickCursor);

        const hoverSelectors = 'a, button, .choker-toggle-wrapper, .card-glass, .tags span, .social-link-btn, input';
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

    // 6. Interactive 3D Perspective Card Tilt
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

                const tiltX = -py * 6;
                const tiltY = px * 6;

                card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.015, 1.015, 1.015)`;
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

    // 7. DOUBLE INTERACTIVE TERMINAL SHELLS ENGINE (Sync Interpreter)
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const embeddedOutput = document.getElementById('embedded-terminal-output');
    const embeddedInput = document.getElementById('embedded-terminal-input');
    
    let cmdHistory = [];
    let historyIndex = -1;

    // Output writers for both consoles
    function printLine(text, type = '') {
        if (!terminalOutput) return;
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        terminalOutput.appendChild(line);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }

    function printLineEmbedded(text, type = '') {
        if (!embeddedOutput) return;
        const line = document.createElement('div');
        line.className = `terminal-line ${type}`;
        line.textContent = text;
        embeddedOutput.appendChild(line);
        embeddedOutput.scrollTop = embeddedOutput.scrollHeight;
    }

    // Boot lines sequence
    const bootLogs = [
        "REZE-OS [Version 2.0.1993]",
        "(c) Soviet Intelligence Agency. Core Console Locked.",
        "",
        "Loading memory blocks... OK",
        "Loading classified personnel dossier... SUCCESS",
        "Initializing core shell guest session...",
        "READY.",
        "Type 'help' to review classified guest protocols list."
    ];

    let bootIndex = 0;
    function playBootSequence() {
        if (bootIndex < bootLogs.length) {
            printLine(bootLogs[bootIndex], bootLogs[bootIndex].startsWith('(') ? 'system' : '');
            bootIndex++;
            setTimeout(playBootSequence, 75);
        }
    }
    playBootSequence();

    // Embedded console boot log
    setTimeout(() => {
        printLineEmbedded("REZE-OS [Version 2.0.1993]", "");
        printLineEmbedded("Access Override Bypassed. Personal Dossier database fully active.", "system");
        printLineEmbedded("Type 'help' to see local override command lists.", "");
    }, 1500);

    // Shared Command Interpreter
    function processCommand(cmdText, sourceConsole = 'main') {
        const rawCmd = cmdText.trim();
        if (!rawCmd) return;

        const writer = sourceConsole === 'main' ? printLine : printLineEmbedded;
        writer(`guest@reze_os:~$ ${rawCmd}`, 'command');

        cmdHistory.push(rawCmd);
        historyIndex = cmdHistory.length;

        const tokens = rawCmd.split(' ');
        const cmd = tokens[0].toLowerCase();

        switch (cmd) {
            case 'help':
                writer("Classified protocols authorized for this grid:");
                writer("  about      - Personal personnel summary info");
                writer("  skills     - Technical competency breakdown");
                writer("  projects   - Selected operations logs summary");
                writer("  resume     - Fetch classified PDF resume");
                writer("  detonate   - Trigger emergency mode detonation");
                if (sourceConsole === 'main') {
                    writer("  reveal     - Unlock secure bypass to personal dossier database (v1)");
                } else {
                    writer("  lock       - Re-secure shell core cockpit dashboard (v2)");
                }
                writer("  clear      - Wipe shell output buffers");
                break;
            case 'about':
                writer("SUBJECT PROFILE: AADITYA SRINIVASAN");
                writer("ACADEMICS: Pursuing B.Tech AI & Data Science (2nd Year) at SRM Madurai.");
                writer("TACTICAL REPUTATION: Developer who focuses on creating offline receipt indexers, Kaggle bug fixes, and scratch-built neural network engines.");
                break;
            case 'skills':
                writer("// COMPETENCY DATA SHEET");
                writer("  Languages:  [====================] Python, SQL, C#, Java, JS");
                writer("  AI & Data:  [==================  ] Pandas, NumPy, scikit-learn, Power BI");
                writer("  Web/Infra:  [===============     ] Django, Flask, Streamlit, Git");
                break;
            case 'projects':
                writer("// SELECTED FIELD OPERATIONS LOGS");
                writer("  1. ImgSeek (Offline OCR Screenshot Scanner)");
                writer("     - Windows native OCR scanner indexing directories offline for keyword matches. Generates galleries.");
                writer("  2. Steam Games EDA");
                writer("     - Flask dashboards verifying pricing modeling after patching pricing header CSV bug on Kaggle.");
                writer("  3. NEURALIS");
                writer("     - Lightweight dependency-free neural network engine simulating custom ML topologies from scratch.");
                break;
            case 'resume':
                writer("Initiating file transfer to local receiver...");
                const downloadLink = document.getElementById('download-btn');
                if (downloadLink) {
                    downloadLink.click();
                    writer("Transfer success. Resume PDF downloaded.", 'system');
                } else {
                    window.open('Aaditya_Srinivasan_Resume.pdf', '_blank');
                    writer("Classified document displayed in external viewport.", 'system');
                }
                break;
            case 'detonate':
                writer("Pulling detonator sequence pin alert...", 'error');
                triggerDetonation();
                break;
            case 'reveal':
                if (sourceConsole === 'main') {
                    writer("BYPASS DECRYPTION SUCCESS. UNLOCKING PORTS...", 'system');
                    unlockPortfolio();
                } else {
                    writer("Bypass database already compromised.", 'system');
                }
                break;
            case 'lock':
            case 'exit':
            case 'reboot':
                if (sourceConsole === 'embedded') {
                    writer("REBOOT SECTOR COMMAND REGISTERED. ENCRYPTING FILES...", 'error');
                    lockPortfolio();
                } else {
                    writer("Cockpit shell already securely locked. Access 'reveal' to override.", 'system');
                }
                break;
            case 'clear':
                if (sourceConsole === 'main' && terminalOutput) {
                    terminalOutput.innerHTML = '';
                } else if (sourceConsole === 'embedded' && embeddedOutput) {
                    embeddedOutput.innerHTML = '';
                }
                break;
            default:
                writer(`Shell error: protocol '${cmd}' unauthorized. Access 'help' to review.`, 'error');
        }
    }

    // Main shell listeners
    if (terminalInput) {
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = terminalInput.value;
                processCommand(val, 'main');
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
        
        const termPanel = document.querySelector('#secure-dashboard-view .terminal-panel');
        if (termPanel) {
            termPanel.addEventListener('click', () => {
                terminalInput.focus();
            });
        }
    }

    // Embedded shell listeners
    if (embeddedInput) {
        embeddedInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = embeddedInput.value;
                processCommand(val, 'embedded');
                embeddedInput.value = '';
            } else if (e.key === 'ArrowUp') {
                if (cmdHistory.length > 0 && historyIndex > 0) {
                    historyIndex--;
                    embeddedInput.value = cmdHistory[historyIndex];
                }
                e.preventDefault();
            } else if (e.key === 'ArrowDown') {
                if (cmdHistory.length > 0 && historyIndex < cmdHistory.length - 1) {
                    historyIndex++;
                    embeddedInput.value = cmdHistory[historyIndex];
                } else {
                    historyIndex = cmdHistory.length;
                    embeddedInput.value = '';
                }
                e.preventDefault();
            }
        });

        const embeddedPanel = document.querySelector('#full-portfolio-view .terminal-panel');
        if (embeddedPanel) {
            embeddedPanel.addEventListener('click', () => {
                embeddedInput.focus();
            });
        }
    }

    // 8. SYNCHRONIZED VINYL & TUNER BGM PLAYBACK BINDINGS
    const musicWidget = document.getElementById('music-widget');
    const bgmPlayer = document.getElementById('bgm-player');
    const playBtn = document.getElementById('music-play-btn');
    const playIcon = document.getElementById('music-play-icon');
    const volumeSlider = document.getElementById('music-volume-slider');
    const volumeIcon = document.getElementById('music-volume-icon');
    const discToggle = document.getElementById('music-disc-toggle');
    const pulsePrompt = document.getElementById('music-pulse-prompt');
    
    // Cockpit Tuner Deck Elements
    const tunerDeck = document.querySelector('.tuner-deck');
    const tunerPlayBtn = document.getElementById('tuner-play-btn');
    const tunerPlayIcon = document.getElementById('tuner-play-icon');
    const tunerVolumeSlider = document.getElementById('tuner-volume-slider');
    const tunerVolumeIcon = document.getElementById('tuner-volume-icon');
    const tunerDiscToggle = document.getElementById('tuner-disc-toggle');

    if (bgmPlayer) {
        bgmPlayer.volume = 0.5;
        let isPlaying = false;
        let initialUserInteraction = false;

        // Synchronized playback updating state
        function updatePlayerUI(playingState) {
            isPlaying = playingState;
            if (isPlaying) {
                musicWidget.classList.add('playing');
                if (tunerDeck) tunerDeck.classList.add('playing');
                if (playIcon) playIcon.className = 'bx bx-pause';
                if (tunerPlayIcon) tunerPlayIcon.className = 'bx bx-pause';
                if (pulsePrompt) pulsePrompt.classList.remove('visible');
            } else {
                musicWidget.classList.remove('playing');
                if (tunerDeck) tunerDeck.classList.remove('playing');
                if (playIcon) playIcon.className = 'bx bx-play';
                if (tunerPlayIcon) tunerPlayIcon.className = 'bx bx-play';
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
                    console.log("Autoplay block: ", err);
                });
            }
        }

        // Tuner BGM Clicks
        if (tunerPlayBtn) {
            tunerPlayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlayback();
            });
        }
        if (tunerDiscToggle) {
            tunerDiscToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlayback();
            });
        }

        // Widget BGM Clicks
        if (playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlayback();
            });
        }
        if (discToggle) {
            discToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                togglePlayback();
                if (!musicWidget.classList.contains('expanded')) {
                    musicWidget.classList.add('expanded');
                }
            });
        }

        musicWidget.addEventListener('click', () => {
            if (!musicWidget.classList.contains('expanded')) {
                musicWidget.classList.add('expanded');
                if (!isPlaying) {
                    bgmPlayer.play().then(() => {
                        initialUserInteraction = true;
                        updatePlayerUI(true);
                    }).catch(() => {});
                }
            }
        });

        musicWidget.addEventListener('mouseleave', () => {
            musicWidget.classList.remove('expanded');
        });

        // Sync Volumes
        function updateVolume(vol) {
            bgmPlayer.volume = vol;
            if (volumeSlider) volumeSlider.value = vol;
            if (tunerVolumeSlider) tunerVolumeSlider.value = vol;

            let iconName = 'bx bx-volume-full';
            if (vol === 0) {
                iconName = 'bx bx-volume-mute';
            } else if (vol < 0.4) {
                iconName = 'bx bx-volume-low';
            }
            if (volumeIcon) volumeIcon.className = iconName;
            if (tunerVolumeIcon) tunerVolumeIcon.className = iconName;
        }

        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                updateVolume(parseFloat(e.target.value));
            });
            volumeSlider.addEventListener('click', (e) => e.stopPropagation());
        }

        if (tunerVolumeSlider) {
            tunerVolumeSlider.addEventListener('input', (e) => {
                updateVolume(parseFloat(e.target.value));
            });
            tunerVolumeSlider.addEventListener('click', (e) => e.stopPropagation());
        }

        // Autoplay sequence triggers
        bgmPlayer.play().then(() => {
            initialUserInteraction = true;
            updatePlayerUI(true);
        }).catch(() => {
            console.log("Autoplay block active. Awaiting user interaction event.");
        });

        setTimeout(() => {
            if (!initialUserInteraction && bgmPlayer.paused) {
                if (pulsePrompt) pulsePrompt.classList.add('visible');
            }
        }, 2200);

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
        addAutoplayListeners();
    }
});
