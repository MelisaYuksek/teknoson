// static/anasayfa.js

const galleryImages = [
    '/static/images/ana-sayfa-arkaplan.jpg',
    'https://i.ibb.co/1qG7XgP/galeri-2.jpg',
    'https://i.ibb.co/T4XhJmF/galeri-3.jpg'
];

let currentImageIndex = 0;
const heroSection = document.querySelector('.hero-gallery');
const indicatorsContainer = document.querySelector('.gallery-indicators');

function updateGallery() {
    heroSection.style.backgroundImage = `url('${galleryImages[currentImageIndex]}')`;
    updateIndicators();
}

function updateIndicators() {
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

document.addEventListener("DOMContentLoaded", () => {
    console.log("Anasayfa JavaScript'i başarıyla yüklendi.");
    
    // Galeriyi başlat
    updateGallery();
    setInterval(autoChangeImage, 5000); // 5 saniyede bir fotoğrafı değiştir
});