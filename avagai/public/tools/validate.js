$(document).ready(function () {
  $('#checkBtn').click(function() {
    shirts_fit_checked = $("input[name^=tshirts_fit]:checked").length;
    if(!shirts_fit_checked) {
      msg = $("p#shirts_fit").text('하나 이상 선택해 주세요.');
      msg.css({"color": "red", "font-size" : "1rem", "margin-top": "5px", "margin-bottom": "5px"});
    }

    button_fit_checked = $("input[name^=button_fit]:checked").length;
    if(!button_fit_checked){
      msg = $("p#button_fit").text('하나 이상 선택해 주세요.');
      msg.css({"color": "red", "font-size" : "1rem", "margin-top": "5px", "margin-bottom": "5px"});
    }

    tuck_in_checked = $("input[name^=tuck_in]:checked").length;
    if(!tuck_in_checked){
      msg = $("p#tuck_in").text('여기 놓치셨어요.');
      msg.css({"color": "red", "font-size" : "1rem", "margin-top": "5px", "margin-bottom": "5px"});
    }

    jeans_fit_checked = $("input[name^=jeans_fit]:checked").length;
    if(!jeans_fit_checked){
      msg = $("p#jeans_fit").text('하나 이상 선택해 주세요.');
      msg.css({"color": "red", "font-size" : "1rem", "margin-top": "5px", "margin-bottom": "5px"});
    }

    pants_fit_checked = $("input[name^=pants_fit]:checked").length;
    if(!pants_fit_checked){
      msg = $("p#pants_fit").text('하나 이상 선택해 주세요.');
      msg.css({"color": "red", "font-size" : "1rem", "margin-top": "5px", "margin-bottom": "5px"});
    }

    shorts_fit_checked = $("input[name^=shorts_fit]:checked").length;
    if(!shorts_fit_checked){
      msg = $("p#shorts_fit").text('하나 이상 선택해 주세요.');
      msg.css({"color": "red", "font-size" : "1rem", "margin-top": "5px", "margin-bottom": "5px"});
    }

    // Scroll
    if(!shirts_fit_checked){
      $('html, body').animate({
            scrollTop: $("p#shirts_fit").offset().top
          }, 1000);
      return false;
    }
    else if(!button_fit_checked){
      $('html, body').animate({
            scrollTop: $("p#button_fit").offset().top
          }, 1000);
      return false;
    }
    else if(!tuck_in_checked){
      $('html, body').animate({
            scrollTop: $("p#tuck_in").offset().top
          }, 1000);
      return false;
    }
    else if(!jeans_fit_checked){
      $('html, body').animate({
            scrollTop: $("p#jeans_fit").offset().top
          }, 1000);
      return false;
    }
    else if(!pants_fit_checked){
      $('html, body').animate({
            scrollTop: $("p#pants_fit").offset().top
          }, 1000);
      return false;
    }
    else if(!shorts_fit_checked){
      $('html, body').animate({
            scrollTop: $("p#shorts_fit").offset().top
          }, 1000);
      return false;
    }
  });
});
