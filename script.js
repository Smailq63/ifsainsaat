// Sticky Navbar
window.addEventListener('scroll', function() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Sayfa Geçiş Efekti (fade-in)
document.addEventListener('DOMContentLoaded', function() {
  document.body.style.opacity = 0;
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.8s';
    document.body.style.opacity = 1;
  }, 100);
});

// Lightbox Galeri
const lightboxModal = document.getElementById('lightbox-modal');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.lightbox-close');
const prevBtn = document.getElementById('lightbox-prev');
const nextBtn = document.getElementById('lightbox-next');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxCounter = document.getElementById('lightbox-counter');
const lightboxThumbnails = document.getElementById('lightbox-thumbnails');

const projectTitles = {
  'proje1': 'AKILLI EV PROJESİ',
  'proje2': 'ALTIN VADİ PROJESİ 1',
  'proje3': 'ALTIN VADİ PROJESİ 2',
  'proje4': 'DİĞER PROJELER'
};

// Galeri görsellerini bul
const galleryImages = document.querySelectorAll('.lightbox-trigger');
const galleries = {
  'proje1': [
    ...Array.from({length: 10}, (_, i) => `images/proje1/${i+1}.jpg`),
    ...Array.from({length: 16}, (_, i) => `images/proje1/${i+11}.jpeg`)
  ],
  'proje2': [
    '1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.jpg','12.jpg','13.jpg','14.jpg','15.jpg','16.jpg','17.jpg','18.jpg','19.jpg','20.jpg','21.jpg'
  ].map(f => `images/proje2/${f}`),
  'proje3': [
    '1.jpg','2.jpg','3.jpg','4.jpg','5.jpg','6.jpg','7.jpg','8.jpg','9.jpg','10.jpg','11.jpg','12.jpg'
  ].map(f => `images/proje3/${f}`),
  'proje4': [
    '1.jpeg','2.jpeg','3.jpeg','4.jpeg','5.jpeg','6.jpeg','7.jpeg','8.jpeg','9.jpeg'
  ].map(f => `images/proje4/${f}`)
};

let currentGallery = [];
let currentIndex = 0;
let currentGalleryName = '';

galleryImages.forEach((img) => {
  img.addEventListener('click', function() {
    const galleryName = img.getAttribute('data-gallery');
    currentGallery = galleries[galleryName] || [];
    currentGalleryName = galleryName;
    currentIndex = 0;
    showLightbox(currentGallery[currentIndex]);
    updateLightboxHeader();
    updateLightboxThumbnails();
    lightboxModal.classList.add('active');
  });
});

function showLightbox(src) {
  lightboxImg.src = src;
  updateLightboxHeader();
  updateLightboxThumbnails();
}

function updateLightboxHeader() {
  if (!currentGallery.length) return;
  if (lightboxTitle) lightboxTitle.textContent = projectTitles[currentGalleryName] || '';
  if (lightboxCounter) lightboxCounter.textContent = `${currentIndex+1} / ${currentGallery.length}`;
}

let lightboxSlideInterval = null;
const SLIDE_INTERVAL = 4000; // 4 saniye

function startLightboxSlideshow() {
  stopLightboxSlideshow();
  lightboxSlideInterval = setInterval(() => {
    if (currentGallery.length > 0) {
      currentIndex = (currentIndex + 1) % currentGallery.length;
      showLightbox(currentGallery[currentIndex]);
    }
  }, SLIDE_INTERVAL);
}
function stopLightboxSlideshow() {
  if (lightboxSlideInterval) {
    clearInterval(lightboxSlideInterval);
    lightboxSlideInterval = null;
  }
}

// Lightbox açıldığında slayt başlat
if (lightboxModal) {
  const observer = new MutationObserver(() => {
    if (lightboxModal.classList.contains('active')) {
      startLightboxSlideshow();
    } else {
      stopLightboxSlideshow();
    }
  });
  observer.observe(lightboxModal, { attributes: true, attributeFilter: ['class'] });
}

// Kullanıcı manuel geçiş yaparsa slayt süresini sıfırla
function resetLightboxSlideshow() {
  startLightboxSlideshow();
}

function updateLightboxThumbnails() {
  if (!lightboxThumbnails) return;
  lightboxThumbnails.innerHTML = '';
  currentGallery.forEach((src, idx) => {
    const thumb = document.createElement('img');
    thumb.src = src;
    thumb.className = idx === currentIndex ? 'active' : '';
    thumb.addEventListener('click', () => {
      currentIndex = idx;
      showLightbox(currentGallery[currentIndex]);
      resetLightboxSlideshow();
    });
    lightboxThumbnails.appendChild(thumb);
  });
}

closeBtn.addEventListener('click', function() {
  lightboxModal.classList.remove('active');
});

prevBtn.addEventListener('click', function() {
  if (currentGallery.length === 0) return;
  currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
  showLightbox(currentGallery[currentIndex]);
  resetLightboxSlideshow();
});

nextBtn.addEventListener('click', function() {
  if (currentGallery.length === 0) return;
  currentIndex = (currentIndex + 1) % currentGallery.length;
  showLightbox(currentGallery[currentIndex]);
  resetLightboxSlideshow();
});

document.addEventListener('click', function(e) {
  if (e.target === lightboxModal) {
    lightboxModal.classList.remove('active');
  }
});

// İletişim Formu Doğrulama
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('form-message');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = contactForm.name.value.trim();
    const email = contactForm.email.value.trim();
    const message = contactForm.message.value.trim();
    let error = '';
    if (name.length < 3) {
      error = 'Lütfen adınızı giriniz.';
    } else if (!validateEmail(email)) {
      error = 'Geçerli bir e-posta adresi giriniz.';
    } else if (message.length < 10) {
      error = 'Mesajınız en az 10 karakter olmalıdır.';
    }
    if (error) {
      formMessage.textContent = error;
      formMessage.style.color = '#f2b100';
      return;
    }
    formMessage.textContent = 'Mesajınız başarıyla gönderildi!';
    formMessage.style.color = '#1e3a8a';
    contactForm.reset();
  });
}

function validateEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

// Hamburger Menü Aç/Kapat
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
if (menuToggle && navMenu) {
  menuToggle.addEventListener('click', function() {
    navMenu.classList.toggle('open');
  });
  // Menüden bir linke tıklanınca menü kapansın (mobilde)
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('open');
    });
  });
} 