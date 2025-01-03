// Asosiy sozlamalar
const CONFIG = {
    ANIMATION: {
        DURATION: 300,
        DELAY: 100
    },
    SCROLL: {
        THRESHOLD: 100,
        DEBOUNCE: 250
    },
    BREAKPOINTS: {
        MOBILE: 768,
        TABLET: 992,
        DESKTOP: 1200
    }
};

// Utility funksiyalar
const Utils = {
    /**
     * Element ko'rinishini tekshirish
     * @param {HTMLElement} element - Tekshiriladigan element
     * @returns {boolean} Element ko'rinishda yoki yo'qligi
     */
    isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
        );
    },

    /**
     * Debounce funksiyasi
     * @param {Function} func - Bajarilishi kerak bo'lgan funksiya
     * @param {number} wait - Kutish vaqti
     * @returns {Function} Debounce qilingan funksiya
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Mobil qurilmani aniqlash
     * @returns {boolean} Mobil qurilma yoki yo'qligi
     */
    isMobile() {
        return window.innerWidth <= CONFIG.BREAKPOINTS.MOBILE;
    },

    /**
     * Smooth scroll funksiyasi
     * @param {string} targetId - Manzil element ID si
     * @param {number} offset - Qo'shimcha oraliq
     */
    smoothScroll(targetId, offset = 0) {
        const target = document.querySelector(targetId);
        if (target) {
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }
};

// Header klassi
class Header {
    constructor() {
        // Elementlarni tanlash
        this.header = document.querySelector('.header');
        this.menuBtn = document.querySelector('.menu-toggle-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        // Holatlar
        this.isMenuOpen = false;
        this.isScrolled = false;

        this.init();
    }

    init() {
        // Event listenerlarni qo'shish
        this.addEventListeners();
        
        // Scroll holatini tekshirish
        this.checkScroll();
        
        // Aktiv linkni belgilash
        this.setActiveLink();
    }

    addEventListeners() {
        // Menu tugmasini bosganda
        this.menuBtn?.addEventListener('click', () => this.toggleMenu());

        // Scroll bo'lganda
        window.addEventListener('scroll', Utils.debounce(() => this.checkScroll(), CONFIG.SCROLL.DEBOUNCE));

        // Link bosilganda
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleLinkClick(e));
        });

        // Tashqi qismni bosganda menuni yopish
        document.addEventListener('click', (e) => this.handleOutsideClick(e));
    }

    /**
     * Menuni ochish/yopish
     */
    toggleMenu() {
        try {
            this.isMenuOpen = !this.isMenuOpen;
            this.menuBtn?.classList.toggle('active', this.isMenuOpen);
            this.navMenu?.classList.toggle('active', this.isMenuOpen);
            
            // Menu ochiq bo'lganda scroll ni bloklash
            document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
        } catch (error) {
            console.error('Menu toggle error:', error);
        }
    }

    /**
     * Scroll holatini tekshirish
     */
    checkScroll() {
        try {
            const scrolled = window.scrollY > CONFIG.SCROLL.THRESHOLD;
            if (this.isScrolled !== scrolled) {
                this.isScrolled = scrolled;
                this.header?.classList.toggle('scrolled', scrolled);
            }
        } catch (error) {
            console.error('Check scroll error:', error);
        }
    }

    /**
     * Link bosilganda
     * @param {Event} e - Click event
     */
    handleLinkClick(e) {
        try {
            e.preventDefault();
            const targetId = e.currentTarget.getAttribute('href');
            Utils.smoothScroll(targetId, 100);
            
            // Mobil versiyada menuni yopish
            if (Utils.isMobile()) {
                this.toggleMenu();
            }
        } catch (error) {
            console.error('Link click error:', error);
        }
    }

    /**
     * Tashqi qismni bosganda
     * @param {Event} e - Click event
     */
    handleOutsideClick(e) {
        try {
            if (this.isMenuOpen && 
                !this.navMenu?.contains(e.target) && 
                !this.menuBtn?.contains(e.target)) {
                this.toggleMenu();
            }
        } catch (error) {
            console.error('Outside click error:', error);
        }
    }

    /**
     * Aktiv linkni belgilash
     */
    setActiveLink() {
        try {
            const sections = document.querySelectorAll('section[id]');
            
            window.addEventListener('scroll', Utils.debounce(() => {
                const scrollPosition = window.scrollY + 100;

                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPosition >= sectionTop && 
                        scrollPosition < sectionTop + sectionHeight) {
                        this.navLinks.forEach(link => {
                            link.classList.toggle('active', 
                                link.getAttribute('href') === `#${sectionId}`);
                        });
                    }
                });
            }, CONFIG.SCROLL.DEBOUNCE));
        } catch (error) {
            console.error('Set active link error:', error);
        }
    }

    /**
     * Event listenerlarni tozalash
     */
    destroy() {
        try {
            this.menuBtn?.removeEventListener('click', this.toggleMenu);
            window.removeEventListener('scroll', this.checkScroll);
            document.removeEventListener('click', this.handleOutsideClick);
        } catch (error) {
            console.error('Destroy error:', error);
        }
    }
}

// Hero Section klassi
class HeroSection {
    constructor() {
        this.heroSection = document.querySelector('.hero');
        this.statsNumbers = document.querySelectorAll('.stat-number');
        this.techStack = document.querySelector('.tech-stack');
        this.init();
    }

