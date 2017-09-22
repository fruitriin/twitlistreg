<?php
$data =  array(1,2,3,4);
$arr = array("list"=>$data);

print_r($arr);
echo "\n";
echo implode(",",$arr["list"]);

foreach ($arr as $key => $elem) {
	if(is_array($elem)){
		$arr[$key] = "[".implode(",", $elem)."]";
	}
}
print_r($arr);
