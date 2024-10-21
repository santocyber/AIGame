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

// Verificar se os dados esperados foram enviados
if (isset($data['mensagem'])) {
    $mensagem = $data['mensagem'];

    // Inserir a conversa no banco de dados (armazena a mensagem do jogador)
    $sql = "INSERT INTO conversas_jogadores (jogador, mensagem, timestamp) VALUES (:jogador, :mensagem, NOW())";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([
            ':jogador' => $jogadorLogado,
            ':mensagem' => $mensagem
        ]);

        // Retornar uma resposta JSON de sucesso
        echo json_encode(['status' => 'success', 'message' => 'Conversa salva com sucesso.']);
    } catch (PDOException $e) {
        // Em caso de erro, retornar uma resposta JSON de erro
        echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar a conversa: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Dados inválidos fornecidos.']);
}
?>
