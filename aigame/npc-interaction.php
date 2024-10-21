<?php
// Configuração da conexão com o banco de dados
$host = 'localhost';
$db   = 'aigame';
$user = 'aigame';
$pass = 'NtaEaPMRpfz4E4BJ';
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

// Função para salvar a conversa no banco de dados
function salvarConversa($npcId, $nickname, $role, $content) {
    global $pdo;
    $sql = "INSERT INTO conversas (npc_id, nickname, role, content, data_hora) VALUES (?, ?, ?, ?, NOW())";
    $stmt = $pdo->prepare($sql);

    try {
        $stmt->execute([$npcId, $nickname, $role, $content]);
    } catch (PDOException $e) {
        error_log("Erro ao salvar conversa: " . $e->getMessage());
        return false;
    }

    return true;
}

// Receber os dados da requisição
$input = json_decode(file_get_contents('php://input'), true);

// Inicializar o histórico de conversas como um array vazio
$conversationHistory = isset($input['conversationHistory']) ? $input['conversationHistory'] : [];

// Validar os campos recebidos
if (isset($input['npcId'], $input['nickname'], $input['mensagem'])) {
    $npcId = $input['npcId'];
    $nickname = $input['nickname'];
    $mensagem = $input['mensagem'];

    // Salvar a mensagem do usuário no banco de dados
    salvarConversa($npcId, $nickname, 'user', $mensagem);

    // Obter a resposta do NPC (GPT)
    $npcResposta = chatGPTRequest($npcId, $nickname, $conversationHistory, $mensagem);

    // Salvar a resposta do NPC no banco de dados
    salvarConversa($npcId, $nickname, 'assistant', $npcResposta);

    // Retornar a resposta para o frontend
    echo json_encode(['response' => $npcResposta]);
} else {
    echo json_encode(['error' => 'Dados incompletos.']);
}
function chatGPTRequest($npcId, $nickname, $conversationHistory) {
    $openAiToken = 'sk---s5rvAr-';

    // Definir a personalidade do NPC com base no nome do NPC
    $personalidade = '';
    switch ($npcId) {
        case 'sabio':
            $personalidade = 'Você é o sábio, que oferece conselhos profundos e reflexivos aos jogadores.';
            break;
        case 'piadista':
            $personalidade = 'Você é o piadista, conhecido por contar piadas engraçadas e responder de forma bem-humorada.';
            break;
        case 'medico':
            $personalidade = 'Você é o médico, oferecendo conselhos de saúde e informações relacionadas ao bem-estar.';
            break;
        case 'cientista':
            $personalidade = 'Você é o cientista, fornecendo respostas detalhadas e baseadas em fatos científicos.';
            break;
        default:
            $personalidade = 'Você é um NPC neutro, criado para ajudar e fornecer informações básicas.';
            break;
    }

    // Iniciar a conversa com a personalidade do NPC
    $messages = [
        ['role' => 'system', 'content' => $personalidade]  // Mensagem inicial de personalidade
    ];

    // Limitar as mensagens enviadas à API para as últimas 3 interações
    $limitedHistory = array_slice($conversationHistory, -3);

    // Adicionar as últimas 3 mensagens ao histórico
    foreach ($limitedHistory as $message) {
        $role = $message['role'];

        // Verificar se o role é válido
        if (!in_array($role, ['system', 'user', 'assistant'])) {
            $role = 'user';  // Define como 'user' caso o role seja inválido
        }

        $messages[] = ['role' => $role, 'content' => $message['content']];
    }

    // Dados para enviar à API do OpenAI
    $data = [
        'model' => 'gpt-3.5-turbo',
        'messages' => $messages,
        'max_tokens' => 1000
    ];

    // Chamada cURL para a API OpenAI
    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => "https://api.openai.com/v1/chat/completions",
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($data),
        CURLOPT_HTTPHEADER => [
            "Content-Type: application/json",
            "Authorization: Bearer $openAiToken"
        ]
    ]);

    $response = curl_exec($curl);

    if (curl_errno($curl)) {
        error_log("Erro de cURL: " . curl_error($curl));
        echo json_encode(['error' => 'Erro na requisição à API OpenAI.']);
        exit;
    }

    curl_close($curl);

    // Verificar se a resposta é vazia
    if (empty($response)) {
        error_log("Erro: Resposta vazia da API OpenAI.");
        echo json_encode(['error' => 'Resposta vazia da API OpenAI.']);
        exit;
    }

    // Decodificar a resposta da API
    $responseDecoded = json_decode($response, true);

    if (isset($responseDecoded['choices'][0]['message']['content'])) {
        return $responseDecoded['choices'][0]['message']['content'];
    } else {
        error_log("Erro ao interpretar a resposta da API: " . json_encode($responseDecoded));
        echo json_encode(['error' => 'Erro ao interpretar a resposta da API.']);
    }
}
