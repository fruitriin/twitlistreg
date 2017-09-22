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
    $(document).on("click", "#list input[type=submit]", function() {
        if ($("input[name=ID]").val() != "")
            getLists();
    });
    $(document).on("click", "input[name=result]", function() {
        if (($("input[name=ID]").val() != "") && ($("input[name=target]").val() != undefined)) {
            $("#result").html("<span class='loading'><img src='images/loadinfo.gif'>読み込み中 <span class='progless'></span></span><table><tr><td class='id'></td><td class='fullname'></td></tr></table>");
            var result = getMembers();
        }
        if (result != undefined) {
            $("#result span.loading").remove();

        } else {
            $("#result").html("読み込み失敗");
        }

    });

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

    data.method = "GET";

    var result = {
        icon : new Array(),
        screen_name : new Array(),
        name : new Array()
    };

    for (var i = 1, count = 0; 50 > i; i++, count++) {
        if (cursor == "0") {
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
            async : true,
            "data" : data,
            success : function(response) {
                if ( typeof response.errors != "undefined") {
                    if (response.errors.code == 88) {
                        $("#result");
                    }
                }

          
                res = response;
                cursor = response.next_cursor_str;
              //  $.each(res.users, function() {
                    result.icon.push(response.users.profile_image_url);
                    result.screen_name.push(response.users.screen_name);
                    result.name.push(response.users.name);

           //     });


            }
        });
              var idTd = $(".id");
                var nameTd = $(".fullname")
                $("span.progless").html("（" + (count * 200) + "件読み込み完了）")
                var htmlid = "";
                for (var i = 0; result.name.length > i; i++) {
                    htmlid += "<img src='" + result.icon[i] + "' width='14px'>" + result.screen_name[i] + "<br>";
                }
                var htmlname = "";
                for (var i = 0; result.name.length > i; i++) {
                    htmlname += result.name[i] + "<br>";
                }

                idTd.append(htmlid);
                nameTd.append(htmlname);
    }
    return result;
}

