var map;

/*Create a venue object*/

var venue = function(data) {
  var self = this;

  self.title = ko.observable(data.title);
  self.address = ko.observable("");
  self.url = ko.observable("");
  self.tips = ko.observable("");
  self.lat = ko.observable(data.lat);
  self.lng = ko.observable(data.lng);


};


//Model
//title and location points for the map
var locations = [
  {title: "Museum of Science and Industry", location: {lat: 41.790573, lng: -87.583066}},
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

function myViewModel(){
    var self = this;

    var infoWindow = new google.maps.InfoWindow({
      maxWidth: 300
    });

    var bounds = new google.maps.LatLngBounds();

    var location;
    var marker;
    var url;
    var iconURL = "http://www.crwflags.com/fotw/images/u/us-il-ch2.gif";
    var flagIcon = {
      url: iconURL,
      size: new google.maps.Size(30,20),
      scaledSize: new google.maps.Size(30,20),
      origin: new google.maps.Point(0,0)

    };
//object array that stores and converts data from the model
    self.locationList = ko.observableArray([]);

    //activeMarker = ko.observable("");

//loop over model data and convert each location to an object of ko.observables.
//store in observable array.
    locations.forEach(function(info){
      self.locationList.push(new Venue(info))
    });

//create markers, click listeners, etc. for map
    locationsList().forEach(function(info){

//create markers
        marker = new google.maps.Marker({

          position: new google.mapsLatLng(info.lat(),info.lng()),
          map: map,
          optimized: false,
          icon: flagIcon,
          animation: google.maps.Animation.DROP,
        });

    bounds.extend(marker.position);
    info.marker = marker;

      $.ajax({

        url: 'https://api.foursquare.com/v2/venues/search'+'?ll=' + info.lat() + ',' info.lng() + '&query=' + info.title() +
          '&client_id=MNKQWW4XDG2NNWXOJFIZYDPZU3FDMZJGYKN2GJPD4DJWBTX0' +
          '&client_secret=I5SAHZ1YCC4ENSWKOQUWEGEDPOJYE2TN0ZYZM3AI5T4HEQWR&v=20171104'
        dataType: 'jsonp',
        type: "GET",

              success: function(data){

                //set the received venues object as the value of newVenue
                newVenue = data.response.hasOwnProperty("venues") ? data.response.venues[0] : '';


                //check for url, set as new venue's url
                newURL = venue.hasOwnProperty("url") ? newVenue.url : '';

                //check for tips, set as new venue's tips
                newTips = venue.hasOwnProperty("tips") ? newVenue.tips : "";

                //visualize new data with html

                info.contentString = '<div><h2>' + info.title() + '</h2><p>' +
                    info.url() + '<br>' + info.tips() + '</p></div>';
              },



              error: function(e){
                 console.log("error in ajax call to foursquare")
                 jQuery("#foursquare-API-error").html("<h3> An error has occured when retrieving data. Please try refreshing page.</h3>")

                 infowindow.setContent('<p>No FourSquare data available!. Please try again.</p>');
          }

        });



            this.searchWord = ko.observable("");


            this.filteredItems = ko.computed(function(){

                return locationList().filter(function(location) {

                  var display = true;

                  if(self.searchWord()){

                    var termIndex=
                    location.title.toLowerCase().indexOf(self.searchWord().toLowerCase());

                    if (termIndex !== -1){
                        display = true;
                    }

                    else {
                        display = false;
                    }
                  }


                  infowindow.close();

                  location.newMarker.setVisible(display);



                  return display;

    })

    });

        google.maps.event.addListener(info.marker, 'click', function() {
         infowindow.open(map, this);
         info.marker.setAnimation(google.maps.Animation.BOUNCE);
         setTimeout(function() {
           info.marker.setAnimation(null);
         }, 1200);
         map.setCenter(info.location);
         infowindow.setContent(info.contentString);
       });
     });

     map.fitBounds(bounds);

     // connect the list items to the correct marker on click
     self.popInfoWindow = function(info) {
       google.maps.event.trigger(info.marker, 'click');
     };


};



//view

function initApp() {
  ko.applyBindings(new myViewModel());
};




function initMap() {

      map = new google.maps.Map(document.getElementById("map"), {
        center: {lat:41.892959, lng:-87.618928},
        zoom: 13

      });

      infowindow = new google.maps.InfoWindow({
        content: "",
        contentPosition: {}
      })

      initApp();

}
