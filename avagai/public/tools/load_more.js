$(document).ready(function(){
  $parent = $("ul[id=style-ul]"),
  $items = $parent.find("li"),
  $loadMoreBtn = $("#load-more-styles"),
  maxItems = 10,
  hiddenClass = "visually-hidden";

  		// add visually hidden class to items beyond maxItems
  $.each($items, function(idx,item){
    if(idx > maxItems - 1){
      $(this).addClass(hiddenClass);
    }
  });

  // onclick of show more button show more = maxItems
  // if there are none left to show kill show more button
  $loadMoreBtn.on("click", function(e){
    $("."+hiddenClass).each(function(idx,item){
      if(idx < maxItems){
        $(this).removeClass(hiddenClass);
      }
      // kill button if no more to show
      if($("."+hiddenClass).size() === 0){
        $loadMoreBtn.hide();
      }
    });
  });
});
