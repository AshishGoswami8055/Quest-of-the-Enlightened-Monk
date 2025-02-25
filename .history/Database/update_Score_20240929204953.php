<?php
include 'db.php';

session_start();

// Check if the user is logged in
if (!isset($_SESSION['u_id'])) {
    echo "User is not logged in.";
    exit();
}

// Validate and sanitize input data
$Energies_1 = isset($_POST['Energies_1']) ? $_POST['Energies_1'] : 0; 
$Health_1 = isset($_POST['Health_1']) ? $_POST['Health_1'] : 0; 
$Min_1 = isset($_POST['Min_1']) ? $_POST['Min_1'] : 0; 
$Sec_1 = isset($_POST['Sec_1']) ? $_POST['Sec_1'] : 0; 
$Score_1 = isset($_POST['Score_1']) ? $_POST['Score_1'] : 0; 

$Energies_2 = isset($_POST['Energies_2']) ? $_POST['Energies_2'] : 0; 
$Health_2 = isset($_POST['Health_2']) ? $_POST['Health_2'] : 0; 
$Min_2 = isset($_POST['Min_2']) ? $_POST['Min_2'] : 0; 
$Sec_2 = isset($_POST['Sec_2']) ? $_POST['Sec_2'] : 0; 
$Score_2 = isset($_POST['Score_2']) ? $_POST['Score_2'] : 0; 

$Energies_3 = isset($_POST['Energies_3']) ? $_POST['Energies_3'] : 0; 
$Health_3 = isset($_POST['Health_3']) ? $_POST['Health_3'] : 0; 
$Min_3 = isset($_POST['Min_3']) ? $_POST['Min_3'] : 0; 
$Sec_3 = isset($_POST['Sec_3']) ? $_POST['Sec_3'] : 0; 
$Score_3 = isset($_POST['Score_3']) ? $_POST['Score_3'] : 0; 

$u_id = $_SESSION['u_id'];

// Prepare SQL statement to prevent SQL injection
$sql = "UPDATE `user` SET 
    `level1Energies` = ?, 
    `level1Health` = ?, 
    `level1Min` = ?, 
    `level1Sec` = ?, 
    `level1Score` = ?, 
    `level2Energies` = ?, 
    `level2Health` = ?, 
    `level2Min` = ?, 
    `level2Sec` = ?, 
    `level2Score` = ?, 
    `level3Energies` = ?, 
    `level3Health` = ?, 
    `level3Min` = ?, 
    `level3Sec` = ?, 
    `level3Score` = ? 
    WHERE `user`.`id` = ?";

// Prepare and bind parameters
$stmt = $conn->prepare($sql);
$stmt->bind_param(
    'iiiiiisiisiisiisi', 
    $Energies_1, $Health_1, $Min_1, $Sec_1, $Score_1, 
    $Energies_2, $Health_2, $Min_2, $Sec_2, $Score_2, 
    $Energies_3, $Health_3, $Min_3, $Sec_3, $Score_3, 
    $u_id
);

// Execute the prepared statement
if ($stmt->execute()) {
    echo "User updated successfully!";
} else {
    echo "Error updating record: " . $stmt->error;
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>
