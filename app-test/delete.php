<?php
require_once './config/dbconnect.php';
// Assuming delete.php is handling POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Get the raw POST data
  $data = json_decode(file_get_contents('php://input'), true);

  // Check if the productId is present in the data
  if (isset($data['productId'])) {
    // Perform the delete operation (replace this with your actual delete logic)
    $productId = $data['productId'];

    // Here, you might have a database connection and execute a DELETE query

    $sql = "DELETE FROM products WHERE productId = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
      $stmt->bind_param("i", $productId);
      $stmt->execute();

      if ($stmt->error) {
        $response = array('status' => 'error', 'message' => 'Database error: ' . $stmt->error);
        http_response_code(500);
      } else {
        $response = array('status' => 'success', 'message' => 'Product deleted successfully');
        http_response_code(200);
      }

      $stmt->close();
    } else {
      $response = array('status' => 'error', 'message' => 'Database error: Unable to prepare statement');
      http_response_code(500);
    }
  } else {
    // If productId is not present in the data, return a bad request response
    $response = array('status' => 'error', 'message' => 'Bad request. ProductId is missing.');
    http_response_code(400);
  }
} else {
  // If the request method is not POST, return a method not allowed response
  $response = array('status' => 'error', 'message' => 'Method not allowed');
  http_response_code(405);
}

// Send the JSON response
header('Content-Type: application/json');
echo json_encode($response);
?>