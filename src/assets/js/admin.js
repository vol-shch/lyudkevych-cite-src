document.addEventListener("DOMContentLoaded", () => {
    const adminSelect = document.getElementById("admin-select");
    const form = document.getElementById("form-administration");
    const statusDiv = document.getElementById("admin-status");

    let administrationData = []; // Тут зберігатимемо завантажених співробітників

    // 1. Завантажуємо поточні дані з JSON для випадаючого списку
    function loadAdminList() {
        fetch("/assets/data/about/administration.json")
            .then((response) => response.json())
            .then((data) => {
                administrationData = data;

                // Очищаємо список, залишаючи лише перший дефолтний варіант
                adminSelect.innerHTML = '<option value="new">-- Додати нового співробітника --</option>';

                // Додаємо співробітників у селект
                data.forEach((person) => {
                    const option = document.createElement("option");
                    option.value = person.id;
                    option.textContent = `${person.name} (${person.position})`;
                    adminSelect.appendChild(option);
                });
            })
            .catch((error) => console.error("Помилка завантаження списку адміністрації:", error));
    }

    // Запускаємо завантаження при старті сторінки
    loadAdminList();

    // 2. Слідкуємо за зміною вибору у випадаючому списку
    adminSelect.addEventListener("change", (e) => {
        const selectedId = e.target.value;

        if (selectedId === "new") {
            // Якщо обрано новий — очищаємо форму
            form.reset();
            document.getElementById("admin-id").value = "";
        } else {
            // Шукаємо потрібну людину в масиві за ID
            const person = administrationData.find((p) => p.id == selectedId);
            if (person) {
                // Заповнюємо поля форми
                document.getElementById("admin-id").value = person.id;
                document.getElementById("admin-pos").value = person.position;
                document.getElementById("admin-name").value = person.name;
                document.getElementById("admin-img").value = person.image;
                document.getElementById("admin-text").value = person.text || "";
            }
        }
    });

    // 3. Обробка відправки форми
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const formProps = Object.fromEntries(formData.entries());
        const currentId = document.getElementById("admin-id").value;

        // Формуємо об'єкт під вашу структуру JSON
        const payload = {
            form_type: formProps.form_type,
            id: currentId ? parseInt(currentId) : Date.now(), // Якщо ID порожній — це новий запис, генеруємо ID
            position: formProps.position,
            name: formProps.name,
            image: formProps.image,
            text: formProps.text || "",
        };

        statusDiv.className = "status-message processing";
        statusDiv.style.display = "block";
        statusDiv.innerText = "Збереження даних...";

        fetch("save.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (!response.ok) throw new Error("Помилка сервера");
                return response.text();
            })
            .then((msg) => {
                statusDiv.className = "status-message success";
                statusDiv.innerText = msg;

                form.reset();
                document.getElementById("admin-id").value = "";

                // Перезавантажуємо список у селекті, щоб відобразити оновлені дані
                loadAdminList();
            })
            .catch((error) => {
                statusDiv.className = "status-message error";
                statusDiv.innerText = "Не вдалося зберегти дані.";
                console.error("Error:", error);
            });
    });
});

// ==========================================
// ЛОГІКА АДМІНІСТРУВАННЯ: НОВИНИ
// ==========================================
const newsSelect = document.getElementById("news-select");
const formNews = document.getElementById("form-news");
const newsDeleteBtn = document.getElementById("news-delete-btn");
const newsStatus = document.getElementById("news-status");

let newsFullData = [];

// 1. Завантаження новин
function loadNewsData() {
    fetch("/assets/data/about/news.json")
        .then((res) => {
            if (!res.ok) throw new Error("Помилка завантаження файлу новин");
            return res.json();
        })
        .then((data) => {
            newsFullData = Array.isArray(data) ? data : [];
            updateNewsSelectOptions();
        })
        .catch((err) => console.error("Помилка ініціалізації розділу новин:", err));
}

// Заповнення селекта
function updateNewsSelectOptions() {
    if (!newsSelect) return;

    newsSelect.innerHTML = '<option value="new">-- Створити нову новину --</option>';

    newsFullData.forEach((newsItem) => {
        const option = document.createElement("option");
        option.value = newsItem.id;
        option.textContent = newsItem.title;
        newsSelect.appendChild(option);
    });

    if (formNews) formNews.reset();
    const idInput = document.getElementById("news-id");
    if (idInput) idInput.readOnly = false;
    if (newsDeleteBtn) newsDeleteBtn.style.display = "none";
    setTodayDate();
}

// Допоміжна функція для дати
function setTodayDate() {
    const dateInput = document.getElementById("news-date");
    if (dateInput && !dateInput.value) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const year = today.getFullYear();
        dateInput.value = `${day}.${month}.${year}`;
    }
}

// 2. Вибір новини у селекті
if (newsSelect) {
    newsSelect.addEventListener("change", (e) => {
        const selectedId = e.target.value;
        const idInput = document.getElementById("news-id");

        if (selectedId === "new") {
            if (formNews) formNews.reset();
            if (idInput) idInput.readOnly = false;
            if (newsDeleteBtn) newsDeleteBtn.style.display = "none";
            setTodayDate();
        } else {
            const newsItem = newsFullData.find((n) => n.id === selectedId);
            if (newsItem) {
                idInput.value = newsItem.id;
                idInput.readOnly = true; // Забороняємо змінювати ID існуючої новини
                document.getElementById("news-title").value = newsItem.title || "";
                document.getElementById("news-date").value = newsItem.date || "";
                document.getElementById("news-img").value = newsItem.image || "";
                document.getElementById("news-text").value = newsItem.text || "";

                if (newsDeleteBtn) newsDeleteBtn.style.display = "inline-block";
            }
        }
    });
}

