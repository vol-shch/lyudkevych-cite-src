document.addEventListener("DOMContentLoaded", () => {
    // 1. Перевіряємо, чи кнопка відкриття відео є на цій сторінці
    if (document.getElementById("openVideoBtn")) {
        initVideoModal();
    }
});

function initVideoModal() {
    const openBtn = document.getElementById("openVideoBtn");
    const closeBtn = document.getElementById("closeVideoBtn");
    const modal = document.getElementById("videoModal");
    const iframe = document.getElementById("modalYoutube");
    const overlay = modal.querySelector(".video-modal__overlay");

    // Скопіюйте посилання "Embed" з ютубу (через кнопку Поділитися -> Вбудувати)
    const youtubeUrl = "https://www.youtube.com/embed/rjyHsiuKGAQ?si=F-E-R6G9fPIWFnNO";

    openBtn.addEventListener("click", () => {
        modal.classList.add("is-open");
        iframe.setAttribute("src", youtubeUrl); // Додаємо src і відео грає
        document.body.style.overflow = "hidden"; // Блокуємо скролл самого сайту на фоні
    });

    const closeModal = () => {
        modal.classList.remove("is-open");
        iframe.setAttribute("src", ""); // Очищуємо src і відео повністю зупиняється
        document.body.style.overflow = ""; // Повертаємо скролл сайту
    };

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", closeModal);
    window.addEventListener("keydown", (event) => {
        // Перевіряємо, чи натиснута клавіша Escape ТА чи модальне вікно зараз відкрите
        if (event.key === "Escape" && modal.classList.contains("is-open")) {
            closeModal();
        }
    });
}
