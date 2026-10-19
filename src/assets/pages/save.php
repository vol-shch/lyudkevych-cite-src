<?php
session_start();

// Блокуємо виконання скрипту, якщо запит йде не від авторизованого вчителя
if (!isset($_SESSION['auth']) || $_SESSION['auth'] !== true) {
    header('HTTP/1.1 403 Forbidden');
    echo "Доступ заборонено!";
    exit();
}

header('Content-Type: text/plain; charset=utf-8');

$inputData = file_get_contents('php://input');
$data = json_decode($inputData, true);

if (!$data || !isset($data['form_type'])) {
    http_response_code(400);
    die("Помилка: Некоректні дані або відсутній тип форми.");
}

$formType = $data['form_type'];
unset($data['form_type']); 

// --- РОЗПОДІЛ ШЛЯХІВ ЗА ТИПОМ ФОРМИ ---
$jsonFile = '';
if ($formType === 'administration') {
    $jsonFile = 'assets/data/about/administration.json'; 
} elseif ($formType === 'news') {
    $jsonFile = 'assets/data/about/news.json'; 
} elseif ($formType === 'strategy_page') {
    $jsonFile = 'assets/data/about/strategy.json'; 
} elseif ($formType === 'admission_page') {
    $jsonFile = 'assets/data/admission/admission-docs.json';
} elseif ($formType === 'students_page') {
    $jsonFile = 'assets/data/students/students-docs.json'; 
} elseif ($formType === 'quality_page') {
    $jsonFile = 'assets/data/quality/quality-docs.json';
} elseif ($formType === 'documents_page') {
    $jsonFile = 'assets/data/documents/documents.json';
} elseif ($formType === 'intro_page') {
    $jsonFile = 'assets/data/about/admission-block.json'; 
} else {
    http_response_code(400);
    die("Помилка: Невідомий розділ сайту.");
}

$currentData = [];
if (file_exists($jsonFile)) {
    $fileContent = file_get_contents($jsonFile);
    $currentData = json_decode($fileContent, true);
    if (!is_array($currentData)) {
        $currentData = [];
    }
}

