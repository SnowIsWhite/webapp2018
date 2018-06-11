$(document).ready(function () {
  $('#checkBtn').click(function() {
    brand_checked = $("input[name^=brands]:checked").length;
    if(!brand_checked) {
      msg = $("p#brand-msg").text('하나 이상 선택해 주세요.');
      msg.css({"color": "red", "font-size" : "1rem", "margin-top": "5px", "margin-bottom": "5px"});
    }

    avoid_checked = $("input[name^=avoid]:checked").length;
    if(!avoid_checked) {
      msg = $("p#avoid-msg").text('기타나 없음을 선택해 주세요.');
      msg.css({"color": "red", "font-size" : "1rem", "margin-top": "5px", "margin-bottom": "5px"});
    }

    style_checked = $("input[name^=style]:checked").length;
    if(!style_checked) {
      msg = $("p#style-msg").text('하나 이상 선택해 주세요.');
      msg.css({"color": "red", "font-size" : "1rem", "margin-top": "5px", "margin-bottom": "5px"});
    }

    // Scroll
    if(!brand_checked){
      $('html, body').animate({
            scrollTop: $("p#brand-msg").offset().top
          }, 1000);
      return false;
    }
    else if(!avoid_checked){
      $('html, body').animate({
            scrollTop: $("p#avoid-msg").offset().top
          }, 1000);
      return false;
    }
    else if(!style_checked){
      $('html, body').animate({
            scrollTop: $("p#style-msg").offset().top
          }, 1000);
      return false;
    }
  });
});
