// Toggle the navigation menu on clicking the hamburger icon
document.querySelector('.menu-toggle').addEventListener('click', () => {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('active');

    // Optional: Change the icon to 'X' when menu is open
    const icon = document.querySelector('.menu-toggle i');
    if (navMenu.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close menu when any nav link is clicked
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        const navMenu = document.querySelector('.nav-menu');
        const icon = document.querySelector('.menu-toggle i');

        // Remove 'active' class
        navMenu.classList.remove('active');

        // Reset icon back to bars
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    });
});


/* About Page Script */
const track = document.querySelector('.team-track');
const cards = document.querySelectorAll('.team-card');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
let currentIndex = 0;
let cardWidth = cards.length > 0 ? cards[0].offsetWidth + 32 : 0;
// Margin included (1rem = 16px left + right)

// Set CSS variable for total cards (sync with CSS width)
track.style.setProperty('--total-cards', cards.length);

// Clone cards for infinite loop
function setupInfiniteCarousel() {
    if (cards.length === 0) return;

    // Clone all cards to create infinite effect
    const clones = Array.from(cards).map(card => {
        const clone = card.cloneNode(true);
        clone.classList.add('team-card-clone');
        return clone;
    });

    // Append clones to the end and start
    clones.forEach(clone => track.appendChild(clone));
    const initialClones = Array.from(cards).map(card => card.cloneNode(true));
    initialClones.forEach(clone => track.insertBefore(clone, track.firstChild));

    // Adjust track width and initial position
    track.style.width = `${(cards.length * 3) * cardWidth}px`; // Original + 2 sets of clones
    currentIndex = cards.length; // Start at the first set of original cards
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

// carousel function
function updateCarousel(transition = true) {
    if (cards.length === 0) return;

    const num_cards = cards.length;

    if (currentIndex < 0) {
        const from_index = currentIndex + 1;
        currentIndex += num_cards;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${(from_index + num_cards) * cardWidth}px)`;
    }

    if (currentIndex >= num_cards * 2) {
        const from_index = currentIndex - 1;
        currentIndex -= num_cards;
        track.style.transition = 'none';
        track.style.transform = `translateX(-${(from_index - num_cards) * cardWidth}px)`;
    }

    track.style.transition = transition ? 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
}

// Event listeners for buttons
nextBtn.addEventListener('click', () => {
    currentIndex++;
    updateCarousel();
});

prevBtn.addEventListener('click', () => {
    currentIndex--;
    updateCarousel();
});

// Auto-scroll
let autoSlide = setInterval(() => {
    currentIndex++;
    updateCarousel();
}, 4000);

track.addEventListener('mouseenter', () => clearInterval(autoSlide));
track.addEventListener('mouseleave', () => {
    autoSlide = setInterval(() => {
        currentIndex++;
        updateCarousel();
    }, 4000);
});

// Handle window resize to update card width
window.addEventListener('resize', () => {
    cardWidth = cards.length > 0 ? cards[0].offsetWidth + 32 : 0;
    track.style.width = `${(cards.length * 3) * cardWidth}px`;
    updateCarousel(false); // Update without transition
});

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    setupInfiniteCarousel();
    updateCarousel(false);

    // Scroll Animations for Team and Testimonials
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.team-card, .testimonial-card').forEach(el => observer.observe(el));
});

// Stats Counter Animation
const counters = document.querySelectorAll('.counter');
const statsSection = document.querySelector('.stats');

function animateCounter(counter, target, suffix = '') {
    let current = 0;
    const increment = target / 50; // Adjust speed (50 steps)
    const duration = 1500; // Animation duration in ms
    const stepTime = duration / 50;

    const updateCounter = () => {
        current += increment;
        if (current >= target) {
            counter.textContent = target + suffix;
            return;
        }
        counter.textContent = Math.floor(current) + suffix;
        setTimeout(updateCounter, stepTime);
    };
    updateCounter();
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const suffix = counter.getAttribute('data-suffix') || '';
                animateCounter(counter, target, suffix);
            });
            statsObserver.unobserve(statsSection); // Run once
        }
    });
}, { threshold: 0.3 });

statsObserver.observe(statsSection);

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


/*portfolio script */

document.addEventListener('DOMContentLoaded', function () {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    const modal = document.getElementById('imgModal');
    const modalImg = document.getElementById('modalImg');
    const modalClose = document.querySelector('.modal-close');

    // Filter functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const filterValue = button.getAttribute('data-filter');
            portfolioItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // Animation
    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 100 + (index * 100));
    });

    // Image enlarge (only for large screens)
    document.querySelectorAll('.portfolio-img img, .view-img').forEach(el => {
        el.addEventListener('click', (e) => {
            {  // ✅ sirf jab screen 768px se badi ho
                let src = e.target.closest('.portfolio-img') ?
                    e.target.closest('.portfolio-img').querySelector('img').src :
                    e.target.closest('.portfolio-item').querySelector('img').src;
                modalImg.src = src;
                modal.style.display = 'flex';
            }
        });
    });

    // Close modal
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
});





/* Contact  Us Page Script */





