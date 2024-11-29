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

    if (isset($_GET['action']) && $_GET['action'] === 'getCurrentProduct') {
        if (isset($_GET['user_id']) && isset($_GET['product_id'])) {
            $userId = clear_data($_GET['user_id']);
            $productId = clear_data($_GET['product_id']);
            $requestorID = clear_data($_GET['requestor_id']);
            $reqSendOk=false;
                if (!empty($requestorID)) {
                    $reqSQL = "SELECT * FROM users WHERE id='$requestorID'";
                    $requestor = mysqli_fetch_assoc(mysqli_query($connect, $reqSQL));
                    if ($requestor['status'] == 2) {
                        $reqSendOk=true;
                    }
                }

            if (!empty($userId) && !empty($productId)) {
                // Check if user is valid and not banned
                $checkUserSql = "SELECT * FROM users WHERE id='$userId'";
                $checkUser = mysqli_query($connect, $checkUserSql);
                if (mysqli_num_rows($checkUser) > 0) {
                    $user = mysqli_fetch_assoc($checkUser);
                    if ($user['status'] == 3&&$reqSendOk==false) {
                        $errors[] = "User is banned.";
                        echo json_encode(["errors" => $errors]);
                        exit;
                    }
                } else {
                    $errors[] = "Invalid UserId.";
                    echo json_encode(["errors" => $errors]);
                    exit;
                }

                // Check if product is valid and not banned
                $checkProductSql = "SELECT * FROM products WHERE id='$productId'";
                $checkProduct = mysqli_query($connect, $checkProductSql);

                if (mysqli_num_rows($checkProduct) > 0) {

                    $product = mysqli_fetch_assoc($checkProduct);
                    if ($userId != $product['user_id']) {
                        $errors[] = "This product dont belong this user.";
                        echo json_encode(["errors" => $errors]);
                        exit;
                    }
                    if ($product['status'] == 0||$reqSendOk==true) {


                        $currentProductSql = "SELECT DISTINCT products.id, products.name, products.description, products.price, products.count, products.status, products.created_at, products.updated_at, users.company_name, users.avatar,products.user_id 
                                              FROM products 
                                              JOIN users ON products.user_id = users.id 
                                              WHERE products.user_id = $userId AND products.id = $productId";
                        $otherCompanyProductsSql = "SELECT DISTINCT products.id, products.name, products.description, products.price, products.count, products.status, products.created_at, products.updated_at, users.company_name, users.avatar, products.user_id 
                                                    FROM products 
                                                    JOIN users ON products.user_id = users.id 
                                                    WHERE products.user_id = $userId AND products.id != $productId 
                                                    ORDER BY products.created_at DESC LIMIT 3";
                        $currentProductImagesSql = "SELECT url AS image_url FROM products_images WHERE product_id = $productId";
                        $otherCompanyProductsImagesSql = "SELECT products.id, products_images.url AS image_url 
                                                          FROM products 
                                                          JOIN products_images ON products.id = products_images.product_id 
                                                          WHERE products.user_id = $userId AND products.id != $productId 
                                                          ORDER BY products.created_at DESC";

                        $currentProductArr = mysqli_query($connect, $currentProductSql);
                        $currentProductImagesArr = mysqli_query($connect, $currentProductImagesSql);
                        $otherCompanyProductsArr = mysqli_query($connect, $otherCompanyProductsSql);
                        $otherCompanyProductsImagesArr = mysqli_query($connect, $otherCompanyProductsImagesSql);

                        if ($currentProductArr && $currentProductImagesArr && $otherCompanyProductsArr && $otherCompanyProductsImagesArr) {
                            $currentProduct = mysqli_fetch_assoc($currentProductArr);
                            $currentProductImages = [];
                            while ($imageRow = mysqli_fetch_assoc($currentProductImagesArr)) {
                                $currentProductImages[] = 'http://endpointshop/' . ltrim($imageRow['image_url'], './');
                            }

                            $otherCompanyProducts = [];
                            while ($row = mysqli_fetch_assoc($otherCompanyProductsArr)) {
                                $productId = $row['id'];
                                $productImagesArr = [];
                                $productImagesQuery = mysqli_query($connect, "SELECT url AS image_url FROM products_images WHERE product_id = $productId");
                                while ($imageRow = mysqli_fetch_assoc($productImagesQuery)) {
                                    $productImagesArr[] = 'http://endpointshop/' . ltrim($imageRow['image_url'], './');
                                }

                                $otherCompanyProducts[] = [
                                    'id' => $row['id'],
                                    'user_id' => $row['user_id'],
                                    'name' => $row['name'],
                                    'description' => $row['description'],
                                    'price' => $row['price'],
                                    'count' => $row['count'],
                                    'status' => $row['status'],
                                    'created_at' => $row['created_at'],
                                    'updated_at' => $row['updated_at'],
                                    'images' => $productImagesArr,
                                    'user' => [
                                        'companyName' => $row['company_name'],
                                        'avatar' => 'http://endpointshop/' . ltrim($row['avatar'], './')
                                    ]
                                ];
                            }

                            $result = [
                                'currentProduct' => [
                                    'id' => $currentProduct['id'],
                                    'name' => $currentProduct['name'],
                                    'user_id' => $currentProduct['user_id'],
                                    'description' => $currentProduct['description'],
                                    'price' => $currentProduct['price'],
                                    'count' => $currentProduct['count'],
                                    'status' => $currentProduct['status'],
                                    'created_at' => $currentProduct['created_at'],
                                    'updated_at' => $currentProduct['updated_at'],
                                    'images' => $currentProductImages,
                                    'user' => [
                                        'companyName' => $currentProduct['company_name'],
                                        'avatar' => 'http://endpointshop/' . ltrim($currentProduct['avatar'], './')
                                    ]
                                ],
                                'otherProducts' => $otherCompanyProducts
                            ];

                            echo json_encode($result);
                        } else {
                            $errors[] = "Database error: " . mysqli_error($connect);
                            echo json_encode(["errors" => $errors]);
                        }
                    } else {
                        $errors[] = "Product is banned.";
                        echo json_encode(["errors" => $errors]);
                        exit;
                    }
                } else {
                    $errors[] = "Invalid ProductId.";
                    echo json_encode(["errors" => $errors]);
                }
            } else {
                $errors[] = "UserId or ProductId not provided.";
                echo json_encode(["errors" => $errors]);
            }
        } else {
            $errors[] = "UserId or ProductId not provided.";
            echo json_encode(["errors" => $errors]);
        }
    } else {
        $errors[] = "Action not provided or invalid.";
        echo json_encode(["errors" => $errors]);
    }
}