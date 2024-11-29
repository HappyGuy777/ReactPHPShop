<?php
require_once (__DIR__ . '/../config.php');

// Check if the connection is established
if (!$connect) {
    die(json_encode(['error' => 'Database connection failed']));
}

function clear_data($val)
{
    $val = trim($val);
    $val = stripslashes($val);
    $val = strip_tags($val);
    $val = htmlspecialchars($val);
    return $val;
}

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $errors = [];

    $category_name = clear_data($_POST['category_name']);
    $gender = clear_data($_POST['gender']);
    $image = $_FILES['image'];

    if (empty($category_name)) {
        $errors['add_category_errors']['category_name'] = 'Category name is required';
    }

    if (empty($gender)) {
        $errors['add_category_errors']['gender'] = 'Gender is required';
    }

    if (empty($errors)) {
        if ($image['size'] == 0) {
            $errors['add_category_errors']['image'] = 'Image is required';
        } else {
            $targetDir = "./uploads/category-images/";
            $fileName = basename($image['name']);
            $targetFilePath = $targetDir . time() . $fileName;
            $fileType = pathinfo($targetFilePath, PATHINFO_EXTENSION);

            $allowTypes = ['jpg', 'jpeg', 'png'];
            if (!in_array($fileType, $allowTypes)) {
                $errors['add_category_errors']['image'] = 'Only JPG, JPEG, PNG files are allowed';
            } else {
                if (!move_uploaded_file($image['tmp_name'], $targetFilePath)) {
                    $errors['add_category_errors']['image'] = 'Failed to upload image';
                }
            }
        }
    }

    if (empty($errors)) {
        // Escape variables for security
        $category_name = mysqli_real_escape_string($connect, $category_name);
        $targetFilePath = mysqli_real_escape_string($connect, $targetFilePath);
        $gender = mysqli_real_escape_string($connect, $gender);

        $sql = "INSERT INTO `categories` (`name`, `url`, `gender`) VALUES ('$category_name', '$targetFilePath', '$gender')";

        if (mysqli_query($connect, $sql)) {
            $lastPostId = mysqli_insert_id($connect);
            echo json_encode(['success' => 'Category added successfully', 'id' => $lastPostId]);
        } else {
            echo json_encode(['error' => 'Database insert failed']);
        }
    } else {
        echo json_encode(['errors' => $errors]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}