// system clock
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

// choker toggle detonation
const chokerToggle = document.getElementById('choker-toggle');
const flashOverlay = document.getElementById('detonation-flash');
const body = document.body;
let isBombMode = false;

function triggerDetonation() {
    if (!flashOverlay) return;

    // screen flash
    flashOverlay.classList.remove('flash-active');
    void flashOverlay.offsetWidth;
    flashOverlay.classList.add('flash-active');

    // screen shake
    body.classList.remove('shake-active');
    void body.offsetWidth;
    body.classList.add('shake-active');

    setTimeout(() => {
        body.classList.remove('shake-active');
    }, 550);

    setTimeout(() => {
        flashOverlay.classList.remove('flash-active');
    }, 800);

    // mode swap
    setTimeout(() => {
        isBombMode = !isBombMode;
        const statusEl = document.querySelector('.system-status');
        
        if (isBombMode) {
            body.classList.remove('cafe-mode');
            body.classList.add('bomb-mode');
            if (statusEl) statusEl.textContent = '// STATE: VOLATILE';
            printLine('>>> WARNING: BOMB_DEVIL_CORE ACTIVE. TEMPERATURE CRITICAL.', 'error');
        } else {
            body.classList.remove('bomb-mode');
            body.classList.add('cafe-mode');
            if (statusEl) statusEl.textContent = '// STATE: NOMINAL';
            printLine('>>> Core cooled. Reze-OS stabilized in Cafe Crossroads mode.', 'system');
        }
    }, 150);
}

if (chokerToggle) {
    chokerToggle.addEventListener('click', triggerDetonation);
}

// terminal engine
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
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

// console boot logs
const bootLogs = [
    "REZE-OS [Version 1.9.2026]",
    "(c) Soviet intelligence agency. All rights reserved.",
    "",
    "Initializing neural memory buffers... OK",
    "Linking local database to SRM Madurai campus... SUCCESS",
    "Fetching project directories... Found 3 items",
    "Opening guest shell port...",
    "READY.",
    "Type 'help' to display tactical command protocols."
];

let bootIndex = 0;
function playBootSequence() {
    if (bootIndex < bootLogs.length) {
        printLine(bootLogs[bootIndex], bootLogs[bootIndex].startsWith('(') ? 'system' : '');
        bootIndex++;
        setTimeout(playBootSequence, 120);
    }
}
playBootSequence();

// shell command parser
function processCommand(cmdText) {
    const rawCmd = cmdText.trim();
    if (!rawCmd) return;

    printLine(`guest@reze_os:~$ ${rawCmd}`, 'command');

    cmdHistory.push(rawCmd);
    historyIndex = cmdHistory.length;

    const cmd = rawCmd.toLowerCase().split(' ')[0];

    switch (cmd) {
        case 'help':
            printLine("Available tactical protocols:");
            printLine("  about      - Personal background file");
            printLine("  skills     - Technical competencies readout");
            printLine("  projects   - Summary of deep field operations");
            printLine("  resume     - Download classified engineer PDF");
            printLine("  detonate   - Trigger emergency volatlity shockwave");
            printLine("  clear      - Wipe shell buffer");
            break;
        case 'about':
            printLine("SUBJECT IDENTITY: AADITYA SRINIVASAN");
            printLine("ROLE: 2nd-year AI & Data Science B.Tech Student at SRM Madurai.");
            printLine("NOTES: Developer who builds practical offline tools and pipelines. I don't use AI to write generic, empty templates. I like low-level APIs, data manipulation, and building neat CLIs.");
            break;
        case 'skills':
            printLine("// TECHNICAL COMPETENCY CHART");
            printLine("Languages: [====================] Python, SQL, C#, Java, JS");
            printLine("AI/ML:     [==================  ] scikit-learn, Pandas, NumPy");
            printLine("Web/Infra: [===============     ] Django, Flask, Streamlit, Git");
            break;
        case 'projects':
            printLine("// DETAILED OPERATIONS SPOTLIGHT");
            printLine("");
            printLine("1. ImgSeek (Standout Offline OCR Gallery)");
            printLine("   - Tech: C#, .NET, Native WinRT OCR Engine");
            printLine("   - Challenge: Searching manually through Discord receipt backups was a massive waste of human life.");
            printLine("   - Built: High-speed local folder indexer. OCR-scans screenshots and auto-generates a clean HTML lightbox gallery of all matching image queries. Runs 100% offline, zero APIs.");
            printLine("");
            printLine("2. Steam Games EDA & Dashboard");
            printLine("   - Tech: Python, Flask, Pandas, ApexCharts");
            printLine("   - Challenge: Discovered that a popular Kaggle CSV database had a comma-shift pricing bug that skewed pricing-to-rating correlations in other studies.");
            printLine("   - Built: Hot-fixed the parsing bug, built a Flask backend to verify the corrected data on 114k+ games, and rendered interactive ApexCharts dashboards.");
            printLine("");
            printLine("3. GitSynth (AI CLI Resolves)");
            printLine("   - Tech: Node.js, Claude API, Git CLI");
            printLine("   - Built: CLI tool that dynamically parses git conflict markers and uses LLMs to synthesize clean, context-aware merge resolutions on the fly.");
            break;
        case 'resume':
            printLine("Opening transfer link to Aaditya_Srinivasan_Resume.pdf...");
            const downloadLink = document.getElementById('download-btn');
            if (downloadLink) {
                downloadLink.click();
                printLine("Classified document transfer initiated.", 'system');
            } else {
                window.open('Aaditya_Srinivasan_Resume.pdf', '_blank');
                printLine("PDF opened in new viewport.", 'system');
            }
            break;
        case 'detonate':
            printLine("Pulling choker detonator pin...", 'error');
            triggerDetonation();
            break;
        case 'clear':
            if (terminalOutput) {
                terminalOutput.innerHTML = '';
            }
            break;
        default:
            printLine(`Shell error: protocol '${cmd}' not recognized. Type 'help' for directory lists.`, 'error');
    }
}

