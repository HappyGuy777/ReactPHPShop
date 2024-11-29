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
        if ($_GET['action'] === 'getUserProducts') {
            if (isset($_GET['userId'])) {
                $userId = clear_data($_GET['userId']);

                if (!empty($userId)) {
                    // Use prepared statement to prevent SQL injection
                    $stmt = $connect->prepare("SELECT status FROM users WHERE id = ?");
                    $stmt->bind_param("i", $userId);
                    $stmt->execute();
                    $userStatusResult = $stmt->get_result();

                    $requestorID = clear_data($_GET['requestor_id']);
                    $stmt->bind_param("i", $requestorID);
                    $stmt->execute();
                    $requestorData = $stmt->get_result();
                    if (!empty($requestorData)) {
                        $requestor = $requestorData->fetch_assoc();
                    }
                
                    if ($userStatusResult && $userStatusResult->num_rows > 0) {
                        $userStatusRow = $userStatusResult->fetch_assoc();
                       
                        if ($userStatusRow['status'] == 3&&$requestor['status']!=2) {
                            $errors[] = "User is banned.";
                            echo json_encode(["errors" => $errors,'requestorStatus'=>$requestorData]);
                            exit;
                        } else { 
                            $stmt = $connect->prepare("SELECT products.*, products_images.url AS image_url, users.company_name, users.avatar 
                                    FROM products 
                                    JOIN products_images ON products.id = products_images.product_id 
                                    JOIN users ON products.user_id = users.id 
                                    WHERE products.user_id = ?
                                    ORDER BY products.created_at DESC");
                            $stmt->bind_param("i", $userId);
                            $stmt->execute();
                            $result = $stmt->get_result();
                        }
                    } else {
                        $errors[] = "User not found.";
                    }
                    $stmt->close();
                } else {
                    $errors[] = "UserId not provided.";
                }
            } else {
                $errors[] = "UserId not provided.";
            }
        } elseif ($_GET['action'] === 'getAllProducts') {
            if (isset($_GET['requestorID']) && !empty($_GET['requestorID'])) {

                $requestorID = clear_data($_GET['requestorID']);
                $sql = "SELECT * FROM users where id=$requestorID";
                $requestor = mysqli_query($connect, $sql);
                if (!empty($requestor)) {
                    $requestor = mysqli_fetch_assoc($requestor);
                }
                if ($requestor['status'] == 2) {
                    $sql = "SELECT products.*, products_images.url AS image_url, users.company_name, users.avatar, users.status AS user_status 
                    FROM products 
                    JOIN products_images ON products.id = products_images.product_id 
                    JOIN users ON products.user_id = users.id 
                    ORDER BY products.created_at DESC";
                } else {
                    $sql = "SELECT products.*, products_images.url AS image_url, users.company_name, users.avatar, users.status AS user_status 
                    FROM products 
                    JOIN products_images ON products.id = products_images.product_id 
                    JOIN users ON products.user_id = users.id 
                    WHERE products.status=0 
                    ORDER BY products.created_at DESC";
                }

            } else {
                $sql = "SELECT products.*, products_images.url AS image_url, users.company_name, users.avatar, users.status AS user_status 
                    FROM products 
                    JOIN products_images ON products.id = products_images.product_id 
                    JOIN users ON products.user_id = users.id 
                    WHERE products.status=0 
                    ORDER BY products.created_at DESC";
            }

        } else {
            $errors[] = "Invalid action.";
        }
    } else {
        $errors[] = "Action not provided.";
    }

    if (isset($sql) || isset($result)) {
        if (isset($sql)) {
            $result = mysqli_query($connect, $sql);
        }

        if ($result) {
            $products = [];
            while ($row = mysqli_fetch_assoc($result)) {
                // Skip products from banned users
                if ($requestor['status'] != 2) {
                    if (isset($row['user_status']) && $row['user_status'] == 3) {
                        continue;
                    }
                }


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
                        'category_id' => $row['category_id'],
                        'subcategory_id' => $row['subcategory_id'],
                        'gender' => $row['gender'],
                        'images' => [],
                        'user' => [
                            'companyName' => $row['company_name'],
                            'status' => $row['user_status'],
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
            $errors[] = "No products found.";
            echo json_encode(["errors" => $errors]);
        }
    }

    // Handle errors
    if (!empty($errors)) {
        echo json_encode(["errors" => $errors]);
    }
}
?>