// 3. Відправка форми (створення / оновлення)
if (formNews) {
    formNews.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(formNews);
        const formProps = Object.fromEntries(formData.entries());

        const payload = {
            form_type: "news",
            id: formProps.id.trim(),
            title: formProps.title.trim(),
            date: formProps.date.trim(),
            image: formProps.image.trim(),
            text: formProps.text.trim(),
        };

        if (newsStatus) {
            newsStatus.className = "status-message processing";
            newsStatus.style.display = "block";
            newsStatus.innerText = "Збереження...";
        }

        fetch("save.php", {
            method: "POST",
            headers: {"Content-Type": "Application/json"},
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Помилка сервера");
                return res.text();
            })
            .then((msg) => {
                if (newsStatus) {
                    newsStatus.className = "status-message success";
                    newsStatus.innerText = msg;
                }
                loadNewsData();
            })
            .catch((err) => {
                if (newsStatus) {
                    newsStatus.className = "status-message error";
                    newsStatus.innerText = "Не вдалося зберегти новину.";
                }
                console.error("Error saving news:", err);
            });
    });
}

// 4. Кнопка видалення новини
if (newsDeleteBtn) {
    newsDeleteBtn.addEventListener("click", () => {
        const selectedId = document.getElementById("news-id").value.trim();

        if (!selectedId) {
            alert("Будь ласка, оберіть існуючу новину для видалення.");
            return;
        }

        if (!confirm(`Ви впевнені, що хочете видалити новину з ID "${selectedId}"?`)) {
            return;
        }

        const payload = {
            form_type: "news",
            id: selectedId,
            action: "delete",
            title: "",
            date: "",
            image: "",
            text: "",
        };

        if (newsStatus) {
            newsStatus.className = "status-message processing";
            newsStatus.style.display = "block";
            newsStatus.innerText = "Видалення...";
        }

        fetch("save.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Помилка сервера");
                return res.text();
            })
            .then((msg) => {
                if (newsStatus) {
                    newsStatus.className = "status-message success";
                    newsStatus.innerText = msg;
                }
                loadNewsData();
            })
            .catch((err) => {
                if (newsStatus) {
                    newsStatus.className = "status-message error";
                    newsStatus.innerText = "Не вдалося видалити новину.";
                }
                console.error("Error deleting news:", err);
            });
    });
}
if (formNews) {
    loadNewsData();
}

// ==========================================
// ЛОГІКА АДМІНІСТРУВАННЯ: СТРАТЕГІЯ РОЗВИТКУ
// ==========================================
const stratSelect = document.getElementById("strat-item-select");
const formStrat = document.getElementById("form-strategy");
const stratStatus = document.getElementById("strat-status");

let strategyDataArray = []; // Масив для збереження поточної стратегії в адмінці

// 1. Функція завантаження списку для адмін-селекту
function loadAdminStrategyList() {
    fetch("/assets/data/about/strategy.json")
        .then((res) => {
            if (!res.ok) throw new Error("Помилка завантаження JSON для адмінки");
            return res.json();
        })
        .then((data) => {
            strategyDataArray = data.strategy || [];

            if (stratSelect) {
                // Залишаємо базовий варіант створення нової картки
                stratSelect.innerHTML = '<option value="new">-- Додати новий документ --</option>';

                // Наповнюємо селект існуючими записами (значенням стає індекс масиву)
                strategyDataArray.forEach((item, index) => {
                    const option = document.createElement("option");
                    option.value = index;
                    option.textContent = item.title;
                    stratSelect.appendChild(option);
                });
            }
        })
        .catch((err) => console.error("Помилка ініціалізації адмін-списку стратегії:", err));
}

// Запускаємо завантаження списку, якщо на сторінці є форма адмінки
if (formStrat) {
    loadAdminStrategyList();
}

// 2. Відстеження вибору документа в селекті
if (stratSelect) {
    stratSelect.addEventListener("change", (e) => {
        const index = e.target.value;

        if (index === "new") {
            formStrat.reset();
            document.getElementById("strat-index").value = "-1";
        } else {
            const doc = strategyDataArray[index];
            if (doc) {
                // Заповнюємо приховані та видимі поля форми даними для редагування
                document.getElementById("strat-index").value = index;
                document.getElementById("strat-title").value = doc.title;
                document.getElementById("strat-url").value = doc.url;
            }
        }
    });
}

// 3. Обробка події submit форми стратегії
if (formStrat) {
    formStrat.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(formStrat);
        const formProps = Object.fromEntries(formData.entries());
        const index = parseInt(formProps.strat_index);

        // Будуємо payload точно під структуру вашого JSON файлу
        const payload = {
            form_type: formProps.form_type, // Передає "strategy_page"
            index: index, // Передає індекс елемента (-1 або числовий індекс)
            title: formProps.title.trim(),
            url: formProps.url.trim(),
        };

        stratStatus.className = "status-message processing";
        stratStatus.style.display = "block";
        stratStatus.innerText = "Збереження документа...";

        fetch("save.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Помилка відповіді сервера");
                return res.text();
            })
            .then((msg) => {
                stratStatus.className = "status-message success";
                stratStatus.innerText = msg;

                // Скидаємо форму до початкового стану
                formStrat.reset();
                document.getElementById("strat-index").value = "-1";

                // Перезавантажуємо селект, щоб зафіксувати зміни
                loadAdminStrategyList();
            })
            .catch((err) => {
                stratStatus.className = "status-message error";
                stratStatus.innerText = "Не вдалося зберегти зміни.";
                console.error("Error saving strategy:", err);
            });
    });
}

