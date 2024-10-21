<?php
header('Content-Type: application/json');

// Incluir o arquivo de configuração do banco de dados
require_once 'db_config.php';

try {
    // Receber os dados enviados pelo fetch
    $data = json_decode(file_get_contents('php://input'), true);

    // Log dos dados recebidos para debug
    file_put_contents('php_log.txt', print_r($data, true), FILE_APPEND);

    if (!isset($data['x']) || !isset($data['y']) || !isset($data['z']) || !isset($data['nickname'])) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Dados insuficientes fornecidos.'
        ]);
        exit;
    }

    // Preparar e executar a query de inserção
    $stmt = $pdo->prepare("INSERT INTO ground (x, y, z, nickname) VALUES (:x, :y, :z, :nickname)");
    $stmt->bindParam(':x', $data['x'], PDO::PARAM_INT);
    $stmt->bindParam(':y', $data['y'], PDO::PARAM_INT);
    $stmt->bindParam(':z', $data['z'], PDO::PARAM_INT);
    $stmt->bindParam(':nickname', $data['nickname'], PDO::PARAM_STR);

    if ($stmt->execute()) {
        echo json_encode([
            'status' => 'success',
            'message' => 'Posição do chão salva com sucesso'
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Erro ao salvar a posição do chão.'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro de conexão com o banco de dados: ' . $e->getMessage()
    ]);
}
