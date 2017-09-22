<?php
session_start();
require_once('twitteroauth/twitteroauth.php');
require_once('config.php');
$access_token = $_SESSION['access_token'];
$user = $access_token["screen_name"];
$debug = "false";

/*
foreach ($_GET["args"] as $key => $elem) {
	if(is_array($elem)){
		$_GET["args"][$key] = implode(",", $elem);
	}
}
*/

echo "<html><head><meta charset=utf-8></head><body><h1>レスポンステスタ</h1><pre><form action=./callApis.php>";
echo "Call　:<input name=call value=></input>\n";
echo "method:<input name=method></input>\n";
//echo "Args　:<input name=args[0]></input>\n";
echo "<input type=submit></input></form>";


if(isset($_GET["call"]) || isset($_GET["method"]) || isset($_GET["args"])){
    $to = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
    $responce = $to->OAuthRequest("https://api.twitter.com/1.1/".$_GET["call"],$_GET["method"],$_GET["args"]);
	print_r($_GET);
	print_r($_GET["args"]);
    print_r(json_encode($responce));
	echo $responce;
}else{
    echo '{"Message":"ＡＰＩのコールがおかしいです"}';
}