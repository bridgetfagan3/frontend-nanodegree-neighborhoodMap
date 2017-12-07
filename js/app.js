//global variables

var map;
var markers = [];
var  venue = [{

      var self = this;

      self.title = ko.observable();
      self.url = ko.observable();
      self.tips = ko.observable();
  }];



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


//Add markers to the map.


var Marker = function(data){

    var self = this;

    this.icon = "http://www.crwflags.com/fotw/images/u/us-il-ch2.gif";

    this.flagIcon = {
      url: self.icon,
      size: new google.maps.Size(30,20),
      scaledSize: new google.maps.Size(30,20),
      origin: new google.maps.Point(0,0)

    };

    this.title = data.title;
    this.location = data.location;
    this.lat = data.location.lat;
    this.lng = data.location.lng;
    this.image = "<div class ='marker-image'></div>";
    this.activeClass = ko.observable(false);
    this.venue = venue;



//create new marker and invoke function
    this.createMarker = (function(){


              self.newMarker = new google.maps.Marker({
              position: self.location,
              title: self.title,
              map: map,
              optimized: false,
              icon: self.flagIcon,
              animation: google.maps.Animation.DROP,
            });


      })();

      self.getInfoWindow = function(){

      infowindow.open(map);

      infowindow.setPosition(self.location);
    };


      this.toggleBounce = function(){
        if(self.newMarker.getAnimation() !=null) {
          self.newMarker.setAnimation(null);
        } else {
          self.newMarker.setAnimation(google.maps.Animation.BOUNCE);
          setTimeout(function(){ self.newMarker.setAnimation(null);}, 2000);
        }
      };

      google.maps.event.addListener(self.newMarker, "click", self.toggleBounce );
      google.maps.event.addListener(self.newMarker, "click", self.getInfoWindow );


      this.getContent = (function(){

        /*
        var foursquareInitalURL = "https://api.foursquare.com/v2/venues/explore";
        var foursquareID = "?client_id=MNKQWW4XDG2NNWXOJFIZYDPZU3FDMZJGYKN2GJPD4DJWBTX0&client_secret=I5SAHZ1YCC4ENSWKOQUWEGEDPOJYE2TN0ZYZM3AI5T4HEQWR";
        var neighborhoodLL = "&ll=" + self.lat + "," + self.lng;
        var version = "&v=20171104";
        */
        var foursquareInitialURL = "https://api.foursquare.com/v2/venues/search?client_id=MNKQWW4XDG2NNWXOJFIZYDPZU3FDMZJGYKN2GJPD4DJWBTX0&client_secret=I5SAHZ1YCC4ENSWKOQUWEGEDPOJYE2TN0ZYZM3AI5T4HEQWR&v=20171104&ll=" + self.lat + "," + self.lng ;


        $.ajax({

          url: "https://api.foursquare.com/v2/venues/search?query=" + self.title + "&ll=" + self.lat + "," + self.lng + "&client_id=MNKQWW4XDG2NNWXOJFIZYDPZU3FDMZJGYKN2GJPD4DJWBTX0&client_secret=I5SAHZ1YCC4ENSWKOQUWEGEDPOJYE2TN0ZYZM3AI5T4HEQWR&v=20171104&",
          dataType: "jsonp",
          type: "GET",

          success: function(data){
            console.log("successful ajax GET");

           newValue = data.response.hasOwnProperty("venues") ? data.response.venues[0] : '';

           newTitle = data.response.hasOwnProperty("title") ? newVenue.title : '';

            newURL = data.response.hasOwnProperty("url") ? newVenue.url : '';

            newTips = data.response.hasOwnProperty("tips") ? newVenue.tips : '';
           console.log("hi");

        },

          error: function(e){
             console.log("error in ajax call to foursquare");
             jQuery("#foursquare-API-error").html("<h3> An error has occured when retrieving data. Please try refreshing page.</h3>");

            infowindow.setContent('<p>No FourSquare data available</p>');
        }

    });

  })();


      this.clickedMarker = function(){

        map.setCenter(self.location);





        activeMarker(this)

      };


};

//Octopus

function myViewModel(){
    var self = this;

    locationList = ko.observableArray([]);

    activeMarker = ko.observable("");


    locations.forEach(function(info){
      locationList.push(new Marker(info))
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

        });


    });
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
