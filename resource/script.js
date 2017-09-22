var data = {
	call:"",
	method:"",
	args:{"":""}
};
var version ="2.0.1";
var res;
var Lists;
var DeleteList;
$(function() {
	showLists();
	setButtons();
	setDialogs();
	$("h1").after("ver "+version);
});
$.ajaxSetup({
	url:"callApis.php",
	method:"post",
	dataType:"json"
})
function getUserData(){
	data.call = "account/verify_credentials.json";
	data.method = "GET";
	data.args = {"":""};
	
	$.post("callApis.php",data,function(response){
		res = response;
	});
}

function setButtons(){
	$(document).on("click","input.deletList",function(){
		deleteListButton(this);
	});
	$(document).on("click","button.makeNewList",function(){
		makeNewListButton(this);
	});
	$("input[name='addList']").on("click",function(){
		addMemberToList();
	});
}


function showLists(){
	data.call ="lists/list.json";
	data.method = "GET";
	data.args = {"cursor":"-1" };
	$.post("callApis.php",data,function(response){
		Lists = response;
		var html = "<h3>■ステップ１．いずれかにチェックをつけてください</h3>\n";
		html += "<table id='listsTable'>";
		$(response).each(function(i,a){
			var mode = "";
			if(this.mode == "private"){
				mode = "[鍵]";
			}
			var checked = "";
			if(i == "0") checked = "checked"; 
			
			html += "<tr><td><input type='radio' name='targetList' value='"+this.id +"' "+ checked +"></td>\n" 
				+ "<td>リスト名：<b>" +mode+this.name +"</b><br>説明文 ：" + this.description + "</td>\n"
				+ "<td>登録人数：" +this.member_count + "<br>利用者数：" + this.subscriber_count + "</td>\n"
				+ "<td data-id='"+ this.id +"'><input type='submit' class='deletList' value='削除'　data-id='"+ this.id +"' data-index='"+ i + "'></td>"
				+ "</tr>\n\n";
		});
		html += "<tr><td><!--<input type='radio' name='targetList' value='&newList'>--></td>\n"
			+ "<td>リスト名：<input name='newname' maxlength='25'><br>\n"
			+ "説明文 ：<input name='newdesc' maxlength='100'></td>"
			+ "<td><input type='radio' name='mode' value='public' checked>公開リスト<br>\n"
			+ "<input type='radio' name='mode' value='private'>非公開</td>"
			+ "<td class='makeNewList'><button class='makeNewList'>作成</button></td></tr>\n";

		html += "</table>";
		$("#Lists").html(html);
		
	});
}

function deleteListButton(e){
	var List = DeleteList = Lists[$(e).attr("data-index")];
	$("div#delDialog").html("選択したリスト：<b>" +List.name + "</b><br>" + List.description +"<br><br>削除しますか？");
	$("div#delDialog").dialog("open");
};

function makeNewListButton(e){
	makeNewList();
}

function makeNewList(){
	data.call = "lists/create.json";
	data.method = "POST";
	data.args = {"name":$("input[name='newname']").val(),
		"mode":$("input[name='mode']:checked").val(),
		"description":$("input[name='newdesc']").val()};
	if($("input[name='newname']").val() == ""){
		return;
	}
	$("td.makeNewList").html("<img src='images/loadinfo.gif'>");	
	$.post("callApis.php",data,function(){
		showLists();
	});
}


function setDialogs(){
$("div#delDialog").dialog({
title:"リスト削除の確認",
modal:"true",
autoOpen:false,
buttons:{
	"OK":function(e){
		var id = DeleteList.id;
		data.call = "lists/destroy.json";
		data.args = {"list_id":DeleteList.id_str};
		data.method = "POST";
		$("td[data-id='"+DeleteList.id+"']").html('<img src="images/loadinfo.gif">');
		$.post("callApis.php",data,function(){
			showLists();
		});
		
		$(this).dialog('close');
	},
	"キャンセル":function(){
		$(this).dialog('close');
		}
	}
});
}