// ==========================================
// ЛОГІКА АДМІНІСТРУВАННЯ: АБІТУРІЄНТИ
// ==========================================
const admCatSelect = document.getElementById("adm-cat-select");
const admSubcatSelect = document.getElementById("adm-subcat-select");
const admItemSelect = document.getElementById("adm-item-select");
const formAdmission = document.getElementById("form-admission");
const admStatus = document.getElementById("adm-status");

let admissionFullData = {}; // Зберігатимемо тут увесь зчитаний об'єкт JSON

// 1. Завантаження JSON даних
function loadAdmissionData() {
    fetch("/assets/data/admission/admission-docs.json") // Підправте шлях до файлу за потреби
        .then((res) => {
            if (!res.ok) throw new Error("Помилка завантаження файлу абітурієнтів");
            return res.json();
        })
        .then((data) => {
            admissionFullData = data;
            updateSubcategoriesVisibility(); // Оновлюємо доступні підкатегорії та список елементів
        })
        .catch((err) => console.error("Помилка ініціалізації розділу абітурієнтів:", err));
}

// 2. Оновлення списку елементів на основі обраної категорії та підкатегорії
function updateAdmissionItemsList() {
    if (!admCatSelect || !admSubcatSelect || !admItemSelect) return;

    const category = admCatSelect.value;
    const subcategory = admSubcatSelect.value;

    // Створюємо структуру в локальній пам'яті, якщо категорія чи підкатегорія відсутні в JSON
    if (!admissionFullData[category]) admissionFullData[category] = {};
    if (!admissionFullData[category][subcategory]) admissionFullData[category][subcategory] = [];

    const itemsArray = admissionFullData[category][subcategory];

    // Очищаємо селект елементів
    admItemSelect.innerHTML = '<option value="new">-- Додати новий запис --</option>';

    // Наповнюємо селект існуючими записами
    itemsArray.forEach((item, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = item.title;
        admItemSelect.appendChild(option);
    });

    // Після зміни категорій скидаємо форму до стану створення "Нового запису"
    if (formAdmission) formAdmission.reset();
    document.getElementById("adm-index").value = "-1";
}

// Функція-запобіжник для підкатегорій (наприклад, відео є тільки у requirements)
function updateSubcategoriesVisibility() {
    const category = admCatSelect.value;

    // Якщо вибрано не "requirements", ховаємо або деактивуємо опцію відео для уникнення помилок викладачів
    const videoOption = admSubcatSelect.querySelector('option[value="video"]');
    if (category !== "requirements") {
        admSubcatSelect.value = "current";
        if (videoOption) videoOption.style.display = "none";
    } else {
        if (videoOption) videoOption.style.display = "block";
    }

    updateAdmissionItemsList();
}

// Слухачі подій для селектів навігації
if (admCatSelect) admCatSelect.addEventListener("change", updateSubcategoriesVisibility);
if (admSubcatSelect) admSubcatSelect.addEventListener("change", updateAdmissionItemsList);

if (admItemSelect) {
    admItemSelect.addEventListener("change", (e) => {
        const index = e.target.value;
        const category = admCatSelect.value;
        const subcategory = admSubcatSelect.value;

        if (index === "new") {
            formAdmission.reset();
            document.getElementById("adm-index").value = "-1";
        } else {
            const item = admissionFullData[category][subcategory][index];
            if (item) {
                document.getElementById("adm-index").value = index;
                document.getElementById("adm-title").value = item.title;
                document.getElementById("adm-url").value = item.url;
            }
        }
    });
}

// 3. Відправка форми на save.php
if (formAdmission) {
    formAdmission.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(formAdmission);
        const formProps = Object.fromEntries(formData.entries());
        const index = parseInt(formProps.adm_index);

        const payload = {
            form_type: formProps.form_type, // "admission_page"
            category: admCatSelect.value,
            subcategory: admSubcatSelect.value,
            index: index,
            title: formProps.title.trim(),
            url: formProps.url.trim(),
        };

        admStatus.className = "status-message processing";
        admStatus.style.display = "block";
        admStatus.innerText = "Збереження...";

        fetch("save.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Помилка сервера");
                return res.text();
            })
            .then((msg) => {
                admStatus.className = "status-message success";
                admStatus.innerText = msg;

                formAdmission.reset();
                document.getElementById("adm-index").value = "-1";

                // Перезавантажуємо структуру, щоб зафіксувати зміни
                loadAdmissionData();
            })
            .catch((err) => {
                admStatus.className = "status-message error";
                admStatus.innerText = "Не вдалося зберегти дані.";
                console.error("Error saving admission data:", err);
            });
    });
}

// Ініціалізація розділу при завантаженні сторінки адмінки
if (formAdmission) {
    loadAdmissionData();
}

// КНОПКА ВИДАЛЕННЯ ======================================

const admDeleteBtn = document.getElementById("adm-delete-btn");

