/* ============================================
   Tira Studio - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // --- Theme Toggle ---
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    const toggleTheme = () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    };

    themeToggle?.addEventListener('click', toggleTheme);
    themeToggleMobile?.addEventListener('click', toggleTheme);

    // --- Language Toggle ---
    const langToggle = document.getElementById('langToggle');
    const langToggleMobile = document.getElementById('langToggleMobile');

    const savedLang = localStorage.getItem('lang') || 'fa';
    html.setAttribute('lang', savedLang);
    html.setAttribute('dir', savedLang === 'fa' ? 'rtl' : 'ltr');
    if (langToggle) langToggle.textContent = savedLang === 'fa' ? 'EN' : 'FA';
    if (langToggleMobile) langToggleMobile.textContent = savedLang === 'fa' ? 'EN' : 'FA';

    const toggleLang = () => {
        const current = html.getAttribute('lang');
        const next = current === 'fa' ? 'en' : 'fa';
        html.setAttribute('lang', next);
        html.setAttribute('dir', next === 'fa' ? 'rtl' : 'ltr');
        localStorage.setItem('lang', next);
        if (langToggle) langToggle.textContent = next === 'fa' ? 'EN' : 'FA';
        if (langToggleMobile) langToggleMobile.textContent = next === 'fa' ? 'EN' : 'FA';
        document.title = next === 'fa' ? 'تیرا استودیو | Tira Studio' : 'Tira Studio | تیرا استودیو';
    };

    langToggle?.addEventListener('click', toggleLang);
    langToggleMobile?.addEventListener('click', toggleLang);

    // --- Header scroll effect ---
    const header = document.getElementById('header');
    const onScroll = () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Active nav on scroll ---
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const updateActiveNav = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            if (scrollY >= top && scrollY < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });

    // --- Intersection Observer for fade-up ---
    const fadeEls = document.querySelectorAll('.fade-up');
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeEls.forEach(el => fadeObserver.observe(el));

    // --- Counter animation ---
    const counters = document.querySelectorAll('.stat-number[data-count], .stat-number-vertical[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                const duration = 1500;
                const start = performance.now();

                const animate = (now) => {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(target * eased);
                    if (progress < 1) requestAnimationFrame(animate);
                };
                requestAnimationFrame(animate);
                counterObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));

    // --- Lightbox ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');

    document.querySelectorAll('.portfolio-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) {
                lightboxImg.src = img.src;
                lightbox.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    lightbox?.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // --- Contact form ---
    const contactForm = document.getElementById('contactForm');
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn');
        const original = btn.innerHTML;
        const lang = html.getAttribute('lang');
        btn.innerHTML = lang === 'fa' ? '<span>ارسال شد!</span>' : '<span>Sent!</span>';
        btn.style.background = '#00b894';
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = '';
            contactForm.reset();
        }, 2000);
    });

    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Portfolio Carousel ---
    const carousel = document.getElementById('portfolioCarousel');
    if (carousel) {
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        let currentIndex = 0;
        const totalItems = items.length;
        let autoPlayInterval;
        let isDragging = false;
        let startX = 0;
        let currentX = 0;

        function updateCarousel() {
            items.forEach((item, index) => {
                item.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next', 'hidden');
                
                let diff = index - currentIndex;
                
                // Handle wrapping
                if (diff > totalItems / 2) diff -= totalItems;
                if (diff < -totalItems / 2) diff += totalItems;
                
                if (diff === 0) {
                    item.classList.add('active');
                } else if (diff === -1) {
                    item.classList.add('prev');
                } else if (diff === 1) {
                    item.classList.add('next');
                } else if (diff === -2) {
                    item.classList.add('far-prev');
                } else if (diff === 2) {
                    item.classList.add('far-next');
                } else {
                    item.classList.add('hidden');
                }
            });
        }

        function goToNext() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateCarousel();
        }

        function goToPrev() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateCarousel();
        }

        // Button clicks
        prevBtn?.addEventListener('click', goToPrev);
        nextBtn?.addEventListener('click', goToNext);

        // Auto-play
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(goToNext, 4000);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        startAutoPlay();

        // Pause on hover
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);

        // Click on item to make it active
        items.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                if (!isDragging) {
                    currentIndex = index;
                    updateCarousel();
                }
            });
        });

        // Drag/Swipe support
        carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.pageX;
            carousel.style.cursor = 'grabbing';
        });

        carousel.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.pageX;
        });

        carousel.addEventListener('mouseup', () => {
            if (!isDragging) return;
            isDragging = false;
            carousel.style.cursor = 'grab';
            
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToNext();
                } else {
                    goToPrev();
                }
            }
        });

        carousel.addEventListener('mouseleave', () => {
            isDragging = false;
            carousel.style.cursor = 'grab';
        });

        // Touch support for mobile
        carousel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
        }, { passive: true });

        carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].pageX;
        }, { passive: true });

        carousel.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;
            
            const diff = startX - currentX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    goToNext();
                } else {
                    goToPrev();
                }
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            const rect = carousel.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                if (e.key === 'ArrowLeft') {
                    goToNext();
                } else if (e.key === 'ArrowRight') {
                    goToPrev();
                }
            }
        });

        // Initialize
        updateCarousel();
    }

    // --- Mini Carousel (About Section) ---
    const miniCarousel = document.getElementById('miniCarousel');
    if (miniCarousel) {
        const items = miniCarousel.querySelectorAll('.mini-carousel-item');
        const prevBtn = miniCarousel.querySelector('.mini-prev');
        const nextBtn = miniCarousel.querySelector('.mini-next');
        let currentIndex = 3;
        const totalItems = items.length;
        let autoPlayInterval;

        function updateMiniCarousel() {
            items.forEach((item, index) => {
                item.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
                
                let diff = index - currentIndex;
                if (diff > totalItems / 2) diff -= totalItems;
                if (diff < -totalItems / 2) diff += totalItems;
                
                if (diff === 0) {
                    item.classList.add('active');
                } else if (diff === -1) {
                    item.classList.add('prev');
                } else if (diff === 1) {
                    item.classList.add('next');
                } else if (diff === -2) {
                    item.classList.add('far-prev');
                } else if (diff === 2) {
                    item.classList.add('far-next');
                }
            });
        }

        function goToNext() {
            currentIndex = (currentIndex + 1) % totalItems;
            updateMiniCarousel();
        }

        function goToPrev() {
            currentIndex = (currentIndex - 1 + totalItems) % totalItems;
            updateMiniCarousel();
        }

        prevBtn?.addEventListener('click', goToPrev);
        nextBtn?.addEventListener('click', goToNext);

        // Auto-play
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(goToNext, 3500);
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        startAutoPlay();
        miniCarousel.addEventListener('mouseenter', stopAutoPlay);
        miniCarousel.addEventListener('mouseleave', startAutoPlay);

        // Click on item
        items.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentIndex = index;
                updateMiniCarousel();
            });
        });

        updateMiniCarousel();
    }

});