    init() {
        if (this.heroSection) {
            this.initParallaxEffect();
            this.animateStats();
            this.initTechStackEffects();
        }
    }

    /**
     * Parallax effektini ishga tushirish
     */
    initParallaxEffect() {
        try {
            if (Utils.isMobile()) return;

            const heroImage = this.heroSection.querySelector('.hero-image');
            const bgElements = this.heroSection.querySelectorAll('.bg-element');

            window.addEventListener('mousemove', (e) => {
                const { clientX, clientY } = e;
                const centerX = window.innerWidth / 2;
                const centerY = window.innerHeight / 2;

                // Rasm uchun parallax
                if (heroImage) {
                    const moveX = (clientX - centerX) / 50;
                    const moveY = (clientY - centerY) / 50;
                    heroImage.style.transform = `translate(${moveX}px, ${moveY}px)`;
                }

                // Orqa fon elementlari uchun parallax
                bgElements.forEach((element, index) => {
                    const depth = (index + 1) * 0.02;
                    const moveX = (clientX - centerX) * depth;
                    const moveY = (clientY - centerY) * depth;
                    element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                });
            });
        } catch (error) {
            console.error('Parallax effect error:', error);
        }
    }

    /**
     * Statistika raqamlarini animatsiya qilish
     */
    animateStats() {
        try {
            this.statsNumbers.forEach(number => {
                const finalNumber = parseInt(number.textContent);
                let currentNumber = 0;
                const duration = 2000;
                const steps = 60;
                const increment = finalNumber / steps;

                const interval = setInterval(() => {
                    currentNumber += increment;
                    if (currentNumber >= finalNumber) {
                        number.textContent = `${finalNumber}+`;
                        clearInterval(interval);
                    } else {
                        number.textContent = `${Math.floor(currentNumber)}+`;
                    }
                }, duration / steps);
            });
        } catch (error) {
            console.error('Stats animation error:', error);
        }
    }

    /**
     * Texnologiyalar stacki uchun effektlar
     */
    initTechStackEffects() {
        try {
            const techItems = this.techStack?.querySelectorAll('.tech-item');
            
            techItems?.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.transform = 'translateY(-10px) scale(1.1)';
                });

                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'translateY(0) scale(1)';
                });
            });
        } catch (error) {
            console.error('Tech stack effects error:', error);
        }
    }

    destroy() {
        // Event listenerlarni tozalash
        window.removeEventListener('mousemove', this.initParallaxEffect);
    }
}

// DOMContentLoaded eventida klasslarni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    try {
        new Header();
        new HeroSection();
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Skills seksiyasi klassi
class SkillsSection {
    constructor() {
        // Elementlarni tanlash
        this.section = document.querySelector('#skills');
        this.skillItems = document.querySelectorAll('.skill-item');
        this.skillCategories = document.querySelectorAll('.skill-category');

        // Holatlar
        this.isAnimated = false;
        this.observer = null;

        this.init();
    }

    init() {
        if (this.section) {
            // Scroll kuzatuvchisini o'rnatish
            this.setupIntersectionObserver();
            
            // Hover effektlarini qo'shish
            this.setupHoverEffects();
            
            // Progress bar animatsiyasini o'rnatish
            this.setupProgressBars();
            
            // Resize hodisasini kuzatish
            this.handleResize();
        }
    }

