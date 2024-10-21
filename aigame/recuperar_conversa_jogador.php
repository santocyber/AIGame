<?php
require_once 'db_config.php';
session_start(); // Iniciar a sessão para acessar os dados do jogador

// Definir cabeçalho JSON
header('Content-Type: application/json');

// Verificar se o nome do jogador logado está na sessão
if (!isset($_SESSION['nickname'])) {
    echo json_encode(['status' => 'error', 'message' => 'Jogador não autenticado']);
    exit;
}

// Nome do jogador logado
$jogadorLogado = $_SESSION['nickname'];

// Receber os dados enviados via POST como JSON
$data = json_decode(file_get_contents('php://input'), true);

// Verificar se o interlocutor foi enviado
if (isset($data['interlocutor'])) {
    $interlocutor = $data['interlocutor'];

    // Query para buscar as conversas entre o jogador logado e o interlocutor
    $sql = "
        SELECT jogador, mensagem, timestamp 
        FROM conversas_jogadores 
        WHERE 
            (jogador = :jogadorLogado OR jogador = :interlocutor)
        ORDER BY timestamp ASC";  // Ordenar pela data/hora da conversa

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':jogadorLogado' => $jogadorLogado,
        ':interlocutor' => $interlocutor
    ]);

    $conversas = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Retornar as conversas em formato JSON
    echo json_encode(['status' => 'success', 'conversas' => $conversas]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Interlocutor não fornecido.']);
}
?>
