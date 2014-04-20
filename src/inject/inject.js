chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading
      console.log("Hello. This message was sent from scripts/inject.js");
      // ----------------------------------------------------------


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

      setTimeout(function(){
        var s = $("body").find("script").first();
        //console.log(s.text());
        eval(s.text());

        //console.log(myid);

        $.ajax({
          url: "gateway.php",
          data: {
            cmd:"init_load",
            myid:"355232",
            _v:"1.80a",
            _av:4,
            _t:"7b000f9bfec65c0017ff3e92f04342cb11838bef5353c15ddfcfc",
            ln:"ja",
            rid:150795,
            type: "",
            new:1
          },
          dataType: "json",
          type: "get"
        }).then(function(data){
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
        });
      }, 1000);

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
