// static/model.js

// Model sayfası için hamburger menü fonksiyonalitesi
function initModelMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const headerNav = document.querySelector('.header-nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    console.log('Model sayfası hamburger menü başlatılıyor...');
    console.log('Menu Toggle:', menuToggle);
    console.log('Header Nav:', headerNav);
    console.log('Mobile Overlay:', mobileOverlay);

    if (!menuToggle || !headerNav) {
        console.error('Hamburger menü elementleri bulunamadı!');
        return;
    }

    // Hamburger menü toggle
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Hamburger menüye tıklandı');
        
        // Menü durumunu toggle et
        const isActive = headerNav.classList.contains('active');
        
        if (isActive) {
            // Menüyü kapat
            menuToggle.classList.remove('active');
            headerNav.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Menü kapatıldı');
        } else {
            // Menüyü aç
            menuToggle.classList.add('active');
            headerNav.classList.add('active');
            if (mobileOverlay) mobileOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            console.log('Menü açıldı');
        }
    });

    // Overlay'e tıklayınca menüyü kapat
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            console.log('Overlay\'e tıklandı - menü kapatılıyor');
            menuToggle.classList.remove('active');
            headerNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Menü linklerine tıklayınca menüyü kapat
    const menuLinks = headerNav.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            console.log('Menü linkine tıklandı - menü kapatılıyor');
            menuToggle.classList.remove('active');
            headerNav.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Escape tuşuna basınca menüyü kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && headerNav.classList.contains('active')) {
            console.log('ESC tuşuna basıldı - menü kapatılıyor');
            menuToggle.classList.remove('active');
            headerNav.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Pencere boyutu değiştiğinde menüyü sıfırla
function handleModelWindowResize() {
    const headerNav = document.querySelector('.header-nav');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    
    if (window.innerWidth > 640) {
        console.log('Desktop moduna geçildi - menü sıfırlanıyor');
        if (headerNav) headerNav.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
    console.log('Model sayfası JavaScript\'i yüklendi');
    initModelMobileMenu();
});

// Pencere boyutu değişikliklerini dinle
window.addEventListener('resize', handleModelWindowResize);