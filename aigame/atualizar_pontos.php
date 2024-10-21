<?php
// Incluir o arquivo de conexão com o banco de dados
include 'db_config.php';

// Definir o cabeçalho para garantir que a resposta seja interpretada como JSON
header('Content-Type: application/json');

// Receber os dados JSON do corpo da requisição
$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['nickname'])) {
    $nickname = $data['nickname'];

    // Se a pontuação foi enviada, atualizar o valor no banco de dados
    if (isset($data['pontos'])) {
        $pontos = $data['pontos'];

        try {
            $query = "UPDATE usuarios SET pontos = :pontos WHERE nickname = :nickname";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':pontos', $pontos, PDO::PARAM_INT);
            $stmt->bindParam(':nickname', $nickname, PDO::PARAM_STR);

            if ($stmt->execute()) {
                echo json_encode(['status' => 'success', 'message' => 'Pontuação atualizada com sucesso.']);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar a pontuação.']);
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao atualizar a pontuação: ' . $e->getMessage()]);
        }
    } else {
        // Se a pontuação não foi enviada, buscar a pontuação atual
        try {
            $query = "SELECT pontos FROM usuarios WHERE nickname = :nickname";
            $stmt = $pdo->prepare($query);
            $stmt->bindParam(':nickname', $nickname, PDO::PARAM_STR);
            $stmt->execute();

            $result = $stmt->fetch();
            if ($result) {
                echo json_encode(['status' => 'success', 'pontos' => $result['pontos']]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Jogador não encontrado.']);
            }
        } catch (PDOException $e) {
            echo json_encode(['status' => 'error', 'message' => 'Erro ao buscar a pontuação: ' . $e->getMessage()]);
        }
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Dados inválidos.']);
}
?>
