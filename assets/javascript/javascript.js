// Javascript written by Ritter Gustave
var recentSearch = [];
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

$.ajaxPrefilter(function(options) {
    if (options.crossDomain && $.support.cors) {
        options.url = 'https://cors-anywhere.herokuapp.com/' + options.url;
    }
});

function getPopulation() {
    $.ajax({
        method: 'GET',
        url: "https://api.rocketleague.com/api/v1/population",
        headers: {
            'Authorization': 'Token ' + apikey
        }
    }).done(function(popData) {
        console.log(popData);
    });
}

function getStatsValueForUser(identification, plat) {
    var id = identification;
    var platform = plat;
    var statsArray = ["assists", "goals", "mvps", "saves", "shots", "wins"];

        for( var i = 0; i < statsArray.length; i++){
            var statistics = statsArray[i];
            ajaxIfCalls(statistics, id, platform);
        }
}

function resolveVanityURL(identification, plat) {
    var id = identification;
    var platform = plat;
    var steamPowered = "61559FC24A7A28F1C4E55C92CFBFFE46";

    if ($('#steam').hasClass("active")) {
        $.ajax({
            method: 'GET',
            url: "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" + steamPowered + "&vanityurl=" + id,
            success: function(response) {
                resolvedID = response.response.steamid;
                $.ajax({
                    method: 'GET',
                    url: "https://api.rocketleague.com/api/v1/" + platform + "/playerskills/" + resolvedID + "/",
                    headers: {
                        'Authorization': 'Token ' + apikey
                    }
                }).done(function(data) {
                    console.log('Successfully Fetched Data:');
                    console.log(data);
                });
            }
        })
    } else if ($('#xbox').hasClass('active') || $('#ps4').hasClass('active')) {
        $.ajax({
            method: 'GET',
            url: "https://api.rocketleague.com/api/v1/" + platform + "/playerskills/" + id + "/",
            headers: {
                'Authorization': 'Token ' + apikey
            }
        }).done(function(data) {
            console.log(data);
        });
    } else {
        $('#emptyPlatformModal').modal('show');
    }
};

function ajaxIfCalls(statistics, id, platform){
  var id = id;
  var platform = platform;
  var steamPowered = "61559FC24A7A28F1C4E55C92CFBFFE46";
  var statsArray = ["assists", "goals", "mvps", "saves", "shots", "wins"];
  var stats = statistics;

  if ($('#steam').hasClass("active")) {
          $.ajax({
              method: 'GET',
              url: "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" + steamPowered + "&vanityurl=" + id,
              success: function(response) {
                  resolvedID = response.response.steamid;
                  $.ajax({
                      method: 'GET',
                      url: "https://api.rocketleague.com/api/v1/" + platform + "/leaderboard/stats/" + stats + "/" + resolvedID + "/",
                      headers: {
                          'Authorization': 'Token ' + apikey
                      }
                  }).done(function(data) {
                      console.log('Successfully Fetched Data:');
                      console.log(data);
                  })
              }
          })
  } else if ($('#xbox').hasClass('active') || $('#ps4').hasClass('active')) {
      $.ajax({
          method: 'GET',
          url: "https://api.rocketleague.com/api/v1/" + platform + "/playerskills/" + id + "/",
          headers: {
              'Authorization': 'Token ' + apikey
          }
      }).done(function(data) {
          console.log(data);
      });
  } else {
      $('#emptyPlatformModal').modal('show');
  }
}

function checkActive(item) {
    $(item).siblings().removeClass("active");
    $(item).toggleClass('active');
}

// ASK for API key, website only works with API key
var apikey = localStorage.getItem('apikey');
if (!apikey) {
    $('#myModal').modal({
        show: false
    });
    $('#myModal').modal('show');
    $('#saveKey').on('click', function() {
        apikey = $('#apiKeyToken').val();
        localStorage.setItem('apikey', apikey);
        $('#myModal').modal('hide');
    });
};

// Platform selection
var platform;
$('#ps4').on('click', function() {
    platform = "ps4";
    if (platform === "ps4") {
        console.log("ps4 selected")
        checkActive($(this));
    };
});
$('#xbox').on('click', function() {
    platform = "xbox";
    if (platform === "xbox") {
        console.log("xbox selected");
        checkActive($(this));
    };
});
$('#steam').on('click', function() {
    platform = "steam";
    if (platform === "steam") {
        console.log("steam selected");
        checkActive($(this));
    };
});
// Platform selection end

$('#submit').on('click', function() {
    var id = $('#inputSearch').val();
    if (id === "") {
        $('#inputEmptyModal').modal('show');
    } else {
        //Check to see if ID exists in the database (not working returns null)
        recentSearch.push(id);
        localStorage.setItem('recentSearch', JSON.stringify(recentSearch));

        database.ref().push({
            searchTerm: id,
            searchTermCount: 0
        });

        resolveVanityURL(id, platform);
        getStatsValueForUser(id, platform);
    };
})

var ctx = $("#playStyle")
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'doughnut',

    // The data for our dataset
    data: {
        labels: ["Goals", "Assists", "Saves"],
        datasets: [{
            label: "My First dataset",
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [100, 40, 300],
        }]
    },

    // Configuration options go here
    options: {}
});
