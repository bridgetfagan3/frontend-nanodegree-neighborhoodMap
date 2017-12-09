//global variables

var map;



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




//Add marker and related items to the map.
var Marker = function(data){

//Set a flag image for the marker point to display on the map.
    var self = this;

    this.icon = "http://www.crwflags.com/fotw/images/u/us-il-ch2.gif";

    this.flagIcon = {
      url: self.icon,
      size: new google.maps.Size(30,20),
      scaledSize: new google.maps.Size(30,20),
      origin: new google.maps.Point(0,0)

    };

//link location data to Marker function
    this.title = data.title;
    this.location = data.location;
    this.lat = data.location.lat;
    this.lng = data.location.lng;

    this.newTitle = ko.observable("");
    this.newURL = ko.observable("");
    this.newPhone = ko.observable("");
    this.contentString = ko.observable("");

    this.activeClass = ko.observable(false);




//create new marker and invoke function (IIFE)
    this.createMarker = (function(){


              self.newMarker = new google.maps.Marker({
              position: self.location,
              title: self.title,
              map: map,
              optimized: false,
              icon: self.flagIcon,
              animation: google.maps.Animation.DROP,
            });

            $.ajax({

              url: "https://api.foursquare.com/v2/venues/search?query=" + self.title + "&ll=" + self.lat + "," + self.lng + "&client_id=MNKQWW4XDG2NNWXOJFIZYDPZU3FDMZJGYKN2GJPD4DJWBTX0&client_secret=I5SAHZ1YCC4ENSWKOQUWEGEDPOJYE2TN0ZYZM3AI5T4HEQWR&v=20171104&",
              dataType: "jsonp",
              type: "GET",

              success: function(data){

                 if(data){
                console.log("successful ajax GET");
                 console.log(data);

              //check for object prperties within the response data.
               newValue = data.response.hasOwnProperty("venues") ? data.response.venues[0] : '';

               self.newTitle = newValue.hasOwnProperty("name") ? newValue.name : '';

               self.newURL = newValue.hasOwnProperty("url") ? newValue.url : '';

               self.newPhone = newValue.contact.hasOwnProperty("formattedPhone") ? newValue.contact.formattedPhone : '';

              //string of HTML for the info window
                self.contentString = "<p><strong>" + self.newTitle + "<hr>" + "</strong></p>"+ "<br>" + "<a id='venue-website' href='" + self.newURL + "'>" + self.newURL + "</a>" + "<hr>" + "<p>" + self.newPhone + "</p>" ;
                console.log(self.contentString);
              }
            },

              error: function(e){
                 console.log("error in ajax call to foursquare");
                 jQuery("#foursquare-API-error").html("<h3> An error has occured when retrieving data. Please try refreshing page.</h3>");
                infowindow.setContent('<p>No FourSquare data available</p>');
            },

             always: function(data){

             infowindow.setContent("<p>" + self.contentString + "</p>");
             }

          });



      })();


//Set up the info window and get foursquare data via ajax call.

      this.getContent = function() {

        map.setCenter(self.location);

  //function to open, set location, and get content of info window
  function getInfoWindow() {

      infowindow.setPosition(self.location);

    infowindow.open(map);

    infowindow.setContent("<p>" + self.contentString + "</p>");
//'<div class="infoWindow"><p id="venueTitle"></p><br><p class="venueURL"></p><br><p class="venueTips"></p></div>'
};

  getInfoWindow();
  self.toggleBounce();


  };


//function to set marker animation
      this.toggleBounce = function(){
        if(self.newMarker.getAnimation() !=null) {
          self.newMarker.setAnimation(null);
        } else {
          self.newMarker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ self.newMarker.setAnimation(null);}, 2000);
        }
      };


//Listeners to set animation and get the foursquare data when marker is clicked.
      google.maps.event.addListener(self.newMarker, "click", self.toggleBounce );
      google.maps.event.addListener(self.newMarker, "click", self.getContent );


      this.activeMarker = function(){
        getInfoWindow();
        self.toggleBounce();
      }


};

//Octopus aka ViewModel

function myViewModel(){
    var self = this;

    locationList = ko.observableArray([]);

    activeMarker = ko.observable("");

    valueContent = ko.observable("");




    locations.forEach(function(info){
      locationList.push(new Marker(info))
    });



    this.searchWord = ko.observable("");


//knockout function to filter list times during a search.
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

        });


    });
};



//view
//set knockout bindings

function initApp() {
  ko.applyBindings(new myViewModel());
};



//initiate Google Map
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
