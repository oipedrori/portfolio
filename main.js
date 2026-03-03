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
    /* 4. Sticky Scroll for Projetos                        */
    /* ---------------------------------------------------- */
    function updateStickyCards() {
        const headerOffset = 100; // Espaço do navbar
        const cards = document.querySelectorAll('.projeto');

        cards.forEach(card => {
            const cardHeight = card.offsetHeight;
            const windowHeight = window.innerHeight;

            if (cardHeight > windowHeight - headerOffset) {
                // Cartão maior que a tela: gruda apenas quando o final do cartão atingir o final da tela
                const topOffset = windowHeight - cardHeight;
                card.style.top = `${topOffset}px`;
            } else {
                // Cartão menor ou igual à tela: gruda logo abaixo do navbar
                card.style.top = `${headerOffset}px`;
            }
        });
    }

    // Atualiza nos eventos de resize e load da página
    window.addEventListener('resize', updateStickyCards);
    window.addEventListener('load', () => {
        updateStickyCards();
        setTimeout(updateStickyCards, 500); // Garante o cálculo após carregar imagens
    });
    // Executa imediatamente no DOM load
    updateStickyCards();

    /* ---------------------------------------------------- */
    /* 5. Sticky Scroll Blur Effect                         */
    /* ---------------------------------------------------- */
    let isTicking = false;

    function updateStickyBlur() {
        const cards = document.querySelectorAll('.projeto');
        const headerOffset = 100;
        const windowHeight = window.innerHeight;
        // Detecta se é mobile para desativar o filtro de Blur pesado que causa engasgos
        const isMobile = window.innerWidth <= 768;

        for (let i = 0; i < cards.length; i++) {
            const currentCard = cards[i];

            // Se for o último cartão, ele nunca é borrado por outro
            if (i === cards.length - 1) {
                currentCard.style.filter = 'blur(0px)';
                currentCard.style.transform = 'scale3d(1, 1, 1) translateZ(0)';
                currentCard.style.opacity = '1';
                continue;
            }

            const nextCard = cards[i + 1];
            const nextTop = nextCard.getBoundingClientRect().top;

            // O próximo cartão começa a aparecer a partir do fundo da tela
            // E cobre totalmente "em cima" quando nextTop <= headerOffset
            if (nextTop <= windowHeight && nextTop >= headerOffset) {
                const progress = 1 - ((nextTop - headerOffset) / (windowHeight - headerOffset));

                // Aplicar os efeitos proporcionais
                const blurValue = progress * 8; // Restaurado Blur em todas as telas
                currentCard.style.filter = `blur(${blurValue}px)`;
                currentCard.style.transform = `scale3d(${1 - (progress * 0.05)}, ${1 - (progress * 0.05)}, 1) translateZ(0)`; // Escala reduz até 0.95
                currentCard.style.opacity = '1'; // Sem transparência!
            } else if (nextTop < headerOffset) {
                // Totalmente coberto pelo próximo cartão
                const blurValue = 8;
                currentCard.style.filter = `blur(${blurValue}px)`;
                currentCard.style.transform = `scale3d(0.95, 0.95, 1) translateZ(0)`;
                currentCard.style.opacity = `1`;
            } else {
                // Próximo cartão ainda não chegou
                currentCard.style.filter = `blur(0px)`;
                currentCard.style.transform = `scale3d(1, 1, 1) translateZ(0)`;
                currentCard.style.opacity = `1`;
            }
        }
        isTicking = false;
    }

    // Ouvinte para atualizar os efeitos em tempo real durante o scroll com otimização GPU
    window.addEventListener('scroll', () => {
        if (!isTicking) {
            window.requestAnimationFrame(updateStickyBlur);
            isTicking = true;
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        if (!isTicking) {
            window.requestAnimationFrame(updateStickyBlur);
            isTicking = true;
        }
    });

    updateStickyBlur(); // Call once initially
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

    /* ---------------------------------------------------- */
    /* 7. Section Navigation Cues (Bottom 30%)              */
    /* ---------------------------------------------------- */
    // Juntar o Hero e as seções de projetos em uma NodeList ou Array
    const navSections = [document.getElementById('hero'), ...document.querySelectorAll('.projeto')];
    const sectionIds = navSections.map(s => s.id);

    // Create the custom cursor element
    const customCursor = document.createElement('div');
    customCursor.classList.add('custom-nav-cursor', 'down'); // Start facing down by default
    customCursor.innerHTML = `<svg viewBox="0 0 36 36"><path></path></svg>`;
    document.body.appendChild(customCursor);

    let isHoveringNavArea = false;

    // Move the custom cursor with the mouse
    document.addEventListener('mousemove', (e) => {
        if (isHoveringNavArea) {
            customCursor.style.left = `${e.clientX}px`;
            customCursor.style.top = `${e.clientY}px`;
        }
    });

    navSections.forEach((section, index) => {
        if (!section) return; // Segurança

        section.addEventListener('mousemove', (e) => {
            // Ignorar elementos clicáveis (botões, abas, links, etc.)
            const isClickable = e.target.closest('a, button, iframe, .tab-btn, .device-btn, .theme-toggle');
            if (isClickable) {
                isHoveringNavArea = false;
                customCursor.classList.remove('active');
                document.body.classList.remove('hide-native-cursor');
                section.dataset.navHover = '';
                return;
            }

            const rect = section.getBoundingClientRect();
            // A posição real do mouse dentro do bloco visível
            const y = e.clientY - rect.top;
            const height = rect.height;

            const isBottomMargin = y > height * 0.7;

            let navHover = '';

            // Next section se não for a última e se o mouse estiver embaixo
            if (isBottomMargin && index < navSections.length - 1) {
                navHover = 'next';
            }

            if (navHover) {
                isHoveringNavArea = true;
                customCursor.classList.add('active');
                document.body.classList.add('hide-native-cursor');
                section.dataset.navHover = navHover;
            } else {
                isHoveringNavArea = false;
                customCursor.classList.remove('active');
                document.body.classList.remove('hide-native-cursor');
                section.dataset.navHover = '';
            }
        });

        section.addEventListener('mouseleave', () => {
            isHoveringNavArea = false;
            customCursor.classList.remove('active');
            document.body.classList.remove('hide-native-cursor');
            section.dataset.navHover = '';
        });

        section.addEventListener('click', (e) => {
            const navHover = section.dataset.navHover;
            if (navHover) {
                const isClickable = e.target.closest('a, button, iframe, .tab-btn, .device-btn, .theme-toggle');
                if (!isClickable) {
                    // Hide cursor immediately on click to prevent stuttering
                    isHoveringNavArea = false;
                    customCursor.classList.remove('active');
                    document.body.classList.remove('hide-native-cursor');
                    section.dataset.navHover = '';

                    const headerOffset = 100; // Espaço do navbar (from updateStickyCards)

                    // Helper para achar o offset absoluto ignorando o efeito sticky visual
                    const getAbsoluteTop = (el) => {
                        let top = 0;
                        while (el) {
                            top += el.offsetTop;
                            el = el.offsetParent;
                        }
                        return top;
                    };

                    if (navHover === 'next' && index < navSections.length - 1) {
                        const targetElement = document.getElementById(sectionIds[index + 1]);
                        if (targetElement) {
                            const topOffset = getAbsoluteTop(targetElement) - headerOffset;
                            window.scrollTo({
                                top: topOffset,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            }
        });
    });

});
