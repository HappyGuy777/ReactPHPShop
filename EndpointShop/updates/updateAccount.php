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
    $company_name = clear_data($_POST['company_name']);
    $description = clear_data($_POST["description"]);
    $bank_chard = clear_data($_POST["bank_chard"]);
    $sql="SELECT * FROM `users` WHERE `id`='$user_id'";
    $user=mysqli_fetch_assoc(mysqli_query($connect,$sql));
    $targetFilePath;
    // var_dump($user);
    // Check for empty fields
    if (empty($company_name)) {
        $errors['update_account_errors']['company_name'] = 'Company name is required';
    }

    if (empty($description)) {
        $errors['update_account_errors']['description'] = 'Description is required';
    }

    if (empty($bank_chard)) {
        if ($user['bank_chard']=="") {
              $errors['update_account_errors']['bank_chard'] = 'Bank Chard is required';
        }else if(strlen((string)$user['bank_chard']) != 16){
            $errors['update_account_errors']['bank_chard'] = 'Bank Chard is need 16 digths';
        } else{

            $bank_chard=$user['bank_chard'];
        }
    }
    if (empty($_FILES['avatar']['name'])) {
        $targetFilePath=$user['avatar'];
    } else {
        // Handle file upload
        $targetDir = "./uploads/avatars/";
        $fileName = basename($_FILES['avatar']['name']);
        $targetFilePath = $targetDir . time() .  $fileName;
        $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);

        $allowTypes = array('jpg', 'jpeg', 'png');
        if (!in_array($fileType, $allowTypes)) {
            $errors['update_account_errors']['image'] = 'Only JPG, JPEG, PNG files are allowed';
        } else {
            if (!move_uploaded_file($_FILES['avatar']['tmp_name'], $targetFilePath)) {
                $errors['update_account_errors']['image'] = 'Failed to upload image';
            }
        }
    }

    if (empty($errors)) {
        if ($user['status']!=3) {
           $sql = "UPDATE `users` SET `company_name`=?, `description`=?, `bank_chard`=?, `avatar`=? ,`status`=? WHERE `id`=?";
           $stmt = mysqli_prepare($connect, $sql);
           if ($stmt) {
            $status=1;
            #
            mysqli_stmt_bind_param($stmt, "ssssii", $company_name, $description, $bank_chard, $targetFilePath, $status,$user_id);
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
                $errors['update_account_errors']['database'] = 'Error updating data: ' . mysqli_stmt_error($stmt);
            }
            mysqli_stmt_close($stmt);
          } else {
            $errors['update_account_errors']['database'] = 'Error preparing statement: ' . mysqli_error($connect);
         } 
        }else {
            $errors['update_account_errors']['database'] = 'Error updating data';
        }
        
    }

    echo json_encode(['errors' => $errors]);
    } else {
        echo json_encode(['error' => 'Invalid request method']);
    }
