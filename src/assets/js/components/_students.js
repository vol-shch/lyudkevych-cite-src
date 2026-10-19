document.addEventListener("DOMContentLoaded", () => {
    // Отримуємо елементи за новими ID
    const titleElement = document.getElementById("students-page-title");
    const listElement = document.getElementById("students-list");
    const archiveListElement = document.getElementById("archive-list");
    const archiveTitleElement = document.getElementById("archive-section-title");
    const archiveContainer = document.getElementById("archive-container");

    if (!listElement || !titleElement) return;

    // Шлях до вашого легкого JSON-файлу
    const jsonUrl = "/assets/data/students/students-docs.json";

    // Словник для динамічних заголовків (відповідно до ключів у JSON)
    const categoryTitles = {
        schedule_classes: "Розклад занять",
        schedule_exams: "Розклад сесії",
        academic_rating: "Рейтинг успішності",
        student_government: "Студентське самоврядування",
        student_rules: "Правила поведінки здобувачів освіти",
    };

    // 1. Зчитуємо параметр ?tab= з адресного рядка
    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get("tab") || "schedule_classes"; // Якщо параметра немає, відкриваємо розклад

    // 2. Міняємо заголовок на сторінці ТА назву вкладки в браузері
    const activeTitle = categoryTitles[currentCategory] || "Документи для студентів";

    titleElement.textContent = activeTitle;
    document.title = activeTitle;

    // 3. Завантажуємо дані з вашого JSON
    fetch(jsonUrl)
        .then((response) => {
            if (!response.ok) throw new Error("Помилка завантаження файлів");
            return response.json();
        })
        .then((data) => {
            const documents = data[currentCategory] || [];
            const archiveKey = `${currentCategory}_archive`;
            const archiveDocuments = data[archiveKey] || [];

            // 1. Рендеримо актуальні документи
            if (documents.length === 0) {
                listElement.innerHTML = "<p class='no-docs'>Наразі немає актуальних документів у цьому розділі.</p>";
            } else {
                listElement.innerHTML = documents
                    .map(
                        (doc) => `
                    <div class="single-page__item">
                        <a href="${doc.url}" target="_blank" class="single-page__item-info" rel="noopener noreferrer">
                            <svg width="40px" height="40px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><style>.a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M10.3635,4.51A1.9944,1.9944,0,0,0,8.4189,6.5043V41.5056A1.9945,1.9945,0,0,0,10.3635,43.5H37.5867a1.9944,1.9944,0,0,0,1.9944-1.9944V14.4719H31.6036a1.9945,1.9945,0,0,1-1.9446-1.9944V4.5Z"/><line class="a" x1="29.5693" y1="4.51" x2="39.5312" y2="14.4719"/><line class="a" x1="15.838" y1="22.928" x2="32.1121" y2="22.928"/><line class="a" x1="15.838" y1="34.994" x2="32.1121" y2="34.994"/><line class="a" x1="15.838" y1="28.961" x2="32.1121" y2="28.961"/></svg>
                            ${doc.title}
                        </a>
                    </div>
                `,
                    )
                    .join("");
            }

            // 2. Рендеримо архівні документи в новий блок, якщо вони є
            if (archiveContainer && archiveListElement && archiveDocuments.length > 0) {
                archiveContainer.style.display = "flex";

                archiveListElement.innerHTML = archiveDocuments
                    .map(
                        (doc) => `
                    <div class="single-page__item single-page__item--archive">
                        <a href="${doc.url}" target="_blank" class="single-page__item-info single-page__item-info_archive" rel="noopener noreferrer">
                            <svg width="40px" height="40px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><style>.a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}</style></defs><path class="a" d="M10.3635,4.51A1.9944,1.9944,0,0,0,8.4189,6.5043V41.5056A1.9945,1.9945,0,0,0,10.3635,43.5H37.5867a1.9944,1.9944,0,0,0,1.9944-1.9944V14.4719H31.6036a1.9945,1.9945,0,0,1-1.9446-1.9944V4.5Z"/><line class="a" x1="29.5693" y1="4.51" x2="39.5312" y2="14.4719"/><line class="a" x1="15.838" y1="22.928" x2="32.1121" y2="22.928"/><line class="a" x1="15.838" y1="34.994" x2="32.1121" y2="34.994"/><line class="a" x1="15.838" y1="28.961" x2="32.1121" y2="28.961"/></svg>
                            ${doc.title}
                        </a>
                    </div>
                `,
                    )
                    .join("");
            } else if (archiveContainer) {
                archiveContainer.style.display = "none"; // Повністю ховаємо весь блок, якщо архів порожній
            }
        })
        .catch((error) => {
            console.error("Помилка обробки:", error);
            titleElement.textContent = "Помилка";
            listElement.innerHTML =
                "<p class='error-message'>Не вдалося завантажити список документів. Спробуйте пізніше.</p>";
        });
});
