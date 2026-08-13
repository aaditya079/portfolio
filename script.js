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

    const showToast = (message) => {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('visible');
        window.clearTimeout(showToast.timeout);
        showToast.timeout = window.setTimeout(() => toast.classList.remove('visible'), 2600);
    };

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
