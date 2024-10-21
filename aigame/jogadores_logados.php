<?php
// Conexão com o banco de dados
require_once 'db_config.php';

// Receber o nickname do jogador local da requisição
$data = json_decode(file_get_contents('php://input'), true);
$nicknameLocal = isset($data['nickname']) ? $data['nickname'] : null;

// Consulta para obter os jogadores logados nos últimos 20 minutos, exceto o jogador local
$sql = "SELECT nickname, posicao, direcao 
        FROM usuarios 
        WHERE TIMESTAMPDIFF(MINUTE, ultima_atividade, NOW()) <= 20 
        AND nickname != :nicknameLocal";
$stmt = $pdo->prepare($sql);
$stmt->execute(['nicknameLocal' => $nicknameLocal]);
$jogadores = $stmt->fetchAll();

// Verifica se encontrou algum jogador
if (count($jogadores) > 0) {
    // Converte as posições e direções em JSON apenas se forem válidas
    foreach ($jogadores as &$jogador) {
        $jogador['posicao'] = !empty($jogador['posicao']) ? json_decode($jogador['posicao'], true) : null;
        $jogador['direcao'] = !empty($jogador['direcao']) ? json_decode($jogador['direcao'], true) : null;
    }

    echo json_encode(['status' => 'success', 'players' => $jogadores]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Nenhum jogador logado nos últimos 20 minutos']);
}
?>
