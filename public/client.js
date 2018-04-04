$(function() {
  var curPage = 0;
  var imagesInPage = 10;
  
  // Fetches an image gallery from Imgur
  var fetchImages = function (query, callback) {
    
    var url = '/api/search?titles=' + query.titles + '&offset=' + curPage + '&count=' + imagesInPage;
    
    $.ajax(
      {url: url,
       method: "GET",
       dataType: "json",
       success: (result) => {
         callback(result); 
       },
       error: (err) => {
         console.log(err.responseJSON);
       }
    });
  }
  
  // Displays a given image
  var displayImage = function (image) {
    if(!image) {
      return;
    }
    
    $("#image-list").append(
      '<div class="img-container">'+
        '<a class="img-cover" target="_blank" href="'+image.page+'"></a>'+
        '<img src="'+image.src+'" alt="'+image.alt+'"></img>'+
      '</div>');
  }
  
  // On Search...
  $("#search-btn").click(function(){
    
    $("#image-list").text("");
    $("#more-btn").addClass("hidden");
    curPage = 0;
    
    fetchImages({titles: $("#search-input").val()}, function (data) {
      
      // For each Gallery...
      for(let i = 0; i < data.images.length; i++) {
        displayImage(data.images[i]);
      }
      
      $("#more-btn").removeClass("hidden");
    });
  });
  
  // On more...
  $("#more-btn").click(()=>{
    
    fetchImages({titles: $("#search-input").val()}, function (data) {
      
      // For each Gallery...
      for(let i = 0; i < data.images.length; i++) {
        displayImage(data.images[i]);
      }
      
    });
  });

})
