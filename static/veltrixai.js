// static/veltrixai.js

// VeltrixAI sayfası için hamburger menü fonksiyonalitesi
function initVeltrixAIMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    console.log('VeltrixAI hamburger menü başlatılıyor...');
    console.log('Menu Toggle:', menuToggle);
    console.log('Main Nav:', mainNav);
    console.log('Mobile Overlay:', mobileOverlay);

    if (!menuToggle || !mainNav) {
        console.error('Hamburger menü elementleri bulunamadı!');
        return;
    }

    // Hamburger menü toggle
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Hamburger menüye tıklandı');
        
        // Menü durumunu toggle et
        const isActive = mainNav.classList.contains('active');
        
        if (isActive) {
            // Menüyü kapat
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
            console.log('Menü kapatıldı');
        } else {
            // Menüyü aç
            menuToggle.classList.add('active');
            mainNav.classList.add('active');
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
            mainNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Menü linklerine tıklayınca menüyü kapat
    const menuLinks = mainNav.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            console.log('Menü linkine tıklandı - menü kapatılıyor');
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Escape tuşuna basınca menüyü kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            console.log('ESC tuşuna basıldı - menü kapatılıyor');
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            if (mobileOverlay) mobileOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Pencere boyutu değiştiğinde menüyü sıfırla
function handleWindowResize() {
    const mainNav = document.getElementById('main-nav');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    
    if (window.innerWidth > 640) {
        console.log('Desktop moduna geçildi - menü sıfırlanıyor');
        if (mainNav) mainNav.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
    console.log('VeltrixAI sayfası JavaScript\'i yüklendi');
    initVeltrixAIMobileMenu();
});

// Pencere boyutu değişikliklerini dinle
window.addEventListener('resize', handleWindowResize);