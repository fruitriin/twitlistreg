var data = {
    call : "",
    method : "",
    args : {
        "" : ""
    }
};
var count = 0;
$.ajaxSetup({
    url : "callApis.php",
    method : "post",
    dataType : "json"
});

$(function() {
    setButtons();
});

function setButtons() {
    $(document).on("click", "#selector button",function(){
       $("#selector button").attr("class","");
       $(this).attr("class","selected");
       
       $("#controler>div").css("display","none");
       $("#controler>#" + $(this).attr("name")).css("display","");
        
    });
    
    $(document).on("click", "#list input[type=submit]", function() {
        if ($("input[name=ID]").val() != "")
            getLists();
    });
    $(document).on("click", "#accounts input[name=result]", function() {
        if (($("input[name=ID]").val() != "") && ($("input[name=target]").val() != undefined)) {
            $("#result").html("<span class='loading'><img src='images/loadinfo.gif'>読み込み中 <span class='progless'></span></span><table><tr><td class='id' nowrap></td><td class='fullname' nowrap></td></tr></table>");
            var result = getMembers();
        }
        if (result != undefined) {
            $("#result span.loading").remove();

        } else {
            $("#result").html("読み込み失敗");
        }

    });
    $(document).on("click", "#status input[name=result]", function() {
        
        if($("#status [type=radio]:checked").val() == "RT"){
            $("#result").html("<table><tr><td class='id' nowrap></td><td class='fullname' nowrap></td></tr></table>");
            getRetweets();
            
        }else{
            getFavorites();
        }
    })


}

function getRetweets(){
    var status_URL = $("input[name=statusURL]").val();
    status_tmp = status_URL.split("/");
    status = status_tmp[status_tmp.length-1];
      var result = {
        icon : new Array(),
        screen_name : new Array(),
        name : new Array()
    };
  
    data.call = "statuses/retweeters/ids.json";
       data.method = "GET";
       data.args = {
           "id" : status,
           
           }
          $.post("callApis.php", data, function(response) {
              
              data.call = "users/lookup.json";
              data.method = "GET";
              data.args={
                  "user_id": response.ids
              }
              
               $.post("callApis.php", data, function(response){
                    $.each(response,function(){
                        result.icon.push(this.profile_image_url);
                        result.screen_name.push(this.screen_name);
                        result.name.push(this.name);
                    })
                var idTd = $(".id");
                var nameTd = $(".fullname")
                $("span.progless").html("（" + (count * 200) + "件読み込み完了）")
                var htmlid = "";
                var htmlname = "";
                for (var i = 0; result.name.length > i; i++) {
                    htmlid += "<img src='" + result.icon[i] + "' width='14px'>" + result.screen_name[i] + "<br>";
                    htmlname += result.name[i] + "<br>";
                }

                idTd.html(htmlid);
                nameTd.html(htmlname);
              })
          })

}


function getFavorites(){
    var status_URL = $("input[name=statusURL]").val();
    status_tmp = status_URL.split("/");
    status = status_tmp[status_tmp.length-1];
    screenName = status_tmp[status_tmp.length-3];
}

function getLists() {
    var user = $("input[name=ID]").val();
    data.call = "lists/list.json";
    data.method = "GET";
    data.args = {
        "screen_name" : user,
        "cursor" : "-1"
    };

    var listarea = $("#list");
    listarea.html("<img src='images/loadinfo.gif'>読み込み中…");
    var html = '<input type="submit" value="リスト一覧再取得"><br>';
    $.post("callApis.php", data, function(response) {
        if ( typeof response.errors != "undefined") {
            listarea.html('<input type="submit" value="リスト一覧再取得"><br>読み込み失敗<br><br>');
            return;
        }
        Lists = response;
        $.each(Lists, function(i, a) {
            html += "<input type='radio' name='target' value='" + this.id + "'>" + this.name + "<br>";
        });
        listarea.html(html);
    });
}

function getMembers() {
    var user = $("input[name=ID]").val();
    var target = $("input[name=target]:checked").val();
    var cursor = -1;
    var error = {"flag":false};
    data.method = "GET";

    var result = {
        icon : new Array(),
        screen_name : new Array(),
        name : new Array()
    };

    for (var i = 1, count = 0; 50 > i; i++, count++) {
        if (cursor == 0) {
            break;
        }
        if(error.flag == true){
            break;
        }
        if (target == "Follow") {
            data.call = "friends/list.json";
            data.args = {
                "screen_name" : user,
                "cursor" : cursor,
                "skip_status" : true,
                "count":200
            };
        } else if (target == "Follower") {
            data.call = "followers/list.json";
            data.args = {
                "screen_name" : user,
                "cursor" : cursor,
                "skip_status" : true,
                "count":200
            };
        } else {
            data.call = "lists/members.json";
            data.args = {
                "list_id" : target,
                "cursor" : cursor,
                "count":200
            };
        }

        $.ajax({
            async : false,
            "data" : data,
            success : function(response) {
                if ( typeof response.errors != "undefined") {
                    if (response.errors.code == 88) {
                        $("result").append("取得失敗：API切れ")

                    }else if (response.errors.code == 112) {
                        $("result").append("取得失敗：有効なリストが選択されていません。")

                    }else{
                         $("result").append("取得失敗")
                    }
                   
                   error.flag = true;
                    return;

                }

          
                res = response;
                cursor = response.next_cursor;
               $.each(res.users, function() {
                    result.icon.push(this.profile_image_url);
                    result.screen_name.push(this.screen_name);
                    result.name.push(this.name);

                });

              var idTd = $(".id");
                var nameTd = $(".fullname")
                $("span.progless").html("（" + (count * 200) + "件読み込み完了）")
                var htmlid = "";
                var htmlname = "";
                for (var i = 0; result.name.length > i; i++) {
                    htmlid += "<img src='" + result.icon[i] + "' width='14px'>" + result.screen_name[i] + "<br>";
                    htmlname += result.name[i] + "<br>";
                }

                idTd.html(htmlid);
                nameTd.html(htmlname);
            }
        });

    }
    return result;
}