    /**
     * Intersection Observer sozlamalari
     */
    setupIntersectionObserver() {
        try {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !this.isAnimated) {
                        this.animateSkills();
                        this.isAnimated = true;
                    }
                });
            }, {
                threshold: 0.2
            });

            this.observer.observe(this.section);
        } catch (error) {
            console.error('Intersection Observer error:', error);
        }
    }

    /**
     * Hover effektlarini qo'shish
     */
    setupHoverEffects() {
        try {
            if (Utils.isMobile()) return;

            this.skillItems.forEach(item => {
                const details = item.querySelector('.skill-details');
                const progress = item.querySelector('.skill-progress');

                // Mouse kirganda
                item.addEventListener('mouseenter', () => {
                    // Detallarni ko'rsatish
                    if (details) {
                        details.style.display = 'block';
                        requestAnimationFrame(() => {
                            details.style.opacity = '1';
                            details.style.transform = 'translateY(0)';
                        });
                    }

                    // Progress bar effekti
                    if (progress) {
                        progress.style.filter = 'brightness(1.2) drop-shadow(0 0 5px rgba(255,215,0,0.5))';
                    }
                });

                // Mouse chiqqanda
                item.addEventListener('mouseleave', () => {
                    if (details) {
                        details.style.opacity = '0';
                        details.style.transform = 'translateY(-10px)';
                        
                        setTimeout(() => {
                            details.style.display = 'none';
                        }, 300);
                    }

                    if (progress) {
                        progress.style.filter = 'none';
                    }
                });
            });
        } catch (error) {
            console.error('Hover effects error:', error);
        }
    }

    /**
     * Progress bar animatsiyasini sozlash
     */
    setupProgressBars() {
        try {
            this.skillItems.forEach(item => {
                const progressBar = item.querySelector('.skill-progress');
                const percentageText = item.querySelector('.skill-percentage');
                const targetProgress = item.dataset.progress;

                if (!progressBar || !percentageText || !targetProgress) return;

                // Boshlang'ich holat
                progressBar.style.width = '0%';
                percentageText.textContent = '0%';

                // Animatsiya qo'shish
                this.animationQueue.set(item, () => {
                    this.animateProgressBar(progressBar, percentageText, targetProgress);
                });
            });
        } catch (error) {
            console.error('Progress bars setup error:', error);
        }
    }

    /**
     * Progress bar animatsiyasi
     */
    animateProgressBar(progressBar, percentageText, targetProgress) {
        try {
            let currentProgress = 0;
            const duration = 1500; // 1.5 sekund
            const steps = 60;
            const increment = targetProgress / steps;
            const stepDuration = duration / steps;

            const animation = setInterval(() => {
                currentProgress += increment;
                
                if (currentProgress >= targetProgress) {
                    currentProgress = targetProgress;
                    clearInterval(animation);
                }

                progressBar.style.width = `${currentProgress}%`;
                percentageText.textContent = `${Math.round(currentProgress)}%`;
            }, stepDuration);
        } catch (error) {
            console.error('Progress bar animation error:', error);
        }
    }

    /**
     * Skills kategoriyalarini animatsiya qilish
     */
    animateSkills() {
        try {
            this.skillCategories.forEach((category, index) => {
                setTimeout(() => {
                    // Kategoriyani ko'rsatish animatsiyasi
                    category.style.opacity = '1';
                    category.style.transform = 'translateY(0)';

                    // Kategoriya ichidagi skill itemlarni animatsiya qilish
                    const items = category.querySelectorAll('.skill-item');
                    items.forEach((item, itemIndex) => {
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'translateX(0)';
                            
                            // Progress bar animatsiyasini boshlash
                            const callback = this.animationQueue.get(item);
                            if (callback) callback();
                        }, itemIndex * 100);
                    });
                }, index * 200);
            });
        } catch (error) {
            console.error('Skills animation error:', error);
        }
    }

    /**
     * Oyna o'lchamlari o'zgarganda
     */
    handleResize() {
        try {
            const resizeHandler = Utils.debounce(() => {
                // Mobile qurilmalarda hover effektlarini o'chirish
                if (Utils.isMobile()) {
                    this.skillItems.forEach(item => {
                        const details = item.querySelector('.skill-details');
                        if (details) {
                            details.style.display = 'none';
                            details.style.opacity = '0';
                        }
                    });
                }
            }, CONFIG.SCROLL.DEBOUNCE);

            window.addEventListener('resize', resizeHandler);
        } catch (error) {
            console.error('Resize handler error:', error);
        }
    }

    // Animatsiya navbati uchun Map
    animationQueue = new Map();

    /**
     * Animatsiyalarni qayta ishga tushirish
     */
    resetAnimations() {
        try {
            this.isAnimated = false;
            
            this.skillItems.forEach(item => {
                const progressBar = item.querySelector('.skill-progress');
                const percentageText = item.querySelector('.skill-percentage');
                
                if (progressBar && percentageText) {
                    progressBar.style.width = '0%';
                    percentageText.textContent = '0%';
                }
                
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
            });

            this.skillCategories.forEach(category => {
                category.style.opacity = '0';
                category.style.transform = 'translateY(20px)';
            });
        } catch (error) {
            console.error('Reset animations error:', error);
        }
    }

    /**
     * Obyektni tozalash
     */
    destroy() {
        try {
            // Intersection Observer ni to'xtatish
            if (this.observer) {
                this.observer.disconnect();
            }

            // Event listener larni tozalash
            window.removeEventListener('resize', this.handleResize);
            
            // Animatsiya navbatini tozalash
            this.animationQueue.clear();
        } catch (error) {
            console.error('Destroy error:', error);
        }
    }
}

// DOMContentLoaded da Skills seksiyasini ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    try {
        const skillsSection = new SkillsSection();

        // Resize event uchun debounce
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                skillsSection.resetAnimations();
                skillsSection.animateSkills();
            }, CONFIG.SCROLL.DEBOUNCE);
        });
    } catch (error) {
        console.error('Skills section initialization error:', error);
    }
});

// Projects seksiyasi klassi
class ProjectsSection {
    constructor() {
        // Elementlarni tanlash
        this.section = document.querySelector('#projects');
        this.projectsGrid = document.querySelector('.projects-grid');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.projectCards = document.querySelectorAll('.project-card');
        this.loadMoreBtn = document.querySelector('.btn-load-more');

        // Asosiy sozlamalar
        this.settings = {
            itemsPerPage: 6,
            currentPage: 1,
            currentFilter: 'all',
            animationDuration: 300,
            staggerDelay: 100
        };

        // Holat
        this.isAnimating = false;
        this.observer = null;

        this.init();
    }

    init() {
        if (this.section) {
            // Filter tugmalarini ishga tushirish
            this.initFilterButtons();
            
            // Dastlabki proyektlarni ko'rsatish
            this.showInitialProjects();
            
            // Lazy loading ni ishga tushirish
            this.initLazyLoading();
            
            // Karta hover effectlarini qo'shish
            this.initCardHoverEffects();
            
            // URL parametrlarini tekshirish
            this.checkURLParameters();
            
            // Load More tugmasini ishga tushirish
            if (this.loadMoreBtn) {
                this.loadMoreBtn.addEventListener('click', () => this.loadMoreProjects());
            }
        }
    }

