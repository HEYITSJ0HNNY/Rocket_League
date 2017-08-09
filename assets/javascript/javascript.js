// Javascript written by Ritter Gustave

$.ajaxPrefilter(function(options) {
    if (options.crossDomain && $.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});


function checkActive(item) {
  $(item).siblings().removeClass("active");
  $(item).toggleClass('active');
}
var platform;
$('#ps4').on('click', function(){
  platform = "ps4";
  if(platform === "ps4"){
    console.log("ps4 selected")
    checkActive($(this));
  }
})
$('#xbox').on('click', function(){
  platform = "xbox";
  if(platform === "xbox"){
    console.log("xbox selected");
    checkActive($(this));
  }
})
$('#steam').on('click', function(){
  platform = "steam";
  if(platform === "steam"){
    console.log("steam selected");
    checkActive($(this));
  }
})


var apikey = localStorage.getItem('apikey');
console.log(apikey)
if (!apikey) {
  apikey = prompt('API key?');
  localStorage.setItem('apikey', apikey);
}
$('#submit').on('click', function(){
  var id = $('#inputSearch').val()

  $.ajax({
    method: 'GET',
    url: "https://api.rocketleague.com/api/v1/" + platform + "/playerskills/" + id + "/",
    headers: {
      'Authorization': 'Token ' + apikey
    }
  }).done(function(data) {
    console.log(data);
    console.log('worked');
  }, function(data) {
    console.log('nope');
  });
  console.log('did the thing')
});


// GET: /api/v1/<platform>/playerskills/<player_id>/
// POST: /api/v1/<platform>/playerskills
