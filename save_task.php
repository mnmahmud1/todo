<?php
// Database connection settings
$host = 'localhost';    // Adjust according to your DB host
$user = 'root';         // Your DB username
$password = '';         // Your DB password
$database = 'task';  // Your DB name

// Connect to the database
$connection = new mysqli($host, $user, $password, $database);

// Check the connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

// Get the input data from the AJAX request
$taskData = json_decode(file_get_contents('php://input'), true);

// Prepare variables for insertion/update
$id = isset($taskData['id']) ? $taskData['id'] : null;
$description = $taskData['description'];
$user = $taskData['user'];
$pic = $taskData['pic'];
$status = $taskData['status'];
$totalDuration = $taskData['totalDuration'];
$actions = json_encode($taskData['actions']);  // Encode the actions as JSON

// Check if task ID exists (to decide insert or update)
if ($id) {
    // Update an existing task
    $sql = "UPDATE tasks SET 
                description = ?, 
                user = ?, 
                pic = ?, 
                status = ?, 
                total_duration = ?, 
                actions = ?
            WHERE id = ?";

    $stmt = $connection->prepare($sql);
    $stmt->bind_param('ssssisi', 
        $description, 
        $user, 
        $pic, 
        $status, 
        $totalDuration, 
        $actions, 
        $id);
} else {
    // Insert a new task
    $sql = "INSERT INTO tasks (description, user, pic, status, total_duration, actions) 
            VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $connection->prepare($sql);
    $stmt->bind_param('ssssss', 
        $description, 
        $user, 
        $pic, 
        $status, 
        $totalDuration, 
        $actions);
}

// Execute the query
if ($stmt->execute()) {
    // Return success response
    echo json_encode(['success' => true, 'id' => $stmt->insert_id]);
} else {
    // Return error response
    echo json_encode(['success' => false, 'message' => $connection->error]);
}

// Close the statement and connection
$stmt->close();
$connection->close();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

?>