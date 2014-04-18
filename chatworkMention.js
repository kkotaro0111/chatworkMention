//require jQuery
$(function(){
  $("#_chatText").on("keyup", function(){
    var splittext = this.value.split("\n");
    $.each(splittext, function(index, text){
      if(/^@$/.test(text)){
        $("#_to").trigger("click");
      }
    });
  });
});
