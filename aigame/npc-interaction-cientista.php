<?php
function chatGPTRequest($npcId, $nickname, $conversationHistory) {


    // Definir a personalidade do NPC Cientista
    $personalidade = '';
    if ($npcId == 4) {  // NPC Cientista
        $personalidade = 'Você é um NPC cientista. Suas respostas são baseadas em descobertas científicas e conceitos avançados. Cite pesquisas e estudos científicos recentes, preferencialmente de fontes como o arXiv ou revistas científicas de alta credibilidade.';
    }

    // Formatar o histórico de conversas para o ChatGPT
    $messages = [['role' => 'system', 'content' => $personalidade]];  // Começar com a personalidade do NPC
    foreach ($conversationHistory as $message) {
        $messages[] = ['role' => $message['role'], 'content' => $message['content']];
    }

    // Dados para enviar à API do OpenAI
    $data = [
        'model' => 'gpt-4-turbo',
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

// Função para buscar artigos no arXiv (opcional)
function buscarArtigosArxiv($termoBusca) {
    $url = "http://export.arxiv.org/api/query?search_query=" . urlencode($termoBusca) . "&start=0&max_results=5";

    $curl = curl_init();
    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
    ]);

    $response = curl_exec($curl);

    if (curl_errno($curl)) {
        error_log("Erro ao buscar artigos no arXiv: " . curl_error($curl));
        return null;
    }

    curl_close($curl);

    // Processar e retornar os artigos do arXiv
    return simplexml_load_string($response);
}

// Processar a requisição recebida
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $npcId = $input['npcId'];
    $nickname = $input['nickname'];
    $conversationHistory = $input['conversationHistory'];

    // Obter resposta da API do ChatGPT
    $resposta = chatGPTRequest($npcId, $nickname, $conversationHistory);

    // Resposta adicional do arXiv (opcional)
    if (isset($input['termoBusca'])) {
        $artigos = buscarArtigosArxiv($input['termoBusca']);
        if ($artigos) {
            $resposta .= "\n\nAqui estão alguns artigos do arXiv relacionados ao tema:\n";
            foreach ($artigos->entry as $artigo) {
                $resposta .= "- " . (string)$artigo->title . " (" . (string)$artigo->id . ")\n";
            }
        } else {
            $resposta .= "\n\nNão foi possível encontrar artigos no arXiv no momento.";
        }
    }

    echo json_encode(['response' => $resposta]);
}
