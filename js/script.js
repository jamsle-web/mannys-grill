(function() {
    'use strict';

    /* ============================================
       VARIABLES GLOBALES
       ============================================ */
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var track = document.getElementById('grillTrack');

    /* ============================================
       LOADING
       ============================================ */
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.getElementById('loader').classList.add('hidden');
            document.body.classList.remove('loading');
        }, 2400);
    });

    /* ============================================
       NAVBAR SCROLL
       ============================================ */
    var navbar = document.getElementById('navbar');
    var backToTop = document.getElementById('backToTop');

    function onScroll() {
        var y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 60);
        backToTop.classList.toggle('visible', y > 800);
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    /* ============================================
       MOBILE MENU
       ============================================ */
    var toggle = document.querySelector('.nav-toggle');
    var mobileMenu = document.getElementById('mobileMenu');

    toggle.addEventListener('click', function() {
        var isOpen = mobileMenu.classList.toggle('open');
        toggle.classList.toggle('active', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            mobileMenu.classList.remove('open');
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        });
    });

    /* ============================================
       HERO PARALLAX
       ============================================ */
    var heroBg = document.getElementById('heroBg');
    var hero = document.getElementById('hero');

    if (!prefersReduced) {
        hero.addEventListener('mousemove', function(e) {
            var x = (e.clientX / window.innerWidth - 0.5) * 20;
            var y = (e.clientY / window.innerHeight - 0.5) * 20;
            heroBg.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
        });

        hero.addEventListener('mouseleave', function() {
            heroBg.style.transform = 'translate(0, 0)';
        });

        window.addEventListener('scroll', function() {
            var scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = 'translateY(' + (scrolled * 0.3) + 'px)';
                hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.6;
            }
        }, { passive: true });
    }

    /* ============================================
       REVEAL ON SCROLL
       ============================================ */
    var revealElements = document.querySelectorAll('.reveal, .reveal-blur, .stagger');

    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function(el) {
        revealObserver.observe(el);
    });

    /* ============================================
       SIGNATURE BG SCALE
       ============================================ */
    var signatureBg = document.getElementById('signatureBg');
    var signatureSection = document.getElementById('signature');

    var sigObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                signatureBg.classList.add('in-view');
                signatureSection.querySelectorAll('.reveal-blur, .signature-fade').forEach(function(el) {
                    el.classList.add('visible');
                });
            }
        });
    }, { threshold: 0.3 });

    sigObserver.observe(signatureSection);

    /* ============================================
       CTA BG REVEAL
       ============================================ */
    var ctaBg = document.getElementById('ctaBg');
    var ctaSection = document.getElementById('cta');

    var ctaObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                ctaBg.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    ctaObserver.observe(ctaSection);

    /* ============================================
       MENU TABS
       ============================================ */
    var menuTabs = document.querySelectorAll('.menu-tab');
    var menuCategories = document.querySelectorAll('.menu-category');

    menuTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            var target = document.getElementById(targetId);

            menuTabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');

            if (target) {
                var offset = 140;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    var menuObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var id = entry.target.id;
                menuTabs.forEach(function(t) {
                    t.classList.toggle('active', t.getAttribute('data-target') === id);
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-140px 0px -50% 0px'
    });

    menuCategories.forEach(function(cat) {
        menuObserver.observe(cat);
    });

    /* ============================================
       HORIZONTAL DRAG SCROLL
       ============================================ */
    var isDown = false;
    var startX, scrollLeft;

    track.addEventListener('mousedown', function(e) {
        isDown = true;
        track.classList.add('grabbing');
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
    });

    track.addEventListener('mouseleave', function() {
        isDown = false;
        track.classList.remove('grabbing');
    });

    track.addEventListener('mouseup', function() {
        isDown = false;
        track.classList.remove('grabbing');
    });

    track.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        var x = e.pageX - track.offsetLeft;
        var walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
    });

    var touchStartX = 0;
    var touchScrollLeft = 0;

    track.addEventListener('touchstart', function(e) {
        touchStartX = e.touches[0].pageX;
        touchScrollLeft = track.scrollLeft;
    }, { passive: true });

    track.addEventListener('touchmove', function(e) {
        var x = e.touches[0].pageX;
        var walk = (touchStartX - x) * 1.5;
        track.scrollLeft = touchScrollLeft + walk;
    }, { passive: true });

    /* ============================================
       BACK TO TOP
       ============================================ */
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ============================================
       3D ORB PARALLAX + MOUSE DEPTH
       ============================================ */
    if (!prefersReduced) {
        var orbContainer = document.getElementById('orbContainer');
        var orbSection = document.getElementById('experience-3d');

        window.addEventListener('scroll', function() {
            var rect = orbSection.getBoundingClientRect();
            var progress = 1 - (rect.top / window.innerHeight);
            if (progress > -0.5 && progress < 1.5) {
                var translateY = (progress - 0.5) * 60;
                var rotate = (progress - 0.5) * 12;
                orbContainer.style.transform =
                    'translateY(' + translateY + 'px) rotate(' + rotate + 'deg)';
            }
        }, { passive: true });

        if (window.matchMedia('(hover: hover)').matches) {
            orbSection.addEventListener('mousemove', function(e) {
                var rect = orbSection.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width - 0.5;
                var y = (e.clientY - rect.top) / rect.height - 0.5;
                var tiltX = y * 12;
                var tiltY = x * 12;
                orbContainer.style.transform =
                    'perspective(900px) rotateX(' + tiltX + 'deg) rotateY(' + tiltY + 'deg)';
            });

            orbSection.addEventListener('mouseleave', function() {
                orbContainer.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
            });
        }
    }

    /* ============================================
       MAGNETIC BUTTON (Desktop only)
       ============================================ */
    if (!prefersReduced && window.matchMedia('(hover: hover)').matches) {
        document.querySelectorAll('.btn-primary').forEach(function(btn) {
            btn.addEventListener('mousemove', function(e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
            });

            btn.addEventListener('mouseleave', function() {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    /* ============================================
       SMOOTH ANCHOR SCROLL
       ============================================ */
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var offset = 80;
                var top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* ============================================
       AUTO-SCROLL CARRUSEL
       ============================================ */
    var autoScrollPaused = false;
    var autoScrollSpeed = 0.5;

    function autoScrollLoop() {
        if (!autoScrollPaused && track) {
            track.scrollLeft += autoScrollSpeed;

            if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 1) {
                track.scrollLeft = 0;
            }
        }
        requestAnimationFrame(autoScrollLoop);
    }

    if (!prefersReduced && window.matchMedia('(min-width: 769px)').matches) {
        requestAnimationFrame(autoScrollLoop);
    }

    ['mouseenter', 'touchstart', 'mousedown'].forEach(function(evt) {
        track.addEventListener(evt, function() { autoScrollPaused = true; });
    });

    ['mouseleave', 'touchend', 'mouseup'].forEach(function(evt) {
        track.addEventListener(evt, function() {
            setTimeout(function() { autoScrollPaused = false; }, 1500);
        });
    });

    /* ============================================
       MODAL DE PLATO
       ============================================ */
    var dishesData = {
        costillas: {
            num: '01 — Signature',
            title: 'Costillas de Cerdo',
            desc: '1 libra de costillas de cerdo a la parrilla, cocinadas lentamente para lograr ese sabor ahumado y esa textura que se deshace. Acompañadas de salsa BBQ de la casa.',
            meta: ['1 Libra', 'A la Parrilla', 'BBQ', 'Para Compartir'],
            price: 'RD$775',
            img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1200&q=80'
        },
        mixto1: {
            num: '02 — Para Uno',
            title: 'Mixto 1 Persona',
            desc: 'La combinación perfecta para un solo comensal: chuletas, alitas, longaniza y chorizos a la parrilla. Una muestra completa de nuestro fuego.',
            meta: ['1 Persona', 'Chuletas', 'Alitas', 'Longaniza', 'Chorizos'],
            price: 'RD$775',
            img: 'https://images.unsplash.com/photo-1558030006-450675393462?w=1200&q=80'
        },
        chuleton: {
            num: '03 — Corte Premium',
            title: 'Chuletón',
            desc: '16 oz de cuello de cerdo a la parrilla. Un corte grueso, jugoso por dentro y con esa costra dorada por fuera que solo el carbón puede dar.',
            meta: ['16 oz', 'Cuello de Cerdo', 'A la Parrilla', 'Jugoso'],
            price: 'RD$675',
            img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=1200&q=80'
        },
        pescado: {
            num: '04 — Del Mar',
            title: 'Filete de Pescado',
            desc: 'Filete de tilapia importado, sazonado y a la parrilla. Ligero, fresco y perfecto si buscas algo más suave sin perder el sabor del fuego.',
            meta: ['Tilapia', 'Importado', 'A la Parrilla', 'Ligero'],
            price: 'RD$670',
            img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200&q=80'
        },
        pollo: {
            num: '05 — Clásico',
            title: 'Muslo de Pollo BBQ',
            desc: 'Muslos de pollo a la parrilla, marinados y glaseados con nuestra salsa BBQ (o sin BBQ si lo prefieres). Jugosos, ahumados y llenos de sabor.',
            meta: ['Muslos', 'BBQ o Sin BBQ', 'A la Parrilla', 'Jugoso'],
            price: 'RD$675',
            img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=1200&q=80'
        }
    };

    var dishModal = document.getElementById('dishModal');
    var dishModalOverlay = document.getElementById('dishModalOverlay');
    var dishModalClose = document.getElementById('dishModalClose');
    var dishModalImg = document.getElementById('dishModalImg');
    var dishModalNum = document.getElementById('dishModalNum');
    var dishModalTitle = document.getElementById('dishModalTitle');
    var dishModalDesc = document.getElementById('dishModalDesc');
    var dishModalMeta = document.getElementById('dishModalMeta');
    var dishModalPrice = document.getElementById('dishModalPrice');

    function openDishModal(dishKey) {
        var data = dishesData[dishKey];
        if (!data) return;

        dishModalImg.style.backgroundImage = "url('" + data.img + "')";
        dishModalNum.textContent = data.num;
        dishModalTitle.textContent = data.title;
        dishModalDesc.textContent = data.desc;
        dishModalPrice.textContent = data.price;

        dishModalMeta.innerHTML = '';
        data.meta.forEach(function(item) {
            var span = document.createElement('span');
            span.textContent = item;
            dishModalMeta.appendChild(span);
        });

        dishModal.classList.add('open');
        document.body.classList.add('modal-open');
        autoScrollPaused = true;
    }

    function closeDishModal() {
        dishModal.classList.remove('open');
        document.body.classList.remove('modal-open');
        autoScrollPaused = false;
    }

    document.querySelectorAll('.grill-card').forEach(function(card) {
        card.addEventListener('click', function() {
            var dishKey = this.getAttribute('data-dish');
            if (dishKey) openDishModal(dishKey);
        });
    });

    dishModalOverlay.addEventListener('click', closeDishModal);
    dishModalClose.addEventListener('click', closeDishModal);

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && dishModal.classList.contains('open')) {
            closeDishModal();
        }
    });

})();
