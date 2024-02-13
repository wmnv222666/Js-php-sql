<?php
require_once './config/dbconnect.php';

// Assuming update.php is handling POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Get the raw POST data
  $data = json_decode(file_get_contents('php://input'), true);

  // Check if the productId and updated data are present in the data
  if (isset($data['productId']) && isset($data['updatedData'])) {
    // Perform the update operation (replace this with your actual update logic)
    $productId = $data['productId'];
    $updatedData = $data['updatedData'];

    // Here, you might have a database connection and execute an UPDATE query
    $sql = "UPDATE products SET productName = ?, productQuantity = ?, storeName = ?, shoptype = ? WHERE productId = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
      $stmt->bind_param("ssssi", $updatedData['productName'], $updatedData['productQuantity'], $updatedData['storeName'], $updatedData['shoptype'], $productId);
      $stmt->execute();

      if ($stmt->error) {
        $response = array('status' => 'error', 'message' => 'Database error: ' . $stmt->error);
        http_response_code(500);
      } else {
        $response = array('status' => 'success', 'message' => 'Product updated successfully');
        http_response_code(200);
      }

      $stmt->close();
    } else {
      $response = array('status' => 'error', 'message' => 'Database error: Unable to prepare statement');
      http_response_code(500);
    }
  } else {
    // If productId or updatedData is not present in the data, return a bad request response
    $response = array('status' => 'error', 'message' => 'Bad request. ProductId or updatedData is missing.');
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