<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "tasks";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $description = $_POST['description'];
    $user = $_POST['user'];
    $pic = $_POST['pic'];
    $status = 'paused';

    $stmt = $conn->prepare("INSERT INTO tasks (description, user, pic, status) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $description, $user, $pic, $status);

    if ($stmt->execute()) {
        echo "New task created successfully!";
    } else {
        echo "Error: " . $conn->error;
    }

    $stmt->close();
}

$conn->close();
?>