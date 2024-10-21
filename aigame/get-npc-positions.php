<?php
header('Content-Type: application/json');
require_once 'db_config.php';

try {
    // Consulta para pegar as posições dos NPCs
    $stmt = $pdo->prepare("SELECT name, x, y, z FROM npcs");
    $stmt->execute();

    $npcs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'status' => 'success',
        'npcs' => $npcs
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro ao carregar as posições dos NPCs: ' . $e->getMessage()
    ]);
}
