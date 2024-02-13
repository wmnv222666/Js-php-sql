<?php
require_once './config/dbconnect.php';
session_start();

// Check if the user is logged in
if (!isset($_SESSION['userID'])) {
    header("Location: login.php"); // Redirect to login page if not logged in
    exit();
}

$userId = $_SESSION['userID'];
$output = []; // initialize

// Check if productId is present in the query parameters
if (isset($_GET['productId'])) {
    $productId = $_GET['productId'];

    // Fetch details for a specific product based on productId
    $stmt = $conn->prepare("SELECT 
                products.productID, 
                products.productName, 
                products.productQuantity, 
                products.storeName, 
                products.userID,
                users.full_name, 
                users.email,
                products.shoptype
            FROM products 
            JOIN users ON users.userID = products.userID
            WHERE users.userID = ? AND products.productID = ?");

    if (!$stmt) {
        die("Error in SQL query: " . $conn->error);
    }

    $stmt->bind_param("ii", $userId, $productId);
} else {
    // Fetch all products for the user
    $stmt = $conn->prepare("SELECT 
                products.productID, 
                products.productName, 
                products.productQuantity, 
                products.storeName, 
                products.userID,
                users.full_name, 
                users.email,
                products.shoptype
            FROM products 
            JOIN users ON users.userID = products.userID
            WHERE users.userID = ?");

    if (!$stmt) {
        die("Error in SQL query: " . $conn->error);
    }

    $stmt->bind_param("i", $userId);
}

$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Output data of each row
    while ($row = $result->fetch_assoc()) {
        $output[] = $row;
    }
} else {
    $output['message'] = "0 results";
}

$stmt->close();
$conn->close();

header('Content-Type: application/json');
echo json_encode($output);
?>