<?php
include 'db_config.php';  // Inclua sua configuração de banco de dados

// Buscar as últimas 50 mensagens do chat global
$query = "SELECT nickname, posicao, mensagem, timestamp FROM chat_global ORDER BY timestamp ASC LIMIT 50";


$stmt = $pdo->prepare($query);
$stmt->execute();

$conversas = $stmt->fetchAll();

echo json_encode(['status' => 'success', 'conversas' => $conversas]);
?>



