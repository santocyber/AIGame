<?php
require 'db_config.php';

// Receber o nickname
$nickname = $_GET['nickname'];

// Recuperar as características do personagem do banco de dados pelo nickname
$sql = "SELECT body_height, body_color, head_radius, neck_height, neck_color, head_color, arm_color, leg_color FROM personagens WHERE nickname = :nickname";
$stmt = $pdo->prepare($sql);
$stmt->execute(['nickname' => $nickname]);
$personagem = $stmt->fetch(PDO::FETCH_ASSOC);

if ($personagem) {
    echo json_encode(['status' => 'success', 'personagem' => $personagem]);
} else {
    // Se não houver personagem, retornar um padrão
    echo json_encode([
        'status' => 'success',
        'personagem' => [
            'body_height' => 2.0,
            'body_color' => '#ff0000',
            'head_radius' => 1.0,
            'neck_height' => 1.0,
            'neck_color' => '#808080',
            'head_color' => '#000000',
            'arm_color' => '#ffcc00',
            'leg_color' => '#ffcc00'
        ]
    ]);
}
?>
