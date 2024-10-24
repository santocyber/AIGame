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

    // Verificar se já existe um bloco com essas coordenadas
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM ground WHERE x = :x AND y = :y AND z = :z");
    $stmt->bindParam(':x', $data['x']);
    $stmt->bindParam(':y', $data['y']);
    $stmt->bindParam(':z', $data['z']);
    $stmt->execute();
    $count = $stmt->fetchColumn();

    if ($count > 0) {
        // Se já existe, retornar um erro
        echo json_encode([
            'status' => 'error',
            'message' => 'Já existe um bloco de chão nessas coordenadas.'
        ]);
        exit;
    }

    // Preparar e executar a query de inserção
    $stmt = $pdo->prepare("INSERT INTO ground (x, y, z, nickname) VALUES (:x, :y, :z, :nickname)");
    $stmt->bindParam(':x', $data['x']);
    $stmt->bindParam(':y', $data['y']);
    $stmt->bindParam(':z', $data['z']);
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
