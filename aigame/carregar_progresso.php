<?php
include 'db_config.php';  // Incluir a configuração do banco de dados

$jogadorId = 1;  // Exemplo de ID do jogador

// Obter o progresso do banco de dados
$stmt = $pdo->prepare("SELECT mapa_estado, pontos FROM mapas_jogadores WHERE jogador_id = ?");
$stmt->execute([$jogadorId]);
$result = $stmt->fetch();

echo json_encode($result);
?>
