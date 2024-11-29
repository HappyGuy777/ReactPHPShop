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
    $product_name = clear_data($_POST['product_name']);
    $description = clear_data($_POST['description']);
    $price = clear_data($_POST['price']);
    $count = clear_data($_POST['count']);
    $category_id = clear_data($_POST['category_id']);
    $gender = clear_data($_POST['gender']);
    $category_name = clear_data($_POST['category_name']);
    $files = $_FILES['images'];

    if (empty($product_name)) {
        $errors['product_name'] = 'Product name is required';
    }

    if (empty($description)) {
        $errors['description'] = 'Description is required';
    }

    if (empty($price)) {
        $errors['price'] = 'Price is required';
    }

    if (empty($count)) {
        $errors['count'] = 'Count is required';
    }

    if (empty($category_name)) {
        $errors['category'] = 'Category name is required';
    } else {
        $stmt = $connect->prepare("SELECT * FROM categories WHERE `name` = ?");
        $stmt->bind_param("s", $category_name);
        $stmt->execute();
        $categoryResult = $stmt->get_result();

        if ($categoryResult->num_rows == 0) {
            $errors['category'] = 'No such category exists';
        } else {
            $category = $categoryResult->fetch_assoc();
            if ($category['gender'] != $gender) {
                $errors['category'] = 'No such category exists';
            } else {
                $category_id = $category['id'];
            }
        }
        $stmt->close();
    }

    if ($_FILES['images']['size'][0] == 0) {
        $errors['image'] = 'Image is required';
    } else {
        $file_paths = [];
        foreach ($_FILES['images']['name'] as $key => $val) {
            if ($key < 10) {
                $check = getimagesize($_FILES['images']['tmp_name'][$key]);
                if ($check === false) {
                    $errors['image_upload']["file_type_$key"] = "File $key is not an image";
                } else {
                    $allowTypes = array('jpg', 'jpeg', 'png');
                    $fileType = strtolower(pathinfo($_FILES['images']['name'][$key], PATHINFO_EXTENSION));
                    if (!in_array($fileType, $allowTypes)) {
                        $errors['image_upload']["image_type_$key"] = "File $key is not a valid type (JPG, JPEG, PNG allowed)";
                    } else {
                        $maxFileSize = 5000000; 
                        if ($_FILES['images']['size'][$key] > $maxFileSize) {
                            $errors['image_upload']["image_size_$key"] = "File $key exceeds the maximum size (5 MB)";
                        } else {
                            $targetDir = "./uploads/posts/";
                            $fileName = basename($_FILES['images']['name'][$key]);
                            $targetFilePath = $targetDir . time() . $fileName;
                            if (move_uploaded_file($_FILES['images']['tmp_name'][$key], $targetFilePath)) {
                                $file_paths[] = $targetFilePath;
                            } else {
                                $errors['image_upload']["image_error_$key"] = "Failed to upload file $key";
                            }
                        }
                    }
                }
            } else {
                $errors['image_upload']['limit_exceeded'] = 'You can upload a maximum of 10 images';
                break;
            }
        }
    }

    if (empty($errors)) {
        $stmt = $connect->prepare("INSERT INTO `products` (`user_id`, `name`, `description`, `gender`, `price`, `count`, `category_id`) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("isssdii", $user_id, $product_name, $description, $gender, $price, $count, $category_id);
        $stmt->execute();

        $lastPostId = $stmt->insert_id;
        $stmt->close();

        $stmt = $connect->prepare("INSERT INTO `products_images` (`product_id`, `url`) VALUES (?, ?)");
        foreach ($file_paths as $path) {
            $stmt->bind_param("is", $lastPostId, $path);
            $stmt->execute();
        }
        $stmt->close();

        http_response_code(200);
        echo json_encode(['message' => 'Product added successfully']);
    } else {
        http_response_code(400);
        echo json_encode(['errors' => $errors]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Invalid request method']);
}
?>
