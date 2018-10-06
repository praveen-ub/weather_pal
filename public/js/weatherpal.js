$(window).bind("load",function(){
  $("#source-input,#dest-input").on("keyup",function(){
    $(".error").hide();
    var val = $(this).val();
    var inputId = $(this).prop("id");
    $.ajax({
      url: 'http://localhost:5000/cities',
      data: {
        key:val
      },
      success: function(response){
        var suggestions = JSON.parse(response.body).predictions;
        var values = [];
        suggestions.forEach(function(suggestion){
            values.push(suggestion.description);
        });
        console.log("Response is::"+response);
        $( "#"+inputId ).autocomplete({
          source: values
        });
      },
      dataType: 'json'
    });
  });
});

var map, infoWindow;
var markers = [];

function initMap() {
  console.log("Init map called");
  var directionsService = new google.maps.DirectionsService();
  var directionsDisplay = new google.maps.DirectionsRenderer();
  var chicago = new google.maps.LatLng(41.850033, -87.6500523);
  var mapOptions = {
    zoom:12,
    center: chicago
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  infoWindow = new google.maps.InfoWindow;
  navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });

  directionsDisplay.setMap(map);
  $("#search-routes").on("click",function(){
    var origin = $("#source-input").val();
    var dest = $("#dest-input").val();
    if(!origin){
      var errorMessage = "Uh-oh! Source city cannot be empty";
      var errorHtml = "<span name='error-message'>"+errorMessage+"</span>";
      $("[name=error-div]").html(errorMessage);
      $(".error").show();
      return;
    }
    else if(!dest){
      var errorMessage = "Uh-oh! Destination city cannot be empty";
      var errorHtml = "<span name='error-message'>"+errorMessage+"</span>";
      $("[name=error-div]").html(errorMessage);
      $(".error").show();
      return;
    }
    var requestData = {
      source:origin,
      destination:dest,
      travelMode:'Driving'
    };
    displayRoute(requestData);
    console.log(`Searching for routes between ${$("#source-input").val()} and ${$("#dest-input").val()}`);
  });

  function displayRoute(requestData){
    $.ajax({
      url: 'http://localhost:5000/directions',
      data: requestData,
      beforeSend: function(req){
        req.setRequestHeader('Access-Control-Allow-Headers', '*');
      },
      success: function(response){
        var routes = response.routes;
        if(routes.length == 0){
          var errorMessage = "Uh-oh! No terrestial routes found, consider flying";
          var errorHtml = "<span name='error-message'>"+errorMessage+"</span>";
          $("[name=error-div]").html(errorMessage);
          $(".error").show();
        }
        response.routes = transformRoutes(routes);
        clearAndPlaceMarkers(routes);
        response.request = requestData;
        var steps = response.routes[0].legs[0].steps;
        for(var idx in steps){
          var step = steps[idx];
          console.log(`Start location ${step.start_location}::End location ${step.end_location}`);
        }
        map.setZoom(12);
        directionsDisplay.setDirections(response);
      },
      dataType: 'json'
    });
  }

  function clearAndPlaceMarkers(routes){
    for (var i=0;i<markers.length;i++){
      markers[i].setMap(null);
    }
    placeMarkers(routes);
  }

  function placeMarkers(routes){

    // infoWindow.addListener(infoWindow,'domready',function(){
    //   $('#div-main-infoWindow')//the root of the content
    //    .closest('.gm-style-iw')
    //     .parent().addClass('custom-iw');
    // });

    function markerHandler(marker){
      var requestData = {
        lat: marker.position.lat,
        lng: marker.position.lng
      }
      $.ajax({
        url: 'http://localhost:5000/weather',
        data: requestData,
        dataType: 'json',
        beforeSend: function(req){
          req.setRequestHeader('Access-Control-Allow-Headers', '*');
        },
        success: function(response){
          console.log("Response is::"+JSON.stringify(response));
          var weatherContent = response.name+", "+response.weather[0].main+","+response.main.temp+" ℉";
          var infowindow = new google.maps.InfoWindow({
            content: weatherContent
          });
          infoWindow.setContent(weatherContent);
          infoWindow.open(map, marker);
        }
      });
    }

    routes.forEach(function(route){
      route.legs.forEach(function(leg){
          leg.steps.forEach(function(step){
            console.log("Step is::"+JSON.stringify(step));
              var marker = new google.maps.Marker({
                map: map,
                draggable: true,
                animation: google.maps.Animation.DROP,
                position: step.end_location
              });
              markers.push(marker);
              google.maps.event.addListener(marker, 'mouseover', function() {
                markerHandler(this);
              });
          });
      });
    });
  }

  //Reference:https://gis.stackexchange.com/questions/15197/google-maps-v3-in-javascript-api-render-route-obtained-with-web-api
  function asBounds(boundsObject){
    return new google.maps.LatLngBounds(asLatLng(boundsObject.southwest),
                                  asLatLng(boundsObject.northeast));
  }

  function asLatLng(latLngObject){
      return new google.maps.LatLng(latLngObject.lat, latLngObject.lng);
  }

  function asPath(encodedPolyObject){
      return google.maps.geometry.encoding.decodePath( encodedPolyObject.points );
  }

  function transformRoutes(routes){

    routes.forEach(function(route){
      route.bounds = asBounds(route.bounds);
      route.overview_path = asPath(route.overview_polyline);

      route.legs.forEach(function(leg){
          leg.start_location = asLatLng(leg.start_location);
          leg.end_location   = asLatLng(leg.end_location);

          leg.steps.forEach(function(step){
              step.start_location = asLatLng(step.start_location);
              step.end_location   = asLatLng(step.end_location);
              step.path = asPath(step.polyline);
          });

      });
    });
    return routes;
  }
}
