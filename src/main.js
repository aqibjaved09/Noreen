// Custom Cursor tracking
const cursorGlow = document.querySelector('.cursor-glow');

if (cursorGlow) {
  window.addEventListener('mousemove', (e) => {
    // Basic smooth tracking
    cursorGlow.style.top = e.clientY + 'px';
    cursorGlow.style.left = e.clientX + 'px';
  });
}

// Card Hover Spotlights
const cards = document.querySelectorAll('.service-card');

cards.forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// Scroll Reveal Animation
const revealElements = document.querySelectorAll('.service-card, .section-header, .hero-content, .about-content, .timeline-item, .skill-category');

// Initial setup to handle fade in
revealElements.forEach((el, index) => {
  el.classList.add('reveal');
  // Stagger effect for cards
  if (el.classList.contains('service-card')) {
    el.style.transitionDelay = `${(index % 5) * 0.1}s`;
  }
});

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  const elementVisible = 150;

  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - elementVisible) {
      el.classList.add('active');
    }
  });
}

// Attach event listener
window.addEventListener('scroll', revealOnScroll);
// Trigger once on load
revealOnScroll();

// Carousel Functionality
const carouselTrack = document.querySelector('.carousel-track');
const carouselItems = document.querySelectorAll('.carousel-item');
const prevBtn = document.querySelector('.carousel-btn.prev');
const nextBtn = document.querySelector('.carousel-btn.next');
const dotsContainer = document.querySelector('.carousel-dots');

let currentIndex = 0;
let autoplayInterval;

// Create dots
carouselItems.forEach((_, index) => {
  const dot = document.createElement('div');
  dot.classList.add('carousel-dot');
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(index));
  dotsContainer.appendChild(dot);
});

const dots = document.querySelectorAll('.carousel-dot');

function updateCarousel() {
  const offset = -currentIndex * 100;
  carouselTrack.style.transform = `translateX(${offset}%)`;
  
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentIndex);
  });
}

function goToSlide(index) {
  currentIndex = index;
  updateCarousel();
  resetAutoplay();
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % carouselItems.length;
  updateCarousel();
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + carouselItems.length) % carouselItems.length;
  updateCarousel();
}

function startAutoplay() {
  autoplayInterval = setInterval(nextSlide, 4000);
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

// Event listeners
nextBtn.addEventListener('click', () => {
  nextSlide();
  resetAutoplay();
});

prevBtn.addEventListener('click', () => {
  prevSlide();
  resetAutoplay();
});

// Pause on hover
const carouselContainer = document.querySelector('.carousel-container');
carouselContainer.addEventListener('mouseenter', () => {
  clearInterval(autoplayInterval);
});

carouselContainer.addEventListener('mouseleave', () => {
  startAutoplay();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') {
    prevSlide();
    resetAutoplay();
  } else if (e.key === 'ArrowRight') {
    nextSlide();
    resetAutoplay();
  }
});

// Touch/swipe support
let touchStartX = 0;
let touchEndX = 0;

carouselContainer.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

carouselContainer.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

function handleSwipe() {
  if (touchStartX - touchEndX > 50) {
    nextSlide();
    resetAutoplay();
  }
  if (touchEndX - touchStartX > 50) {
    prevSlide();
    resetAutoplay();
  }
}

// Start autoplay
startAutoplay();
