$(document).ready(function () {
  $('#checkBtn').click(function() {
    bodyshape_checked = $("input[name^=bodyshape_radio]:checked").val();
    if(!bodyshape_checked) {
      msg = $("p#bodyshape").text('필수 사항입니다.');
      msg.css({"color": "red", "font-size" : "1rem", "margin-top": "5px", "margin-bottom": "5px"});
    }

    faceshape_checked = $("input[name^=faceshape_radio]:checked").val();
    if(!faceshape_checked) {
      msg = $("p#faceshape").text('필수 사항입니다.');
      msg.css({"color": "red", "font-size" : "1rem", "margin-top": "5px", "margin-bottom": "5px"});
    }

    skintone_checked = $("input[name^=skintone_radio]:checked").val();
    if(!skintone_checked) {
      msg = $("p#skintone").text('필수 사항입니다.');
      msg.css({"color": "red", "font-size" : "1rem", "margin-top": "5px", "margin-bottom": "5px"});
    }

    // Scroll
    if(!bodyshape_checked){
      $('html, body').animate({
            scrollTop: $("p#bodyshape").offset().top
          }, 1000);
      return false;
    }
    else if(!faceshape_checked){
      $('html, body').animate({
            scrollTop: $("p#faceshape").offset().top
          }, 1000);
      return false;
    }
    else if(!skintone_checked){
      $('html, body').animate({
            scrollTop: $("p#skintone").offset().top
          }, 1000);
      return false;
    }
  });
});
