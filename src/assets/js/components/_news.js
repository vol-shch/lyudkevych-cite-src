// Окрема сторінка новин

async function loadNews() {
    const container = document.getElementById("news-page-container");

    try {
        // Отримуємо дані з JSON-файлу
        const response = await fetch("/assets/data/about/news.json");

        if (!response.ok) {
            throw new Error("Не вдалося завантажити файл новин");
        }

        const newsList = await response.json();

        // Очищуємо контейнер про всяк випадок
        container.innerHTML = "";

        // Беремо перші 100 новин із початку файлу
        const latestNews = newsList.slice(0, 100);

        // Перебираємо кожну новину з масиву і створюємо для неї HTML
        latestNews.forEach((news) => {
            const newsCard = document.createElement("article");
            newsCard.className = "news-page-card";

            newsCard.innerHTML = `
            <div class="news-page-card__card">
                <div class="news-page-card__img">
                    <img
                        src="${news.image}"
                        alt="${news.title}"
                        class="news-page-card__img-settings" />
                </div>
                <div class="news-page-card__content">
                    <div class="news-page-card__date">
                        <span class="news-page-card__date">
                            <svg
                                width="25px"
                                height="25px"
                                viewBox="-1 0 32 32"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                <title>calendar</title>
                                <desc>Created with Sketch Beta.</desc>
                                <defs></defs>
                                <g
                                    id="Page-1"
                                    stroke="none"
                                    stroke-width="1"
                                    fill="none"
                                    fill-rule="evenodd"
                                    sketch:type="MSPage">
                                    <g
                                        id="Icon-Set"
                                        sketch:type="MSLayerGroup"
                                        transform="translate(-309.000000, -359.000000)"
                                        fill="#000000">
                                        <path
                                            d="M323,383 L325,383 L325,385 L323,385 L323,383 Z M323,387 L325,387 C326.104,387 327,386.104 327,385 L327,383 C327,381.896 326.104,381 325,381 L323,381 C321.896,381 321,381.896 321,383 L321,385 C321,386.104 321.896,387 323,387 L323,387 Z M315,383 L317,383 L317,385 L315,385 L315,383 Z M315,387 L317,387 C318.104,387 319,386.104 319,385 L319,383 C319,381.896 318.104,381 317,381 L315,381 C313.896,381 313,381.896 313,383 L313,385 C313,386.104 313.896,387 315,387 L315,387 Z M323,375 L325,375 L325,377 L323,377 L323,375 Z M323,379 L325,379 C326.104,379 327,378.104 327,377 L327,375 C327,373.896 326.104,373 325,373 L323,373 C321.896,373 321,373.896 321,375 L321,377 C321,378.104 321.896,379 323,379 L323,379 Z M315,375 L317,375 L317,377 L315,377 L315,375 Z M315,379 L317,379 C318.104,379 319,378.104 319,377 L319,375 C319,373.896 318.104,373 317,373 L315,373 C313.896,373 313,373.896 313,375 L313,377 C313,378.104 313.896,379 315,379 L315,379 Z M337,367 L311,367 L311,365 C311,363.896 311.896,363 313,363 L317,363 L317,364 C317,364.553 317.447,365 318,365 C318.553,365 319,364.553 319,364 L319,363 L329,363 L329,364 C329,364.553 329.447,365 330,365 C330.553,365 331,364.553 331,364 L331,363 L335,363 C336.104,363 337,363.896 337,365 L337,367 L337,367 Z M337,387 C337,388.104 336.104,389 335,389 L313,389 C311.896,389 311,388.104 311,387 L311,369 L337,369 L337,387 L337,387 Z M335,361 L331,361 L331,360 C331,359.448 330.553,359 330,359 C329.447,359 329,359.448 329,360 L329,361 L319,361 L319,360 C319,359.448 318.553,359 318,359 C317.447,359 317,359.448 317,360 L317,361 L313,361 C310.791,361 309,362.791 309,365 L309,387 C309,389.209 310.791,391 313,391 L335,391 C337.209,391 339,389.209 339,387 L339,365 C339,362.791 337.209,361 335,361 L335,361 Z M331,375 L333,375 L333,377 L331,377 L331,375 Z M331,379 L333,379 C334.104,379 335,378.104 335,377 L335,375 C335,373.896 334.104,373 333,373 L331,373 C329.896,373 329,373.896 329,375 L329,377 C329,378.104 329.896,379 331,379 L331,379 Z M331,383 L333,383 L333,385 L331,385 L331,383 Z M331,387 L333,387 C334.104,387 335,386.104 335,385 L335,383 C335,381.896 334.104,381 333,381 L331,381 C329.896,381 329,381.896 329,383 L329,385 C329,386.104 329.896,387 331,387 L331,387 Z"
                                            id="calendar"
                                            sketch:type="MSShapeGroup"></path>
                                    </g>
                                </g>
                            </svg>
                            ${news.date}</span
                        >
                    </div>
                    <h2 class="news-page-card__title">${news.title}</h2>
                    <p class="news-page-card__text">
                        ${news.text}
                    </p>
                </div>
        </div>
            `;
            // КЛІК НА КАРТКУ: відкриваємо нову сторінку з повними даними
            newsCard.addEventListener("click", () => {
                window.location.href = `/internal-pages/about/single-news.html?id=${news.id}`;
            });

            // Додаємо створену картку в загальний контейнер
            container.appendChild(newsCard);
        });
    } catch (error) {
        console.error("Помилка:", error);
        container.innerHTML = '<p class="error-message">Вибачте, не вдалося завантажити новини. Спробуйте пізніше.</p>';
    }
}

