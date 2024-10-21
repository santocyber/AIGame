<?php
session_start();

if (!isset($_SESSION['nickname'])) {
    header('Location: index.php');
    exit;
}

$nickname = $_SESSION['nickname'];
require_once 'db_config.php';

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
    <title>Jogo 3D</title>
    <style>
     #npcChat {
    position: fixed;
    bottom: 10px;
    left: 10px;
    width: 300px;
    min-height: 150px;  /* Altura mínima para o chat */
    max-height: 90vh;   /* Altura máxima relativa à altura da janela */
    background-color: rgba(0, 0, 0, 0.8);  /* Fundo transparente */
    border: 2px solid white;
    color: white;
    padding: 10px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

#chatHistory {
    flex-grow: 1;
    overflow-y: auto;
    margin-bottom: 10px;
    max-height: 80vh;  /* Limita a altura do histórico para evitar ultrapassar o limite do chat */
}

#npcAnswer {
    width: 100%;
    padding: 5px;
    margin-bottom: 10px;
}

#npcSubmit {
    width: 100%;
    padding: 5px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
}

#npcSubmit:hover {
    background-color: #218838;
}

/* Estilo do botão no topo */
#toggleJoystickButton {
    position: fixed;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    z-index: 1000;
}

/* Estilo do joystick */
#joystickContainer {
    display: none;  /* O joystick começa oculto */
    position: fixed;
    bottom: 5%;
    right: 5%;
    width: 120px;
    height: 120px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    z-index: 100;
}

#joystick {
    position: absolute;
    width: 50px;
    height: 50px;
    background-color: #fff;
    border-radius: 50%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

    </style>
</head>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>
    
    <script>
        const jogadorNickname = '<?php echo htmlspecialchars($nickname); ?>';
        const playerInitialPosition = <?php echo json_encode($posicao); ?>;
                console.log('Nickname do jogador:', jogadorNickname);  // Verifique se o nome do jogador está correto
                console.log('Posicao jogador:', playerInitialPosition);  // Verifique se o nome do jogador está correto
    </script>

    <script src="jogador.js"></script>
    <script src="jogo.js"></script>
<div id="npcChat">
    <div id="chatHistory"></div>
    <input type="text" id="npcAnswer" placeholder="Digite sua resposta" />
    <button id="npcSubmit">Enviar</button>
</div>
   <!-- Botão para ativar/desativar o joystick -->
    <button id="toggleJoystickButton">Ativar Joystick</button>

    <!-- Contêiner do joystick -->
    <div id="joystickContainer">
        <div id="joystick"></div>
    </div>
    
    <button id="addGroundButton">Adicionar Chão</button>
                    <button id="toggleChatButton" class="btn btn-custom mx-2">Abrir Chat</button>
     

     <script>
        document.addEventListener('DOMContentLoaded', function () {
            const joystickContainer = document.getElementById('joystickContainer');
            const toggleJoystickButton = document.getElementById('toggleJoystickButton');
            let joystickVisible = false;

            // Função para alternar a visibilidade do joystick
            toggleJoystickButton.addEventListener('click', function () {
                joystickVisible = !joystickVisible;

                if (joystickVisible) {
                    joystickContainer.style.display = 'block';  // Mostra o joystick
                    toggleJoystickButton.textContent = 'Desativar Joystick';
                } else {
                    joystickContainer.style.display = 'none';  // Esconde o joystick
                    toggleJoystickButton.textContent = 'Ativar Joystick';
                }
            });
            
                   


        });
        
 

    </script>

</body>
</html>