    /**
     * Filter tugmalarini ishga tushirish
     */
    initFilterButtons() {
        try {
            this.filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if (this.isAnimating) return;
                    
                    this.isAnimating = true;
                    this.updateActiveFilter(btn);
                    this.filterProjects(btn.dataset.filter);
                });
            });
        } catch (error) {
            console.error('Filter buttons initialization error:', error);
        }
    }

    /**
     * Aktiv filterni yangilash
     * @param {HTMLElement} activeBtn - Aktiv tugma
     */
    updateActiveFilter(activeBtn) {
        try {
            // Active klassni yangilash
            this.filterBtns.forEach(btn => btn.classList.remove('active'));
            activeBtn.classList.add('active');

            // URL parametrini yangilash
            const filterValue = activeBtn.dataset.filter;
            this.updateURLParameter('category', filterValue);
            this.settings.currentFilter = filterValue;
        } catch (error) {
            console.error('Update active filter error:', error);
        }
    }

    /**
     * URL parametrini yangilash
     * @param {string} key - Parametr nomi
     * @param {string} value - Parametr qiymati
     */
    updateURLParameter(key, value) {
        try {
            const url = new URL(window.location.href);
            url.searchParams.set(key, value);
            window.history.pushState({}, '', url);
        } catch (error) {
            console.error('URL parameter update error:', error);
        }
    }

    /**
     * URL parametrlarini tekshirish
     */
    checkURLParameters() {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const category = urlParams.get('category');

            if (category) {
                const filterBtn = Array.from(this.filterBtns)
                    .find(btn => btn.dataset.filter === category);

                if (filterBtn) {
                    this.updateActiveFilter(filterBtn);
                    this.filterProjects(category);
                }
            }
        } catch (error) {
            console.error('URL parameters check error:', error);
        }
    }

    /**
     * Proyektlarni filtrlash
     * @param {string} filter - Filter kategoriyasi
     */
    async filterProjects(filter) {
        try {
            // Barcha proyektlarni yashirish animatsiyasi
            await this.hideAllProjects();

            // Filtrlash va ko'rsatish
            this.projectCards.forEach(card => {
                const shouldShow = filter === 'all' || card.dataset.category === filter;
                card.style.display = shouldShow ? 'block' : 'none';
            });

            // Ko'rsatish animatsiyasi
            await this.showFilteredProjects();

            // Load more tugmasini yangilash
            this.updateLoadMoreButton();
            
            // Animatsiya holatini qaytarish
            setTimeout(() => {
                this.isAnimating = false;
            }, this.settings.animationDuration);
        } catch (error) {
            console.error('Projects filtering error:', error);
        }
    }

    /**
     * Barcha proyektlarni yashirish
     */
    hideAllProjects() {
        return new Promise(resolve => {
            const animations = Array.from(this.projectCards).map((card, index) => {
                return new Promise(cardResolve => {
                    setTimeout(() => {
                        card.style.opacity = '0';
                        card.style.transform = 'scale(0.8)';
                        cardResolve();
                    }, index * 50);
                });
            });

            Promise.all(animations).then(resolve);
        });
    }

    /**
     * Filtrlangan proyektlarni ko'rsatish
     */
    showFilteredProjects() {
        return new Promise(resolve => {
            const animations = Array.from(this.projectCards)
                .filter(card => card.style.display === 'block')
                .map((card, index) => {
                    return new Promise(cardResolve => {
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                            cardResolve();
                        }, index * this.settings.staggerDelay);
                    });
                });

            Promise.all(animations).then(resolve);
        });
    }

    /**
     * Dastlabki proyektlarni ko'rsatish
     */
    showInitialProjects() {
        try {
            this.projectCards.forEach((card, index) => {
                if (index < this.settings.itemsPerPage) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, index * this.settings.staggerDelay);
                } else {
                    card.style.display = 'none';
                }
            });
            this.updateLoadMoreButton();
        } catch (error) {
            console.error('Initial projects display error:', error);
        }
    }

    /**
     * Ko'proq proyektlarni yuklash
     */
    async loadMoreProjects() {
        if (this.isAnimating) return;
        
        try {
            this.isAnimating = true;
            const startIndex = this.settings.currentPage * this.settings.itemsPerPage;
            const endIndex = startIndex + this.settings.itemsPerPage;
            let delay = 0;

            const animations = Array.from(this.projectCards)
                .filter((card, index) => {
                    return index >= startIndex && 
                           index < endIndex && 
                           (this.settings.currentFilter === 'all' || 
                            card.dataset.category === this.settings.currentFilter);
                })
                .map(card => {
                    return new Promise(resolve => {
                        card.style.display = 'block';
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';

                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                            resolve();
                        }, delay);
                        delay += this.settings.staggerDelay;
                    });
                });

            await Promise.all(animations);
            this.settings.currentPage++;
            this.updateLoadMoreButton();
            this.isAnimating = false;
        } catch (error) {
            console.error('Load more projects error:', error);
        }
    }

    /**
     * Load More tugmasini yangilash
     */
    updateLoadMoreButton() {
        try {
            if (!this.loadMoreBtn) return;

            const visibleProjects = Array.from(this.projectCards)
                .filter(card => {
                    const matchesFilter = this.settings.currentFilter === 'all' || 
                                      card.dataset.category === this.settings.currentFilter;
                    const isVisible = card.style.display === 'block';
                    return matchesFilter && !isVisible;
                }).length;

            this.loadMoreBtn.style.display = visibleProjects > 0 ? 'inline-flex' : 'none';
        } catch (error) {
            console.error('Load more button update error:', error);
        }
    }

    /**
     * Karta hover effectlarini qo'shish
     */
    initCardHoverEffects() {
        try {
            if (Utils.isMobile()) return;

            this.projectCards.forEach(card => {
                const image = card.querySelector('.project-image img');
                const content = card.querySelector('.project-content');
                const overlay = card.querySelector('.project-overlay');

                card.addEventListener('mouseenter', () => {
                    if (image) image.style.transform = 'scale(1.1)';
                    if (content) content.style.transform = 'translateY(-10px)';
                    if (overlay) overlay.style.opacity = '1';
                });

                card.addEventListener('mouseleave', () => {
                    if (image) image.style.transform = 'scale(1)';
                    if (content) content.style.transform = 'translateY(0)';
                    if (overlay) overlay.style.opacity = '0';
                });
            });
        } catch (error) {
            console.error('Card hover effects error:', error);
        }
    }

    /**
     * Lazy loading ni ishga tushirish
     */
    initLazyLoading() {
        try {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                            this.observer.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px'
            });

            // Rasmlarni kuzatishni boshlash
            this.projectCards.forEach(card => {
                const img = card.querySelector('img[data-src]');
                if (img) this.observer.observe(img);
            });
        } catch (error) {
            console.error('Lazy loading initialization error:', error);
        }
    }

    /**
     * Obyektni tozalash
     */
    destroy() {
        try {
            // Event listenerlarni tozalash
            this.filterBtns.forEach(btn => {
                btn.removeEventListener('click', this.filterProjects);
            });

            if (this.loadMoreBtn) {
                this.loadMoreBtn.removeEventListener('click', this.loadMoreProjects);
            }

            // Lazy loading observer ni to'xtatish
            if (this.observer) {
                this.observer.disconnect();
            }

            // Xotiradan tozalash
            this.projectCards = null;
            this.projectsGrid = null;
            this.filterBtns = null;
            this.loadMoreBtn = null;
        } catch (error) {
            console.error('Destroy error:', error);
        }
    }
}