// 1. Керування видимістю кнопки видалення при виборі елемента у селекті
if (admItemSelect) {
    admItemSelect.addEventListener("change", (e) => {
        const index = e.target.value;
        const category = admCatSelect.value;
        const subcategory = admSubcatSelect.value;

        if (index === "new") {
            formAdmission.reset();
            document.getElementById("adm-index").value = "-1";
            if (admDeleteBtn) admDeleteBtn.style.display = "none"; // Ховаємо кнопку на новому записі
        } else {
            const item = admissionFullData[category][subcategory][index];
            if (item) {
                document.getElementById("adm-index").value = index;
                document.getElementById("adm-title").value = item.title;
                document.getElementById("adm-url").value = item.url;
                if (admDeleteBtn) admDeleteBtn.style.display = "inline-block"; // Показуємо кнопку при редагуванні
            }
        }
    });
}

// 2. Обробка натискання на кнопку видалення
if (admDeleteBtn) {
    admDeleteBtn.addEventListener("click", () => {
        const index = parseInt(document.getElementById("adm-index").value);

        if (index < 0) {
            alert("Будь ласка, оберіть існуючий запис для видалення.");
            return;
        }

        if (!confirm("Ви впевнені, що хочете видалити цей запис?")) {
            return;
        }

        const payload = {
            form_type: "admission_page",
            category: admCatSelect.value,
            subcategory: admSubcatSelect.value,
            index: index,
            action: "delete", // Вказуємо специфічну дію
            title: "",
            url: "",
        };

        admStatus.className = "status-message processing";
        admStatus.style.display = "block";
        admStatus.innerText = "Видалення...";

        fetch("save.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Помилка сервера");
                return res.text();
            })
            .then((msg) => {
                admStatus.className = "status-message success";
                admStatus.innerText = msg;

                formAdmission.reset();
                document.getElementById("adm-index").value = "-1";
                if (admDeleteBtn) admDeleteBtn.style.display = "none";

                loadAdmissionData(); // Оновлюємо дані
            })
            .catch((err) => {
                admStatus.className = "status-message error";
                admStatus.innerText = "Не вдалося видалити дані.";
                console.error("Error deleting admission data:", err);
            });
    });
}

if (admDeleteBtn) admDeleteBtn.style.display = "none";

// ==========================================
// ЛОГІКА АДМІНІСТРУВАННЯ: СТУДЕНТАМ
// ==========================================

const studCatSelect = document.getElementById("stud-cat-select");
const studTypeSelect = document.getElementById("stud-type-select"); // Новий селект типу
const studItemSelect = document.getElementById("stud-item-select");
const formStudents = document.getElementById("form-students");
const studStatus = document.getElementById("stud-status");

let studentsFullData = {};

// Допоміжна функція для отримання актуального ключа масиву (з врахуванням архіву)
function getSelectedDataKey() {
    const category = studCatSelect ? studCatSelect.value : "schedule_classes";
    const isArchive = studTypeSelect && studTypeSelect.value === "1";
    return isArchive ? `${category}_archive` : category;
}

// 1. Завантаження JSON даних
function loadStudentsData() {
    fetch("/assets/data/students/students-docs.json")
        .then((res) => {
            if (!res.ok) throw new Error("Помилка завантаження файлу студентів");
            return res.json();
        })
        .then((data) => {
            studentsFullData = data;
            updateStudentsItemsList();
        })
        .catch((err) => console.error("Помилка ініціалізації розділу студентів:", err));
}

// 2. Оновлення списку елементів
function updateStudentsItemsList() {
    if (!studCatSelect || !studItemSelect) return;

    const dataKey = getSelectedDataKey();

    // Створюємо структуру в пам'яті, якщо такого масиву ще немає
    if (!studentsFullData[dataKey]) studentsFullData[dataKey] = [];

    const itemsArray = studentsFullData[dataKey];

    studItemSelect.innerHTML = '<option value="new">-- Додати новий запис --</option>';

    itemsArray.forEach((item, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = item.title;
        studItemSelect.appendChild(option);
    });

    if (formStudents) {
        const currentCat = studCatSelect.value;
        const currentType = studTypeSelect ? studTypeSelect.value : "0";
        formStudents.reset();
        studCatSelect.value = currentCat;
        if (studTypeSelect) studTypeSelect.value = currentType;
    }
    document.getElementById("stud-index").value = "-1";
}

// Слухачі подій для зміни категорії або типу (актуальне / архів)
if (studCatSelect) studCatSelect.addEventListener("change", updateStudentsItemsList);
if (studTypeSelect) studTypeSelect.addEventListener("change", updateStudentsItemsList);

// Слухач подій для вибору конкретного документа
if (studItemSelect) {
    studItemSelect.addEventListener("change", (e) => {
        const index = e.target.value;
        const dataKey = getSelectedDataKey();

        if (index === "new") {
            const currentCat = studCatSelect.value;
            const currentType = studTypeSelect ? studTypeSelect.value : "0";
            if (formStudents) formStudents.reset();
            studCatSelect.value = currentCat;
            if (studTypeSelect) studTypeSelect.value = currentType;
            document.getElementById("stud-index").value = "-1";
        } else {
            const item = studentsFullData[dataKey][index];
            if (item) {
                document.getElementById("stud-index").value = index;
                document.getElementById("stud-title").value = item.title;
                document.getElementById("stud-url").value = item.url;
            }
        }
    });
}

