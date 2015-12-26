$(document).ready(function() {
  var origin = document.getElementById('source-1');
  var destination = document.getElementById('destination-1');
  initMap(origin,destination);
});

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
   var index = $(e.target).closest('li').index()+1;
   var origin_input = document.getElementById('source-'+index);
   var destination_input = document.getElementById('destination-'+index);
   initMap(origin_input,destination_input);
 });

function initMap(origin_input, destination_input) {
  var origin_place_id = null;
  var destination_place_id = null;
  var travel_mode = google.maps.TravelMode.DRIVING;

  var map = new google.maps.Map(document.getElementById('map'), {
    mapTypeControl: false,    
    center: {lat: 28.6139, lng: 77.2090},
    zoom: 10
  });

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
    });
  }

  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);

  // var origin_input =document.getElementById('source');
  // var destination_input = document.getElementById('destination');
  // var modes = document.getElementById('mode-selector');

  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(origin_input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(destination_input);
  // map.controls[google.maps.ControlPosition.TOP_LEFT].push(modes);

  var origin_autocomplete = new google.maps.places.Autocomplete(origin_input);
  origin_autocomplete.bindTo('bounds', map);
  var destination_autocomplete =
  new google.maps.places.Autocomplete(destination_input);
  destination_autocomplete.bindTo('bounds', map);

  // Sets a listener on a radio button to change the filter type on Places
  // Autocomplete.
  // function setupClickListener(id, mode) {
  //   var radioButton = document.getElementById(id);
  //   radioButton.addEventListener('click', function() {
  //     travel_mode = mode;
  //   });
  // }
  // setupClickListener('changemode-walking', google.maps.TravelMode.WALKING);
  // setupClickListener('changemode-transit', google.maps.TravelMode.TRANSIT);
  // setupClickListener('changemode-driving', google.maps.TravelMode.DRIVING);

  function expandViewportToFitPlace(map, place) {
    if (place.geometry.viewport) {
      map.fitBounds(place.geometry.viewport);
    } else {
      map.setCenter(place.geometry.location);
      map.setZoom(17);
    }
  }

  origin_autocomplete.addListener('place_changed', function() {
    var place = origin_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Enter the valid Origin Point");
      return;
    }
    expandViewportToFitPlace(map, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    origin_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
      directionsService, directionsDisplay);
  });

  destination_autocomplete.addListener('place_changed', function() {
    var place = destination_autocomplete.getPlace();
    if (!place.geometry) {
      window.alert("Enter the valid Destination Point");
      return;
    }
    expandViewportToFitPlace(map, place);

    // If the place has a geometry, store its place ID and route if we have
    // the other place ID
    destination_place_id = place.place_id;
    route(origin_place_id, destination_place_id, travel_mode,
      directionsService, directionsDisplay);
  });

  function route(origin_place_id, destination_place_id, travel_mode,
   directionsService, directionsDisplay) {
    if (!origin_place_id || !destination_place_id) {
      return;
    }
    directionsService.route({
      origin: {'placeId': origin_place_id},
      destination: {'placeId': destination_place_id},
      travelMode: travel_mode
    }, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }
}