function addMemberToList(){
	
	var targetIDs = $("textarea").val().split("\n");
	for(var i = 0; targetIDs.length > i; i++){
		targetIDs[i] = targetIDs[i].replace(/^\s+|\s+$|^@/g,'');
	};
	
	var step =0;
	var sumStep = Math.ceil(targetIDs.length/100);

	$("#result").html("<img src='images/loadinfo.gif'>登録中…(0%)");


	var tr = $("[name='targetList']:checked").parent().parent(); 
	var list_id = tr.find("input[name='targetList']").val();
	
	var prevMembers = getListMembers(list_id);
	$("#result").html("<img src='images/loadinfo.gif'>登録中…(33%)");


	data.call = "lists/members/create_all.json";
	data.method = "POST";
	for(var i =0; Math.ceil(targetIDs.length/100) > i; i++){
		if((i+1)*100 -1 > targetIDs.length){
			var targets = targetIDs.slice(i*100, (i+1)*100-1);
		}else{
			var targets = targetIDs.slice(i*100, targetIDs.length);
		}
		
		data.args = 
			{"list_id":list_id,
			"screen_name":targets};
		 //"[" + targets.join(",") +"]"
		$.ajax({url: "callApis.php",async: false,data: data,
		  success: function(response) {
		  	res = response;
		  }
		  
		});		
	};
	
	$("#result").html("<img src='images/loadinfo.gif'>登録中…(66%)");

	var resultMembers = getListMembers(list_id);
	
	
	var diffList = arrayDiff(prevMembers,resultMembers);
	var succsessLower = arrayChangeLowerCase(diffList[1]);
	var targetIDsLower = arrayChangeLowerCase(targetIDs);
	var diffExec = arrayDiff(succsessLower,targetIDs);
	var resultLower = arrayChangeLowerCase(resultMembers);
	var added = diffExec[1].intersect(resultLower);
	var failed = diffExec[1].diff(added);
	
	var str ='<input type="submit" name="addList" value="登録"><br><br>';
	str +="登録成功（"+diffList[1].length +"件）：<br>\n";
	str += diffList[1].join("<br>\n");
	str += "<br>\n<br>\n登録済み("+ added.length +"件)<br>\n";
	str +=  added.join("<br>\n");
	str += "<br>\n<br>\n登録失敗("+ failed.length +"件)<br>\n";
	str +=  failed.join("<br>\n");
	str += 	'<br>\n<br>\n';

	
	$("#result").html(str);
	
	
}

function getListMembers(id){
	data.call = "lists/members.json";
	data.method = "GET";
	var cursor=-1;
	var resultIDs=new Array();
	for(var i=0; 6>i; i++){
		if(cursor == 0){
			break;
		}
		data.args = {
			"list_id":id,
			"cursor":cursor};
		$.ajax({url: "callApis.php",async: false,data: data,
			success: function(response) {
				res = response;
				cursor = response.next_cursor;
				$.each(res.users,function(e){
					resultIDs.push(this.screen_name);
				});
			}
		});
	}
	return resultIDs;
}


function arrayChangeLowerCase(array){
	array.forEach(function(e,i,a){
		array[i] = e.toLowerCase();
	});
	
	return array;
}

// JavaScript 1.7
//配列の差分をとりたい - ヨーキョクデイ（借り） 
//http://e10s.hateblo.jp/entry/20070526/1180173036
function arrayDiff(aOlder, aNewer){
    function f(aElement, aIndex, aArray){  // コールバック関数
        /*
           filter の第 1 引数の各要素についてこの関数は繰り返し実行される。
           filter の第 2 引数がこの関数内の this になる。
        */
        return (this.indexOf(aElement) == -1);  // 配列 this にその要素が含まれなければ true
    }

    /*
       filter メソッドは対象の配列の各要素について反復し、
       各要素について第 1 引数のコールバック関数（今回は f）が実行され、
       その関数が true を返した要素からなる新たな配列を返す。
    */
    var removed = aOlder.filter(f, aNewer);  // aOlder の要素のうち aNewer に含まれないものからなる配列
    var added = aNewer.filter(f, aOlder);  // aNewer の要素のうち aOlder に含まれないものからなる配列

    return [removed, added];  // 複数の値を返す
}

//javascriptでarray_intersect – ぱんぴーまっしぐら 
//http://blog.cheki.net/archives/2370
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return !(a.indexOf(i) > -1);});
};
//JavaScript array difference - Stack Overflow 
//http://stackoverflow.com/questions/1187518/javascript-array-difference
Array.prototype.intersect = function(a) {
    return this.filter(function(i) {return a.indexOf(i) != -1;});
};