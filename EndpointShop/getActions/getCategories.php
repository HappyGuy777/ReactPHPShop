<?php
require_once (__DIR__ . '/../config.php');

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

    if (isset($_GET['action']) && $_GET['action'] === 'getAllCategories') {
        $sql = "SELECT * FROM categories";
        $result = mysqli_query($connect, $sql);
        $categories = mysqli_fetch_all($result, MYSQLI_ASSOC);

        if ($categories && mysqli_num_rows($result) > 0) {
            $categoriesWithSubcategories = [];

            foreach ($categories as $category) {
                $categoryId = $category['id'];
                $categoryImage = 'http://endpointshop/' . ltrim($category['url'], './');

                // Fetch subcategories for this category
                $sql = "SELECT * FROM subcategories WHERE category_id = $categoryId";
                $subResult = mysqli_query($connect, $sql);
                $subcategories = mysqli_fetch_all($subResult, MYSQLI_ASSOC);

                $categoriesWithSubcategories[] = [
                    'id' => $category['id'],
                    'user_id' => $category['user_id'],
                    'name' => $category['name'],
                    'gender' => $category['gender'],
                    'image' => $categoryImage,
                    'subcategories' => $subcategories
                ];
            }

            echo json_encode(["data" => $categoriesWithSubcategories]);
        } else {
            echo json_encode(["data" => []]);
        }
    } else {
        $errors[] = "Action not provided or invalid.";
        echo json_encode(["errors" => $errors]); 
    }
} else {
    $errors[] = "Action not provided or invalid.";
    echo json_encode(["errors" => $errors]);
}
