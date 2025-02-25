
<?php
include 'db.php';
session_start();
$name = $_POST['name'];
$character = $_POST['character'];

$sql = "INSERT INTO `user` (`name`, `character`) VALUES ('$name', '$character')";

$conn->query($sql);

echo "User added successfully!";

// Fetch Record and Count How many Records and Add on Session

$sql = "SELECT * FROM user";
$result = $conn->query($sql);

$count = $result->num_rows;

$_SESSION['u_id'] = $count;
?>

