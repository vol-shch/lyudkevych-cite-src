const dataUrl = "/assets/data/about/administration.json";

// Функція для створення HTML-карток
function renderCards(cardsArray) {
    const container = document.getElementById("administration-content");
    if (!container) return;

    // Очищаємо контейнер перед рендером
    container.innerHTML = "";

    cardsArray.forEach((item) => {
        const card = document.createElement("div");
        card.classList.add("administration__card", "card-ad");

        // Перевірка на порожній текст
        const textHtml = item.text ? `<p class="card-ad__desc">${item.text}</p>` : "";

        // Наповнюємо картку контентом
        card.innerHTML = `
            <div class="card-ad__img">
                        <img src="${item.image}" alt="${item.name}" />
                    </div>
                    <div class="card-ad__text">
                        <h2 class="card-ad__position">${item.position}</h2>
                        <h3 class="card-ad__name">${item.name}</h3>
                        ${textHtml}
                    </div>
        `;

        container.appendChild(card);
    });
}

// Асинхронна функція для завантаження даних із JSON-файлу
async function loadTeachersData() {
    try {
        const response = await fetch(dataUrl);

        // Перевіряємо, чи файл успішно знайprotect і завантажено
        if (!response.ok) {
            throw new Error(`Помилка завантаження файлу: ${response.status} ${response.statusText}`);
        }

        // Перетворюємо отриманий результат у масив об'єктів
        const data = await response.json();

        // Запускаємо рендеринг карток із отриманими даними
        renderCards(data);
    } catch (error) {
        console.error("Не вдалося завантажити дані викладачів:", error);

        // Можна вивести повідомлення для користувача на сторінці у разі помилки
        const container = document.getElementById("administration-content");
        if (container) {
            container.innerHTML = `<p style="color: red; padding: 20px;">Помилка завантаження даних. Будь ласка, спробуйте пізніше.</p>`;
        }
    }
}

// Запускаємо завантаження після того, як DOM повністю готовий
document.addEventListener("DOMContentLoaded", () => {
    loadTeachersData();
});
