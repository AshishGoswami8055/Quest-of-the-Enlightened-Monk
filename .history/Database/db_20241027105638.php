<?php
// Define database connection parameters
$host = 'localhost';     // Database host
$user = 'root';          // Database username
$password = '';          // Database password (empty for local development)
$database = 'monkgame';  // Database name

// Create a new mysqli instance to establish a connection to the database
$conn = new mysqli($host, $user, $password, $database);

// Check for connection errors
if ($conn->connect_error) {
    // If there is a connection error, terminate the script and display an error message
    die("Connection failed: " . $conn->connect_error);
}
?>
