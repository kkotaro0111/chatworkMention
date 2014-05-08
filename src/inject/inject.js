chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading
      console.log("Hello. This message was sent from scripts/inject.js");
      // ----------------------------------------------------------

      var app = app || {};

      //create searchform
      function createSearchForm(){
        var dom$ = $("<div />").attr("id", "uw_searchform");
        var ul$ = $("<ul />").addClass("userlist");

        dom$.html(ul$);

        return dom$;
      }

      //set searchform
      function setSearchForm(){
        var searchform$ = createSearchForm();
        searchform$.css({
          position: "absolute",
          top: 0,
          right: 0,
          display: "none"
        });

        $("#_chatTextArea").append( searchform$ );
        return searchform$;
      }

      var searchform$ = setSearchForm();

      function loadGlobalVars(){
        var s = $("body").find("script").first();
        app.p = {};
        var s2 = s.text().replace(/var /g, "app.p.");
        console.log(s.text(), s2);
        eval(s2);

        console.log(app.p.myid);
      }

      function getFirstRoomId(){
        return 0;
      }

      function init(){
        loadGlobalVars();

        app.p.rid = getFirstRoomId();

        $.ajax({
          url: "gateway.php",
          data: {
            cmd:"init_load",
            myid: app.p.myid,
            _v: app.p.client_ver,
            _av:4,
            _t: app.p.ACCESS_TOKEN,
            ln:"ja",
            rid: app.p.rid,
            type: "",
            new:1
          },
          dataType: "json",
          type: "get"
        }).then(function(data){
          console.log("ajax data", data);
          RL = {};
          AC = {};
          RL.rooms = data.result.room_dat;
          $.each( RL.rooms, function(key, value){
            //console.log(arguments, value, value.m);
            var members = $.map(value.m, function(value, key){
              return key;
            });
            members.sort();
            value.sorted_member_list = members;
          });
          //console.log(RL.rooms);
          AC.account_dat = data.result.contact_dat;
        });      }

      init();

      $("#_roomListItems").on("click", "li._roomLink", function(){
        //console.log($(this), $(this).data("rid"));
        RL.focused_room_id = $(this).data("rid");
      });


      $("#_chatText").on("keyup", function(){
        //console.log(this, this.value, this.value.split("\n"));
        var splittext = this.value.split("\n");
        $.each(splittext, function(index, text){
          if(/^@$/.test(text)){
            var currentRoom = RL.rooms[RL.focused_room_id];
            //console.log("RL", window.RL, RL.focused_room_id, currentRoom);
            var userlist = [];
            var ul$ = searchform$.find("ul");
            $.each(currentRoom.sorted_member_list, function(){
              var user = AC.account_dat[this.toString()];
              userlist.push( user.nm );
              var li$ = $("<li />");
              li$.text( user.nm );
              ul$.append(li$);
            }); 
            searchform$.css({
              display: "block"
            });
          }
        });
      });

    }
  }, 10);
});
