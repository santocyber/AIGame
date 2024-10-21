<?php
// Coloque aqui a chave da API da OpenAI
$api_key = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $question = $_POST['question'] ?? '';

    if (empty($question)) {
        echo json_encode(['status' => 'error', 'message' => 'Pergunta vazia']);
        exit;
    }

    // Faz a chamada para a API da OpenAI
    $response = askOpenAI($question);

    if ($response !== null) {
        echo json_encode(['status' => 'success', 'response' => $response]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erro ao chamar a OpenAI']);
    }
}

function askOpenAI($question) {
    global $api_key;

    $data = [
        'model' => 'text-davinci-003',
        'prompt' => $question,
        'max_tokens' => 150,
        'temperature' => 0.7,
    ];

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, 'https://api.openai.com/v1/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $api_key,
    ]);

    $result = curl_exec($ch);
    curl_close($ch);

    if ($result === false) {
        return null;
    }

    $response = json_decode($result, true);
    return $response['choices'][0]['text'] ?? null;
}
