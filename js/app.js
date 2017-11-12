//global variables

var map;
var markers = [];

//Model
var locationsModel = [
  {title: "The Museum of Science and Industry", location: {lat: 41.790573, lng: -87.583066}},
  {title: "The Field Museum", location: {lat: 41.866261, lng: -87.616981}},
  {title: "Willis Tower", location: {lat: 41.878876, lng:-87.635915}},
  {title: "Soldier Field", location: {lat: 41.862313, lng:-87.616688}},
  {title: "Navy Pier", location: {lat: 41.891551, lng:-87.607375 }},
  {title: "The Art Institute of Chicago", location: {lat: 41.879585,lng:-87.623713}},
  {title: "Wrigley Field", location: {lat: 41.94883, lng:-87.657718}},
  {title: "The Second City", location: {lat: 41.953797, lng:-87.683267}},
  {title: "Harold Washington Public Library", location: {lat: 41.87632, lng:-87.628201}},
  {title: "Cloud Gate (The Bean)", location: {lat: 41.882501, lng:-87.623343}},
  {title: "The Shedd Aquarium", location: {lat: 41.867573, lng:-87.614038}},
  {title: "Lincoln Park Zoo", location: {lat: 41.921092, lng:-87.633991}},
  {title: "Civic Opera House", location: {lat: 41.882564, lng:-87.637425}},
  {title: "Tribune Tower", location: {lat: 41.890405, lng:-87.623188 }},
  {title: "Holy Name Cathedral", location: {lat: 41.895962, lng:-87.627989}},

];



//Octopus




//View

function initMap() {

  map = new google.maps.Map(document.getElementById("map"), {
    center: {lat:41.892959, lng:-87.618928},
    zoom: 13

  });
}