// DOMContentLoaded da Projects seksiyasini ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ProjectsSection();
    } catch (error) {
        console.error('Projects section initialization error:', error);
    }
});

// Contact seksiyasi klassi
class ContactSection {
    constructor() {
        // Elementlarni tanlash
        this.form = document.querySelector('.contact-form');
        this.inputs = this.form?.querySelectorAll('input, textarea');
        this.submitBtn = this.form?.querySelector('.submit-btn');
        this.modal = document.querySelector('#success-modal');
        this.modalCloseBtn = this.modal?.querySelector('.modal-close');
        
        // Validatsiya sozlamalari
        this.validationRules = {
            name: {
                required: true,
                minLength: 2,
                pattern: /^[a-zA-Z\s]+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            subject: {
                required: true,
                minLength: 3
            },
            message: {
                required: true,
                minLength: 10
            }
        };

        // Xatolik xabarlari
        this.errorMessages = {
            required: 'Bu maydonni to\'ldirish shart',
            minLength: (min) => `Minimal ${min} ta belgi bo'lishi kerak`,
            pattern: {
                name: 'Faqat harflar va bo\'sh joylar ruxsat etilgan',
                email: 'Noto\'g\'ri email format'
            }
        };

        this.init();
    }

    init() {
        if (this.form) {
            // Form submitni ushlab qolish
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            
            // Input validatsiyasini qo'shish
            this.setupInputValidation();
            
            // Modal tugmasini ishga tushirish
            this.setupModal();
            
            // Input animatsiyalarini qo'shish
            this.setupInputAnimations();
        }
    }

    /**
     * Inputlarni validatsiya qilish
     */
    setupInputValidation() {
        try {
            this.inputs?.forEach(input => {
                // Inputdan chiqqanda validatsiya
                input.addEventListener('blur', () => {
                    this.validateInput(input);
                });

                // Input o'zgarganida xatolikni tozalash
                input.addEventListener('input', () => {
                    this.clearInputError(input);
                });
            });
        } catch (error) {
            console.error('Input validation setup error:', error);
        }
    }

    /**
     * Input animatsiyalarini qo'shish
     */
    setupInputAnimations() {
        try {
            this.inputs?.forEach(input => {
                const inputGroup = input.closest('.input-group');
                const label = inputGroup?.querySelector('label');
                const icon = inputGroup?.querySelector('.input-icon');

                // Focus animatsiyasi
                input.addEventListener('focus', () => {
                    inputGroup?.classList.add('focused');
                    if (icon) icon.style.color = 'var(--orange-yellow-crayola)';
                });

                // Blur animatsiyasi
                input.addEventListener('blur', () => {
                    if (!input.value) {
                        inputGroup?.classList.remove('focused');
                    }
                    if (icon) icon.style.color = '';
                });

                // Agar input to'ldirilgan bo'lsa
                if (input.value) {
                    inputGroup?.classList.add('focused');
                }
            });
        } catch (error) {
            console.error('Input animations setup error:', error);
        }
    }

    /**
     * Modaln sozlamalari
     */
    setupModal() {
        try {
            // Modal yopish tugmasi
            this.modalCloseBtn?.addEventListener('click', () => {
                this.hideModal();
            });

            // Modaldan tashqari bosilganda yopish
            this.modal?.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.hideModal();
                }
            });

