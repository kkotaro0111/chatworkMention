chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading
      console.log("Hello. This message was sent from scripts/inject.js");
      // ----------------------------------------------------------


      var add = function(func){
        location.href="javascript: setTimeout(" + func.toString() + ", 10);";
      };

      function run(){
        /* set global bars */
        var app = app || {};
        app.keyCode = {
          "@": 219,
          "up": 38,
          "down": 40,
          "return": 13
        };
        app.userList = [];
        app.selectUserIndex = 0;

        /* set functions */
        /* for dom */
        app.createSearchForm = function(){
          var dom$ = $("<div />").attr("id", "uw_searchform");
          var ul$ = $("<ul />").addClass("userlist");

          dom$.html(ul$);
          ul$.on("click", "li", app.selectedUser);

          return dom$;
        };

        app.setSearchForm = function(){
          var searchform$ = app.createSearchForm();
          searchform$.css({
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            overflow: "scroll",
            display: "none"
          });

          $("#_chatTextArea").append( searchform$ );
          return searchform$;
        };

        app.createUserList = function(){
          var currentRoom = RL.rooms[RL.focused_room_id];
          app.userList = [];
          var ul$ = app.searchform$.find("ul");
          $.each(currentRoom.sorted_member_list, function(){
            var user = AC.account_dat[this.toString()];
            app.userList.push( user );
            var li$ = $("<li />");
            li$.text( user.nm );
            ul$.append(li$);
          }); 
        };

        app.closeUserList = function(){
          app.selectMode = false;
          app.searchform$.hide();
        };

        app.openUserList = function(){
          app.selectMode = true;
          app.searchform$.show();
        };

        app.selectUser = function(index){
          app.selectUserIndex = index;
          app.searchform$.find("li").removeClass("select").eq(index).addClass("select");
        };

        /* for user action */
        app.selectedUser = function(){
          var t$ = $(this);
          console.log("clicked", t$.text());
        };

        app.changeRoom = function(){
          app.closeUserList();
          app.createUserList();
        };

        app.onKey = function(e){
          /*console.log("keyup", this, arguments, event);*/
          console.log("keyup", event.keyCode);
          var keycode = event.keyCode;

          if( app.selectMode === true ){
            var userlen = app.userList.length;
            if( keycode === app.keyCode["down"]){
              app.selectUser( (app.selectUserIndex + 1 ) % userlen );
            }else if (keycode === app.keyCode["up"]){
              app.selectUser( (app.selectUserIndex + userlen - 1 ) % userlen );
            }else if (keycode === app.keyCode["return"]){
              app.closeUserList();
            }
          }else{
            if( keycode === app.keyCode["@"] ){
              app.openUserList();
              app.selectUser(0);
            }
          }

        };

        /* for init */
        app.init = function(){
          app.searchform$ = app.setSearchForm();
          app.loadGlobalVars();
          app.p.rid = app.getFirstRoomId();
          app.setEvents();
          app.createUserList();
        };

        app.loadGlobalVars = function(){
          var s = $("body").find("script").first();
          app.p = {};
          var s2 = s.text().replace(/var /g, "app.p.");
          console.log(s.text(), s2);
          eval(s2);

          console.log(app.p.myid);
        };

        app.getFirstRoomId = function(){
          return 0;
        };

        /* set Event */
        app.setEvents = function(){
          $("#_roomListItems").on("click", "li._roomLink", app.changeRoom);
          $("#_chatText").on("keyup", app.onKey);
        };

        /* run */
        app.init();
      };

      add( run );

    }
  }, 10);
});
