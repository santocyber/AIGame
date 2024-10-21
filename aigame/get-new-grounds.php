<?php
header('Content-Type: application/json');
require_once 'db_config.php';

try {
    // Consulta para pegar os últimos 10 blocos em ordem crescente (por ID)
    $stmt = $pdo->prepare("SELECT id, x, y, z, nickname FROM ground ORDER BY id DESC LIMIT 10");
    $stmt->execute();

    // Verifica se encontrou resultados
    if ($stmt->rowCount() > 0) {
        $grounds = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => 'success',
            'grounds' => $grounds
        ]);
    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Nenhum novo bloco de chão encontrado.'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro de conexão com o banco de dados: ' . $e->getMessage()
    ]);
}
?>
