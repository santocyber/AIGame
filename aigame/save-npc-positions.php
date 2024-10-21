<?php
header('Content-Type: application/json');
require_once 'db_config.php';  // Inclui a configuração do banco de dados

$npcData = json_decode(file_get_contents('php://input'), true);

if (!$npcData || !is_array($npcData)) {
    echo json_encode(['status' => 'error', 'message' => 'Dados inválidos.']);
    exit();
}

try {
    $pdo->beginTransaction();

    // Limpar as posições atuais dos NPCs (para atualizar)
    $stmtDelete = $pdo->prepare("DELETE FROM npcs");
    $stmtDelete->execute();

    // Inserir as novas posições dos NPCs
    $stmtInsert = $pdo->prepare("INSERT INTO npcs (name, x, y, z) VALUES (:name, :x, :y, :z)");
    foreach ($npcData as $npc) {
        $stmtInsert->execute([
            ':name' => $npc['name'],
            ':x' => $npc['x'],
            ':y' => $npc['y'],
            ':z' => $npc['z']
        ]);
    }

    $pdo->commit();
    echo json_encode(['status' => 'success', 'message' => 'Posições dos NPCs salvas com sucesso.']);

} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar as posições: ' . $e->getMessage()]);
}
?>
