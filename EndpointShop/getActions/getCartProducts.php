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

    if (isset($_GET['action']) && $_GET['action'] === 'getLatestProductData') {
        $data = json_decode(file_get_contents('php://input'), true);
        $productIds = array_map('clear_data', $data['productIds']);
        $productIds = implode(',', array_map('intval', $productIds));

        $sql = "SELECT * FROM products WHERE products.id IN ($productIds)";
        $result = mysqli_query($connect, $sql);

        if ($result && mysqli_num_rows($result) > 0) {
            $cartProducts = [];

            while ($row = mysqli_fetch_assoc($result)) {
                // Fetch one image for the product
                $productImage = null;
                $productImageSql = "SELECT url FROM products_images WHERE product_id = " . intval($row['id']) . " LIMIT 1";
                $imageResult = mysqli_query($connect, $productImageSql);

                if ($imageResult && mysqli_num_rows($imageResult) > 0) {
                    $imageRow = mysqli_fetch_assoc($imageResult);
                    $productImage = 'http://endpointshop/' . ltrim($imageRow['url'], './');
                }

                $cartProducts[] = [
                    'id' => $row['id'],
                    'user_id' => $row['user_id'],
                    'name' => $row['name'],
                    'description' => $row['description'],
                    'price' => $row['price'],
                    'count' => $row['count'],
                    'status' => $row['status'],
                    'created_at' => $row['created_at'],
                    'updated_at' => $row['updated_at'],
                    'image' => $productImage,
                ];
            }
            echo json_encode(["data" => $cartProducts]);
        } else {
            echo json_encode(["data" => []]);
        }
    } else {
        $errors[] = "Action not provided or invalid.";
        echo json_encode(["errors" => $errors]);
    }
}
