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

    if (isset($_GET['action']) && $_GET['action'] === 'buyProduct') {
        $data = json_decode(file_get_contents('php://input'), true);
        $products = $data['products'];
    
        if (empty($products)) {
            $errors[] = "No products provided for purchase.";
            echo json_encode(["errors" => $errors]);
            exit;
        }

        $productId = clear_data($products['id']);
        $quantity = clear_data(intval($products['quantity']));
        $cvv=clear_data($products['cvv']);
        $user_id = clear_data($product['user_id']);
        if (empty($productId)) {
            $errors[] = "Product ID not provided or invalid for purchase.";
        }
        if ($quantity <= 0) {
            $errors[] = "Quantity not provided or invalid for purchase.";
        }
        if (strlen($cvv)!=3||empty($cvv)) {
            $errors[] = "CVV is invalid.";
        }
        if (empty($errors)) {
            $productSql = "SELECT * FROM products WHERE id = $productId";
            
            $productResult = mysqli_query($connect,$productSql);
            if ($productResult && $productResult->num_rows > 0) {
                $row = $productResult->fetch_assoc();
                $availableCount = intval($row['count']);
                $status = intval($row['status']);

                if ($availableCount >= $quantity) {
                    if ($status !=1) {
                        $newCount = $availableCount - $quantity;
                        $updateSql = "UPDATE products SET count = ? WHERE id = ?";
                        $updateStmt = $connect->prepare($updateSql);
                        $updateStmt->bind_param("ii", $newCount, $productId);
                        $insertSql = "INSERT INTO  purchases (product_id,user_id,quality) VALUES ('$productId', '$user_id', '$quantity')";
                        mysqli_query($connect,$insertSql);
                        if (!$updateStmt->execute()) {
                            $errors[] = "Failed to update product count for product ID $productId.";
                        }
                    } else {
                        $errors[] = "The product with ID: $productId is banned.";
                    }
                } else {
                    $errors[] = "Not enough stock for product ID $productId.";
                }
            } else {
                $errors[] = "Product ID $productId not found.";
            }
        }

        if (!empty($errors)) {
            echo json_encode(["errors" => $errors]);
        } else {
            echo json_encode(["message" => "Purchase successful."]);
        }
    } else if(isset($_GET['action']) && $_GET['action'] === 'buyProducts'){
        if (isset($_GET['action']) && $_GET['action'] === 'buyProducts') {
            $data = json_decode(file_get_contents('php://input'), true);
            $products = $data['products'];
    
            if (empty($products)) {
                $errors[] = "No products provided for purchase.";
                echo json_encode(["errors" => $errors]);
                exit;
            }
    
            foreach ($products as $product) {
                $productId = clear_data($product['id']);
                $quantity = clear_data(intval($product['quantity']));
                $name = clear_data($product['name']);
                $user_id = clear_data($product['user_id']);
                if (empty($productId)) {
                    $errors[] = "Product id not provided or invalid for purchase.";
                    continue;
                }
                if ($quantity <= 0) {
                    $errors[] = "Quantity not provided or invalid for purchase.";
                    continue;
                }
    
                $productSql = "SELECT * FROM products WHERE id = ?";
                $stmt = $connect->prepare($productSql);
                $stmt->bind_param("i", $productId);
                $stmt->execute();
                $productResult = $stmt->get_result();
    
                if ($productResult && $productResult->num_rows > 0) {
                    $row = $productResult->fetch_assoc();
                    $availableCount = intval($row['count']);
                    $status = intval($row['status']);
    
                    if ($availableCount >= $quantity) {
                        if ($status == 0) {
                            $newCount = $availableCount - $quantity;
                            $sql = "UPDATE products SET count = ? WHERE id = ?";
                            $updateStmt = $connect->prepare($sql);
                            $updateStmt->bind_param("ii", $newCount, $productId);
                            $insertSql = "INSERT INTO   purchases (product_id,user_id,quality)  VALUES ('$productId', '$user_id', '$quantity')";
                            mysqli_query($connect,$insertSql);
                            if (!$updateStmt->execute()) {
                                $errors[] = "Failed to update product count for product ID $productId.";
                            }
                        } else {
                            $errors[] = "The product with name: $name and ID: $productId is banned.";
                        }
                    } else {
                        $errors[] = "Not enough stock for product ID $productId.";
                    }
                } else {
                    $errors[] = "Product ID $productId not found.";
                }
    
                $stmt->close();
            }
    
            if (!empty($errors)) {
                echo json_encode(["errors" => $errors]);
            } else {
                echo json_encode(["message" => "Purchase successful."]);
            }
    }
    }else {
        $errors[] = "Action not provided or invalid.";
        echo json_encode(["errors" => $errors]);
    }
}
?>