// --- ЛОГІКА ЗБЕРЕЖЕННЯ ---
if ($formType === 'administration') {
    $isUpdated = false;
    $incomingId = intval($data['id']);
    foreach ($currentData as $key => $item) {
        if (intval($item['id']) === $incomingId) {
            $currentData[$key] = $data;
            $isUpdated = true;
            break;
        }
    }
    if (!$isUpdated) {
        $currentData[] = $data;
    }
    $responseText = $isUpdated ? "Дані успішно перезаписано!" : "Нового співробітника успішно додано!";

} elseif ($formType === 'news') {
    $incomingId = isset($data['id']) ? trim($data['id']) : '';
    $isDelete = isset($data['action']) && $data['action'] === 'delete';

    if ($isDelete) {
        // Видалення новини за її текстовим ID
        $foundIndex = -1;
        foreach ($currentData as $key => $item) {
            if (isset($item['id']) && $item['id'] === $incomingId) {
                $foundIndex = $key;
                break;
            }
        }

        if ($foundIndex !== -1) {
            array_splice($currentData, $foundIndex, 1);
            $responseText = "Новину успішно видалено!";
        } else {
            http_response_code(400);
            die("Помилка: Новину з таким ID не знайдено.");
        }
    } else {
        // Перевірка на редагування чи створення
        $isUpdated = false;
        foreach ($currentData as $key => $item) {
            if (isset($item['id']) && $item['id'] === $incomingId) {
                $currentData[$key] = $data; // Перезаписуємо існуючу
                $isUpdated = true;
                break;
            }
        }

        if (!$isUpdated) {
            // Нову новину додаємо на початок масиву
            array_unshift($currentData, $data);
            $responseText = "Новину успішно опубліковано!";
        } else {
            $responseText = "Новину успішно оновлено!";
        }
    }
} elseif ($formType === 'strategy_page') {
    // Якщо файл порожній, створюємо структуру з ключем strategy
    if (!isset($currentData['strategy']) || !is_array($currentData['strategy'])) {
        $currentData['strategy'] = [];
    }

    $index = intval($data['index']);
    $newDoc = [
        "title" => $data['title'],
        "url" => $data['url']
    ];

    if ($index >= 0 && isset($currentData['strategy'][$index])) {
        // Перезаписуємо існуючий документ за індексом
        $currentData['strategy'][$index] = $newDoc;
        $responseText = "Документ стратегії успішно перезаписано!";
    } else {
        // Додаємо новий документ в кінець масиву
        $currentData['strategy'][] = $newDoc;
        $responseText = "Новий документ стратегії успішно додано!";
    }

} elseif ($formType === 'admission_page') {
    $category = $data['category'];
    $subcategory = $data['subcategory'];
    $index = intval($data['index']);
    
    // Перевіряємо, чи це дія видалення
    $isDelete = isset($data['action']) && $data['action'] === 'delete';

    // Створюємо масиви за структурою, якщо вони відсутні у файлі
    if (!isset($currentData[$category])) {
        $currentData[$category] = [];
    }
    if (!isset($currentData[$category][$subcategory]) || !is_array($currentData[$category][$subcategory])) {
        $currentData[$category][$subcategory] = [];
    }

    if ($isDelete) {
        if ($index >= 0 && isset($currentData[$category][$subcategory][$index])) {
            // Видаляємо елемент за індексом і переіндексовуємо масив
            array_splice($currentData[$category][$subcategory], $index, 1);
            $responseText = "Запис успішно видалено!";
        } else {
            http_response_code(400);
            die("Помилка: Неможливо видалити неіснуючий запис.");
        }
    } else {
        // Звичайне збереження / редагування
        $node = [
            "title" => $data['title'],
            "url" => $data['url']
        ];

        if ($index >= 0 && isset($currentData[$category][$subcategory][$index])) {
            $currentData[$category][$subcategory][$index] = $node;
            $responseText = "Дані абітурієнта успішно оновлено!";
        } else {
            $currentData[$category][$subcategory][] = $node;
            $responseText = "Новий елемент успішно додано у розділ абітурієнтів!";
        }
    }
} elseif ($formType === 'students_page') {
    $category = $data['category'];
    
    $isArchive = isset($data['is_archive']) && intval($data['is_archive']) === 1;
    $targetKey = $isArchive ? $category . '_archive' : $category;
    
    $index = intval($data['index']);
    $isDelete = isset($data['action']) && $data['action'] === 'delete';

    if (!isset($currentData[$targetKey]) || !is_array($currentData[$targetKey])) {
        $currentData[$targetKey] = [];
    }

    if ($isDelete) {
        if ($index >= 0 && isset($currentData[$targetKey][$index])) {
            // Видаляємо документ за індексом
            array_splice($currentData[$targetKey], $index, 1);
            $responseText = "Документ успішно видалено!";
        } else {
            http_response_code(400);
            die("Помилка: Неможливо видалити неіснуючий документ.");
        }
    } else {
        $node = [
            "title" => $data['title'],
            "url" => $data['url']
        ];

        if ($index >= 0 && isset($currentData[$targetKey][$index])) {
            // Редагування
            $currentData[$targetKey][$index] = $node;
            $responseText = "Документ успішно оновлено!";
        } else {
            // СТВОРЕННЯ:
            if ($isArchive) {
                array_unshift($currentData[$targetKey], $node);
                $responseText = "Новий архівний документ успішно додано вгору!";
            } else {
                $currentData[$targetKey][] = $node;
                $responseText = "Новий документ успішно додано!";
            }
        }
    }
} elseif ($formType === 'quality_page') {
    $category = $data['category'];
    $secIndex = $data['section_index'];
    $secTitle = $data['section_title'];
    $index = intval($data['index']);
    
    $action = isset($data['action']) ? $data['action'] : '';

    if (!isset($currentData[$category])) {
        $currentData[$category] = ["sections" => []];
    }

    // Дія: ВИДАЛЕННЯ СЕКЦІЇ ЦІЛКОМ
    if ($action === 'delete_section' && $secIndex !== 'new_section') {
        $secIndex = intval($secIndex);
        if (isset($currentData[$category]['sections'][$secIndex])) {
            array_splice($currentData[$category]['sections'], $secIndex, 1);
            $responseText = "Підрозділ успішно видалено!";
        } else {
            http_response_code(400);
            die("Помилка: Підрозділ не знайдено для видалення.");
        }
    } 
    // Дія: ВИДАЛЕННЯ ОКРЕМОГО ДОКУМЕНТА
    elseif ($action === 'delete_item' && $secIndex !== 'new_section') {
        $secIndex = intval($secIndex);
        if (isset($currentData[$category]['sections'][$secIndex]['items'][$index])) {
            array_splice($currentData[$category]['sections'][$secIndex]['items'], $index, 1);
            $responseText = "Документ успішно видалено з підрозділу!";
        } else {
            http_response_code(400);
            die("Помилка: Документ не знайдено для видалення.");
        }
    } 
    // ЗВИЧАЙНЕ ЗБЕРЕЖЕННЯ / РЕДАГУВАННЯ
    else {
        $node = [
            "title" => $data['title'],
            "url" => $data['url']
        ];

        if ($secIndex === 'new_section') {
            $currentData[$category]['sections'][] = [
                "section_title" => $secTitle,
                "items" => [$node]
            ];
            $responseText = "Створено новий підрозділ та додано документ!";
        } else {
            $secIndex = intval($secIndex);
            if (isset($currentData[$category]['sections'][$secIndex])) {
                $currentData[$category]['sections'][$secIndex]['section_title'] = $secTitle;

                if ($index >= 0 && isset($currentData[$category]['sections'][$secIndex]['items'][$index])) {
                    $currentData[$category]['sections'][$secIndex]['items'][$index] = $node;
                    $responseText = "Документ успішно оновлено!";
                } else {
                    $currentData[$category]['sections'][$secIndex]['items'][] = $node;
                    $responseText = "Документ успішно додано до підрозділу!";
                }
            } else {
                http_response_code(400);
                die("Помилка: Підрозділ не знайдено.");
            }
        }
    }
} elseif ($formType === 'documents_page') {
    $id = intval($data['id']);
    $isDelete = isset($data['action']) && $data['action'] === 'delete';
    
    // Переконуємось, що дані зчитано як масив
    if (!is_array($currentData)) {
        $currentData = [];
    }

    if ($isDelete) {
        // ВИДАЛЕННЯ: шукаємо індекс елемента за його ID та видаляємо
        $foundIndex = -1;
        foreach ($currentData as $key => $item) {
            if (isset($item['id']) && intval($item['id']) === $id) {
                $foundIndex = $key;
                break;
            }
        }

        if ($foundIndex !== -1) {
            array_splice($currentData, $foundIndex, 1);
            $responseText = "Документ успішно видалено!";
        } else {
            http_response_code(400);
            die("Помилка: Неможливо видалити неіснуючий документ.");
        }
    } else {
        if ($id >= 0) {
            // РЕДАГУВАННЯ: шукаємо елемент з потрібним ID в масиві
            $found = false;
            foreach ($currentData as $key => $item) {
                if (isset($item['id']) && intval($item['id']) === $id) {
                    $currentData[$key]['title'] = $data['title'];
                    $currentData[$key]['category'] = $data['category'];
                    $currentData[$key]['fileUrl'] = $data['fileUrl'];
                    $found = true;
                    break;
                }
            }
            $responseText = $found ? "Документ успішно оновлено!" : "Помилка: Документ не знайдено.";
        } else {
            // СТВОРЕННЯ: шукаємо максимальний ID, щоб згенерувати наступний
            $maxId = 0;
            foreach ($currentData as $item) {
                if (isset($item['id']) && intval($item['id']) > $maxId) {
                    $maxId = intval($item['id']);
                }
            }
            
            $newNode = [
                "id" => $maxId + 1,
                "title" => $data['title'],
                "category" => $data['category'],
                "fileUrl" => $data['fileUrl']
            ];
            
            $currentData[] = $newNode;
            $responseText = "Новий документ успішно додано!";
        }
    }
} elseif ($formType === 'intro_page') {
    // Повністю перевизначаємо масив новими даними з форми
    $currentData = [
        "title" => $data['title'],
        "documents" => $data['documents'],
        "exams" => $data['exams'],
        "results" => $data['results']
    ];
    $responseText = "Строки вступної кампанії успішно оновлено!";
}

// Зберігаємо структуру назад у JSON
$updatedJson = json_encode($currentData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

if (file_put_contents($jsonFile, $updatedJson) !== false) {
    echo $responseText;
} else {
    http_response_code(500);
    echo "Помилка: Не вдалося записати дані у файл.";
}
?>