            // Escape tugmasi bosilganda yopish
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal?.classList.contains('active')) {
                    this.hideModal();
                }
            });
        } catch (error) {
            console.error('Modal setup error:', error);
        }
    }

    /**
     * Form yuborilganda
     * @param {Event} e - Submit event
     */
    async handleSubmit(e) {
        try {
            e.preventDefault();
            
            // Barcha inputlarni validatsiya qilish
            const isValid = this.validateForm();
            
            if (isValid) {
                // Loading holatini ko'rsatish
                this.setLoadingState(true);
                
                // Form ma'lumotlarini yig'ish
                const formData = this.getFormData();
                
                // Form yuborish (API request simulatsiyasi)
                await this.submitForm(formData);
                
                // Muvaffaqiyatli yuborildi
                this.showSuccessMessage();
                
                // Formni tozalash
                this.resetForm();
            }
        } catch (error) {
            // Xatolik xabari
            this.showErrorMessage(error.message);
            console.error('Form submission error:', error);
        } finally {
            // Loading holatini o'chirish
            this.setLoadingState(false);
        }
    }

    /**
     * Formni validatsiya qilish
     * @returns {boolean} Validatsiya natijasi
     */
    validateForm() {
        try {
            let isValid = true;
            this.inputs?.forEach(input => {
                if (!this.validateInput(input)) {
                    isValid = false;
                }
            });
            return isValid;
        } catch (error) {
            console.error('Form validation error:', error);
            return false;
        }
    }

    /**
     * Input validatsiyasi
     * @param {HTMLElement} input - Input elementi
     * @returns {boolean} Validatsiya natijasi
     */
    validateInput(input) {
        try {
            const rules = this.validationRules[input.name];
            if (!rules) return true;

            const inputGroup = input.closest('.form-group');
            const errorElement = inputGroup?.querySelector('.error-message');
            let isValid = true;
            let errorMessage = '';

            // Required tekshiruvi
            if (rules.required && !input.value.trim()) {
                isValid = false;
                errorMessage = this.errorMessages.required;
            }
            // Minimal uzunlik tekshiruvi
            else if (rules.minLength && input.value.length < rules.minLength) {
                isValid = false;
                errorMessage = this.errorMessages.minLength(rules.minLength);
            }
            // Pattern tekshiruvi
            else if (rules.pattern && !rules.pattern.test(input.value)) {
                isValid = false;
                errorMessage = this.errorMessages.pattern[input.name];
            }

            // Xatolik xabarini ko'rsatish/yashirish
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.style.display = isValid ? 'none' : 'block';
            }

            // Input holatini yangilash
            inputGroup?.classList.toggle('error', !isValid);
            
            return isValid;
        } catch (error) {
            console.error('Input validation error:', error);
            return false;
        }
    }

    /**
     * Input xatoligini tozalash
     * @param {HTMLElement} input - Input elementi
     */
    clearInputError(input) {
        try {
            const inputGroup = input.closest('.form-group');
            const errorElement = inputGroup?.querySelector('.error-message');
            
            inputGroup?.classList.remove('error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        } catch (error) {
            console.error('Clear input error:', error);
        }
    }

    /**
     * Form ma'lumotlarini yig'ish
     * @returns {Object} Form ma'lumotlari
     */
    getFormData() {
        const formData = {};
        this.inputs?.forEach(input => {
            formData[input.name] = input.value;
        });
        return formData;
    }

    /**
     * Form yuborish (API request simulatsiyasi)
     * @param {Object} data - Yuborilayotgan ma'lumotlar
     * @returns {Promise} Request natijasi
     */
    submitForm(data) {
        return new Promise((resolve) => {
            // API request simulatsiyasi
            setTimeout(() => {
                resolve({ success: true });
            }, 1500);
        });
    }

    /**
     * Loading holatini o'rnatish
     * @param {boolean} isLoading - Loading holati
     */
    setLoadingState(isLoading) {
        try {
            if (!this.submitBtn) return;

            const btnText = this.submitBtn.querySelector('.btn-text');
            const btnIcon = this.submitBtn.querySelector('.btn-icon');

            this.submitBtn.disabled = isLoading;
            if (btnText) btnText.style.visibility = isLoading ? 'hidden' : 'visible';
            if (btnIcon) {
                btnIcon.style.display = isLoading ? 'inline-block' : 'none';
                btnIcon.style.animation = isLoading ? 'rotate 1s linear infinite' : '';
            }
        } catch (error) {
            console.error('Loading state error:', error);
        }
    }

    /**
     * Muvaffaqiyat xabarini ko'rsatish
     */
    showSuccessMessage() {
        try {
            this.modal?.classList.add('active');
            document.body.style.overflow = 'hidden';
        } catch (error) {
            console.error('Success message error:', error);
        }
    }

    /**
     * Modalni yashirish
     */
    hideModal() {
        try {
            this.modal?.classList.remove('active');
            document.body.style.overflow = '';
        } catch (error) {
            console.error('Hide modal error:', error);
        }
    }

    /**
     * Xatolik xabarini ko'rsatish
     * @param {string} message - Xatolik xabari
     */
    showErrorMessage(message) {
        try {
            // Toast notification ko'rsatish
            const toast = document.createElement('div');
            toast.className = 'toast error';
            toast.textContent = message;
            
            document.body.appendChild(toast);
            
            // 3 sekunddan keyin o'chirish
            setTimeout(() => {
                toast.remove();
            }, 3000);
        } catch (error) {
            console.error('Error message display error:', error);
        }
    }

    /**
     * Formni tozalash
     */
    resetForm() {
        try {
            this.form?.reset();
            this.inputs?.forEach(input => {
                const inputGroup = input.closest('.input-group');
                inputGroup?.classList.remove('focused', 'error');
            });
        } catch (error) {
            console.error('Form reset error:', error);
        }
    }

    /**
     * Obyektni tozalash
     */
    destroy() {
        try {
            // Form eventlarini tozalash
            this.form?.removeEventListener('submit', this.handleSubmit);
            
            // Input eventlarini tozalash
            this.inputs?.forEach(input => {
                input.removeEventListener('blur', this.validateInput);
                input.removeEventListener('input', this.clearInputError);
                input.removeEventListener('focus', this.setupInputAnimations);
                input.removeEventListener('blur', this.setupInputAnimations);
            });

            // Modal eventlarini tozalash
            this.modalCloseBtn?.removeEventListener('click', this.hideModal);
            this.modal?.removeEventListener('click', this.hideModal);
            document.removeEventListener('keydown', this.setupModal);
        } catch (error) {
            console.error('Destroy error:', error);
        }
    }
}

