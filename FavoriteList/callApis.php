<?php
session_start();
require_once('twitteroauth/twitteroauth.php');
require_once('config.php');
$access_token = $_SESSION['access_token'];
$user = $access_token["screen_name"];
$debug = "false";

foreach ($_POST["args"] as $key => $elem) {
	if(is_array($elem)){
		$_POST["args"][$key] = implode(",", $elem);
	}
}

if(isset($_POST["call"]) || isset($_POST["method"]) || isset($_POST["args"])){
if($debug == "true"){	
/*	echo CONSUMER_KEY."\n";
	echo CONSUMER_SECRET."\n";
	echo $access_token['oauth_token']."\n";
	echo $access_token['oauth_token_secret']."\n";*/
	print_r(array("https://api.twitter.com/1.1/".$_POST["call"],$_POST["method"],$_POST["args"]));
	//print_r(array("https://api.twitter.com/1/".$user."/lists.xml","GET",array("cursor"=>"-1")));
	$to = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
    $responce = $to->OAuthRequest("https://api.twitter.com/1.1/".$_POST["call"],$_POST["method"],$_POST["args"]);
    print_r(json_decode($responce));
	
}else{	
    $to = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);
    $responce = $to->OAuthRequest("https://api.twitter.com/1.1/".$_POST["call"],$_POST["method"],$_POST["args"]);
    echo $responce;
}
}else{
    echo '{"Message":"ＡＰＩのコールがおかしいです"}';
}