// Головна сторінка з блоком новин

async function loadNewsMainPage() {
    const containerMain = document.getElementById("news-container");
    const modal = document.getElementById("news-modal");
    const modalImg = document.getElementById("modal-img");
    const modalDate = document.getElementById("modal-date");
    const modalTitle = document.getElementById("modal-title");
    const modalText = document.getElementById("modal-text");
    const modalClose = document.getElementById("modal-close");

    try {
        // Отримуємо дані з JSON-файлу
        const response = await fetch("/assets/data/about/news.json");

        if (!response.ok) {
            throw new Error("Не вдалося завантажити файл новин");
        }

        const newsList = await response.json();

        // Очищуємо контейнер про всяк випадок
        containerMain.innerHTML = "";

        // Беремо перші 6 новин із початку файлу
        const latestNews = newsList.slice(0, 6);

        // Перебираємо кожну новину з масиву і створюємо для неї HTML
        latestNews.forEach((news) => {
            const newsCard = document.createElement("article");
            newsCard.className = "news-card";

            newsCard.innerHTML = `
            <div class="news-grid__card card">
                <div class="card__img">
                    <img
                        src="${news.image}"
                        alt="${news.title}"
                        class="card__img-settings" />
                </div>
                <div class="card__content">
                    <div class="card__date">
                        <span class="card__date">
                            <svg
                                width="25px"
                                height="25px"
                                viewBox="-1 0 32 32"
                                version="1.1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                                <title>calendar</title>
                                <desc>Created with Sketch Beta.</desc>
                                <defs></defs>
                                <g
                                    id="Page-1"
                                    stroke="none"
                                    stroke-width="1"
                                    fill="none"
                                    fill-rule="evenodd"
                                    sketch:type="MSPage">
                                    <g
                                        id="Icon-Set"
                                        sketch:type="MSLayerGroup"
                                        transform="translate(-309.000000, -359.000000)"
                                        fill="#000000">
                                        <path
                                            d="M323,383 L325,383 L325,385 L323,385 L323,383 Z M323,387 L325,387 C326.104,387 327,386.104 327,385 L327,383 C327,381.896 326.104,381 325,381 L323,381 C321.896,381 321,381.896 321,383 L321,385 C321,386.104 321.896,387 323,387 L323,387 Z M315,383 L317,383 L317,385 L315,385 L315,383 Z M315,387 L317,387 C318.104,387 319,386.104 319,385 L319,383 C319,381.896 318.104,381 317,381 L315,381 C313.896,381 313,381.896 313,383 L313,385 C313,386.104 313.896,387 315,387 L315,387 Z M323,375 L325,375 L325,377 L323,377 L323,375 Z M323,379 L325,379 C326.104,379 327,378.104 327,377 L327,375 C327,373.896 326.104,373 325,373 L323,373 C321.896,373 321,373.896 321,375 L321,377 C321,378.104 321.896,379 323,379 L323,379 Z M315,375 L317,375 L317,377 L315,377 L315,375 Z M315,379 L317,379 C318.104,379 319,378.104 319,377 L319,375 C319,373.896 318.104,373 317,373 L315,373 C313.896,373 313,373.896 313,375 L313,377 C313,378.104 313.896,379 315,379 L315,379 Z M337,367 L311,367 L311,365 C311,363.896 311.896,363 313,363 L317,363 L317,364 C317,364.553 317.447,365 318,365 C318.553,365 319,364.553 319,364 L319,363 L329,363 L329,364 C329,364.553 329.447,365 330,365 C330.553,365 331,364.553 331,364 L331,363 L335,363 C336.104,363 337,363.896 337,365 L337,367 L337,367 Z M337,387 C337,388.104 336.104,389 335,389 L313,389 C311.896,389 311,388.104 311,387 L311,369 L337,369 L337,387 L337,387 Z M335,361 L331,361 L331,360 C331,359.448 330.553,359 330,359 C329.447,359 329,359.448 329,360 L329,361 L319,361 L319,360 C319,359.448 318.553,359 318,359 C317.447,359 317,359.448 317,360 L317,361 L313,361 C310.791,361 309,362.791 309,365 L309,387 C309,389.209 310.791,391 313,391 L335,391 C337.209,391 339,389.209 339,387 L339,365 C339,362.791 337.209,361 335,361 L335,361 Z M331,375 L333,375 L333,377 L331,377 L331,375 Z M331,379 L333,379 C334.104,379 335,378.104 335,377 L335,375 C335,373.896 334.104,373 333,373 L331,373 C329.896,373 329,373.896 329,375 L329,377 C329,378.104 329.896,379 331,379 L331,379 Z M331,383 L333,383 L333,385 L331,385 L331,383 Z M331,387 L333,387 C334.104,387 335,386.104 335,385 L335,383 C335,381.896 334.104,381 333,381 L331,381 C329.896,381 329,381.896 329,383 L329,385 C329,386.104 329.896,387 331,387 L331,387 Z"
                                            id="calendar"
                                            sketch:type="MSShapeGroup"></path>
                                    </g>
                                </g>
                            </svg>
                            ${news.date}</span
                        >
                    </div>
                    <h2 class="card__title">${news.title}</h2>
                    <p class="card__text">
                        ${news.text}
                    </p>
                </div>
        </div>
            `;
            // КЛІК НА КАРТКУ: відкриваємо модалку з повними даними
            newsCard.addEventListener("click", () => {
                modalImg.src = news.image;
                modalImg.alt = news.title;
                modalDate.textContent = news.date;
                modalTitle.textContent = news.title;
                modalText.textContent = news.text; // Тут текст виведеться повністю!

                modal.classList.add("is-open"); // Показуємо модалку
                document.body.style.overflow = "hidden"; // Блокуємо скролл самого сайту на фоні
            });

            // Додаємо створену картку в загальний контейнер
            containerMain.appendChild(newsCard);
        });
        // ЗАКРИТТЯ МОДАЛКИ: по кліку на хрестик
        modalClose.addEventListener("click", closeModal);

        // ЗАКРИТТЯ МОДАЛКИ: по кліку на темний фон навколо вікна
        modal.addEventListener("click", (e) => {
            if (e.target === modal) closeModal();
        });

        // ЗАКРИТТЯ МОДАЛКИ: по натисканню клавіші Escape
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
        });

        function closeModal() {
            modal.classList.remove("is-open");
            document.body.style.overflow = ""; // Повертаємо скролл сайту
        }
    } catch (error) {
        console.error("Помилка:", error);
        containerMain.innerHTML =
            '<p class="error-message">Вибачте, не вдалося завантажити новини. Спробуйте пізніше.</p>';
    }
}

