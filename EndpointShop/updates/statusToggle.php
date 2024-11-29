<?php
require_once(__DIR__ . '/../config.php');

global $connect;

function clear_data($val)
{
    $val = trim($val);
    $val = stripslashes($val);
    $val = strip_tags($val);
    $val = htmlspecialchars($val);
    return $val;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $errors = [];

    if (isset($_GET['action'])) {
        if ($_GET['action'] == 'statusToggle') {
            if (isset($_GET['product_id'])) {
                $product_id = clear_data($_GET['product_id']);
                
                if (!empty($product_id)) {
                   
                    // Join products table with users table to get user information
                    $sql = "SELECT * FROM `products` WHERE `id`='$product_id'";
                    echo json_encode($product_id . " prod");
                    $result=mysqli_fetch_assoc(mysqli_query($connect,$sql)); 
                    echo json_encode($result);
                    if ($result['status']==0) {
                        echo json_encode("Acton1 Sucessful");
                        $sql="UPDATE `products` SET `status` = '1' WHERE `id` = '$product_id'";
                    }else{
                        $sql="UPDATE `products` SET `status` = '0' WHERE `id` = '$product_id'";
                    }
                    mysqli_query($connect,$sql);
                    echo json_encode("Acton3 Sucessful");
                } else {
                    $errors[] = "Product id not provided.";
                }
            } else {
                $errors[] = "Product id not provided.";
            }
        }
        // Check if action is getAllProducts
        elseif ($_GET['action'] === 'getAllProducts') {
            // Join products table with users table to get user information
            $sql = "SELECT products.*, products_images.url AS image_url, users.company_name, users.avatar FROM products JOIN products_images ON products.id = products_images.product_id JOIN users ON products.user_id = users.id ORDER BY products.created_at DESC";
        } else {
            $errors[] = "Invalid action.";
        }
    } else {
        $errors[] = "Action not provided.";
    }


    // Handle errors
    if (!empty($errors)) {
        echo json_encode(["errors" => $errors]);
    }
}
