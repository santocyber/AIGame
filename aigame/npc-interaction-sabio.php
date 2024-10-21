<?php
function chatGPTRequest($npcId, $nickname, $conversationHistory) {
    $openAiToken = '';

    // Definir a personalidade do NPC Médico
    $personalidade = '';
    if ($npcId == 3) {  // NPC Médico
        $personalidade = 'Você é um sabio NPC. Suas respostas são baseadas em informações científicas de fontes confiáveis. Responda de forma clara e objetiva, citando artigos e estudos relevantes quando necessário.';
    }

    // Formatar o histórico de conversas para o ChatGPT
    $messages = [['role' => 'system', 'content' => $personalidade]];  // Começar com a personalidade do NPC
    foreach ($conversationHistory as $message) {
        $messages[] = ['role' => $message['role'], 'content' => $message['content']];
    }

    // Dados para enviar à API do OpenAI
    $data = [
        'model' => 'gpt-4',
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
        error_log("cURL error: " . curl_error($curl));
        return json_encode(['error' => 'Erro na requisição à API OpenAI.']);
    }

    curl_close($curl);

    // Decodificar a resposta da API
    $responseDecoded = json_decode($response, true);

    if (isset($responseDecoded['choices'][0]['message']['content'])) {
        return $responseDecoded['choices'][0]['message']['content'];
    } else {
        return json_encode(['error' => 'Erro ao interpretar a resposta da API.']);
    }
}

// Processar a requisição recebida
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $npcId = $input['npcId'];
    $nickname = $input['nickname'];
    $conversationHistory = $input['conversationHistory'];

    // Obter resposta da API do ChatGPT para o NPC Médico
    $resposta = chatGPTRequest($npcId, $nickname, $conversationHistory);
    echo json_encode(['response' => $resposta]);
}
