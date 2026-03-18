/* ============================================
   MOBILE MENU TOGGLE
   ============================================ */
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const warnDiv = document.querySelector('.warning-banner');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            warnDiv.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                warnDiv.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnHamburger = hamburger.contains(event.target);

            if (!isClickInsideNav && !isClickOnHamburger && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                warnDiv.classList.remove('active');
            }
        });
    }
});

/* ============================================
   3D PRODUCT CAROUSEL FUNCTIONALITY
   ============================================ */
class Carousel3D {
    constructor() {
        this.container = document.getElementById('carousel3DContainer');
        this.stage = document.getElementById('carousel3DStage');
        this.leftArrow = document.querySelector('.carousel-arrow-left');
        this.rightArrow = document.querySelector('.carousel-arrow-right');
        this.indicatorsContainer = document.getElementById('carouselIndicators3D');

        if (!this.container || !this.stage) return;

        this.cards = this.stage.querySelectorAll('.product-card-3d');
        this.currentIndex = 0;
        this.totalCards = this.cards.length;

        // Touch/Swipe variables
        this.isSwip = false;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.diff = 0;

        this.init();
    }

    init() {
        this.initBackgroundImages();
        this.createIndicators();
        this.updateCarousel();
        this.attachEventListeners();
    }

    initBackgroundImages() {
        this.cards.forEach(card => {
            const bgImageEl = card.querySelector('[data-bg-image]');
            if (bgImageEl) {
                const bgUrl = bgImageEl.getAttribute('data-bg-image');
                if (bgUrl) {
                    bgImageEl.style.backgroundImage = `url('${bgUrl}')`;
                }
            }
        });
    }

    createIndicators() {
        this.indicatorsContainer.innerHTML = '';
        for (let i = 0; i < this.totalCards; i++) {
            const indicator = document.createElement('div');
            indicator.classList.add('carousel-indicator-3d');
            if (i === 0) indicator.classList.add('active');
            indicator.addEventListener('click', () => this.goToSlide(i));
            this.indicatorsContainer.appendChild(indicator);
        }
    }

    attachEventListeners() {
        // Arrow navigation
        this.leftArrow?.addEventListener('click', () => this.prevSlide());
        this.rightArrow?.addEventListener('click', () => this.nextSlide());

        // Touch events for mobile
        this.container.addEventListener('touchstart', this.touchStart.bind(this), { passive: false });
        this.container.addEventListener('touchmove', this.touchMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.touchEnd.bind(this));

        // Mouse events for desktop drag
        this.container.addEventListener('mousedown', this.mouseDown.bind(this));
        this.container.addEventListener('mousemove', this.mouseMove.bind(this));
        this.container.addEventListener('mouseup', this.mouseUp.bind(this));
        this.container.addEventListener('mouseleave', this.mouseUp.bind(this));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            }
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });
    }

    touchStart(e) {
        this.isSwip = true;
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
    }

    touchMove(e) {
        if (!this.isSwip) return;
        this.currentX = e.touches[0].clientX;
        this.diff = this.startX - this.currentX;
    }

    touchEnd(e) {
        if (!this.isSwip) return;

        this.isSwip = false;

        // Threshold for swipe (50px)
        if (Math.abs(this.diff) > 50) {
            if (this.diff > 0) {
                // Swiped left - next
                this.nextSlide();
            } else {
                // Swiped right - prev
                this.prevSlide();
            }
        }

        this.diff = 0;
    }

    mouseDown(e) {
        this.isSwip = true;
        this.startX = e.clientX;
        this.container.style.cursor = 'grabbing';
        e.preventDefault();
    }

    mouseMove(e) {
        if (!this.isSwip) return;
        this.currentX = e.clientX;
        this.diff = this.startX - this.currentX;
    }

    mouseUp(e) {
        if (!this.isSwip) return;

        this.isSwip = false;
        this.container.style.cursor = 'grab';

        // Threshold for drag (50px)
        if (Math.abs(this.diff) > 50) {
            if (this.diff > 0) {
                // Dragged left - next
                this.nextSlide();
            } else {
                // Dragged right - prev
                this.prevSlide();
            }
        }

        this.diff = 0;
    }

    updateCarousel() {
        // Remove all position classes
        this.cards.forEach(card => {
            card.classList.remove('active', 'prev', 'next', 'far-prev', 'far-next');
        });

        // Set positions for each card relative to current index
        this.cards.forEach((card, index) => {
            const position = this.getRelativePosition(index);

            if (position === 0) {
                card.classList.add('active');
            } else if (position === -1) {
                card.classList.add('prev');
            } else if (position === 1) {
                card.classList.add('next');
            } else if (position === -2) {
                card.classList.add('far-prev');
            } else if (position === 2) {
                card.classList.add('far-next');
            }
        });

        this.updateIndicators();
        this.updateArrows();
    }

    getRelativePosition(cardIndex) {
        let diff = cardIndex - this.currentIndex;

        // Handle circular wrapping
        if (diff > this.totalCards / 2) {
            diff -= this.totalCards;
        } else if (diff < -this.totalCards / 2) {
            diff += this.totalCards;
        }

        return diff;
    }

    updateArrows() {
        // Arrows are always enabled for circular carousel
        // If you want to disable at ends, uncomment below:
        /*
        if (this.leftArrow) {
            this.leftArrow.disabled = this.currentIndex === 0;
        }
        if (this.rightArrow) {
            this.rightArrow.disabled = this.currentIndex >= this.totalCards - 1;
        }
        */
    }

    updateIndicators() {
        const indicators = this.indicatorsContainer.querySelectorAll('.carousel-indicator-3d');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentIndex);
        });
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.totalCards;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentIndex = (this.currentIndex - 1 + this.totalCards) % this.totalCards;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    new Carousel3D();
});

/* ============================================
   SMOOTH SCROLLING FOR ANCHOR LINKS
   ============================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 60; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

/* ============================================
   NAVBAR BACKGROUND ON SCROLL
   ============================================ */
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');

    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.boxShadow = 'none';
    }
});

/* ============================================
   FADE IN ANIMATION ON SCROLL
   ============================================ */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Elements to observe
const animatedElements = document.querySelectorAll('.product-card, .portfolio-item, .testimonial-card, .team-member');

animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
});

/* ============================================
   FOOTER
   ============================================ */

const city = document.getElementById("city");
const cont = document.querySelectorAll(".foot-cont-three a");

city.addEventListener("toggle", toggleCont);

city.addEventListener("click", () => {
    city.dispatchEvent(new Event("toggle"));
});

function toggleCont() {
    city.classList.toggle("active");
    cont.forEach((el) => {
        el.style.display = el.style.display === "block" ? "none" : "block";
    });
}

const yearSpan = document.querySelector('#year');
if (yearSpan) {
    yearSpan.innerText = new Date().getFullYear();
}

/* ============================================
   BACKGROUND IMAGE INITIALIZATION
   ============================================ */
document.addEventListener('DOMContentLoaded', function() {
    const bgElements = document.querySelectorAll('[data-bg-image]:not(.product-image-3d)');
    bgElements.forEach(el => {
        const bgUrl = el.getAttribute('data-bg-image');
        if (bgUrl) {
            el.style.backgroundImage = `url('${bgUrl}')`;
        }
    });
});
