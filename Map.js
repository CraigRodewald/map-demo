var globalMap;
var markers = [];
var infowindow;
var lat = 42.2814;
var lng = -83.7483;
var mile = 1609;

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

                infowindow = new google.maps.InfoWindow();
                var service = new google.maps.places.PlacesService(globalMap);
                var marker = new google.maps.Marker({
                    position: {lat: currAirport.Latitude, lng: currAirport.Longitude},
                    map: globalMap,
                    title: currAirport.Code
                });

                google.maps.event.addListener(marker, 'click', function() {
                  infowindow.setContent(currAirport.Code);
                  infowindow.open(globalMap, this);
                  MapFcns.siteListChange(currAirport);

                });

                markers.unshift(marker);

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
    center: {lat: lat, lng: lng},
    scrollwheel: true,
    zoom: 6
  });

  var geocoder = new google.maps.Geocoder();
	document.getElementById('submit').addEventListener('click', function() {
	   geocodeAddress(geocoder, globalMap);
	  });

  var request = {
    location: {lat: lat, lng: lng},
  };

  infowindow = new google.maps.InfoWindow();

  }

      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      }

      function createMarker(place) {
        var placeLoc = place.geometry.location;
        var marker = new google.maps.Marker({
          map: globalMap,
          position: place.geometry.location
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.setContent(place.name);
          infowindow.open(globalMap, this);
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

    function geocodeAddress(geocoder, resultsMap) {
   		var address = document.getElementById('address').value;

  	 	geocoder.geocode({'address': address}, function(results, status) {
      	if (status === google.maps.GeocoderStatus.OK) {
        		resultsMap.setCenter(results[0].geometry.location);

            var service = new google.maps.places.PlacesService(globalMap);
            service.nearbySearch({
              location: {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()},
              radius: mile*10,
              type: ['airport']
            }, callback);
        }

		});

		}
