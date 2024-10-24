<?php
session_start();
require 'db_config.php';

// Remove qualquer saída em buffer para evitar quebras no JSON
ob_clean();

// Verifica se o usuário está logado
if (!isset($_SESSION['nickname'])) {
    echo json_encode(['status' => 'error', 'message' => 'Usuário não logado.']);
    exit();
}

$nickname = $_SESSION['nickname'];

// Recebe os dados do POST
$data = json_decode(file_get_contents('php://input'), true);

// Valida se os dados necessários foram enviados
if (!isset($data['body_height']) || !isset($data['body_color']) || !isset($data['head_radius']) || !isset($data['neck_height']) || !isset($data['neck_color']) || !isset($data['head_color']) || !isset($data['arm_color']) || !isset($data['leg_color'])) {
    echo json_encode(['status' => 'error', 'message' => 'Dados incompletos.']);
    exit();
}

// Atualiza os dados do personagem no banco de dados
$sql = "UPDATE personagens SET 
            body_height = :body_height, 
            body_color = :body_color, 
            head_radius = :head_radius, 
            neck_height = :neck_height, 
            neck_color = :neck_color, 
            head_color = :head_color, 
            arm_color = :arm_color, 
            leg_color = :leg_color 
        WHERE nickname = :nickname";

$stmt = $pdo->prepare($sql);
$result = $stmt->execute([
    'body_height' => (float)$data['body_height'],
    'body_color' => $data['body_color'],
    'head_radius' => (float)$data['head_radius'],
    'neck_height' => (float)$data['neck_height'],
    'neck_color' => $data['neck_color'],
    'head_color' => $data['head_color'],
    'arm_color' => $data['arm_color'],
    'leg_color' => $data['leg_color'],
    'nickname' => $nickname
]);

// Verifica se houve algum erro no banco de dados
if ($stmt->errorInfo()[0] !== "00000") {
    echo json_encode(['status' => 'error', 'message' => 'Erro no banco de dados: ' . $stmt->errorInfo()[2]]);
    exit();
}

if ($result) {
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar as características.']);
}

?>
