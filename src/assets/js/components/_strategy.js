document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("strategy-list");
    const pageTitle = document.getElementById("strategy-title");

    // Якщо на сторінці немає контейнера, зупиняємо скрипт
    if (!container) return;

    // Завантаження даних
    fetch("/assets/data/about/strategy.json")
        .then((response) => {
            if (!response.ok) throw new Error("Помилка завантаження JSON");
            return response.json();
        })
        .then((data) => {
            // Витягуємо масив документів
            const documents = data.strategy || [];

            if (documents.length === 0) {
                if (pageTitle) pageTitle.textContent = "Документи";
                container.innerHTML = "<p>Список документів порожній.</p>";
                return;
            }

            // Беремо назву першого документа для головного заголовка h2
            if (pageTitle) {
                pageTitle.textContent = documents[0].title;
            }
            // Змінюємо заголовок вкладки браузера
            document.title = documents[0].title;

            // Виводимо документи на сторінку
            renderDocuments(documents);
        })
        .catch((error) => {
            console.error("Помилка:", error);
            if (pageTitle) pageTitle.textContent = "Помилка завантаження";
            container.innerHTML = `<p class="error-message" style="color: red;">Не вдалося завантажити документи.</p>`;
        });

    // Функція рендерингу карток з SVG іконкою
    function renderDocuments(documents) {
        const htmlContent = documents
            .map(
                (doc) => `
            <div class="single-page__item">
                <a href="${doc.url}" target="_blank" class="single-page__item-info" rel="noopener noreferrer">                                    <svg width="40px" height="40px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><style>.a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M10.3635,4.51A1.9944,1.9944,0,0,0,8.4189,6.5043V41.5056A1.9945,1.9945,0,0,0,10.3635,43.5H37.5867a1.9944,1.9944,0,0,0,1.9944-1.9944V14.4719H31.6036a1.9945,1.9945,0,0,1-1.9446-1.9944V4.5Z"/><line class="a" x1="29.5693" y1="4.51" x2="39.5312" y2="14.4719"/><line class="a" x1="15.838" y1="22.928" x2="32.1121" y2="22.928"/><line class="a" x1="15.838" y1="34.994" x2="32.1121" y2="34.994"/><line class="a" x1="15.838" y1="28.961" x2="32.1121" y2="28.961"/></svg>
                        ${doc.title}</a>
            </div>
        `,
            )
            .join("");

        container.innerHTML = htmlContent;
    }
});
