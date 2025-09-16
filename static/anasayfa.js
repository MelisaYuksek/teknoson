// static/anasayfa.js

/**
 * Bu dosya, ana sayfaya özgü JavaScript işlevlerini içerir.
 * Örneğin:
 * - Sayfa yüklendiğinde bir karşılama animasyonu başlatma
 * - Butona tıklandığında yumuşak kaydırma efekti (smooth scroll)
 * - Kartların üzerine gelindiğinde bir efekt uygulama
 */

document.addEventListener("DOMContentLoaded", () => {
    console.log("Anasayfa JavaScript'i başarıyla yüklendi.");
    
    // Örnek: "Tahmin Yapmaya Başla" butonuna tıklandığında
    const heroButton = document.querySelector(".hero-button");
    if (heroButton) {
        heroButton.addEventListener("click", (e) => {
            // İsterseniz buraya bir animasyon veya loglama kodu ekleyebilirsiniz.
            console.log("Tahmin yapmaya başla butonuna tıklandı.");
        });
    }

    // Örnek: Kartların üzerine gelindiğinde bir loglama
    const featureCards = document.querySelectorAll(".feature-cards .card");
    featureCards.forEach(card => {
        card.addEventListener("mouseenter", () => {
            // Kartın hover durumunu izleyebilirsiniz.
            // console.log("Kartın üzerine gelindi.");
        });
    });
});