const swiper = new Swiper(".swiper", {
    // Нескінченне гортання
    loop: true,
    speed: 800,
    // ДОДАЄМО АВТОПЕРЕГОРТАННЯ
    autoplay: {
        delay: 3000, // затримка в мілісекундах (3000 мс = 3 секунди)
        disableOnInteraction: false, // автоперегортання НЕ вимкнеться, якщо користувач сам клікне на слайд
    },
    // Вмикаємо пагінацію (крапочки)
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    },
    // Вмикаємо стрілки
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});