// DOMContentLoaded da Contact seksiyasini ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    try {
        new ContactSection();
    } catch (error) {
        console.error('Contact section initialization error:', error);
    }
});

// Footer seksiyasi klassi
class Footer {
    constructor() {
        // Elementlarni tanlash
        this.footer = document.querySelector('.footer');
        this.scrollTopBtn = document.querySelector('.scroll-top');
        this.footerLinks = this.footer?.querySelectorAll('.footer-links a');
        this.socialLinks = this.footer?.querySelectorAll('.social-link');
        this.infoItems = this.footer?.querySelectorAll('.info-item');

        // Sozlamalar
        this.settings = {
            scrollThreshold: 400,    // Scroll tugmasi ko'rinish chegarasi
            scrollDuration: 800,     // Scroll animatsiya davomiyligi
            animationDelay: 100,     // Animatsiya kechikishi
        };

        this.init();
    }

    init() {
        if (this.footer) {
            // Scroll to top funksionalligini qo'shish
            this.initScrollToTop();
            
            // Footer linklar smooth scroll
            this.initSmoothScroll();
            
            // Hover effectlarni qo'shish
            this.initHoverEffects();
            
            // Fade animatsiyalarini qo'shish
            this.initFadeAnimations();
            
            // Copyright yilini yangilash
            this.updateCopyrightYear();
            
            // Scroll hodisasini tekshirish
            window.addEventListener('scroll', 
                Utils.debounce(() => this.handleScroll(), 100)
            );
        }
    }

