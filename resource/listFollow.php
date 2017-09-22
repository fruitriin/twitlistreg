<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>TwitListReg - TwitListReg - Twitterリスト一括登録Webサービス</title>
<script>
	var user = "<?php echo $user ?>";
</script>
<script src="resource/jquery-2.0.3.min.js"></script>
<script src="resource/script.js" class="userScript" type="text/javascript"></script>
<script src="resource/jquery.socialbutton-1.9.1.min.js" type="text/javascript"></script>
<link rel="stylesheet" href="resource/style.css">
<link href="resource/jQueryUI/jquery-ui-1.10.3.custom.css" rel="stylesheet">
<script src="resource/jQueryUI/jquery-ui-1.10.3.custom.js"></script>
</head>
<body>
<div id="wrap">
	<div id="main">
	<section>
	<h1>TwitListReg</h1>
	<p>リストの登録が地味に面倒だなぁと思ったことはありませんか？<br>
	 このWebサービスは、TwitterのIDから自分のリストに一気に登録するサービスです！
	</p>
	<p>
	<script language="JavaScript" type="text/javascript" src="http://counter1.fc2.com/counter.php?id=10242708"></script><noscript><img src="http://counter1.fc2.com/counter_img.php?id=10242708"></noscript>
	</p>
	<p>
	<a href="./clearsessions.php">ログアウト</a>
	</p>
	
	<div id="Lists">
	<h3>■ステップ１．いずれかにチェックをつけてください</h3>
	<img src="images/loadinfo.gif">リスト一覧読み込み中・・・
	
	
	</div>
	<h3>■ステップ２．テキストエリアに登録する人のIDを入力</h3>
	<div >
	<div id="registor">
	1行につき１つのTwitterのIDを入力し、<br>
	送信ボタンを押してください。<br>
	'//'を含んでいる行は無視されます。<br>
	<textarea name="screan_names" rows="17" cols="30"></textarea>
	</div>
	<div id="util">
		●登録に便利なユーティリティ<br>
		<iframe src="getIDs.php" height="300" width="500" name="help"></iframe>
		<br clear="all">
	</div>
	<br clear="all">
	<ul>
		<li>１アカウントにつき作成できるリストの数は２０個までです。</li>
		<li>１リストにつき登録できるアカウントの数は５００人までです。</li>
	</ul>
	</div>
	<div id="result">
		<input type="submit" name='addList' value="登録">
	</div>
	</section>
	</div>
</div>

<div id="delDialog">

</div>

</body>
</html>

<?php include("resource/footer.php"); ?>