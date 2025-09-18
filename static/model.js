// static/model.js

// Model sayfası için hamburger menü fonksiyonalitesi
function initModelMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle') || document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.header-nav') || document.getElementById('main-nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    console.log('Model sayfası hamburger menü başlatılıyor...');
    console.log('Menu Toggle:', menuToggle);
    console.log('Main Nav:', mainNav);
    console.log('Mobile Overlay:', mobileOverlay);

    if (!menuToggle || !mainNav) {
        console.error('Model sayfası hamburger menü elementleri bulunamadı!');
        
        // Alternatif selector denemeleri
        const altMenuToggle = document.querySelector('[class*="menu"]') || document.querySelector('[id*="menu"]');
        const altMainNav = document.querySelector('nav') || document.querySelector('[class*="nav"]');
        
        console.log('Alternatif Menu Toggle:', altMenuToggle);
        console.log('Alternatif Main Nav:', altMainNav);
        
        if (altMenuToggle && altMainNav) {
            setupMenuListeners(altMenuToggle, altMainNav, mobileOverlay);
        }
        return;
    }

    setupMenuListeners(menuToggle, mainNav, mobileOverlay);
}

function setupMenuListeners(menuToggle, mainNav, mobileOverlay) {
    // Hamburger menü toggle
    menuToggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('Model sayfası hamburger menüye tıklandı');
        
        // Menü durumunu toggle et
        const isActive = mainNav.classList.contains('active');
        
        if (isActive) {
            // Menüyü kapat
            closeMenu(menuToggle, mainNav, mobileOverlay);
        } else {
            // Menüyü aç
            openMenu(menuToggle, mainNav, mobileOverlay);
        }
    });

    // Overlay'e tıklayınca menüyü kapat
    if (mobileOverlay) {
        mobileOverlay.addEventListener('click', function() {
            console.log('Model sayfası overlay\'e tıklandı - menü kapatılıyor');
            closeMenu(menuToggle, mainNav, mobileOverlay);
        });
    }

    // Menü linklerine tıklayınca menüyü kapat
    const menuLinks = mainNav.querySelectorAll('a');
    menuLinks.forEach(function(link) {
        link.addEventListener('click', function() {
            console.log('Model sayfası menü linkine tıklandı - menü kapatılıyor');
            closeMenu(menuToggle, mainNav, mobileOverlay);
        });
    });

    // Escape tuşuna basınca menüyü kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mainNav.classList.contains('active')) {
            console.log('ESC tuşuna basıldı - model sayfası menü kapatılıyor');
            closeMenu(menuToggle, mainNav, mobileOverlay);
        }
    });

    // Sayfa dışına tıklayınca menüyü kapat
    document.addEventListener('click', function(e) {
        if (mainNav.classList.contains('active')) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu(menuToggle, mainNav, mobileOverlay);
            }
        }
    });
}

function openMenu(menuToggle, mainNav, mobileOverlay) {
    menuToggle.classList.add('active');
    mainNav.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    console.log('Model sayfası menü açıldı');
}

function closeMenu(menuToggle, mainNav, mobileOverlay) {
    menuToggle.classList.remove('active');
    mainNav.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
    console.log('Model sayfası menü kapatıldı');
}

// Pencere boyutu değiştiğinde menüyü sıfırla
function handleModelWindowResize() {
    const mainNav = document.querySelector('.header-nav') || document.getElementById('main-nav');
    const menuToggle = document.querySelector('.mobile-menu-toggle') || document.getElementById('menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    
    if (window.innerWidth > 640) {
        console.log('Desktop moduna geçildi - model sayfası menü sıfırlanıyor');
        if (mainNav) mainNav.classList.remove('active');
        if (menuToggle) menuToggle.classList.remove('active');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Sayfa yüklendiğinde çalıştır
document.addEventListener('DOMContentLoaded', function() {
    console.log('Model sayfası JavaScript\'i yüklendi');
    
    // Küçük bir gecikme ile menüyü başlat (DOM tamamen yüklensin diye)
    setTimeout(function() {
        initModelMobileMenu();
    }, 100);
});

// Pencere boyutu değişikliklerini dinle
window.addEventListener('resize', handleModelWindowResize);

// Sayfa tamamen yüklendiğinde tekrar kontrol et
window.addEventListener('load', function() {
    console.log('Model sayfası tamamen yüklendi - menü kontrol ediliyor');
    
    const menuToggle = document.querySelector('.mobile-menu-toggle') || document.getElementById('menu-toggle');
    const mainNav = document.querySelector('.header-nav') || document.getElementById('main-nav');
    
    if (!menuToggle || !mainNav) {
        console.warn('Model sayfasında hamburger menü elementleri hala bulunamadı');
        // Son bir deneme daha
        setTimeout(initModelMobileMenu, 500);
    }
});