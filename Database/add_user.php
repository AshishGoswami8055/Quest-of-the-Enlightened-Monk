<?php
// Include the database connection file
include 'db.php';

// Start a new session or resume the existing session
session_start();

// Retrieve the 'name' and 'character' values from the POST request
$name = $_POST['name'];
$character = $_POST['character'];

// Prepare the SQL query to insert the user data into the 'user' table
$sql = "INSERT INTO `user` (`name`, `character`) VALUES ('$name', '$character')";

// Execute the SQL query
$conn->query($sql);

// Output a success message to indicate the user was added
echo "User added successfully!";

// Fetch all records from the 'user' table to count the total number of users
$sql = "SELECT * FROM user";
$result = $conn->query($sql);

// Get the number of records returned from the query
$count = $result->num_rows;

// Store the count of users in the session variable 'u_id'
$_SESSION['u_id'] = $count;
?>
