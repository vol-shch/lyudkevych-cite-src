// Функція для завантаження та виведення даних
async function loadVstupData() {
    // 1. Шукаємо головний контейнер
    const infoBox = document.getElementById("info-box");

    // 2. Якщо контейнера немає на цій сторінці — зупиняємо роботу функції
    if (!infoBox) {
        return;
    }

    // 3. Якщо контейнер є — виконуємо запит до JSON
    try {
        const response = await fetch("/assets/data/about/admission-block.json");

        if (!response.ok) {
            throw new Error("Не вдалося завантажити дані про вступ");
        }

        const data = await response.json();

        // 4. Заповнюємо елементи всередині знайденого info-box
        document.getElementById("vstup-title").textContent = data.title;
        document.getElementById("vstup-doc").textContent = data.documents;
        document.getElementById("vstup-exams").textContent = data.exams;
        document.getElementById("vstup-result").textContent = data.results;
    } catch (error) {
        console.error("Помилка:", error);

        // Перевіряємо наявність окремого елемента перед виводом помилки
        const titleElement = document.getElementById("vstup-title");
        if (titleElement) {
            titleElement.textContent = "Інформація оновлюється";
        }
    }
}

document.addEventListener("DOMContentLoaded", loadVstupData);
