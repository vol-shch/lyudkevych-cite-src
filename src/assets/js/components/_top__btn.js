const scrollToTopBtn = document.getElementById("scrollToTopBtn");

// Відстежуємо подію прокрутки (scroll)
window.addEventListener("scroll", () => {
    // Якщо прокрутили більше ніж на 500 пікселів, показуємо кнопку
    if (window.scrollY > 500) {
        scrollToTopBtn.classList.add("show");
    } else {
        scrollToTopBtn.classList.remove("show");
    }
});

// Обробка кліку на кнопку
scrollToTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth", // Плавна прокрутка
    });
});
