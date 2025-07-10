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
    // WhatsApp mesajı oluştur
    const wpMesaj =
      `*İLETİŞİM FORMU*%0A` +
      `Ad Soyad: ${encodeURIComponent(name)}%0A` +
      `E-posta: ${encodeURIComponent(email)}%0A` +
      `Mesaj: ${encodeURIComponent(message)}`;
    const wpUrl = `https://wa.me/905323942628?text=${wpMesaj}`;
    window.open(wpUrl, '_blank');
    formMessage.textContent = 'WhatsApp üzerinden mesajınız iletilecek.';
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

// Tanıtım videosu: hover ile ses aç/kapat
const promoVideo = document.getElementById('promoVideo');
if (promoVideo) {
  promoVideo.volume = 1;
  promoVideo.muted = true;
  promoVideo.addEventListener('mouseenter', function() {
    promoVideo.muted = false;
  });
  promoVideo.addEventListener('mouseleave', function() {
    promoVideo.muted = true;
  });
}

// SSS (FAQ) akordeon işlevi
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(q => {
  q.addEventListener('click', function() {
    const item = this.parentElement;
    item.classList.toggle('active');
    // Diğer açık olanları kapat
    document.querySelectorAll('.faq-item').forEach(other => {
      if (other !== item) other.classList.remove('active');
    });
  });
});

// Teklif Al formu işlevi
const teklifForm = document.getElementById('teklifForm');
const teklifMsg = document.getElementById('teklifForm-msg');
if (teklifForm) {
  teklifForm.addEventListener('submit', function(e) {
    e.preventDefault();
    // Basit doğrulama
    const ad = teklifForm['ad'].value.trim();
    const tel = teklifForm['tel'].value.trim();
    const email = teklifForm['email'].value.trim();
    const tur = teklifForm['tur'].value;
    const aciklama = teklifForm['aciklama'].value.trim();
    if (!ad || !tel || !email || !tur || !aciklama) {
      teklifMsg.textContent = 'Lütfen tüm alanları doldurun.';
      teklifMsg.style.color = 'red';
      return;
    }
    if (!validateEmail(email)) {
      teklifMsg.textContent = 'Geçerli bir e-posta adresi giriniz.';
      teklifMsg.style.color = 'red';
      return;
    }
    // WhatsApp mesajı oluştur
    const mesaj =
      `*TEKLİF FORMU*%0A` +
      `Ad Soyad: ${encodeURIComponent(ad)}%0A` +
      `Telefon: ${encodeURIComponent(tel)}%0A` +
      `E-posta: ${encodeURIComponent(email)}%0A` +
      `Proje Türü: ${encodeURIComponent(tur)}%0A` +
      `Açıklama: ${encodeURIComponent(aciklama)}`;
    const whatsappUrl = `https://wa.me/905323942628?text=${mesaj}`;
    window.open(whatsappUrl, '_blank');
    teklifMsg.textContent = 'WhatsApp üzerinden teklif talebiniz iletilecek.';
    teklifMsg.style.color = 'green';
    teklifForm.reset();
  });
}

// Hizmet Detay Modalı
const serviceDetails = {
  yonetim: {
    title: 'Taahhüt ve Proje Yönetimi',
    body: 'Projelerinizi anahtar teslim olarak, planlama, bütçelendirme, tedarik, uygulama ve teslim süreçlerinin tamamında profesyonel yönetim anlayışıyla yürütüyoruz. Süreç boyunca şeffaf raporlama ve müşteri bilgilendirmesi sağlanır.'
  },
  mimari: {
    title: 'Mimari ve Statik Tasarım',
    body: 'Uzman mimar ve mühendis kadromuzla, modern ve fonksiyonel yapılar için özgün mimari ve statik projeler hazırlıyoruz. Tasarımlarımızda estetik, güvenlik ve sürdürülebilirlik ön plandadır.'
  },
  restorasyon: {
    title: 'Renovasyon & Restorasyon',
    body: 'Tarihi ve mevcut yapıların aslına uygun şekilde yenilenmesi, güçlendirilmesi ve modern standartlara kavuşturulması için kapsamlı renovasyon ve restorasyon hizmetleri sunuyoruz.'
  },
  danismanlik: {
    title: 'Danışmanlık & Teknik Destek',
    body: 'Proje öncesi fizibilite, malzeme seçimi, uygulama süreci ve sonrası için teknik danışmanlık ve destek sağlıyoruz. Her aşamada profesyonel rehberlik sunuyoruz.'
  },
  yesil: {
    title: 'Sürdürülebilir ve Yeşil Bina Çözümleri',
    body: 'Enerji verimliliği yüksek, çevre dostu ve sürdürülebilir bina çözümleriyle geleceğe yatırım yapıyoruz. Yeşil bina sertifikasyon süreçlerinde de danışmanlık veriyoruz.'
  },
  guvenlik: {
    title: 'İş Güvenliği ve Kalite Kontrol',
    body: 'Tüm projelerde ulusal ve uluslararası standartlara uygunluk, iş güvenliği ve kalite kontrol süreçleri titizlikle uygulanır. Sıfır hata ve maksimum güvenlik hedeflenir.'
  }
};

const serviceModal = document.getElementById('service-modal');
const serviceModalTitle = document.getElementById('service-modal-title');
const serviceModalBody = document.getElementById('service-modal-body');
const serviceModalClose = document.querySelector('.service-modal-close');

document.querySelectorAll('.service-detail-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const key = btn.getAttribute('data-service');
    const detail = serviceDetails[key];
    if (detail) {
      serviceModalTitle.textContent = detail.title;
      serviceModalBody.textContent = detail.body;
      serviceModal.classList.add('active');
    }
  });
});
if (serviceModalClose) {
  serviceModalClose.addEventListener('click', function() {
    serviceModal.classList.remove('active');
  });
}
serviceModal.addEventListener('click', function(e) {
  if (e.target === serviceModal) {
    serviceModal.classList.remove('active');
  }
}); 