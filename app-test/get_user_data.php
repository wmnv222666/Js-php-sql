<?php
session_start();

$response = array('user' => null);

if (isset($_SESSION['user'])) {
  // Assuming you store the user's name in the session after login
  $response['user'] = $_SESSION['user'];
}

header('Content-Type: application/json');
echo json_encode($response);
?>