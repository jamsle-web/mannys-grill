/* ============================================
   CARRUSEL — THE GRILL (global)
   ============================================ */
var carruselActual = 0;
var carruselTotal = 5;
var carruselVelocidad = 4000;
var carruselPlay = null;
var carruselPausado = false;

function carruselPuntos(n) {
    var ptn = document.getElementsByClassName('carrusel-punto');
    for (var i = 0; i < ptn.length; i++) {
        ptn[i].className = ptn[i].className.replace('activo', '').replace(/\s+/g, ' ').trim();
    }
    if (ptn[n]) ptn[n].className += ' activo';
}

function carruselMostrar(n) {
    var imagenes = document.getElementsByClassName('carrusel-imagen');
    for (var i = 0; i < imagenes.length; i++) {
        imagenes[i].className = imagenes[i].className.replace('actual', '').replace(/\s+/g, ' ').trim();
    }
    carruselActual = n;
    if (imagenes[n]) imagenes[n].className += ' actual';
    carruselPuntos(n);
}

function carruselSiguiente() {
    carruselActual++;
    if (carruselActual >= carruselTotal) carruselActual = 0;
    carruselMostrar(carruselActual);
}

function carruselAnterior() {
    carruselActual--;
    if (carruselActual < 0) carruselActual = carruselTotal - 1;
    carruselMostrar(carruselActual);
}

function carruselIniciar() {
    if (carruselPlay) clearInterval(carruselPlay);
    carruselPlay = setInterval(carruselSiguiente, carruselVelocidad);
    carruselPausado = false;
    var icon = document.getElementById('carruselPlayIcon');
    if (icon) icon.textContent = '❚❚';
}

function carruselPausar() {
    if (carruselPlay) {
        clearInterval(carruselPlay);
        carruselPlay = null;
    }
    carruselPausado = true;
    var icon = document.getElementById('carruselPlayIcon');
    if (icon) icon.textContent = '▶';
}

function carruselPlayPause() {
    if (carruselPausado) carruselIniciar();
    else carruselPausar();
}

/* ============================================
   REVIEWS CARRUSEL
   ============================================ */
var reviewsActual = 0;
var reviewsCards = [];
var reviewsAuto = null;

function reviewsInit() {
    reviewsCards = document.querySelectorAll('.review-card');
    if (reviewsCards.length === 0) return;
    reviewsMostrar(0);
    reviewsAutoPlay();
}

function reviewsMostrar(n) {
    reviewsCards.forEach(function(card, i) {
        card.classList.remove('active', 'prev', 'next');
    });

    var total = reviewsCards.length;
    reviewsActual = (n + total) % total;

    reviewsCards.forEach(function(card, i) {
        var diff = i - reviewsActual;
        if (diff > total / 2) diff -= total;
        if (diff < -total / 2) diff += total;

        if (diff === 0) card.classList.add('active');
        else if (diff === -1) card.classList.add('prev');
        else if (diff === 1) card.classList.add('next');
    });
}

function reviewsSiguiente() {
    reviewsMostrar(reviewsActual + 1);
}

function reviewsAutoPlay() {
    if (reviewsAuto) clearInterval(reviewsAuto);
    reviewsAuto = setInterval(reviewsSiguiente, 5000);
}

/* ============================================
   IIFE PRINCIPAL
   ============================================ */
