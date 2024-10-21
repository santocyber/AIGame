<?php
header('Content-Type: application/json');

// Incluir o arquivo de configuração do banco de dados
require_once 'db_config.php';

try {
    // Consulta para pegar todas as coordenadas de blocos do banco de dados
    $stmt = $pdo->prepare("SELECT x, y, z FROM ground");
    $stmt->execute();

    // Verifica se encontrou algum resultado
    if ($stmt->rowCount() > 0) {
        $grounds = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Inicializar os valores máximos e mínimos
        $minX = PHP_INT_MAX;
        $maxX = PHP_INT_MIN;
        $minY = PHP_INT_MAX;
        $maxY = PHP_INT_MIN;
        $minZ = PHP_INT_MAX;
        $maxZ = PHP_INT_MIN;

        // Iterar por cada bloco e calcular os limites
        foreach ($grounds as $ground) {
            $x = (int) $ground['x'];
            $y = (int) $ground['y'];
            $z = (int) $ground['z'];

            // Atualizar os valores mínimos e máximos para cada eixo
            if ($x < $minX) $minX = $x;
            if ($x > $maxX) $maxX = $x;
            if ($y < $minY) $minY = $y;
            if ($y > $maxY) $maxY = $y;
            if ($z < $minZ) $minZ = $z;
            if ($z > $maxZ) $maxZ = $z;
        }

        // Retornar os limites calculados como resposta JSON
        echo json_encode([
            'status' => 'success',
            'limits' => [
                'minX' => $minX,
                'maxX' => $maxX,
                'minY' => $minY,
                'maxY' => $maxY,
                'minZ' => $minZ,
                'maxZ' => $maxZ
            ]
        ]);

    } else {
        echo json_encode([
            'status' => 'error',
            'message' => 'Nenhum bloco de chão encontrado.'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Erro de conexão com o banco de dados: ' . $e->getMessage()
    ]);
}
?>
