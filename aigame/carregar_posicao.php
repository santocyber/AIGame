<?php
require_once 'db_config.php';

// Receber os dados do corpo da requisição como JSON
$data = json_decode(file_get_contents('php://input'), true);

// Verificar se o parâmetro 'nickname' está presente
if (isset($data['nickname'])) {
    $nickname = $data['nickname'];

    // Consultar a posição e direção do jogador no banco de dados
    $sql = "SELECT posicao, direcao FROM usuarios WHERE nickname = :nickname";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['nickname' => $nickname]);
    $usuario = $stmt->fetch();

    if ($usuario && $usuario['posicao']) {
        // Decodificar a posição e a direção salvas no banco de dados
        $posicao = json_decode($usuario['posicao'], true);
        $direcao = json_decode($usuario['direcao'], true);

        // Retornar a posição e a direção como JSON
        echo json_encode([
            'status' => 'success', 
            'posicao' => $posicao, 
            'direcao' => $direcao
        ]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Posição ou direção não encontrada ou usuário inexistente']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Parâmetro "nickname" inválido']);
}
?>
