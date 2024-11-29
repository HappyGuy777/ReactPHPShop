<?php
require_once(__DIR__ . '/../config.php');

function clear_data($val) {
    $val = trim($val);
    $val = stripslashes($val);
    $val = strip_tags($val);
    $val = htmlspecialchars($val);
    return $val;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Validate and sanitize input
    $userId = clear_data($_GET['userId']);
    $requestorID=clear_data($_GET['requestorID']);
    if (!is_numeric($userId)) {
        echo json_encode(['error' => 'Invalid user ID']);
        exit;
    }
    
    // Prepare and execute the query using a prepared statement
    $query = "SELECT * FROM users WHERE id = ?";
    $stmt = mysqli_prepare($connect, $query);
    mysqli_stmt_bind_param($stmt, "i", $userId);
    mysqli_stmt_execute($stmt);
    $userData = mysqli_stmt_get_result($stmt);
    if (isset($requestorID) && is_numeric($requestorID)) {
        mysqli_stmt_bind_param($stmt, "i", $requestorID);
        mysqli_stmt_execute($stmt);
        $requestorData = mysqli_stmt_get_result($stmt);
       $requestor =$requestorData->fetch_assoc();
    }
    if (mysqli_num_rows($userData) > 0) {
       
        $user = $userData->fetch_assoc();
     
        if ($user['status'] == 3 && $requestor['status']!=2) {
            echo json_encode(['errors' => ['login_errors' => ['email' => 'User is banned']]]);
        } else {
            if (!empty($user['avatar'])) {
                // Convert avatar to base64
                $imageData = file_get_contents($user['avatar']);
                $base64Image = base64_encode($imageData);
                $user['avatar_base64'] = $base64Image;
            }
            // Remove sensitive data before sending response
            unset($user['password']);
            echo json_encode(['data' => $user]);
        }
    } else {
        // User not found
        echo json_encode(['errors' => ['login_errors' => ['email' => 'User not found']]]);
    }
} else {
    // Invalid request method
    echo json_encode(['error' => 'Invalid request method']);
}
?>
