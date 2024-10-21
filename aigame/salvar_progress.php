<?php
include 'db_config.php';  // Incluir a configuração do banco de dados

// Receber os dados do progresso
$data = json_decode(file_get_contents('php://input'), true);
$jogadorId = $data['jogador_id'];
$mapaEstado = $data['mapa_estado'];
$pontos = $data['pontos'];

// Atualizar o progresso no banco de dados
$stmt = $pdo->prepare("UPDATE mapas_jogadores SET mapa_estado = ?, pontos = ? WHERE jogador_id = ?");
$stmt->execute([$mapaEstado, $pontos, $jogadorId]);

echo json_encode(['status' => 'success']);
?>
