<?php
session_start();

// Якщо вже авторизований — одразу пускаємо в адмінку
if (isset($_SESSION['auth']) && $_SESSION['auth'] === true) {
    header('Location: admin.php');
    exit();
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';
    
    // Вкажіть ваш надійний пароль для вчителів
    $correct_password = 'lmk2026Lydkevucha1939'; 

    if ($password === $correct_password) {
        $_SESSION['auth'] = true;
        header('Location: admin.php');
        exit();
    } else {
        $error = 'Невірний пароль!';
    }
}
?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <title>Вхід в адмін-панель</title>
    <style>
        body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f4f6f9; }
        .login-box { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); text-align: center; }
        input { width: 100%; padding: 10px; margin: 10px 0; box-sizing: border-box; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; cursor: pointer; width: 100%; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="login-box">
        <h2>Вхід для адміністратора</h2>
        <?php if ($error): ?>
            <p style="color: red;"><?php echo $error; ?></p>
        <?php endif; ?>
        <form method="POST">
            <input type="password" name="password" placeholder="Введіть пароль" required>
            <button type="submit">Увійти</button>
        </form>
    </div>
</body>
</html>