// 3. Відправка форми на save.php
if (formStudents) {
    formStudents.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(formStudents);
        const formProps = Object.fromEntries(formData.entries());
        const index = parseInt(formProps.stud_index);

        const payload = {
            form_type: formProps.form_type,
            category: studCatSelect.value,
            is_archive: studTypeSelect ? studTypeSelect.value : "0", // Передаємо ознаку архіву
            index: index,
            title: formProps.title.trim(),
            url: formProps.url.trim(),
        };

        studStatus.className = "status-message processing";
        studStatus.style.display = "block";
        studStatus.innerText = "Збереження...";

        fetch("save.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Помилка сервера");
                return res.text();
            })
            .then((msg) => {
                studStatus.className = "status-message success";
                studStatus.innerText = msg;

                if (formStudents) formStudents.reset();
                document.getElementById("stud-index").value = "-1";

                loadStudentsData();
            })
            .catch((err) => {
                studStatus.className = "status-message error";
                studStatus.innerText = "Не вдалося зберегти дані.";
                console.error("Error saving students data:", err);
            });
    });
}

if (formStudents) {
    loadStudentsData();
}

// КНОПКА ВИДАЛЕННЯ =========================
const studDeleteBtn = document.getElementById("stud-delete-btn");

// 1. Оновлюємо функцію відображення списку елементів, щоб ховати кнопку видалення при скиданні
const originalUpdateStudentsItemsList = updateStudentsItemsList;
// Або просто додай всередину існуючої updateStudentsItemsList рядок:
// if (studDeleteBtn) studTypeSelect (або де зручно) -> краще в обробник вибору елемента:

if (studItemSelect) {
    studItemSelect.addEventListener("change", (e) => {
        const index = e.target.value;
        const dataKey = getSelectedDataKey();

        if (index === "new") {
            const currentCat = studCatSelect.value;
            const currentType = studTypeSelect ? studTypeSelect.value : "0";
            if (formStudents) formStudents.reset();
            studCatSelect.value = currentCat;
            if (studTypeSelect) studTypeSelect.value = currentType;
            document.getElementById("stud-index").value = "-1";
            if (studDeleteBtn) studDeleteBtn.style.display = "none"; // Ховаємо кнопку
        } else {
            const item = studentsFullData[dataKey][index];
            if (item) {
                document.getElementById("stud-index").value = index;
                document.getElementById("stud-title").value = item.title;
                document.getElementById("stud-url").value = item.url;
                if (studDeleteBtn) studDeleteBtn.style.display = "inline-block"; // Показуємо кнопку
            }
        }
    });
}

// Також ховаємо кнопку при зміні категорії чи типу архіву
if (studCatSelect) {
    studCatSelect.addEventListener("change", () => {
        if (studDeleteBtn) studDeleteBtn.style.display = "none";
    });
}
if (studTypeSelect) {
    studTypeSelect.addEventListener("change", () => {
        if (studDeleteBtn) studDeleteBtn.style.display = "none";
    });
}

// 2. Обробка натискання на кнопку видалення студентів
if (studDeleteBtn) {
    studDeleteBtn.addEventListener("click", () => {
        const index = parseInt(document.getElementById("stud-index").value);

        if (index < 0) {
            alert("Будь ласка, оберіть існуючий документ для видалення.");
            return;
        }

        if (!confirm("Ви впевнені, що хочете видалити цей документ?")) {
            return;
        }

        const payload = {
            form_type: "students_page",
            category: studCatSelect.value,
            is_archive: studTypeSelect ? studTypeSelect.value : "0",
            index: index,
            action: "delete",
            title: "",
            url: "",
        };

        studStatus.className = "status-message processing";
        studStatus.style.display = "block";
        studStatus.innerText = "Видалення...";

        fetch("save.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Помилка сервера");
                return res.text();
            })
            .then((msg) => {
                studStatus.className = "status-message success";
                studStatus.innerText = msg;

                if (formStudents) {
                    const currentCat = studCatSelect.value;
                    const currentType = studTypeSelect ? studTypeSelect.value : "0";
                    formStudents.reset();
                    studCatSelect.value = currentCat;
                    if (studTypeSelect) studTypeSelect.value = currentType;
                }
                document.getElementById("stud-index").value = "-1";
                if (studDeleteBtn) studDeleteBtn.style.display = "none";

                loadStudentsData(); // Оновлюємо дані
            })
            .catch((err) => {
                studStatus.className = "status-message error";
                studStatus.innerText = "Не вдалося видалити дані.";
                console.error("Error deleting students data:", err);
            });
    });
}

// ==========================================
// ЛОГІКА АДМІНІСТРУВАННЯ: ЯКІСТЬ ОСВІТИ
// ==========================================
const qualCatSelect = document.getElementById("qual-cat-select");
const qualSecSelect = document.getElementById("qual-sec-select");
const qualItemSelect = document.getElementById("qual-item-select");
const formQuality = document.getElementById("form-quality");
const qualStatus = document.getElementById("qual-status");

let qualityFullData = {};

function loadQualityData() {
    fetch("/assets/data/quality/quality-docs.json")
        .then((res) => {
            if (!res.ok) throw new Error("Помилка завантаження файлу якості освіти");
            return res.json();
        })
        .then((data) => {
            qualityFullData = data;
            updateQualitySectionsList();
        })
        .catch((err) => console.error("Помилка ініціалізації розділу якості освіти:", err));
}

