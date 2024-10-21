<?php
require_once 'db_config.php';

// Receber os dados JSON do corpo da requisição
$data = json_decode(file_get_contents('php://input'), true);

// Verificar se os parâmetros de posição e direção estão presentes
if (isset($data['nickname'], $data['x'], $data['y'], $data['z'], $data['lookX'], $data['lookY'], $data['lookZ'])) {
    $nickname = $data['nickname'];
    $x = $data['x'];
    $y = $data['y'];
    $z = $data['z'];
    $lookX = $data['lookX'];
    $lookY = $data['lookY'];
    $lookZ = $data['lookZ'];

    // Verificar se o nickname existe no banco de dados
    $sql = "SELECT id FROM usuarios WHERE nickname = :nickname";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['nickname' => $nickname]);
    $usuario = $stmt->fetch();

    if ($usuario) {
        // Atualizar a posição e a direção do jogador no banco de dados
        $sql = "UPDATE usuarios SET posicao = :posicao, direcao = :direcao, ultima_atividade = NOW() WHERE nickname = :nickname";
        $stmt = $pdo->prepare($sql);

        // Converter a posição e a direção para JSON
        $posicao = json_encode(['x' => $x, 'y' => $y, 'z' => $z]);
        $direcao = json_encode(['lookX' => $lookX, 'lookY' => $lookY, 'lookZ' => $lookZ]);

        // Executar a query
        $stmt->execute(['posicao' => $posicao, 'direcao' => $direcao, 'nickname' => $nickname]);

        if ($stmt->rowCount() > 0) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Nenhuma linha foi atualizada']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Nickname não encontrado']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Parâmetros inválidos']);
}
?>