(function() {
    'use strict';

    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* LOADING */
    window.addEventListener('load', function() {
        setTimeout(function() {
            document.getElementById('loader').classList.add('hidden');
            document.body.classList.remove('loading');
        }, 2400);
    });

    /* NAVBAR SCROLL */
    var navbar = document.getElementById('navbar');
    var backToTop = document.getElementById('backToTop');
    var waFloat = document.getElementById('waFloat');

    function onScroll() {
        var y = window.scrollY;
        navbar.classList.toggle('scrolled', y > 60);
        backToTop.classList.toggle('visible', y > 800);
        if (waFloat) waFloat.classList.toggle('visible', y > 400);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* MOBILE MENU */
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

    /* HERO PARALLAX */
    var heroBg = document.getElementById('heroBg');
    var hero = document.getElementById('hero');

    if (!prefersReduced && hero && heroBg) {
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

    /* REVEAL ON SCROLL */
    var revealElements = document.querySelectorAll('.reveal, .reveal-blur, .stagger');
    var revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach(function(el) { revealObserver.observe(el); });

    /* MENU TABS */
    var menuTabs = document.querySelectorAll('.menu-tab');
    var menuCategories = document.querySelectorAll('.menu-category');

    menuTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var targetId = this.getAttribute('data-target');
            var target = document.getElementById(targetId);
            menuTabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            if (target) {
                var top = target.getBoundingClientRect().top + window.scrollY - 140;
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
    }, { threshold: 0.3, rootMargin: '-140px 0px -50% 0px' });
    menuCategories.forEach(function(cat) { menuObserver.observe(cat); });

    /* BACK TO TOP */
    backToTop.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* VIDEO — control de rendimiento */
    var expVideo = document.querySelector('.exp-video');
    if (expVideo) {
        if (prefersReduced) {
            expVideo.pause();
            expVideo.removeAttribute('autoplay');
        }
    }

    /* MAGNETIC BUTTON */
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

    /* SMOOTH ANCHOR SCROLL */
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var top = target.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    /* CARRUSEL */
    if (!prefersReduced) {
        carruselIniciar();
        var contenedor = document.getElementById('carruselContenedor');
        if (contenedor) {
            contenedor.addEventListener('mouseenter', carruselPausar);
            contenedor.addEventListener('mouseleave', function() {
                if (!carruselPausado) carruselIniciar();
            });
        }
    }

    /* REVIEWS CARRUSEL */
    reviewsInit();

    /* ============================================
       EXPERIENCE — SCROLL CINEMATOGRÁFICO
       ============================================ */
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReduced) {

        gsap.registerPlugin(ScrollTrigger);

        var expSection = document.querySelector('.exp-pin-section');
        var expScene1 = document.getElementById('expScene1');
        var expScene2 = document.getElementById('expScene2');
        var expScene3 = document.getElementById('expScene3');
        var expVideoEl = document.querySelector('.exp-video');
        var progressFill = document.getElementById('expProgressFill');
        var progressText = document.querySelector('.exp-progress-text');

        if (expSection && expScene1 && expScene2 && expScene3 && expVideoEl) {

            var masterTL = gsap.timeline({
                scrollTrigger: {
                    trigger: expSection,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1,
                    onUpdate: function(self) {
                        var p = self.progress;
                        if (progressFill) progressFill.style.width = (p * 100) + '%';
                        if (progressText) {
                            if (p < 0.33) progressText.textContent = 'El Fuego';
                            else if (p < 0.66) progressText.textContent = 'Signature';
                            else progressText.textContent = 'Pedir Ahora';
                        }
                    }
                }
            });

            /* ESCENA 1 → ESCENA 2 */
            masterTL.to(expVideoEl, { scale: 1.15, duration: 0.33 }, 0);
            masterTL.to(expScene1, { opacity: 0, y: -60, filter: 'blur(8px)', duration: 0.1 }, 0.25);

            masterTL.set(expScene2, { visibility: 'visible' }, 0.33);
            masterTL.fromTo(expScene2, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.1 }, 0.35);
            masterTL.to(expScene2.querySelector('.exp-signature-bg'), { scale: 1.1, duration: 0.3 }, 0.4);
            masterTL.to(expScene2, { opacity: 0, y: -60, filter: 'blur(8px)', duration: 0.1 }, 0.58);

            /* ESCENA 2 → ESCENA 3 */
            masterTL.set(expScene3, { visibility: 'visible' }, 0.66);
            masterTL.fromTo(expScene3, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.1 }, 0.68);
            masterTL.to(expScene3, { opacity: 1, duration: 0.3 }, 0.78);
        }
    }

})();
