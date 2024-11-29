<?php
$allowedOrigins = array(
    'http://localhost',
    'http://localhost:3000'
);

if (in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
}
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Max-Age: 86400');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

header('Content-Type: application/json');

require_once ("./config.php");

//login and regiser
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'register') {
    require_once ("./register.php");
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'login') {
    require_once ("./login.php");
}
//updates
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'updateUser') {
    require_once ("./updates/updateUser.php");
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'updateCompany') {
    require_once ("./updates/updateCompany.php");
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'updateAccount') {
    require_once ("./updates/updateAccount.php");
}
//adds
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'addProduct') {
    require_once ("./updates/addProduct.php");
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'addCategory') {
    require_once ("./updates/addCategory.php");
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'addSubcategory') {
    require_once ("./updates/addSubcategory.php");
}
if ($_SERVER['REQUEST_METHOD'] ==='GET'&&isset($_GET['action']) && $_GET['action'] === 'statusToggle') {
   require_once('./updates/statusToggle.php');
}
//get actions
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getUser') {
    require_once ("./getActions/getUser.php");
}
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getUserProducts' || $_GET['action'] === 'getAllProducts') {
    require_once ("./getActions/getProducts.php");
}
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getSearchedProdcuts') {
    require_once ("./getActions/getSearchedProdcuts.php");
}
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getCurrentProduct') {
    require_once ("./getActions/getCurrentProduct.php");
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'getLatestProductData') {
    require_once ("./getActions/getCartProducts.php");
}
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['action']) && $_GET['action'] === 'buyProducts' || $_GET['action'] === 'buyProduct') {
    require_once ("./updates/buyProducts.php");
}
if ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'getAllCategories') {
    require_once ("./getActions/getCategories.php");
}

//wrong request
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    echo json_encode(['error' => 'Invalid request method']);
}

