<?php

$webhook_url = getenv('DISCORD_WEBHOOK_URL');

$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['userEmail'];
$subject = $_POST['subject'];
$description = $_POST['description'];

$msg = [
    "content" => "New contact form submission:\n\n".
                 "Name: $firstName $lastName\n".
                 "Email: $email\n".
                 "Subject: $subject\n".
                 "Description: $description"
];

$headers = array('Content-Type: application/json');

$ch = curl_init();
if ($ch === false) {
    die('Failed to initialize cURL');
}
curl_setopt($ch, CURLOPT_URL, $webhook_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($msg));
$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>