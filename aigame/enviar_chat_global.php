<?php
include 'db_config.php';  // Inclua sua configuração de banco de dados

// Receber os dados JSON do corpo da requisição
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['nickname']) && isset($data['mensagem']) && isset($data['posicao'])) {
    $nickname = $data['nickname'];
    $mensagem = $data['mensagem'];
    $posicao = $data['posicao'];

    // Inserir a mensagem no chat global
    $query = "INSERT INTO chat_global (nickname, posicao, mensagem) VALUES (?, ?, ?)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$nickname, $posicao, $mensagem]);

    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Dados inválidos.']);
}
?>
