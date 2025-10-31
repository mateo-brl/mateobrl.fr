document.addEventListener('DOMContentLoaded', function() {
    // Variables - Cache des éléments DOM
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-list');
    const navLinks = document.querySelectorAll('.nav-list a[data-page]');
    const ctaButtons = document.querySelectorAll('.cta-button[data-target]');
    const pages = document.querySelectorAll('.page');

    // Gestion optimisée du scroll avec throttle
    let scrollTimeout;
    let lastScrollY = 0;

    const handleScroll = () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 50 && lastScrollY <= 50) {
            header.classList.add('scrolled');
        } else if (currentScrollY <= 50 && lastScrollY > 50) {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(handleScroll);
    }, { passive: true });

    // Gestion du menu mobile avec accessibilité
    menuToggle.addEventListener('click', function() {
        const isActive = menuToggle.classList.toggle('active');
        navList.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        // Accessibilité
        menuToggle.setAttribute('aria-expanded', isActive);
        menuToggle.setAttribute('aria-label', isActive ? 'Fermer le menu' : 'Ouvrir le menu principal');
    });

    // Gestion des pages SPA (Single Page Application)
    function showPage(pageId) {
        // Masquer toutes les pages
        pages.forEach(page => page.classList.remove('active'));

        // Afficher la page sélectionnée
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Mettre à jour les liens actifs
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-page') === pageId);
        });

        // Fermer le menu mobile si ouvert
        if (menuToggle.classList.contains('active')) {
            menuToggle.classList.remove('active');
            navList.classList.remove('active');
            document.body.classList.remove('menu-open');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', 'Ouvrir le menu principal');
        }

        // Défiler vers le haut avec smooth scroll
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Délégation d'événements pour la navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            if (pageId) {
                showPage(pageId);
            }
        });
    });

    // Gestion des boutons d'action (CTA)
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-target');
            if (targetPage) {
                showPage(targetPage);
            }
        });
    });
    
    // Animation de fond Matrix (effet cybersécurité)
    const matrixBackground = document.querySelector('.matrix-background');

    // Configuration
    const isMobile = window.innerWidth <= 768;

    // Créer le canvas uniquement si pas mobile
    if (!isMobile && matrixBackground) {
        const canvas = document.createElement('canvas');
        matrixBackground.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Caractères pour l'effet "Matrix"
        const chars = '01';
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);
        const drops = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        let matrixInterval;

        function drawMatrix() {
            // Semi-transparence pour créer l'effet de fade
            ctx.fillStyle = 'rgba(10, 25, 47, 0.07)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#00ff9d';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Caractère aléatoire
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Réinitialiser quand les caractères atteignent le bas ou aléatoirement
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        }

        // Démarrer l'animation
        matrixInterval = setInterval(drawMatrix, 50);

        // Gestion du redimensionnement
        window.addEventListener('resize', function() {
            if (window.innerWidth <= 768) {
                clearInterval(matrixInterval);
                canvas.remove();
            } else {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }
        });
    }
});
