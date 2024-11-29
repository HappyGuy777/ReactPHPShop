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

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $errors = [];

    if (isset($_GET['action'])) {
        if ($_GET['action'] === 'getSearchedProdcuts') {
            if (isset($_GET['query'])) {
                $query = clear_data($_GET['query']);
                if (!empty($query)) {
                    // Join products table with users table to get user information
                    $sql = "SELECT products.*, products_images.url AS image_url, users.company_name, users.avatar 
                    FROM products 
                    JOIN products_images ON products.id = products_images.product_id 
                    JOIN users ON products.user_id = users.id 
                    WHERE products.name LIKE '%$query%' AND products.status=0 AND users.status!=3
                    LIMIT 10";
            
                } else {
                    $errors[] = "UserId not provided.";
                }
            } else {
                $errors[] = "UserId not provided.";
            }
        }

    }  else {
        $errors[] = "Action not provided.";
    }

    if (isset($sql)) {
        $result = mysqli_query($connect, $sql);
        if ($result) {
            $products = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $productId = $row['id'];
                if (!isset($products[$productId])) {
                    $products[$productId] = [
                        'id' => $row['id'],
                        'name' => $row['name'],
                        'description' => $row['description'],
                        'price' => $row['price'],
                        'count' => $row['count'],
                        'status' => $row['status'],
                        'user_id' => $row['user_id'],
                        'created_at' => $row['created_at'],
                        'updated_at' => $row['updated_at'],
                        'images' => [], 
                        'user' => [
                            'companyName' => $row['company_name'], 
                            'avatar' => 'http://endpointshop/' . ltrim($row['avatar'], './')
                        ]
                    ];
                }
            
                $imageUrl = 'http://endpointshop/' . ltrim($row['image_url'], './');
                $products[$productId]['images'][] = $imageUrl;
            }
            // Convert associative array to indexed array
            $products = array_values($products);
            echo json_encode($products);
        } else {
            $errors[] = "Database error: " . mysqli_error($connect);
        }
    }

    // Handle errors
    if (!empty($errors)) {
        echo json_encode(["errors" => $errors]);
    }
}
