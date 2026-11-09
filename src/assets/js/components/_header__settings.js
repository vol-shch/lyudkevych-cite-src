document.addEventListener("DOMContentLoaded", function () {
    const burgerBtn = document.querySelector(".icon-menu");
    const menuBody = document.querySelector(".nav__body");
    const dropdownToggles = document.querySelectorAll(".dropdown__toggle");
    const navItems = document.querySelectorAll(".nav__item");

    // 1. Логіка для кліку по бургеру
    if (burgerBtn && menuBody) {
        burgerBtn.addEventListener("click", function () {
            burgerBtn.classList.toggle("active");
            menuBody.classList.toggle("active");
        });
    }

    // 2. Логіка для кліку по dropdown__toggle на мобільних пристроях
    dropdownToggles.forEach((toggle) => {
        toggle.addEventListener("click", function (e) {
            // Перевіряємо, чи ми зараз на мобільному екрані (< 768px)
            if (window.innerWidth < 829.98) {
                e.preventDefault(); // Скасовуємо перехід по посиланню/хрестику

                const parentItem = this.closest(".dropdown");

                // Якщо потрібно, щоб при відкритті одного дропдауна інший закривався — розкоментуй код нижче:

                document.querySelectorAll(".dropdown").forEach((item) => {
                    if (item !== parentItem) item.classList.remove("open");
                });

                // Перемикаємо клас для відкриття/закриття
                if (parentItem) {
                    parentItem.classList.toggle("open");
                }
            }
        });
    });
    navItems.forEach((item) => {
        item.addEventListener("click", function (e) {
            if (window.innerWidth <= 829.98) {
                // Зупиняємо спливання події, якщо клікнули на вкладені посилання в підменю,
                // щоб рамка не перескакувала і не зникала при кліках всередині дропдауна
                if (e.target.closest(".dropdown-menu")) {
                    return;
                }

                // Якщо клікнули на той самий пункт, який вже активний — знімаємо рамку
                if (this.classList.contains("is-selected")) {
                    this.classList.remove("is-selected");
                } else {
                    // Спочатку прибираємо рамку з усіх інших пунктів меню
                    navItems.forEach((el) => el.classList.remove("is-selected"));
                    // Додаємо рамку на поточний клікнутий пункт
                    this.classList.add("is-selected");
                }
            }
        });
    });
});
