<?php
// Conexão com o banco de dados
$host = 'localhost';
$db   = 'aigame';
$user = 'aigame';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Falha na conexão com o banco de dados']);
    exit;
}

// Verifique se os parâmetros foram passados corretamente
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['npcId']) || !isset($input['nickname'])) {
    echo json_encode(['status' => 'error', 'message' => 'Parâmetros ausentes']);
    exit;
}

// Converter o npcId string para numérico
$npcId = convertNpcIdToNumeric($input['npcId']);  
$nickname = $input['nickname'];

// Recuperar as últimas 10 conversas do jogador com o NPC específico
$sql = "SELECT role, content FROM conversas WHERE npc_id = ? AND nickname = ? ORDER BY data_hora DESC LIMIT 10";
$stmt = $pdo->prepare($sql);
$stmt->execute([$npcId, $nickname]);
$conversas = $stmt->fetchAll();

if ($conversas) {
    // Inverter a ordem das conversas para exibir da mais antiga para a mais recente
    $conversas = array_reverse($conversas);
    echo json_encode($conversas);
} else {
    // Se não houver conversas, retorne uma resposta inicial do NPC
    $npcResponse = gerarRespostaNPC($npcId);
    echo json_encode([
        ['role' => 'npc', 'content' => $npcResponse]
    ]);
}

// Função para gerar uma resposta inicial do NPC com base no ID
function gerarRespostaNPC($npcId) {
    switch ($npcId) {
        case 1:
            return 'Olá, sou o sábio. Como posso ajudá-lo hoje?';
        case 2:
            return 'Oi, eu sou o piadista! Quer ouvir uma piada?';
        case 3:
            return 'Sou o médico, como posso ajudar na sua saúde?';
        case 4:
            return 'Saudações! Está pronto para aprender algo novo?';
        default:
            return 'Olá! O que posso fazer por você?';
    }
}

// Função para converter o npcId string para numérico
function convertNpcIdToNumeric($npcId) {
    switch ($npcId) {
        case 'sabio':
            return 1;
        case 'piadista':
            return 2;
        case 'medico':
            return 3;
        case 'cientista':
            return 4;
        default:
            return 0;  // Caso não haja correspondência, retorna 0
    }
}
?>
