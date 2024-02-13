<?php
session_start();

$response = array('logged_in' => false);

if (isset($_SESSION['user'])) {
    $response['logged_in'] = true;
    $response['user'] = $_SESSION['user'];
}

header('Content-Type: application/json');
echo json_encode($response);
?>