
 <?php
session_start();

if (!isset($_SESSION['nickname'])) {
    header('Location: index.php');
    exit;
}

$nickname = $_SESSION['nickname'];

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

// Buscar a posição do jogador no banco de dados
$sql = "SELECT posicao FROM usuarios WHERE nickname = ?";
$stmt = $pdo->prepare($sql);
$stmt->execute([$nickname]);
$posicao = $stmt->fetchColumn();

$posicao = $posicao ? json_decode($posicao, true) : ['x' => 0, 'y' => 0, 'z' => 0];  // Posição padrão se não encontrado
?>

<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jogo AI 3D</title>

    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>



    <style>
        body {
            background-color: #000; 
            color: white;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
        }

        .navbar {
            z-index: 1000; 
            position: fixed;
            top: 0;
            width: 100%;
        }

        #gameContainer {
            border: 15px solid #333;
            box-shadow: 0px 0px 100px rgba(0, 255, 0, 0.6);
            width: 900px;
            height: 650px;
            margin: auto; 
            background: #222;
            border-radius: 15px;
            background-image: url('https://i.imgur.com/Tq2BBJv.png');
            background-size: cover;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1; 
        }

        #gameCanvas {
            width: 100%;
            height: 100%;
            display: block;
        }

        .btn-custom {
            background-color: #333;
            border: 2px solid #999;
            color: #fff;
            font-family: 'Courier New', Courier, monospace;
            font-size: 16px;
            padding: 10px 20px;
            box-shadow: 0px 0px 10px rgba(0, 255, 0, 0.8);
            transition: background-color 0.3s;
        }

        .btn-custom:hover {
            background-color: #555;
        }

#npcChat {
    background-color: rgba(0, 0, 0, 0.8);
    border: 2px solid white;
    color: white;
    padding: 10px;
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 300px;
    min-height: 100px;  /* Altura mínima */
    max-height: 100vh;   /* Limitar o crescimento para no máximo 100% da altura da tela */
    display: none;  /* Inicialmente oculto */
    overflow: hidden;   /* Impede o crescimento do chat além do limite */
    transition: height 0.3s ease;  /* Suaviza a transição ao crescer */
}

#chatHistory {
    max-height: calc(90vh - 110px);  /* Define a altura máxima para o histórico, descontando o espaço do campo e botão */
    overflow-y: auto;
    margin-bottom: 5px;
}

#chatInputContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
        .fixed {
            position: fixed;
            bottom: 15px;
            right: 5px;
        }

        #joystickContainer {
            width: 100px;
            height: 100px;
            background-color: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            display: none;
        }

        #joystick {
            width: 50px;
            height: 50px;
            background-color: #fff;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
        
            /* Estilo retro para o ScoreBoard */

        
    </style>
</head>
<body>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="#">AI Game</a> 
        
     
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                
  
        
                <li class="nav-item">
            <span id="scoreDisplay" class="btn btn-custom mx-2">Tokens GrANA</span>
                </li>   
                <li class="nav-item">
                    <button id="toggleJoystickButton" class="btn btn-custom mx-2">Ativar Joystick</button>
                </li>
                <li class="nav-item">
                    <button id="toggleCameraButton" class="btn btn-custom mx-2">Toggle Camera</button>
                </li>
                <li class="nav-item">
                    <button id="addGroundButton" class="btn btn-custom mx-2">Adicionar Chão</button>
                </li>
                <li class="nav-item">
                    <button id="toggleChatButton" class="btn btn-custom mx-2">Abrir Chat</button>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- Container do jogo (a "TV") -->
<
<!-- Chat -->
<div id="npcChat">
    <div id="chatHistory"></div>
    <input type="text" id="npcAnswer" placeholder="Digite sua resposta" class="form-control" />
    <button id="npcSubmit" class="btn btn-primary mt-2">Enviar</button>
</div>

<!-- Joystick -->
<div id="joystickContainer" class="fixed">
    <div id="joystick"></div>
</div>

<!-- Scripts -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>

<!-- Definir a variável jogadorNickname -->
<script>
    const jogadorNickname = '<?php echo htmlspecialchars($nickname); ?>';
</script>

<script src="jogador.js"></script> <!-- Lógica do jogador -->
<script src="jogo.js"></script> <!-- Lógica do jogo -->

<script>




    const toggleJoystickButton = document.getElementById('toggleJoystickButton');
    const joystickContainer = document.getElementById('joystickContainer');
    let joystickVisible = false;

    toggleJoystickButton.addEventListener('click', function () {
        joystickVisible = !joystickVisible;
        joystickContainer.style.display = joystickVisible ? 'block' : 'none';
        toggleJoystickButton.textContent = joystickVisible ? 'Desativar Joystick' : 'Ativar Joystick';
    });

</script>

</body>
</html>