// 3. НОВА ФУНКЦІЯ ДЛЯ ВІДОБРАЖЕННЯ ОДНІЄЇ КОНКРЕТНОЇ НОВИНИ (single-news.html)
async function loadSingleNews() {
    // Шукаємо унікальний контейнер саме цієї сторінки
    const singleNewsContainer = document.querySelector(".single-news__container");
    if (!singleNewsContainer) return; // Якщо ми не на цій сторінці — виходимо

    // 1. Отримуємо ID новини з адресного рядка (?id=значення)
    const urlParams = new URLSearchParams(window.location.search);
    const newsId = urlParams.get("id");

    if (!newsId) {
        window.location.href = "/internal-pages/about/news.html"; // Якщо зайшли без ID — повертаємо назад
        return;
    }

    try {
        const response = await fetch("/assets/data/about/news.json");
        if (!response.ok) throw new Error("Не вдалося завантажити файл новин");

        const newsList = await response.json();

        // 2. Шукаємо об'єкт новини, у якого id збігається з параметром з URL
        // Приводимо до рядка String(), про всяк випадок, якщо в JSON id записані як числа
        const currentNews = newsList.find((item) => String(item.id) === String(newsId));

        if (currentNews) {
            // 3. Зв'язуємо дані з вашою HTML розміткою
            document.getElementById("news-date").innerHTML = `
                <svg
                            width="25px"
                            height="25px"
                            viewBox="-1 0 32 32"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlns:xlink="http://www.w3.org/1999/xlink"
                            xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
                            <title>calendar</title>
                            <desc>Created with Sketch Beta.</desc>
                            <defs></defs>
                            <g
                                id="Page-1"
                                stroke="none"
                                stroke-width="1"
                                fill="none"
                                fill-rule="evenodd"
                                sketch:type="MSPage">
                                <g
                                    id="Icon-Set"
                                    sketch:type="MSLayerGroup"
                                    transform="translate(-309.000000, -359.000000)"
                                    fill="#000000">
                                    <path
                                        d="M323,383 L325,383 L325,385 L323,385 L323,383 Z M323,387 L325,387 C326.104,387 327,386.104 327,385 L327,383 C327,381.896 326.104,381 325,381 L323,381 C321.896,381 321,381.896 321,383 L321,385 C321,386.104 321.896,387 323,387 L323,387 Z M315,383 L317,383 L317,385 L315,385 L315,383 Z M315,387 L317,387 C318.104,387 319,386.104 319,385 L319,383 C319,381.896 318.104,381 317,381 L315,381 C313.896,381 313,381.896 313,383 L313,385 C313,386.104 313.896,387 315,387 L315,387 Z M323,375 L325,375 L325,377 L323,377 L323,375 Z M323,379 L325,379 C326.104,379 327,378.104 327,377 L327,375 C327,373.896 326.104,373 325,373 L323,373 C321.896,373 321,373.896 321,375 L321,377 C321,378.104 321.896,379 323,379 L323,379 Z M315,375 L317,375 L317,377 L315,377 L315,375 Z M315,379 L317,379 C318.104,379 319,378.104 319,377 L319,375 C319,373.896 318.104,373 317,373 L315,373 C313.896,373 313,373.896 313,375 L313,377 C313,378.104 313.896,379 315,379 L315,379 Z M337,367 L311,367 L311,365 C311,363.896 311.896,363 313,363 L317,363 L317,364 C317,364.553 317.447,365 318,365 C318.553,365 319,364.553 319,364 L319,363 L329,363 L329,364 C329,364.553 329.447,365 330,365 C330.553,365 331,364.553 331,364 L331,363 L335,363 C336.104,363 337,363.896 337,365 L337,367 L337,367 Z M337,387 C337,388.104 336.104,389 335,389 L313,389 C311.896,389 311,388.104 311,387 L311,369 L337,369 L337,387 L337,387 Z M335,361 L331,361 L331,360 C331,359.448 330.553,359 330,359 C329.447,359 329,359.448 329,360 L329,361 L319,361 L319,360 C319,359.448 318.553,359 318,359 C317.447,359 317,359.448 317,360 L317,361 L313,361 C310.791,361 309,362.791 309,365 L309,387 C309,389.209 310.791,391 313,391 L335,391 C337.209,391 339,389.209 339,387 L339,365 C339,362.791 337.209,361 335,361 L335,361 Z M331,375 L333,375 L333,377 L331,377 L331,375 Z M331,379 L333,379 C334.104,379 335,378.104 335,377 L335,375 C335,373.896 334.104,373 333,373 L331,373 C329.896,373 329,373.896 329,375 L329,377 C329,378.104 329.896,379 331,379 L331,379 Z M331,383 L333,383 L333,385 L331,385 L331,383 Z M331,387 L333,387 C334.104,387 335,386.104 335,385 L335,383 C335,381.896 334.104,381 333,381 L331,381 C329.896,381 329,381.896 329,383 L329,385 C329,386.104 329.896,387 331,387 L331,387 Z"
                                        id="calendar"
                                        sketch:type="MSShapeGroup"></path>
                                </g>
                            </g>
                        </svg>
                ${currentNews.date}
            `;
            document.getElementById("news-title").textContent = currentNews.title;

            const imgElement = document.getElementById("news-image");
            imgElement.src = currentNews.image;
            imgElement.alt = currentNews.title;

            // Якщо у файлі великий текст з тегами <p>, міняємо textContent на innerHTML
            document.getElementById("news-text").innerHTML = currentNews.text;

            // Динамічно міняємо назву вкладки браузера
            document.title = `${currentNews.title} | Коледж`;
        } else {
            document.getElementById("news-title").textContent = "Новину не знайдено";
            document.getElementById("news-text").textContent =
                "На жаль, такої публікації більше не існує або посилання застаріло.";
        }
    } catch (error) {
        console.error("Помилка завантаження новини:", error);
    }
}

// Запускаємо функцію, коли сторінка повністю завантажилася
document.addEventListener("DOMContentLoaded", () => {
    // Перевіряємо, чи ми на сторінці ВСІХ новин
    if (document.getElementById("news-page-container")) {
        loadNews();
    }
    // Перевіряємо, чи ми на ГОЛОВНІЙ сторінці
    if (document.getElementById("news-container")) {
        loadNewsMainPage();
    }
    loadSingleNews();
});
