document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const mobileOverlay = document.querySelector('.mobile-overlay');

    if (menuToggle && mainNav && mobileOverlay) {
        menuToggle.addEventListener('click', function() {
            menuToggle.classList.toggle('active');
            mainNav.classList.toggle('active');
            mobileOverlay.classList.toggle('active');
        });

        mobileOverlay.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            mobileOverlay.classList.remove('active');
        });
    }
}); 