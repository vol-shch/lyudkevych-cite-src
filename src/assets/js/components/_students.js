document.addEventListener("DOMContentLoaded", () => {
    const titleElement = document.getElementById("students-page-title");
    const listElement = document.getElementById("students-list");

    if (!listElement || !titleElement) return;

    const jsonUrl = "/assets/data/students/students-docs.json";

    const categoryTitles = {
        schedule_classes: "Розклад занять",
        schedule_exams: "Розклад сесії",
        academic_rating: "Рейтинг успішності",
        schedule_year: "Графік освітнього процесу",
        student_government: "Студентське самоврядування",
        student_rules: "Правила поведінки здобувачів освіти",
        practical_education: "Практичне навчання",
        choise_lessions: "Каталог вибіркових дисциплін",
    };

    const urlParams = new URLSearchParams(window.location.search);
    const currentCategory = urlParams.get("tab") || "schedule_classes";

    const activeTitle = categoryTitles[currentCategory] || "Документи для студентів";
    titleElement.textContent = activeTitle;
    document.title = activeTitle;

    fetch(jsonUrl)
        .then((response) => {
            if (!response.ok) throw new Error("Помилка завантаження файлів");
            return response.json();
        })
        .then((data) => {
            const categoryData = data[currentCategory];

            if (!categoryData || !categoryData.sections || categoryData.sections.length === 0) {
                listElement.innerHTML = "<p class='no-docs'>Наразі немає доступних документів у цьому розділі.</p>";
                return;
            }

            const docIcon = `
                <svg width="40px" height="40px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                    <defs><style>.a{fill:none;stroke:#000000;stroke-linecap:round;stroke-linejoin:round;}</style></defs>
                    <path class="a" d="M10.3635,4.51A1.9944,1.9944,0,0,0,8.4189,6.5043V41.5056A1.9945,1.9945,0,0,0,10.3635,43.5H37.5867a1.9944,1.9944,0,0,0,1.9944-1.9944V14.4719H31.6036a1.9945,1.9945,0,0,1-1.9446-1.9944V4.5Z"/>
                    <line class="a" x1="29.5693" y1="4.51" x2="39.5312" y2="14.4719"/>
                    <line class="a" x1="15.838" y1="22.928" x2="32.1121" y2="22.928"/>
                    <line class="a" x1="15.838" y1="34.994" x2="32.1121" y2="34.994"/>
                    <line class="a" x1="15.838" y1="28.961" x2="32.1121" y2="28.961"/>
                </svg>
            `;

            const contentHTML = categoryData.sections
                .map((section) => {
                    const itemsHTML = section.items
                        .map(
                            (doc) => `
                        <div class="single-page__item">
                            <a href="${doc.url}" target="_blank" class="single-page__item-info" rel="noopener noreferrer">
                                ${docIcon}
                                ${doc.title}
                            </a>
                        </div>
                    `,
                        )
                        .join("");

                    return `
                    <div class="single-page__list-wrapper-quality">
                        <h3 class="quality-subsection__title title">${section.section_title}</h3>
                        <div class="single-page__grid">
                            ${itemsHTML}
                        </div>
                    </div>
                `;
                })
                .join("");

            listElement.innerHTML = contentHTML;
        })
        .catch((error) => {
            console.error("Помилка обробки:", error);
            titleElement.textContent = "Помилка";
            listElement.innerHTML =
                "<p class='error-message'>Не вдалося завантажити список документів. Спробуйте пізніше.</p>";
        });
});
