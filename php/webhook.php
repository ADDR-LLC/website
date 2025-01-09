<?php

require 'env_loader.php';

$envFilePath = __DIR__ . '/.env';
loadEnv($envFilePath);

if (file_exists($envFilePath)) {
    $webhook_url = getenv('DISCORD_WEBHOOK_URL');
    if (!$webhook_url) {
        die(json_encode(['status' => 'error', 'message' => 'Webhook URL not set.']));
    }

    // components from html page
    $firstName = $_POST['firstName'];
    $lastName = $_POST['lastName'];
    $email = $_POST['userEmail'];
    $subject = $_POST['subject'];
    $description = $_POST['description'];

    $msg = [
        "content" => "**New Contact Form submission for ADDR**\n\n".
                     "**Name:** $firstName $lastName\n\n".
                     "**Email:** $email\n\n".
                     "**Subject:** $subject\n\n".
                     "**Description:**\n$description"
    ];

    sendWebhook($webhook_url, $msg); // sending the message here

} else {
    die(json_encode(['status' => 'error', 'message' => '.env not found']));
}


function sendWebhook($webhook_url, $msg) {
    $headers = array('Content-Type: application/json');

    $ch = curl_init();
    if ($ch === false) {
        die(json_encode(['status' => 'error', 'message' => 'Failed to initialize cURL']));
    }

    curl_setopt($ch, CURLOPT_URL, $webhook_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($msg));

    $response = curl_exec($ch);
    if ($response === false) {
        die(json_encode(['status' => 'error', 'message' => 'cURL error: ' . curl_error($ch)]));
    }

    http_response_code(200);
    echo json_encode(['status' => 'success', 'message' => 'Message sent successfully']);

    curl_close($ch);
}
?>