    /**
     * Scroll to top funksionalligi
     */
    initScrollToTop() {
        try {
            if (!this.scrollTopBtn) return;

            // Click event
            this.scrollTopBtn.addEventListener('click', () => {
                this.smoothScrollToTop();
            });

            // Dastlabki holatni tekshirish
            this.toggleScrollButton();

            // Klaviatura bilan ishlash
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Home') {
                    this.smoothScrollToTop();
                }
            });
        } catch (error) {
            console.error('Scroll to top initialization error:', error);
        }
    }

    /**
     * Smooth scroll funksionalligi
     */
    initSmoothScroll() {
        try {
            this.footerLinks?.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href?.startsWith('#')) {
                        e.preventDefault();
                        const targetId = href;
                        const targetSection = document.querySelector(targetId);

                        if (targetSection) {
                            const headerOffset = 100;
                            const targetPosition = 
                                targetSection.offsetTop - headerOffset;

                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                });
            });
        } catch (error) {
            console.error('Smooth scroll initialization error:', error);
        }
    }

    /**
     * Hover effectlarni qo'shish
     */
    initHoverEffects() {
        try {
            // Ijtimoiy tarmoq ikonkalari uchun
            this.socialLinks?.forEach(link => {
                // Mouse kirganda
                link.addEventListener('mouseenter', () => {
                    const icon = link.querySelector('i');
                    if (icon) {
                        icon.style.transform = 'scale(1.2) rotate(360deg)';
                        icon.style.color = 'var(--orange-yellow-crayola)';
                    }
                });

                // Mouse chiqqanda
                link.addEventListener('mouseleave', () => {
                    const icon = link.querySelector('i');
                    if (icon) {
                        icon.style.transform = '';
                        icon.style.color = '';
                    }
                });
            });

            // Info elementlari uchun
            this.infoItems?.forEach(item => {
                // Mouse kirganda
                item.addEventListener('mouseenter', () => {
                    const icon = item.querySelector('i');
                    const text = item.querySelector('span');
                    if (icon) {
                        icon.style.transform = 'scale(1.1)';
                        icon.style.color = 'var(--orange-yellow-crayola)';
                    }
                    if (text) {
                        text.style.color = 'var(--orange-yellow-crayola)';
                    }
                });

                // Mouse chiqqanda
                item.addEventListener('mouseleave', () => {
                    const icon = item.querySelector('i');
                    const text = item.querySelector('span');
                    if (icon) {
                        icon.style.transform = '';
                        icon.style.color = '';
                    }
                    if (text) {
                        text.style.color = '';
                    }
                });
            });
        } catch (error) {
            console.error('Hover effects initialization error:', error);
        }
    }

    /**
     * Fade animatsiyalarini qo'shish
     */
    initFadeAnimations() {
        try {
            // Intersection Observer yaratish
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.animateElement(entry.target);
                            observer.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );

            // Footer elementlarini kuzatish
            const elements = this.footer?.querySelectorAll(
                '.footer-info, .footer-links, .footer-services, .footer-contact'
            );

            elements?.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px)';
                element.dataset.delay = index * this.settings.animationDelay;
                observer.observe(element);
            });
        } catch (error) {
            console.error('Fade animations initialization error:', error);
        }
    }

    /**
     * Element animatsiyasi
     * @param {HTMLElement} element - Animatsiya qilinadigan element
     */
    animateElement(element) {
        try {
            const delay = parseInt(element.dataset.delay) || 0;
            
            setTimeout(() => {
                requestAnimationFrame(() => {
                    element.style.transition = 'all 0.5s ease';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });
            }, delay);
        } catch (error) {
            console.error('Element animation error:', error);
        }
    }

    /**
     * Copyright yilini yangilash
     */
    updateCopyrightYear() {
        try {
            const copyrightElement = this.footer?.querySelector('.copyright p');
            if (copyrightElement) {
                const currentYear = new Date().getFullYear();
                copyrightElement.textContent = 
                    `© ${currentYear} Barcha huquqlar himoyalangan`;
            }
        } catch (error) {
            console.error('Copyright year update error:', error);
        }
    }

    /**
     * Scroll hodisasini boshqarish
     */
    handleScroll() {
        try {
            this.toggleScrollButton();
            this.handleScrollShadow();
        } catch (error) {
            console.error('Scroll handling error:', error);
        }
    }

    /**
     * Scroll tugmasini ko'rsatish/yashirish
     */
    toggleScrollButton() {
        try {
            if (!this.scrollTopBtn) return;

            const shouldShow = window.scrollY > this.settings.scrollThreshold;
            this.scrollTopBtn.classList.toggle('visible', shouldShow);
        } catch (error) {
            console.error('Toggle scroll button error:', error);
        }
    }

    /**
     * Footer soyasini boshqarish
     */
    handleScrollShadow() {
        try {
            if (!this.footer) return;

            const isAtBottom = window.innerHeight + window.scrollY >= 
                document.documentElement.scrollHeight;

            this.footer.classList.toggle('shadow', !isAtBottom);
        } catch (error) {
            console.error('Scroll shadow handling error:', error);
        }
    }

    /**
     * Tepaga smooth scroll
     */
    smoothScrollToTop() {
        try {
            const startPosition = window.scrollY;
            const startTime = performance.now();

            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / this.settings.scrollDuration, 1);

                // Easing funksiyasi
                const easeProgress = this.easeOutCubic(progress);
                
                window.scrollTo(0, startPosition * (1 - easeProgress));

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };

            requestAnimationFrame(animateScroll);
        } catch (error) {
            console.error('Smooth scroll to top error:', error);
        }
    }

    /**
     * Easing funksiyasi
     * @param {number} x - Progress qiymati (0-1)
     * @returns {number} Easing qiymati
     */
    easeOutCubic(x) {
        return 1 - Math.pow(1 - x, 3);
    }

    /**
     * Obyektni tozalash
     */
    destroy() {
        try {
            // Scroll event ni tozalash
            window.removeEventListener('scroll', this.handleScroll);

            // Scroll top button event ni tozalash
            this.scrollTopBtn?.removeEventListener('click', this.smoothScrollToTop);

            // Footer linklar eventlarini tozalash
            this.footerLinks?.forEach(link => {
                link.removeEventListener('click', this.initSmoothScroll);
            });

            // Ijtimoiy tarmoq linklarini tozalash
            this.socialLinks?.forEach(link => {
                link.removeEventListener('mouseenter', this.initHoverEffects);
                link.removeEventListener('mouseleave', this.initHoverEffects);
            });

            // Info elementlari eventlarini tozalash
            this.infoItems?.forEach(item => {
                item.removeEventListener('mouseenter', this.initHoverEffects);
                item.removeEventListener('mouseleave', this.initHoverEffects);
            });

            // Klaviatura eventini tozalash
            document.removeEventListener('keydown', this.initScrollToTop);
        } catch (error) {
            console.error('Destroy error:', error);
        }
    }
}

// DOMContentLoaded da Footer ni ishga tushirish
document.addEventListener('DOMContentLoaded', () => {
    try {
        new Footer();
    } catch (error) {
        console.error('Footer initialization error:', error);
    }
});