// Оновлюємо список Секцій (Другий селект)
function updateQualitySectionsList() {
    if (!qualCatSelect || !qualSecSelect) return;

    const category = qualCatSelect.value;
    if (!qualityFullData[category]) qualityFullData[category] = {sections: []};
    if (!qualityFullData[category].sections) qualityFullData[category].sections = [];

    const sections = qualityFullData[category].sections;
    qualSecSelect.innerHTML = "";

    sections.forEach((sec, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = sec.section_title;
        qualSecSelect.appendChild(option);
    });

    // Додаємо можливість створити абсолютно нову секцію
    const newSecOption = document.createElement("option");
    newSecOption.value = "new_section";
    newSecOption.textContent = "+ Створити новий підрозділ";
    qualSecSelect.appendChild(newSecOption);

    updateQualityItemsList();
}

// Оновлюємо список Елементів (Третій селект)
function updateQualityItemsList() {
    if (!qualCatSelect || !qualSecSelect || !qualItemSelect) return;

    const category = qualCatSelect.value;
    const secIndex = qualSecSelect.value;
    const secTitleInput = document.getElementById("qual-sec-title");

    qualItemSelect.innerHTML = '<option value="new">-- Додати новий запис --</option>';

    if (secIndex === "new_section") {
        secTitleInput.value = "";
        secTitleInput.readOnly = false;
        clearQualityItemFields();
        return;
    }

    const currentSection = qualityFullData[category].sections[secIndex];
    if (currentSection) {
        secTitleInput.value = currentSection.section_title;

        const items = currentSection.items || [];
        items.forEach((item, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = item.title;
            qualItemSelect.appendChild(option);
        });
    }

    clearQualityItemFields();
}

function clearQualityItemFields() {
    document.getElementById("qual-index").value = "-1";
    document.getElementById("qual-title").value = "";
    document.getElementById("qual-url").value = "";
}

if (qualCatSelect) qualCatSelect.addEventListener("change", updateQualitySectionsList);
if (qualSecSelect) qualSecSelect.addEventListener("change", updateQualityItemsList);

if (qualItemSelect) {
    qualItemSelect.addEventListener("change", (e) => {
        const index = e.target.value;
        const category = qualCatSelect.value;
        const secIndex = qualSecSelect.value;

        if (index === "new" || secIndex === "new_section") {
            clearQualityItemFields();
        } else {
            const item = qualityFullData[category].sections[secIndex].items[index];
            if (item) {
                document.getElementById("qual-index").value = index;
                document.getElementById("qual-title").value = item.title;
                document.getElementById("qual-url").value = item.url;
            }
        }
    });
}

if (formQuality) {
    formQuality.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(formQuality);
        const formProps = Object.fromEntries(formData.entries());

        const payload = {
            form_type: formProps.form_type, // "quality_page"
            category: qualCatSelect.value,
            section_index: qualSecSelect.value, // число або "new_section"
            section_title: formProps.section_title.trim(),
            index: parseInt(formProps.qual_index),
            title: formProps.title.trim(),
            url: formProps.url.trim(),
        };

        qualStatus.className = "status-message processing";
        qualStatus.style.display = "block";
        qualStatus.innerText = "Збереження...";

        fetch("save.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Помилка сервера");
                return res.text();
            })
            .then((msg) => {
                qualStatus.className = "status-message success";
                qualStatus.innerText = msg;

                const savedCategory = qualCatSelect.value;

                fetch("/assets/data/quality/quality.json?t=" + Date.now())
                    .then((r) => r.json())
                    .then((updatedData) => {
                        qualityFullData = updatedData;
                        qualCatSelect.value = savedCategory;
                        updateQualitySectionsList();
                    });
            })
            .catch((err) => {
                qualStatus.className = "status-message error";
                qualStatus.innerText = "Не вдалося зберегти зміни.";
                console.error(err);
            });
    });
}

if (formQuality) {
    loadQualityData();
}

// КНОПКА ВИДАЛЕННЯ =======================================================================

const qualDeleteItemBtn = document.getElementById("qual-delete-item-btn");
const qualDeleteSectionBtn = document.getElementById("qual-delete-section-btn");

// Оновлюємо функцію очищення полів, щоб також ховати кнопки видалення за потреби
function clearQualityItemFields() {
    document.getElementById("qual-index").value = "-1";
    document.getElementById("qual-title").value = "";
    document.getElementById("qual-url").value = "";
    if (qualDeleteItemBtn) qualDeleteItemBtn.style.display = "none";
}

// Управління кнопкою видалення секції при зміні селекта секцій
const originalUpdateQualityItemsList = updateQualityItemsList;
updateQualityItemsList = function () {
    originalUpdateQualityItemsList();

    const secIndex = qualSecSelect ? qualSecSelect.value : "";
    if (secIndex === "new_section") {
        if (qualDeleteSectionBtn) qualDeleteSectionBtn.style.display = "none";
    } else {
        if (qualDeleteSectionBtn) qualDeleteSectionBtn.style.display = "inline-block";
    }
    if (qualDeleteItemBtn) qualDeleteItemBtn.style.display = "none";
};