if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const inputVal = terminalInput.value;
            processCommand(inputVal);
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

    // force focus on shell container click
    const termPanel = document.querySelector('.terminal-panel');
    if (termPanel) {
        termPanel.addEventListener('click', () => {
            terminalInput.focus();
        });
    }
}

// BGM tuner tape player
const bgmPlayer = document.getElementById('bgm-player');
const playBtn = document.getElementById('music-play-btn');
const playIcon = document.getElementById('music-play-icon');
const volumeSlider = document.getElementById('music-volume-slider');
const volumeIcon = document.getElementById('music-volume-icon');
const discToggle = document.getElementById('music-disc-toggle');
const tunerDeck = document.querySelector('.tuner-deck');
const pulsePrompt = document.getElementById('music-pulse-prompt');

if (tunerDeck && bgmPlayer && playBtn) {
    bgmPlayer.volume = 0.5;
    let isPlaying = false;
    let initialUserInteraction = false;
    
    function togglePlayback() {
        if (isPlaying) {
            bgmPlayer.pause();
            isPlaying = false;
            tunerDeck.classList.remove('playing');
            playIcon.className = 'bx bx-play';
        } else {
            bgmPlayer.play().then(() => {
                isPlaying = true;
                initialUserInteraction = true;
                tunerDeck.classList.add('playing');
                playIcon.className = 'bx bx-pause';
                pulsePrompt.classList.remove('visible');
            }).catch(err => {
                console.log("Audio lock: ", err);
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

    // autoplay triggers
    bgmPlayer.play().then(() => {
        isPlaying = true;
        initialUserInteraction = true;
        tunerDeck.classList.add('playing');
        playIcon.className = 'bx bx-pause';
        pulsePrompt.classList.remove('visible');
    }).catch(() => {});
    
    setTimeout(() => {
        if (!initialUserInteraction && bgmPlayer.paused) {
            pulsePrompt.classList.add('visible');
        }
    }, 2800);
    
    function triggerAutoplayOnInteraction() {
        if (!initialUserInteraction) {
            bgmPlayer.play().then(() => {
                isPlaying = true;
                initialUserInteraction = true;
                tunerDeck.classList.add('playing');
                playIcon.className = 'bx bx-pause';
                pulsePrompt.classList.remove('visible');
                removeAutoplayListeners();
            }).catch(() => {});
        }
    }

    const autoplayEvents = ['click', 'keydown', 'touchstart', 'pointerdown'];
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

// ambient dual engine canvas particles
const canvas = document.getElementById('ambient-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let particleCount = 35;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        particleCount = window.innerWidth < 768 ? 15 : 35;
        initParticles();
    }
    window.addEventListener('resize', resizeCanvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    particleCount = window.innerWidth < 768 ? 15 : 35;

    class Particle {
        constructor() {
            this.reset(true);
        }
        reset(initial = false) {
            this.radius = Math.random() * 3 + 1.5;
            if (isBombMode) {
                // rising sparks
                this.x = Math.random() * canvas.width;
                this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
                this.vx = (Math.random() - 0.5) * 1.2;
                this.vy = -(Math.random() * 1.5 + 0.6);
                this.hue = Math.random() > 0.5 ? Math.random() * 12 + 10 : Math.random() * 15 + 30; // red/orange
                this.alpha = Math.random() * 0.6 + 0.3;
                this.decay = Math.random() * 0.006 + 0.002;
            } else {
                // falling lilac code streams
                this.x = Math.random() * canvas.width;
                this.y = initial ? Math.random() * canvas.height : -10;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = Math.random() * 1.2 + 0.6;
                this.hue = 280; // violet code
                this.alpha = Math.random() * 0.4 + 0.15;
            }
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            if (isBombMode) {
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${this.hue}, 100%, 55%, ${this.alpha})`;
                ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, 0.8)`;
                ctx.shadowBlur = 8;
                ctx.fill();
            } else {
                // draw tiny binary numbers falling
                ctx.font = `${this.radius * 3 + 6}px monospace`;
                ctx.fillStyle = `hsla(${this.hue}, 80%, 75%, ${this.alpha})`;
                const digit = Math.random() > 0.5 ? "1" : "0";
                ctx.fillText(digit, this.x, this.y);
            }
            ctx.restore();
        }
        update() {
            if (isBombMode) {
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= this.decay;
                if (this.alpha <= 0 || this.y < -10) this.reset();
            } else {
                this.x += this.vx;
                this.y += this.vy;
                if (this.y > canvas.height + 10) this.reset();
            }
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);

    if (chokerToggle) {
        chokerToggle.addEventListener('click', () => {
            particles.forEach(p => p.reset());
        });
    }
}
