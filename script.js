(function() {
            'use strict';

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
            var lastScroll = 0;

            function onScroll() {
                var y = window.scrollY;
                navbar.classList.toggle('scrolled', y > 60);
                backToTop.classList.toggle('visible', y > 800);
                lastScroll = y;
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
            var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

            /* Update active tab on scroll */
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
            var track = document.getElementById('grillTrack');
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

            /* Touch drag for mobile */
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

                /* Parallax por scroll */
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

                /* Profundidad al mover el mouse */
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

        })();
