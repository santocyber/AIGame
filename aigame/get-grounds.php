<?php
// Conexão com o banco de dados
require 'db_config.php';

header('Content-Type: application/json'); // Assegura que o conteúdo será JSON

try {
    // Consulta para pegar todos os blocos de chão adicionados
    $stmt = $pdo->prepare("SELECT nickname, x, y, z FROM ground");
    $stmt->execute();

    // Verifica se encontrou algum resultado
    if ($stmt->rowCount() > 0) {
        $grounds = $stmt->fetchAll(PDO::FETCH_ASSOC);  // Busca todos os resultados como array associativo
        echo json_encode(['status' => 'success', 'grounds' => $grounds]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Nenhum chão encontrado']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro na consulta: ' . $e->getMessage()]);
}
?>
