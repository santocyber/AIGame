<?php
function chatGPTRequest($npcId, $nickname, $conversationHistory) {
    $openAiToken = '';

   // Definir a personalidade do NPC com base no ID
    $personalidade = '';
    switch ($npcId) {
        case 1:
            $personalidade = 'Você é um NPC sábio que dá conselhos profundos aos jogadores.';
            break;
        case 2:
            $personalidade = 'Você é um NPC engraçado e sarcástico que responde de forma bem-humorada.';
            break;
        case 3:
            $personalidade = 'Você é um NPC médico, fornecendo conselhos de saúde.';
            break;
        case 4:
            $personalidade = 'Você é um NPC cientista, fornecendo respostas detalhadas e científicas.';
            break;
        default:
            $personalidade = 'Você é um NPC neutro, fornecendo respostas genéricas.';
    }

    // Conectar ao banco de dados para recuperar o histórico de conversas
    $pdo = getDBConnection(); // Supondo que você já tenha essa função

    // Recuperar as últimas 3 mensagens da conversa do banco de dados
    $sql = "SELECT role, content FROM conversas WHERE npc_id = ? AND nickname = ? ORDER BY data_hora DESC LIMIT 3";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$npcId, $nickname]);
    $conversationHistory = $stmt->fetchAll();

    // Iniciar com a personalidade do NPC
    $messages = [['role' => 'system', 'content' => $personalidade]];

    // Adicionar as últimas 3 mensagens ao histórico (se houver)
    if (!empty($conversationHistory)) {
        foreach (array_reverse($conversationHistory) as $message) {
            $messages[] = ['role' => $message['role'], 'content' => $message['content']];
        }
    }

    // Verificar o conteúdo que será enviado à API (para depuração)
    error_log("Enviando as seguintes mensagens para GPT: " . json_encode($messages));

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
        return json_encode(['error' => 'Erro na requisição à API OpenAI.']);
    }

    curl_close($curl);

    // Verificar se a resposta é vazia
    if (empty($response)) {
        error_log("Erro: Resposta vazia da API OpenAI.");
        return json_encode(['error' => 'Resposta vazia da API OpenAI.']);
    }

    // Verificar o conteúdo da resposta (para depuração)
    error_log("Resposta recebida da API: " . $response);

    // Decodificar a resposta da API
    $responseDecoded = json_decode($response, true);

    if (isset($responseDecoded['choices'][0]['message']['content'])) {
        return $responseDecoded['choices'][0]['message']['content'];
    } else {
        error_log("Erro ao interpretar a resposta da API: " . json_encode($responseDecoded));
        return json_encode(['error' => 'Erro ao interpretar a resposta da API.']);
    }
}
