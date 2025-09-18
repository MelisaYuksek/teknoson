// static/anasayfa.js

const galleryImages = [
    '/static/images/again.jpg',
    '/static/images/clouds.jpg',
    '/static/images/skyplane.jpg',
];

let currentImageIndex = 0;
const heroSection = document.querySelector('.hero-gallery');
const indicatorsContainer = document.querySelector('.gallery-indicators');

function updateGallery() {
    if (heroSection && indicatorsContainer) {
        heroSection.style.backgroundImage = `url('${galleryImages[currentImageIndex]}')`;
        updateIndicators();
    }
}

function updateIndicators() {
    if (!indicatorsContainer) return;
    
    indicatorsContainer.innerHTML = '';
    galleryImages.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.className = 'gallery-indicator';
        if (index === currentImageIndex) {
            indicator.classList.add('active');
        }
        indicator.addEventListener('click', () => {
            currentImageIndex = index;
            updateGallery();
        });
        indicatorsContainer.appendChild(indicator);
    });
}

function autoChangeImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateGallery();
}

// Hamburger menü fonksiyonalitesi
function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header-nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    if (!mobileMenuToggle || !headerNav) {
        console.log('Hamburger menü elementleri bulunamadı');
        return;
    }

    // Hamburger menü toggle
    mobileMenuToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Hamburger menüye tıklandı');
        
        // Menüyü aç/kapat
        headerNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        // Body scroll'u engelle/serbest bırak
        if (headerNav.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Overlay'e tıklayınca menüyü kapat
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', () => {
            headerNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Menü linklerine tıklayınca menüyü kapat
    const menuLinks = headerNav.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            headerNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Escape tuşuna basınca menüyü kapat
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && headerNav.classList.contains('active')) {
            headerNav.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Anasayfa JavaScript'i başarıyla yüklendi.");
    
    // Hamburger menüyü başlat
    initMobileMenu();
    
    // Galeriyi başlat (eğer galeri elementleri varsa)
    if (heroSection && indicatorsContainer) {
        updateGallery();
        setInterval(autoChangeImage, 5000); // 5 saniyede bir fotoğrafı değiştir
    }
});

// Pencere boyutu değiştiğinde menüyü sıfırla
window.addEventListener('resize', () => {
    const headerNav = document.querySelector('.header-nav');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    
    if (window.innerWidth > 640) {
        if (headerNav) headerNav.classList.remove('active');
        if (mobileMenuToggle) mobileMenuToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
});