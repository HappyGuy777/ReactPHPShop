<?php

require_once (".\config.php");
global $connect;

function clear_data($val) {
    $val = trim($val);
    $val = stripslashes($val);
    $val = strip_tags($val);
    $val = htmlspecialchars($val);
    return $val;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jsonData = file_get_contents("php://input");
    $data = json_decode($jsonData, true);

    $errors = [];

    // Escape variables to prevent SQL injection
    $name = mysqli_real_escape_string($connect, clear_data($data['name']));
    $second_name = mysqli_real_escape_string($connect, clear_data($data['second_name']));
    $email = mysqli_real_escape_string($connect, clear_data($data['email']));
    $birthday=mysqli_real_escape_string($connect,clear_data($data['birthday']));
    $gender = mysqli_real_escape_string($connect, $data['gender']);
    if ($gender=="male") {
        $avatar="./uploads/avatars/male.png";
    }else{
        $avatar="./uploads/avatars/female.png";
    }   
    $password = mysqli_real_escape_string($connect, clear_data($data['password']));
    $repeatPassword = mysqli_real_escape_string($connect, clear_data($data['repeatPassword']));

    // Check for empty fields
    if (empty($name)) {
        $errors['register_errors']['name'] = 'Name is required';
    }

    if (empty($second_name)) {
        $errors['register_errors']['second_name'] = 'Second Name is required';
    }

    if (empty($email)) {
        $errors['register_errors']['email'] = 'Email is required';
    }

    if (empty($password)) {
        $errors['register_errors']['password'] = 'Password is required';
    }

    if (empty($repeatPassword)) {
        $errors['register_errors']['repeatPassword'] = 'Repeat Password is required';
    }
    if (empty($birthday)) {
        $errors['register_errors']['birthday'] = 'Birthday is required';
    }
    // Check if passwords match
    if ($password !== $repeatPassword) {
        $errors['register_errors']['repeatPassword'] = 'Passwords do not match';
    } else {
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    }

    $emailCheckQuery = "SELECT * FROM users WHERE email = '$email'";
    $emailCheckResult = mysqli_query($connect, $emailCheckQuery);

    if (mysqli_num_rows($emailCheckResult) > 0) {
        $errors['register_errors']['email'] = 'Email already exists';
    }

    // If there are no errors, proceed with database operations
    if (empty($errors)) {
        $sql = "INSERT INTO `users` (`name`, `second_name`, `email`,`birthday`, `gender`, `password`,`avatar`) 
                VALUES ('$name', '$second_name', '$email','$birthday', '$gender', '$hashedPassword','$avatar')";

        if (mysqli_query($connect, $sql)) {
            $lastInsertId = mysqli_insert_id($connect);

            // Assuming you have a function to fetch user data by ID from the database
            $sql = "SELECT * FROM `users` WHERE `email` = '$email'";
            $result = mysqli_query($connect, $sql);

            if ($result) {
                $userData = mysqli_fetch_assoc($result);
                echo json_encode(['data' => $userData]);
            } else {
                echo json_encode(['error' => 'Error fetching user data']);
            }
        } else {
            $errors['register_errors']['database'] = 'Error inserting data: ' . mysqli_error($connect);
        }
    }

    echo json_encode(['errors' => $errors]);
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
?>
