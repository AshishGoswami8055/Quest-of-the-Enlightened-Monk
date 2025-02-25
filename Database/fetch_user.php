<?php
// Include the database connection file
include 'db.php';

// SQL query to select all records from the 'user' table
$sql = "SELECT * FROM user";

// Execute the query and store the result
$result = $conn->query($sql);

// Initialize an empty array to hold user data
$users = [];

// Check if there are any rows returned from the query
if ($result->num_rows > 0) {
    // Loop through each row in the result set
    while ($row = $result->fetch_assoc()) {
        // Append each row (as an associative array) to the $users array
        $users[] = $row;
    }
}

// Encode the $users array as a JSON object and output it
echo json_encode($users);
?>
