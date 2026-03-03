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
        document.documentElement.setAttribute('data-theme', theme);
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
        const currentTheme = document.documentElement.getAttribute('data-theme');
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

    /* ---------------------------------------------------- */
    /* 8. Magnetic Hover Elements                           */
    /* ---------------------------------------------------- */
    // Apenas botões da hero e tags da bio terão magnetismo, navbar não.
    const magneticElements = document.querySelectorAll('.hero .btn, .sobre-content .tag');
    magneticElements.forEach(elem => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            elem.style.transition = 'transform 0.1s ease-out';
            elem.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        });

        elem.addEventListener('mouseleave', () => {
            elem.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
            elem.style.transform = `translate(0px, 0px)`;

            setTimeout(() => {
                elem.style.transition = '';
                elem.style.transform = '';
            }, 500);
        });
    });

    /* ---------------------------------------------------- */
    /* 9. Interactive Grid (Hero)                           */
    /* ---------------------------------------------------- */
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            // Salva coordenadas como variáveis CSS
            heroSection.style.setProperty('--mouse-x', `${x}px`);
            heroSection.style.setProperty('--mouse-y', `${y}px`);
        });
    }

    /* ---------------------------------------------------- */
    /* 10. 3D Tilt Effect on Bento Cards                    */
    /* ---------------------------------------------------- */
    const tiltCards = document.querySelectorAll('.bento-card, .ps-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -4; // max tilt degrees
            const rotateY = ((x - centerX) / centerX) * 4;

            card.style.transition = 'transform 0.1s ease-out, box-shadow 0.1s ease-out';
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.zIndex = '10'; // Elevando proximo card enquanto hover (tilt effect over others)
        });

        card.addEventListener('mouseleave', () => {
            card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.zIndex = '1';

            setTimeout(() => {
                card.style.transition = '';
                card.style.transform = '';
                card.style.zIndex = '';
            }, 500);
        });
    });

    // Sensor de Orientação para Mobile (Giroscópio)
    // Permite que os cards inclinem fisicamente ao mover o celular
    let isMobileDevice = false;

    // Pequeno truque para detectar se é um dispositivo touch (provavelmente mobile/tablet)
    if (window.matchMedia("(pointer: coarse)").matches || 'ontouchstart' in window) {
        isMobileDevice = true;
    }

    if (isMobileDevice) {
        // As vezes iOS pede permissão explícita para o giroscópio, mas em muitos Androids/iOS mais antigos funciona direto.
        // O efeito será contínuo em todos os tiltCards visíveis na tela
        window.addEventListener('deviceorientation', (e) => {
            if (!e.beta || !e.gamma) return;

            // beta: tilt front/back [-180, 180] -> limitaremos para o efeito
            // gamma: tilt left/right [-90, 90]

            // Limitando a inclinação para algo confortável visualmente (max 10-15 graus dependendo de como o usuário segura)
            // Valores bases ideais (celular na mão levemente inclinado para cima)
            let xTilt = (e.beta - 45) / 5; // Assumindo base de 45 graus na mão 
            let yTilt = e.gamma / 4;

            // Teto de rotação para evitar que o card vire de cabeça para baixo
            xTilt = Math.max(-8, Math.min(8, xTilt));
            yTilt = Math.max(-10, Math.min(10, yTilt));

            tiltCards.forEach(card => {
                // Checar se o card está visível antes de animar para poupar bateria/GPU
                const rect = card.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    card.style.transform = `perspective(1000px) rotateX(${-xTilt}deg) rotateY(${yTilt}deg)`;
                    card.style.boxShadow = `${-yTilt * 2}px ${xTilt * 2 + 10}px 25px rgba(0, 0, 0, 0.1)`;
                }
            });
        });
    }

});
