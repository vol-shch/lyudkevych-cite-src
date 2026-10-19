const docUrl = "/assets/data/documents/documents.json";

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("documents-list");
    const pageTitle = document.getElementById("documents-page-title"); // Додайте цей ID для h2 заголовка на сторінці, якщо хочете міняти текст

    if (!container) return; // Якщо на сторінці немає цього блоку, зупиняємо скрипт

    // Словник для заміни технічних назв категорій на людські заголовки
    const categoryNames = {
        statuts: "Статути",
        polozhennya: "Положення коледжу",
        anti_corruption: "Антикорупція",
        diplom: "Порядок видачі дублікатів диплому",
        educational_plans: "Навчальні плани",
        educational_professional_plans: "Освітньо-професійні програми",
        inside_rules: "Правила внутрішнього трудового договору",
        license: "Сертифікати про акредитацію",
        orders: "Накази",
        materialne: "Матеріально-технічне забезпечення",
        reports: "Звіти",
    };

    // 1. Змінено: Дізнаємося категорію з URL-адреси (?category=polozhennya)
    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get("category");

    fetch(docUrl)
        .then((response) => {
            if (!response.ok) throw new Error("Помилка завантаження JSON");
            return response.json();
        })
        .then((data) => {
            // 2. Фільтруємо масив:
            // Якщо категорія вказана — фільтруємо. Якщо користувач перейшов просто на documents.html — беремо ВСІ дані
            let filteredDocuments = data;
            if (currentCategory) {
                filteredDocuments = data.filter((doc) => doc.category === currentCategory);
            }

            if (currentCategory) {
                const curentName = categoryNames[currentCategory] || currentCategory;
                if (pageTitle) pageTitle.textContent = curentName;

                // Встановлює, наприклад: "Статути — Офіційні документи"
                document.title = `${curentName}`;
            } else {
                if (pageTitle) pageTitle.textContent = "Усі офіційні документи";

                // Дефолтний заголовок для загальної сторінки
                document.title = "Усі офіційні документи — Коледж";
            }

            // 3. Виводимо відфільтровані документи (розмітка зберігається вашою)
            renderDocuments(filteredDocuments);
        })
        .catch((error) => {
            console.error("Помилка:", error);
            container.innerHTML = `<p class="error-message">Не вдалося завантажити документи.</p>`;
        });

    function renderDocuments(documents) {
        if (documents.length === 0) {
            container.innerHTML = "<p>У цьому розділі поки немає документів.</p>";
            return;
        }

        // Ваша оригінальна структура карток з SVG іконкою
        const htmlContent = documents
            .map(
                (doc) => `
            <div class="single-page__item">
                <a href="${doc.fileUrl}" target="_blank" class="single-page__item-info" rel="noopener noreferrer">                                    <svg width="40px" height="40px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><style>.a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M10.3635,4.51A1.9944,1.9944,0,0,0,8.4189,6.5043V41.5056A1.9945,1.9945,0,0,0,10.3635,43.5H37.5867a1.9944,1.9944,0,0,0,1.9944-1.9944V14.4719H31.6036a1.9945,1.9945,0,0,1-1.9446-1.9944V4.5Z"/><line class="a" x1="29.5693" y1="4.51" x2="39.5312" y2="14.4719"/><line class="a" x1="15.838" y1="22.928" x2="32.1121" y2="22.928"/><line class="a" x1="15.838" y1="34.994" x2="32.1121" y2="34.994"/><line class="a" x1="15.838" y1="28.961" x2="32.1121" y2="28.961"/></svg>
                        ${doc.title}</a>
            </div>
        `,
            )
            .join("");

        container.innerHTML = htmlContent;
    }
});
