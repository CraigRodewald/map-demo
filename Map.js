var globalMap;
var markers = [];

$(function() {

var MapFcns = {
    loadSiteList: function () {
        var airportList = $('#airport-list');
            airportList.html('');
            airportList.append('<option value=""></option>');
            sites.sort(SortByCode);
        for (var i in sites) {
            var newOption = $('<option value="' + sites[i].Code + '">' + sites[i].Code + '</option>');
            airportList.append(newOption);
        }
    },

    siteListChange: function() {
        var ctl = $(this),
            airportCode = ctl.val();
            if(airportCode) {
                var currAirport = _.findWhere(sites, {Code: airportCode});
                $('#setting-code').text(currAirport.Code);
                $('#setting-city').text(currAirport.City);
                $('#setting-state').text(currAirport.State);
               $('#setting-airport-name').text(currAirport.FullSiteName.split("_")[2]);
                $('#setting-lat').text(currAirport.Latitude);
                $('#setting-long').text(currAirport.Longitude);

                var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code
                });
                markers.unshift(marker);
                //console.log(markers);
            }
    }
};

MapFcns.loadSiteList();
$('#airport-list').change(MapFcns.siteListChange);
$('#exercise-toggle').click(function() {
    var  toggleCtl = $(this),
         toggleVal = toggleCtl.text();
    if (toggleVal == '-') {
        toggleCtl.text('+');
        $('#exercise-instructions').hide();
    } else {
        toggleCtl.text('-');
        $('#exercise-instructions').show();
    }
});

});

function SortByCode(a, b){
   var aCode = a.Code.toLowerCase();
   var bCode = b.Code.toLowerCase();
  return ((aCode < bCode) ? -1 : ((aCode > bCode) ? 1 : 0));
  }

function  initMap() {
  // Callback function to create a map object and specify the DOM element for display.
  globalMap = new google.maps.Map(document.getElementById('airport-map'), {
    center: {lat: 42.2814, lng: -83.7483},
    scrollwheel: true,
    zoom: 6
  });

    }

    function setMapOnAll(globalMap) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(globalMap);
      }
    }

    function clearMarkers() {
      setMapOnAll(null);
    }

    function showMarkers() {
      setMapOnAll(globalMap);
    }

    function removeMarkers() {
      markers.splice(0,1);
      clearMarkers();
      initMap();
      showMarkers();
    }

    function deleteMarkers() {
      clearMarkers();
      markers = [];
    }
