<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once './config/dbconnect.php';

session_start();
if (!isset($_SESSION['userID'])) {
    header("Location: login.php"); // Redirect to login page if not logged in
    exit();
}

$userId = $_SESSION['userID'];
// $userId = 1;

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // Check if the request Content-Type is JSON
    if (isset($_SERVER['CONTENT_TYPE']) && stripos($_SERVER['CONTENT_TYPE'], 'application/json') !== false) {
        // Get the raw JSON data from the request
        $jsonData = file_get_contents("php://input");

        // Decode the JSON data
        $data = json_decode($jsonData, true);

        // Check if all required fields are set
        if (isset($data['productName'], $data['productQuantity'], $data['storeName'], $data['shoptype'])) {

            // Insert a new row into the 'products' table
            $sql = "INSERT INTO products (productName, productQuantity, storeName, shoptype, userID)
                    VALUES (?, ?, ?, ?, ?)";

            $stmt = $conn->prepare($sql);

            if (!$stmt) {
                die("Error in SQL query preparation: " . $conn->error);
            }

            $stmt->bind_param("sissi", $data['productName'], $data['productQuantity'], $data['storeName'], $data['shoptype'], $userId);

            if ($stmt->execute()) {
                // Return a JSON success response
                echo json_encode(array("message" => "New record created successfully"));
            } else {
                echo "Error executing SQL query: " . $stmt->error;
            }

            $stmt->close(); // Close the statement
        } else {
            echo "Error: All required fields are not set.";
        }
    } else {
        echo "Error: Invalid Content-Type. Expected application/json.";
    }
} else {
    echo "Error: Invalid request method.";
}

// $conn->close(); // Close the connection
?>