// Показуємо кнопку видалення документа, якщо обрано існуючий елемент
if (qualItemSelect) {
    qualItemSelect.addEventListener("change", (e) => {
        const index = e.target.value;
        const category = qualCatSelect.value;
        const secIndex = qualSecSelect.value;

        if (index === "new" || secIndex === "new_section") {
            clearQualityItemFields();
        } else {
            const item = qualityFullData[category].sections[secIndex].items[index];
            if (item) {
                document.getElementById("qual-index").value = index;
                document.getElementById("qual-title").value = item.title;
                document.getElementById("qual-url").value = item.url;
                if (qualDeleteItemBtn) qualDeleteItemBtn.style.display = "inline-block";
            }
        }
    });
}

// Обробник видалення окремого документа
if (qualDeleteItemBtn) {
    qualDeleteItemBtn.addEventListener("click", () => {
        const index = parseInt(document.getElementById("qual-index").value);
        if (index < 0) return;

        if (!confirm("Ви впевнені, що хочете видалити цей документ?")) return;

        sendQualityAction({
            form_type: "quality_page",
            category: qualCatSelect.value,
            section_index: qualSecSelect.value,
            section_title: document.getElementById("qual-sec-title").value.trim(),
            index: index,
            action: "delete_item",
            title: "",
            url: "",
        });
    });
}

// Обробник видалення цілої секції
if (qualDeleteSectionBtn) {
    qualDeleteSectionBtn.addEventListener("click", () => {
        const secIndex = qualSecSelect.value;
        if (secIndex === "new_section") return;

        if (!confirm("УВАГА! Ви видаляєте весь підрозділ разом із усіма документами в ньому. Продовжити?")) return;

        sendQualityAction({
            form_type: "quality_page",
            category: qualCatSelect.value,
            section_index: secIndex,
            section_title: document.getElementById("qual-sec-title").value.trim(),
            index: -1,
            action: "delete_section",
            title: "",
            url: "",
        });
    });
}

// Допоміжна функція для відправки запитів видалення / збереження
function sendQualityAction(payload) {
    qualStatus.className = "status-message processing";
    qualStatus.style.display = "block";
    qualStatus.innerText = "Обробка...";

    fetch("save.php", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload),
    })
        .then((res) => {
            if (!res.ok) throw new Error("Помилка сервера");
            return res.text();
        })
        .then((msg) => {
            qualStatus.className = "status-message success";
            qualStatus.innerText = msg;

            const savedCategory = qualCatSelect.value;
            // Зверни увагу на шлях до твого файлу даних якості (заміни шлях, якщо у тебе використовується інший шлях завантаження JSON)
            fetch("/assets/data/quality/quality-docs.json?t=" + Date.now())
                .then((r) => r.json())
                .then((updatedData) => {
                    qualityFullData = updatedData;
                    qualCatSelect.value = savedCategory;
                    updateQualitySectionsList();
                });
        })
        .catch((err) => {
            qualStatus.className = "status-message error";
            qualStatus.innerText = "Не вдалося виконати операцію.";
            console.error(err);
        });
}

// ==========================================
// ЛОГІКА АДМІНІСТРУВАННЯ: ОФІЦІЙНІ ДОКУМЕНТИ
// ==========================================
const docCatSelect = document.getElementById("doc-cat-select");
const docItemSelect = document.getElementById("doc-item-select");
const formDocuments = document.getElementById("form-documents");
const docStatus = document.getElementById("doc-status");

let documentsFullData = []; // Тут зберігається масив []

function loadDocumentsData() {
    fetch("/assets/data/documents/documents.json")
        .then((res) => {
            if (!res.ok) throw new Error("Помилка завантаження офіційних документів");
            return res.json();
        })
        .then((data) => {
            documentsFullData = data;
            updateDocumentsItemsList();
        })
        .catch((err) => console.error("Помилка ініціалізації розділу документів:", err));
}

function updateDocumentsItemsList() {
    if (!docCatSelect || !docItemSelect) return;

    const category = docCatSelect.value;

    // Фільтруємо документи, що належать ЛИШЕ обраній категорії
    const filteredItems = documentsFullData.filter((item) => item.category === category);

    docItemSelect.innerHTML = '<option value="new">-- Додати новий документ --</option>';

    filteredItems.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id; // Передаємо у value унікальний ID з бази
        option.textContent = item.title;
        docItemSelect.appendChild(option);
    });

    if (formDocuments) {
        formDocuments.reset();
        docCatSelect.value = category;
    }
    document.getElementById("doc-id").value = "-1";
}

if (docCatSelect) docCatSelect.addEventListener("change", updateDocumentsItemsList);

if (docItemSelect) {
    docItemSelect.addEventListener("change", (e) => {
        const id = parseInt(e.target.value);
        const category = docCatSelect.value;

        if (e.target.value === "new") {
            if (formDocuments) formDocuments.reset();
            docCatSelect.value = category;
            document.getElementById("doc-id").value = "-1";
        } else {
            // Шукаємо документ в загальному масиві за його ID
            const item = documentsFullData.find((d) => d.id === id);
            if (item) {
                document.getElementById("doc-id").value = item.id;
                document.getElementById("doc-title").value = item.title;
                document.getElementById("doc-url").value = item.fileUrl; // Використовуємо fileUrl
            }
        }
    });
}

