document.addEventListener('DOMContentLoaded', () => {
    /* ---------------------------------------------------- */
    /* 1. Theme Toggle (Dark/Light Mode)                    */
    /* ---------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to apply theme
    function applyTheme(theme) {
        document.body.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }

    // Initial load
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(systemPrefersDark.matches ? 'dark' : 'light');
    }

    // Listen to system changes dynamically
    systemPrefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    // Toggle theme on click
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';

        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    /* ---------------------------------------------------- */
    /* 2. Navbar Scroll Effect                              */
    /* ---------------------------------------------------- */
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    /* ---------------------------------------------------- */
    /* 3. Fade-In Animation on Scroll                       */
    /* ---------------------------------------------------- */
    const fadeElements = document.querySelectorAll('.fade-in');

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once faded in
                // fadeObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15, // Trigger when 15% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Slightly before it fully enters viewport
    });

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Trigger visible immediately for elements already in viewport (e.g. Hero)
    setTimeout(() => {
        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom >= 0) {
                element.classList.add('visible');
            }
        });
    }, 100);


    /* ---------------------------------------------------- */
    /* 6. Showcase Interativo (Projeto 2)                   */
    /* ---------------------------------------------------- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const deviceBtns = document.querySelectorAll('.device-btn');
    const browserWindow = document.getElementById('browserWindow');
    const mockupUrl = document.getElementById('mockupUrl');
    const mockupImgs = document.querySelectorAll('.mockup-img');

    // Estado Atual
    let currentCampaign = 'natal'; // natal | pascoa
    let currentDevice = 'desktop'; // desktop | mobile

    const urls = {
        'natal': 'br.cvglobal.co/colecao-natal',
        'pascoa': 'br.cvglobal.co/da-cruz-a-luz'
    };

    function updateShowcase() {
        // Atualizar URL Fictícia
        mockupUrl.textContent = urls[currentCampaign];

        // Atualizar Dimensões do Browser (Animado via CSS transiton width)
        if (currentDevice === 'mobile') {
            browserWindow.className = `browser-mockup mobile-mode`;
        } else {
            browserWindow.className = `browser-mockup desktop-mode`;
        }

        // Esconder todas imagens
        mockupImgs.forEach(img => img.classList.remove('active'));

        // Mostrar apenas a imagem correta cruzando a Tab + Viewport
        const targetId = `img-${currentCampaign}-${currentDevice}`;
        const targetImg = document.getElementById(targetId);
        if (targetImg) {
            targetImg.classList.add('active');

            // Forçar o scroll ir pro topo sempre que mudar a imagem ou o device
            const viewport = document.querySelector('.browser-viewport');
            if (viewport) viewport.scrollTop = 0;
        }
    }

    // Ouvintes de Clique: Abas de Campanhas
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCampaign = btn.dataset.campaign;
            updateShowcase();
        });
    });

    // Ouvintes de Clique: Devices (Desktop/Mobile)
    deviceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            deviceBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentDevice = btn.dataset.device;
            updateShowcase();
        });
    });

    // Inicialização
    if (tabBtns.length > 0) {
        // Checar se é mobile no load para definir o device padrão
        if (window.innerWidth <= 768) {
            currentDevice = 'mobile';
            deviceBtns.forEach(btn => {
                if (btn.dataset.device === 'mobile') {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        }
        updateShowcase();
    }

});
