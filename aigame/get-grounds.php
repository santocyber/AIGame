<?php
// Conexão com o banco de dados
require 'db_config.php';

header('Content-Type: application/json'); // Assegura que o conteúdo será JSON

// Receber os dados enviados via POST
$data = json_decode(file_get_contents('php://input'), true);
$x = $data['x'];
$z = $data['z'];
$renderDistance = $data['renderDistance'];

// Converter para números (caso seja necessário)
$x = floatval($x);
$z = floatval($z);
$renderDistance = intval($renderDistance);

// Consultar os blocos de chão dentro do renderDistance
$sql = "SELECT x, y, z FROM ground WHERE 
        x BETWEEN (:xMin) AND (:xMax) AND 
        z BETWEEN (:zMin) AND (:zMax)";
$stmt = $pdo->prepare($sql);
$stmt->execute([
    ':xMin' => $x - $renderDistance,
    ':xMax' => $x + $renderDistance,
    ':zMin' => $z - $renderDistance,
    ':zMax' => $z + $renderDistance
]);

$grounds = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode(['status' => 'success', 'grounds' => $grounds]);

?>
