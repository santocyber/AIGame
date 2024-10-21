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

// Verifica se os dados estão corretamente enviados
$input = json_decode(file_get_contents('php://input'), true);

if ($input === null) {
    echo json_encode(['status' => 'error', 'message' => 'JSON inválido recebido']);
    exit;
}

if (!isset($input['conversa']) || !isset($input['npcId']) || !isset($input['nickname'])) {
    echo json_encode(['status' => 'error', 'message' => 'Parâmetros ausentes']);
    exit;
}

$conversa = $input['conversa'];  // Recebe a conversa (array)
$npcId = convertNpcIdToNumeric($input['npcId']);  // Converter o npcId da string para o numérico
$nickname = $input['nickname'];

// Salvar cada parte da conversa no banco de dados
try {
    foreach ($conversa as $message) {
        $role = $message['role'];  // 'user' ou 'assistant'
        $content = $message['content'];

        $sql = "INSERT INTO conversas (npc_id, nickname, role, content) VALUES (?, ?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$npcId, $nickname, $role, $content]);
    }

    echo json_encode(['status' => 'success', 'message' => 'Conversa salva com sucesso']);
} catch (\PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Erro ao salvar a conversa no banco de dados']);
    exit;
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
            return 0;  // Caso não haja correspondência
    }
}
?>
