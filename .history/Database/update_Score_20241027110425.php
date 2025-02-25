<?php
// Include the database connection file
include 'db.php';

// Start a new session or resume the existing session
session_start();

// Retrieve POST data for level 1 stats
$Energies_1 = $_POST['Energies_1']; 
$Health_1 = $_POST['Health_1']; 
$Min_1 = $_POST['Min_1']; 
$Sec_1 = $_POST['Sec_1']; 
$Score_1 = $_POST['Score_1']; 

// Retrieve POST data for level 2 stats
$Energies_2 = $_POST['Energies_2']; 
$Health_2 = $_POST['Health_2']; 
$Min_2 = $_POST['Min_2']; 
$Sec_2 = $_POST['Sec_2']; 
$Score_2 = $_POST['Score_2']; 

// Retrieve POST data for level 3 stats
$Energies_3 = $_POST['Energies_3']; 
$Health_3 = $_POST['Health_3']; 
$Min_3 = $_POST['Min_3']; 
$Sec_3 = $_POST['Sec_3']; 
$Score_3 = $_POST['Score_3']; 

// Get the user ID from the session
$u_id = $_SESSION['u_id'];

// SQL query to update the user's stats in the database
$sql = "UPDATE `user` SET 
    `level1Energies` = '$Energies_1', 
    `level1Health` = '$Health_1', 
    `level1Min` = '$Min_1', 
    `level1Sec` = '$Sec_1', 
    `level1Score` = '$Score_1', 
    `level2Energies` = '$Energies_2', 
    `level2Health` = '$Health_2', 
    `level2Min` = '$Min_2', 
    `level2Sec` = '$Sec_2', 
    `level2Score` = '$Score_2', 
    `level3Energies` = '$Energies_3', 
    `level3Health` = '$Health_3', 
    `level3Min` = '$Min_3', 
    `level3Sec` = '$Sec_3', 
    `level3Score` = '$Score_3' 
WHERE `user`.`id` = '$u_id';";

// Execute the update query
$conn->query($sql);

// Output a success message
echo "User updated successfully!";
?>
