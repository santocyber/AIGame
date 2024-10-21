<?php
session_start();

// Conexão com o banco de dados
$host = 'localhost';
$db   = 'aigame';
$user = 'aigame';
$pass = 'NtaEaPMRpfz4E4BJ';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

$error = '';
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action']) && $_POST['action'] === 'register') {
        // Lógica de registro
        $nickname = trim($_POST['nickname']);
        $senha = trim($_POST['senha']);

        if (empty($nickname) || empty($senha)) {
            $error = 'Nickname e senha são obrigatórios.';
        } else {
            // Verifica se o nickname já existe
            try {
                $sql = "SELECT id FROM usuarios WHERE nickname = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$nickname]);
                if ($stmt->fetch()) {
                    $error = 'Este nickname já está em uso. Escolha outro.';
                } else {
                    // Inserir o usuário com a senha criptografada
                    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);
                    $sql = "INSERT INTO usuarios (nickname, senha) VALUES (?, ?)";
                    $stmt = $pdo->prepare($sql);
                    $stmt->execute([$nickname, $senhaHash]);
                    $success = true;
                }
            } catch (PDOException $e) {
                $error = 'Erro ao salvar o usuário. Tente novamente.';
            }
        }
    } elseif (isset($_POST['action']) && $_POST['action'] === 'login') {
        // Lógica de login
        $nickname = trim($_POST['nickname']);
        $senha = trim($_POST['senha']);

        if (empty($nickname) || empty($senha)) {
            $error = 'Nickname e senha são obrigatórios.';
        } else {
            // Verifica se o usuário existe e a senha está correta
            try {
                $sql = "SELECT id, senha FROM usuarios WHERE nickname = ?";
                $stmt = $pdo->prepare($sql);
                $stmt->execute([$nickname]);
                $usuario = $stmt->fetch();

                if ($usuario && password_verify($senha, $usuario['senha'])) {
                    $_SESSION['nickname'] = $nickname;
                    $_SESSION['id'] = $usuario['id'];
                    header('Location: dashboard.php');
                    exit;
                } else {
                    $error = 'Nickname ou senha incorretos.';
                }
            } catch (PDOException $e) {
                $error = 'Erro ao realizar login. Tente novamente.';
            }
        }
    }
}
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login e Cadastro</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #1e1e1e;
            color: white;
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .container {
            background-color: #2c2c2c;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            text-align: center;
            width: 300px;
        }
        input[type="text"], input[type="password"] {
            width: 100%;
            padding: 10px;
            margin: 15px 0;
            font-size: 16px;
            background-color: #3c3c3c;
            border: 1px solid #555;
            color: white;
            border-radius: 4px;
        }
        button {
            width: 100%;
            padding: 10px;
            font-size: 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        button:hover {
            background-color: #45a049;
        }
        .error, .success {
            margin-bottom: 20px;
            padding: 10px;
            color: white;
            text-align: center;
            border-radius: 4px;
        }
        .error {
            background-color: red;
        }
        .success {
            background-color: green;
        }
        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            justify-content: center;
            align-items: center;
        }
        .modal-content {
            background-color: #2c2c2c;
            padding: 30px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            width: 300px;
        }
        .modal-content button {
            margin-top: 10px;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>Login</h1>
        <?php if (!empty($error)): ?>
            <div class="error"><?php echo $error; ?></div>
        <?php endif; ?>

        <?php if ($success): ?>
            <div class="success">Cadastro realizado com sucesso! Faça login para continuar.</div>
        <?php endif; ?>

        <form method="POST">
            <input type="text" name="nickname" placeholder="Nickname" required>
            <input type="password" name="senha" placeholder="Senha" required>
            <input type="hidden" name="action" value="login">
            <button type="submit">Entrar</button>
        </form>
        <button id="openModal">Cadastrar</button>
    </div>

    <!-- Modal de Cadastro -->
    <div class="modal" id="modalCadastro">
        <div class="modal-content">
            <h2>Cadastro</h2>
            <form method="POST">
                <input type="text" name="nickname" placeholder="Digite seu nickname" required>
                <input type="password" name="senha" placeholder="Digite sua senha" required>
                <input type="hidden" name="action" value="register">
                <button type="submit">Cadastrar</button>
                <button type="button" id="fecharModal">Fechar</button>
            </form>
        </div>
    </div>

    <script>
        // Abrir o modal de cadastro
        document.getElementById('openModal').addEventListener('click', function() {
            document.getElementById('modalCadastro').style.display = 'flex';
        });

        // Fechar o modal de cadastro
        document.getElementById('fecharModal').addEventListener('click', function() {
            document.getElementById('modalCadastro').style.display = 'none';
        });

        // Fechar o modal quando clicar fora do conteúdo
        window.onclick = function(event) {
            if (event.target === document.getElementById('modalCadastro')) {
                document.getElementById('modalCadastro').style.display = 'none';
            }
        }
    </script>

</body>
</html>
