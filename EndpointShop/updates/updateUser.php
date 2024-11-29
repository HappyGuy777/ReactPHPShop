<?php
require_once(__DIR__ . '/../config.php');

global $connect;

function clear_data($val) {
    $val = trim($val);
    $val = stripslashes($val);
    $val = strip_tags($val);
    $val = htmlspecialchars($val);
    return $val;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $errors = [];

    $user_id = clear_data($_POST['user_id']);
    $name = clear_data($_POST['name']);
    $second_name = clear_data($_POST['second_name']);
    $cellphone = clear_data($_POST['cellphone']);
    $bank_chard = clear_data((string)$_POST['bank_chard']);
    $password = clear_data($_POST['password']);
    $repeatPassword = clear_data($_POST['repeat_password']);
    $sql="SELECT * FROM `users` WHERE `id`='$user_id'";
    $user=mysqli_fetch_assoc(mysqli_query($connect,$sql));
    $targetFilePath;
    
    if (empty($name)) {
        $errors['register_errors']['name'] = 'Name is required';
    }

    if (empty($second_name)) {
        $errors['register_errors']['second_name'] = 'Second Name is required';
    }
    if (empty($cellphone)) {
        $cellphone=$user['cellphone'];
    }
    if (empty($bank_chard)) {
        $bank_chard=$user['bank_chard'];
    }else if(strlen($bank_chard)!=16){
        $errors['register_errors']['bank_chard'] = 'Bank chard need to be 16 digths';
    }   

    if (!empty($repeatPassword) && empty($password)) {
            $errors['register_errors']['password'] = 'Password is required';
    }

    if (empty($password)) {
        $hashedPassword=$user['password'];
    } else {
        if ($password !== $repeatPassword) {
            $errors['register_errors']['repeatPassword'] = 'Passwords do not match';
        } else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
            $updatePassword = true;
        }
    }

    

    if (empty($_FILES['avatar']['name'])) {
        $targetFilePath=$user['avatar'];
    } else {
        $targetDir = "./uploads/avatars/";
        $fileName = basename($_FILES['avatar']['name']);
        $targetFilePath = $targetDir. time() .  $fileName;
        $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);

        $allowTypes = array('jpg', 'jpeg', 'png');
        if (!in_array($fileType, $allowTypes)) {
            $errors['register_errors']['image'] = 'Only JPG, JPEG, PNG files are allowed';
        } else {
            if (!move_uploaded_file($_FILES['avatar']['tmp_name'], $targetFilePath)) {
                $errors['register_errors']['image'] = 'Failed to upload image';
            }
        }
    }
    

    if (empty($errors)) {
        $sql = "UPDATE `users` SET `name`=?, `second_name`=?, `cellphone`=?, `bank_chard`=? ,`password`=?, `avatar`=? WHERE `id`=?";
        $stmt = mysqli_prepare($connect, $sql);
        if ($stmt) {
            mysqli_stmt_bind_param($stmt, "ssssssi", $name, $second_name, $cellphone, $bank_chard , $hashedPassword ,$targetFilePath ,$user_id);
            if (mysqli_stmt_execute($stmt)) {
                $sql = "SELECT * FROM `users` WHERE `id` = '$user_id'";
                $result = mysqli_query($connect, $sql);

                if ($result) {
                    $userData = mysqli_fetch_assoc($result);
                    echo json_encode(['data' => $userData]);
                } else {
                    echo json_encode(['error' => 'Error fetching user data']);
                }
            } else {
                $errors['register_errors']['database'] = 'Error updating data: ' . mysqli_stmt_error($stmt);
            }
            mysqli_stmt_close($stmt);
        } else {
            $errors['register_errors']['database'] = 'Error preparing statement: ' . mysqli_error($connect);
        }
    }

    echo json_encode(['errors' => $errors]);
    } else {
        echo json_encode(['error' => 'Invalid request method']);
    }
?>

