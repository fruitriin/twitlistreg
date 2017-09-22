<?php
/**
 * セッション開始
 * 
 */
session_start();
require_once('twitteroauth/twitteroauth.php');
require_once('config.php');

/* アクセストークンが有効ならメインページにリダイレクト */
if(isset($_SESSION['access_token']) && isset($_SESSION['access_token']['oauth_token']) && isset($_SESSION['access_token']['oauth_token_secret'])){
	$access_token = $_SESSION['access_token'];
	$user = $access_token["screen_name"];
    include("resource/templates/getIDs.html");	
}else if (empty($_SESSION['access_token']) && empty($_SESSION['access_token']['oauth_token']) && empty($_SESSION['access_token']['oauth_token_secret'])) {
	include("resource/connect.php");
}else{
    header('Location: ./clearsessions.php');
	exit();
}