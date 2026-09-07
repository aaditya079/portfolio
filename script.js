document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = document.getElementById('site-header');
    const progress = document.getElementById('scroll-progress');
    const menuToggle = document.getElementById('menu-toggle');
    const menuIcon = document.getElementById('menu-icon');
    const mobileNav = document.getElementById('mobile-nav');
    const modeSwitch = document.getElementById('mode-switch');
    const modeReadout = document.getElementById('mode-readout');
    const heroModeLabel = document.getElementById('hero-mode-label');
    const heroModeStatus = document.getElementById('hero-mode-status');
    const imageIndex = document.getElementById('image-index');
    const imageCaption = document.getElementById('image-caption');
    const modeFlash = document.getElementById('mode-flash');
    const copyButton = document.getElementById('copy-email-btn');
    const copyLabel = document.getElementById('copy-label');
    const copyIcon = document.getElementById('copy-icon');
    const toast = document.getElementById('toast');
    const email = 'aadityasrinivasan079@gmail.com';
    const cafeBgVideo = document.getElementById('cafe-bg-video');
    const bombBgVideo = document.getElementById('bomb-bg-video');

    const ensureVideoPlayback = (video) => {
        if (!video) return;
        if (video.paused) {
            video.play().catch(() => {
                // Background autoplay may be deferred by browser power settings
            });
        }
    };

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('visible');
        window.clearTimeout(showToast.timeout);
        showToast.timeout = window.setTimeout(() => toast.classList.remove('visible'), 2600);
    };

    // REZE_OS audio deck. Browsers may block unmuted autoplay, so the deck
    // attempts playback first and then exposes a clear user-gesture fallback.
    const musicDeck = document.getElementById('music-deck');
    const bgmPlayer = document.getElementById('bgm-player');
    const musicToggle = document.getElementById('music-toggle');
    const musicToggleIcon = document.getElementById('music-toggle-icon');
    const musicStatus = document.getElementById('music-status');
    const musicExpand = document.getElementById('music-expand');
    const musicExpandIcon = document.getElementById('music-expand-icon');
    const musicDeckControls = document.getElementById('music-deck-controls');
    const musicVolume = document.getElementById('music-volume');
    const musicVolumeLabel = document.getElementById('music-volume-label');
    const musicVolumeIcon = document.getElementById('music-volume-icon');

    if (musicDeck && bgmPlayer) {
        const savedVolume = Number.parseFloat(localStorage.getItem('reze-volume'));
        const startingVolume = Number.isFinite(savedVolume) ? Math.min(1, Math.max(0, savedVolume)) : 0.28;
        bgmPlayer.volume = startingVolume;
        if (musicVolume) musicVolume.value = String(startingVolume);

        const updateMusicUI = (isPlaying) => {
            musicDeck.classList.toggle('playing', isPlaying);
            musicDeck.classList.remove('autoplay-blocked');
            if (musicToggleIcon) musicToggleIcon.className = isPlaying ? 'bx bx-pause' : 'bx bx-play';
            if (musicToggle) {
                musicToggle.setAttribute('aria-pressed', String(isPlaying));
                musicToggle.setAttribute('aria-label', isPlaying ? 'Pause background music' : 'Play background music');
            }
            if (musicStatus) musicStatus.textContent = isPlaying ? 'REZE_OS AUDIO / PLAYING' : 'REZE_OS AUDIO / PAUSED';
        };

        const markAutoplayBlocked = () => {
            musicDeck.classList.add('autoplay-blocked');
            if (musicStatus) musicStatus.textContent = 'REZE_OS AUDIO / TAP TO START';
        };

        const playMusic = (announce = false) => {
            bgmPlayer.play().then(() => {
                updateMusicUI(true);
                if (announce) showToast('REZE_OS audio online');
            }).catch(() => markAutoplayBlocked());
        };

        const pauseMusic = () => {
            bgmPlayer.pause();
            updateMusicUI(false);
        };

        musicToggle?.addEventListener('click', () => {
            if (bgmPlayer.paused) playMusic(true);
            else pauseMusic();
        });

        musicExpand?.addEventListener('click', () => {
            const expanded = musicDeck.classList.toggle('expanded');
            musicExpand.setAttribute('aria-expanded', String(expanded));
            musicExpand.setAttribute('aria-label', expanded ? 'Hide audio controls' : 'Show audio controls');
            if (musicExpandIcon) musicExpandIcon.className = expanded ? 'bx bx-chevron-down' : 'bx bx-chevron-up';
            if (musicDeckControls) musicDeckControls.hidden = false;
        });

        musicVolume?.addEventListener('input', (event) => {
            const volume = Number.parseFloat(event.target.value);
            bgmPlayer.volume = volume;
            localStorage.setItem('reze-volume', String(volume));
            if (musicVolumeLabel) musicVolumeLabel.textContent = `${Math.round(volume * 100)}%`;
            if (musicVolumeIcon) musicVolumeIcon.className = volume === 0 ? 'bx bx-volume-mute' : volume < 0.45 ? 'bx bx-volume-low' : 'bx bx-volume-full';
        });

        bgmPlayer.addEventListener('play', () => updateMusicUI(true));
        bgmPlayer.addEventListener('pause', () => updateMusicUI(false));
        bgmPlayer.addEventListener('error', () => {
            if (musicStatus) musicStatus.textContent = 'REZE_OS AUDIO / FILE ERROR';
            showToast('Audio file could not be loaded');
        });

        // Try immediately. If blocked, retry on the first meaningful gesture.
        playMusic();
        const retryEvents = ['click', 'keydown'];
        const retryAutoplay = () => {
            if (bgmPlayer.paused) playMusic();
            retryEvents.forEach((eventName) => document.removeEventListener(eventName, retryAutoplay));
        };
        retryEvents.forEach((eventName) => document.addEventListener(eventName, retryAutoplay, { once: true, passive: true }));
    }

    const setMode = (mode, announce = true) => {
        const isBomb = mode === 'bomb';
        body.classList.toggle('bomb-mode', isBomb);
        body.classList.toggle('cafe-mode', !isBomb);
        localStorage.setItem('reze-mode', isBomb ? 'bomb' : 'cafe');

        if (modeSwitch) {
            modeSwitch.setAttribute('aria-checked', String(isBomb));
            modeSwitch.setAttribute('aria-label', isBomb ? 'Switch to Café Crossroads mode' : 'Switch to Bomb Devil mode');
        }
        if (modeReadout) modeReadout.textContent = isBomb ? 'BOMB_DEVIL / VOLATILE' : 'REZE_OS / NOMINAL';
        if (heroModeLabel) heroModeLabel.textContent = isBomb ? 'Bomb Devil' : 'Café Crossroads';
        if (heroModeStatus) heroModeStatus.textContent = isBomb ? 'BOMB_DEVIL / VOLATILE' : 'REZE_OS / NOMINAL';
        if (imageIndex) imageIndex.textContent = isBomb ? 'BOMB_VISUAL / 02' : 'REZE_VISUAL / 01';
        if (imageCaption) imageCaption.textContent = isBomb ? 'Bomb Devil — heat, risk, and sharper edges.' : 'Café Crossroads — soft edges, sharp systems.';

        const themeColor = document.querySelector('meta[name="theme-color"]');
        if (themeColor) themeColor.setAttribute('content', isBomb ? '#100706' : '#0b0715');

        if (isBomb) {
            ensureVideoPlayback(bombBgVideo);
        } else {
            ensureVideoPlayback(cafeBgVideo);
        }

        if (announce) {
            modeFlash?.classList.remove('active');
            if (modeFlash) {
                void modeFlash.offsetWidth;
                modeFlash.classList.add('active');
            }
            body.classList.remove('mode-shake');
            void body.offsetWidth;
            body.classList.add('mode-shake');
            window.setTimeout(() => body.classList.remove('mode-shake'), 460);
            showToast(isBomb ? 'Bomb Devil mode activated' : 'Café Crossroads mode restored');
        }
    };

    const savedMode = localStorage.getItem('reze-mode');
    setMode(savedMode === 'bomb' ? 'bomb' : 'cafe', false);

    // Resume video playback if tab re-enters focus
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            if (body.classList.contains('bomb-mode')) {
                ensureVideoPlayback(bombBgVideo);
            } else {
                ensureVideoPlayback(cafeBgVideo);
            }
        }
    });

    const toggleMode = () => {
        setMode(body.classList.contains('bomb-mode') ? 'cafe' : 'bomb');
    };

    modeSwitch?.addEventListener('click', toggleMode);
    modeSwitch?.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleMode();
        }
    });

    const updateScrollState = () => {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const percent = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        if (progress) progress.style.width = `${percent}%`;
        header?.classList.toggle('scrolled', scrollTop > 18);
    };

    updateScrollState();
    window.addEventListener('scroll', updateScrollState, { passive: true });

    const closeMobileNav = () => {
        mobileNav?.classList.remove('open');
        menuToggle?.setAttribute('aria-expanded', 'false');
        menuToggle?.setAttribute('aria-label', 'Open navigation');
        if (menuIcon) menuIcon.className = 'bx bx-menu';
    };

    menuToggle?.addEventListener('click', () => {
        const isOpen = mobileNav?.classList.toggle('open') ?? false;
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        if (menuIcon) menuIcon.className = isOpen ? 'bx bx-x' : 'bx bx-menu';
    });

    mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNav));
    window.addEventListener('resize', () => {
        if (window.innerWidth > 700) closeMobileNav();
    });

    const navLinks = [...document.querySelectorAll('.desktop-nav .nav-link, .mobile-nav .nav-link')];
    const sections = [...document.querySelectorAll('main section[id]')];
    const updateActiveLink = () => {
        const current = sections.reduce((active, section) => {
            return window.scrollY >= section.offsetTop - 170 ? section.id : active;
        }, 'home');
        navLinks.forEach((link) => {
            const isActive = link.getAttribute('href') === `#${current}`;
            link.classList.toggle('active', isActive);
        });
    };
    updateActiveLink();
    window.addEventListener('scroll', updateActiveLink, { passive: true });

    copyButton?.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(email);
            if (copyLabel) copyLabel.textContent = 'Email copied';
            if (copyIcon) copyIcon.className = 'bx bx-check';
            showToast('Email copied to clipboard');
            window.setTimeout(() => {
                if (copyLabel) copyLabel.textContent = 'Copy email';
                if (copyIcon) copyIcon.className = 'bx bx-copy';
            }, 2200);
        } catch {
            showToast('Select the email address to copy it');
        }
    });

    const revealItems = document.querySelectorAll('[data-reveal]');
    revealItems.forEach((item) => {
        const delay = item.dataset.delay;
        if (delay) item.style.setProperty('--delay', `${delay}ms`);
    });

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    } else if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
        revealItems.forEach((item) => observer.observe(item));
    } else {
        revealItems.forEach((item) => item.classList.add('is-visible'));
    }

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', (event) => {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        });
    });
});