if (formDocuments) {
    formDocuments.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(formDocuments);
        const formProps = Object.fromEntries(formData.entries());
        const id = parseInt(formProps.doc_id);

        const payload = {
            form_type: formProps.form_type, // "documents_page"
            id: id,
            category: docCatSelect.value,
            title: formProps.title.trim(),
            fileUrl: formProps.fileUrl.trim(), // Передаємо саме як fileUrl
        };

        docStatus.className = "status-message processing";
        docStatus.style.display = "block";
        docStatus.innerText = "Збереження...";

        fetch("save.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Помилка сервера");
                return res.text();
            })
            .then((msg) => {
                docStatus.className = "status-message success";
                docStatus.innerText = msg;

                if (formDocuments) formDocuments.reset();
                document.getElementById("doc-id").value = "-1";

                loadDocumentsData();
            })
            .catch((err) => {
                docStatus.className = "status-message error";
                docStatus.innerText = "Не вдалося зберегти документ.";
                console.error("Error saving documents data:", err);
            });
    });
}

if (formDocuments) {
    loadDocumentsData();
}

// КНОПКА ВИДАЛЕННЯ =========================

const docDeleteBtn = document.getElementById("doc-delete-btn");

// Керування видимістю кнопки при виборі в селекті
if (docItemSelect) {
    docItemSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        const category = docCatSelect.value;

        if (val === "new") {
            if (formDocuments) formDocuments.reset();
            docCatSelect.value = category;
            document.getElementById("doc-id").value = "-1";
            if (docDeleteBtn) docDeleteBtn.style.display = "none"; // Ховаємо кнопку для нового запису
        } else {
            const id = parseInt(val);
            const item = documentsFullData.find((d) => d.id === id);
            if (item) {
                document.getElementById("doc-id").value = item.id;
                document.getElementById("doc-title").value = item.title;
                document.getElementById("doc-url").value = item.fileUrl;
                if (docDeleteBtn) docDeleteBtn.style.display = "inline-block"; // Показуємо кнопку при редагуванні
            }
        }
    });
}

// Також ховаємо кнопку видалення при зміні категорії
if (docCatSelect) {
    docCatSelect.addEventListener("change", () => {
        if (docDeleteBtn) docDeleteBtn.style.display = "none";
    });
}

// Обробник натискання на кнопку видалення
if (docDeleteBtn) {
    docDeleteBtn.addEventListener("click", () => {
        const id = parseInt(document.getElementById("doc-id").value);

        if (id < 0) {
            alert("Будь ласка, оберіть існуючий документ для видалення.");
            return;
        }

        if (!confirm("Ви впевнені, що хочете видалити цей документ?")) {
            return;
        }

        const payload = {
            form_type: "documents_page",
            id: id,
            category: docCatSelect.value,
            title: "",
            fileUrl: "",
            action: "delete", // Специфічний прапорець для видалення
        };

        docStatus.className = "status-message processing";
        docStatus.style.display = "block";
        docStatus.innerText = "Видалення...";

        fetch("save.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Помилка сервера");
                return res.text();
            })
            .then((msg) => {
                docStatus.className = "status-message success";
                docStatus.innerText = msg;

                if (formDocuments) {
                    const currentCat = docCatSelect.value;
                    formDocuments.reset();
                    docCatSelect.value = currentCat;
                }
                document.getElementById("doc-id").value = "-1";
                if (docDeleteBtn) docDeleteBtn.style.display = "none";

                loadDocumentsData(); // Оновлюємо список
            })
            .catch((err) => {
                docStatus.className = "status-message error";
                docStatus.innerText = "Не вдалося видалити документ.";
                console.error("Error deleting document:", err);
            });
    });
}

// ==========================================
// ЛОГІКА АДМІНІСТРУВАННЯ: СТРОКИ ВСТУПУ
// ==========================================
const formIntro = document.getElementById("form-intro");
const introStatus = document.getElementById("intro-status");

// 1. Завантаження даних та автозаповнення полів
function loadIntroData() {
    fetch("/assets/data/about/admission-block.json") // Підкоригуй шлях за потреби
        .then((res) => {
            if (!res.ok) throw new Error("Помилка завантаження строків вступу");
            return res.json();
        })
        .then((data) => {
            // Оскільки це плоский об'єкт, просто розкладаємо значення по полях
            if (data.title) document.getElementById("intro-title").value = data.title;
            if (data.documents) document.getElementById("intro-documents").value = data.documents;
            if (data.exams) document.getElementById("intro-exams").value = data.exams;
            if (data.results) document.getElementById("intro-results").value = data.results;
        })
        .catch((err) => console.error("Помилка ініціалізації строків вступу:", err));
}

// 2. Відправка оновлених дат на сервер
if (formIntro) {
    formIntro.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(formIntro);
        const formProps = Object.fromEntries(formData.entries());

        // Формуємо чистий об'єкт без індексів та категорій
        const payload = {
            form_type: formProps.form_type, // "intro_page"
            title: formProps.title.trim(),
            documents: formProps.documents.trim(),
            exams: formProps.exams.trim(),
            results: formProps.results.trim(),
        };

        introStatus.className = "status-message processing";
        introStatus.style.display = "block";
        introStatus.innerText = "Збереження...";

        fetch("save.php", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload),
        })
            .then((res) => {
                if (!res.ok) throw new Error("Помилка сервера");
                return res.text();
            })
            .then((msg) => {
                introStatus.className = "status-message success";
                introStatus.innerText = msg;

                // Перезавантажуємо актуальні дані для впевненості
                loadIntroData();
            })
            .catch((err) => {
                introStatus.className = "status-message error";
                introStatus.innerText = "Не вдалося зберегти зміни.";
                console.error("Error saving intro data:", err);
            });
    });
}

// Ініціалізація розділу строків вступу
if (formIntro) {
    loadIntroData();
}
