document.addEventListener("DOMContentLoaded", () => {
    const pageTitle = document.getElementById("admission-page-title");
    const docsContainer = document.getElementById("admission-list");

    // Нові елементи для архівного блоку
    const pastResultsBlock = document.getElementById("past-results-block");
    const pastDocsContainer = document.getElementById("past-docs-list");

    if (!docsContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const currentTab = urlParams.get("tab") || "rules";

    const metaTitles = {
        annonounce: "Оголошення",
        rules: "Правила прийому",
        polozhennya: "Положення",
        documents: "Перелік документів для вступу",
        submission: "Порядок подання та розгляду заяв в електронній формі",
        schedule: "Розклад",
        results: "Результати вступних випробувань",
        requirements: "Вимоги до вступу та програми іспитів",
        rating: "Рейтинг",
        orders: "Накази про зарахування",
    };

    const activeTitle = metaTitles[currentTab] || "Інформація для вступника";
    pageTitle.textContent = activeTitle;
    document.title = `${activeTitle}`;

    // Завантажуємо JSON
    fetch("/assets/data/admission/admission-docs.json")
        .then((response) => response.json())
        .then((data) => {
            const categoryData = data[currentTab];

            if (!categoryData) {
                docsContainer.innerHTML = "<p>Розділ не знайдено.</p>";
                pastResultsBlock.style.display = "none";
                return;
            }

            // 1. Рендеримо актуальні документи (current)
            if (categoryData.current && categoryData.current.length > 0) {
                docsContainer.innerHTML = renderDocsList(categoryData.current);
            } else {
                docsContainer.innerHTML = "<p>Актуальні документи на цей рік ще не завантажені.</p>";
            }

            // 2. АВТОМАТИЧНА ПЕРЕВІРКА АРХІВУ (archive)
            if (categoryData.video && categoryData.video.length > 0) {
                pastResultsBlock.style.display = "block"; // Показуємо блок, бо файли є
                pastDocsContainer.innerHTML = renderDocsList(categoryData.video);
            } else {
                pastResultsBlock.style.display = "none"; // Ховаємо блок, бо архів порожній
            }
        })
        .catch((err) => console.error("Помилка завантаження динамічних даних:", err));
});

// Допоміжна функція, щоб не дублювати HTML-код рендерингу карток
function renderDocsList(docsArray) {
    return `
        <div class="single-page__list-wrapper">
            ${docsArray
                .map(
                    (doc) => `
                <div class="single-page__item">
                        <a href="${doc.url}" target="_blank" class="single-page__item-info" rel="noopener noreferrer">                                    <svg width="40px" height="40px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><style>.a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M10.3635,4.51A1.9944,1.9944,0,0,0,8.4189,6.5043V41.5056A1.9945,1.9945,0,0,0,10.3635,43.5H37.5867a1.9944,1.9944,0,0,0,1.9944-1.9944V14.4719H31.6036a1.9945,1.9945,0,0,1-1.9446-1.9944V4.5Z"/><line class="a" x1="29.5693" y1="4.51" x2="39.5312" y2="14.4719"/><line class="a" x1="15.838" y1="22.928" x2="32.1121" y2="22.928"/><line class="a" x1="15.838" y1="34.994" x2="32.1121" y2="34.994"/><line class="a" x1="15.838" y1="28.961" x2="32.1121" y2="28.961"/></svg>
                        ${doc.title}</a>
                </div>
            `,
                )
                .join("")}
        </div>
    `;
}
