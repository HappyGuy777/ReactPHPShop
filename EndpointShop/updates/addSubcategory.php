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


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $errors = [];

    $subcategory_name = clear_data($_POST['subcategory_name']);
    $category_id=clear_data($_POST['category_id']);
    if (empty($subcategory_name)) {
        $errors['add_category_errors']['subcategory_name'] = 'Subategory name is required';
    }

    if (empty($category_id)) {
        $errors['add_category_errors']['category_id'] = 'Pelase slelect category';
    }


    if (empty($errors)) {
        $subcategory_name = mysqli_real_escape_string($connect, $subcategory_name);
        $category_id = mysqli_real_escape_string($connect, $category_id);

        $sql = "INSERT INTO `subcategories` (`name`, `category_id`) VALUES ('$subcategory_name', '$category_id')";

        if (mysqli_query($connect, $sql)) {
            $lastPostId = mysqli_insert_id($connect);
            echo json_encode(['success' => 'Subcategory added successfully', 'id' => $lastPostId]);
        } else {
            echo json_encode(['error' => 'Database insert failed']);
        }
    } else {
        echo json_encode(['errors' => $errors]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}