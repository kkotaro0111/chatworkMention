chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      clearInterval(readyStateCheckInterval);

      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading
      console.log("Hello. This message was sent from scripts/inject.js");
      // ----------------------------------------------------------
      $("#_chatText").on("keyup", function(){
        var splittext = this.value.split("\n");
        $.each(splittext, function(index, text){
          if(/^@$/.test(text)){
            $("#_to").trigger("click");
          }
        });
      });

    }
  }, 10);
});
