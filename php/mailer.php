<?php

// form data
$firstName = $_POST['firstName'];
$lastName = $_POST['lastName'];
$email = $_POST['userEmail'];
$subject = $_POST['subject'];
$description = $_POST['description'];


$msg = "New contact form submission:\n\n".
       "Name: $firstName $lastName\n".
       "Email: $email\n".
       "Subject: $subject\n".
       "Description: $description";

// Use wordwrap() if lines are longer than 70 characters
$msg = wordwrap($msg, 70);

// Send email
$to = "someone@example.com"; // our mail
$headers = "From: $email";

if (mail($to, $subject, $msg, $headers)) {
    echo "Email sent successfully.";
} else {
    echo "Failed to send email.";
}
?>