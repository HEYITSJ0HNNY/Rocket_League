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

// Firebase initialization
var config = {
  apiKey: "AIzaSyAf2Mv8BSPQn2d50Uu_rbP-V3V8rwtdqP0",
  authDomain: "rlstatsdb.firebaseapp.com",
  databaseURL: "https://rlstatsdb.firebaseio.com",
  projectId: "rlstatsdb",
  storageBucket: "rlstatsdb.appspot.com",
  messagingSenderId: "510843603868"
};
firebase.initializeApp(config);
var database = firebase.database();
// EO firebase initialization

// Testing Firebase DB Grounds
database.ref().on('value', function(snapshot){
  console.log(snapshot.val());
})
// Testing Firebase DB Grounds

// Platform selection
var platform;
$('#ps4').on('click', function(){
  platform = "ps4";
  if(platform === "ps4"){
    console.log("ps4 selected")
    checkActive($(this));
  };
});
$('#xbox').on('click', function(){
  platform = "xbox";
  if(platform === "xbox"){
    console.log("xbox selected");
    checkActive($(this));
  };
});
$('#steam').on('click', function(){
  platform = "steam";
  if(platform === "steam"){
    console.log("steam selected");
    checkActive($(this));
  };
});
// Platform selection end

// ASK for API key, website only works with API key
var apikey = localStorage.getItem('apikey');
if (!apikey) {
  $('#myModal').modal({ show: false });
  $('#myModal').modal('show');
  $('#saveKey').on('click', function(){
    apikey = $('#apiKeyToken').val();
    localStorage.setItem('apikey', apikey);
    $('#myModal').modal('hide');
  });
};

$('#submit').on('click', function(){
  var id = $('#inputSearch').val();
  if ( id === "" ){
    alert("You need input!");
  } else {
    //Check to see if ID exists in the database (not working returns null)
    database.ref().child('rlstatsdb').orderByChild("searchTerm").equalTo(id).once("value", function(snapshot) {
        var userData = snapshot.val();
        console.log(snapshot.val());
        if (userData){
          console.log("exists!");
        }
    });

    database.ref().push({
      searchTerm: id,
      searchTermCount: 0
    });
  };

  // AJAX call
  $.ajax({
    method: 'GET',
    url: "https://api.rocketleague.com/api/v1/" + platform + "/playerskills/" + id + "/",
    headers: {
      'Authorization': 'Token ' + apikey
    }
  }).done(function(data) {
    console.log('Successfully Fetched Data:');
    console.log(data);
  });
  console.log('End of AJAX call');
  // EO Ajax Call
});


// GET: /api/v1/<platform>/playerskills/<player_id>/
// POST: /api/v1/<platform>/playerskills
