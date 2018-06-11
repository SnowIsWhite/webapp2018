$(document).ready(function(){
  $("textarea").keydown(function(){
    var numChar = $(this).val().length;
    var maxNum = 500;
    var charRemain = maxNum - numChar;
    $("p[id=textarea]").text(charRemain);
    if(numChar > maxNum-1){
        $(this).val($(this).val().substr(0, maxNum));
    }
  });
});
