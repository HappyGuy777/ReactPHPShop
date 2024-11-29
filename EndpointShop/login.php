<?php
require_once("./config.php");

global $connect;

function clear_data($val) {
    return htmlspecialchars(strip_tags(stripslashes(trim($val))));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $jsonData = file_get_contents("php://input");
    $data = json_decode($jsonData, true);

    $errors = [];

    // Sanitize input data
    $email = mysqli_real_escape_string($connect, clear_data($data['email']));
    $password = mysqli_real_escape_string($connect, clear_data($data['password']));

    // Check for empty fields
    if (empty($email)) {
        $errors['login_errors']['email'] = 'Email is required';
    }

    if (empty($password)) {
        $errors['login_errors']['password'] = 'Password is required';
    }

    if (empty($errors)) {
        $query = "SELECT * FROM users WHERE email = '$email'";
        $result = mysqli_query($connect, $query);
        
        if (mysqli_num_rows($result) > 0) {
            $user = mysqli_fetch_assoc($result);
            if ($user['status']!=3) {
                // Verify password
                if (password_verify($password, $user['password'])) {
                    // Password is correct, return user data
                    // Check if the avatar field is not empty
                    if (!empty($user['avatar'])) {
                        // Read the image file
                        $imageData = file_get_contents($user['avatar']);

                        // Convert image data to base64
                        $base64Image = base64_encode($imageData);

                        // Add base64 image data to the user array
                        $user['avatar_base64'] = $base64Image;
                    }

                    // Remove the 'password' field from the response for security reasons
                    unset($user['password']);

                    echo json_encode(['data' => $user]);
                } else {
                    // Password is incorrect
                    $errors['login_errors']['password'] = 'Incorrect password';
                }
            }else{
                $errors['login_errors']['email'] = 'Email not found';
            }
            
        } else {
            // Email does not exist
            $errors['login_errors']['email'] = 'Email not found';
        }
    }

    if (!empty($errors)) {
        echo json_encode(['errors' => $errors]);
    }
} else {
    // Invalid request method
    echo json_encode(['error' => 'Invalid request method']);
}
?>
