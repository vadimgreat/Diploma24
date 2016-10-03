/**
 * Created by Vadim on 02.10.2016.
 */
document.addEventListener("DOMContentLoaded", init);
var map;
var markers = [];
var mapBound1;
var mapBound2;
var mapBound3;
var mapBound4;
var aircratfArray = [];
var interval = 3000;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 50.2700, lng:  30.3124},
        zoom: 7
    });
}
function init() {
    /******************************
     * Data operations
     */
    initMap();
    google.maps.event.addListenerOnce(map, 'idle', function(){
        // do something only the first time the map is loaded
        mapBound1 = map.getBounds().b.b.toFixed(2);
        mapBound2 = map.getBounds().b.f.toFixed(2);
        mapBound3 = map.getBounds().f.b.toFixed(2);
        mapBound4 = map.getBounds().f.f.toFixed(2);


        var data;

        setInterval(function () {
            var xhr = new XMLHttpRequest();
            xhr.open('GET','https://data-live.flightradar24.com/zones/fcgi/feed.js?bounds='+mapBound3+','+mapBound4+','+mapBound1+','+mapBound2+'&faa=1&mlat=1&flarm=1&adsb=1&gnd=1&air=1&vehicles=1&estimated=1&maxage=7200&gliders=1&stats=1&ems=1',true);
            xhr.send();
            xhr.onload = function () {
                var dataFromFL = JSON.parse(xhr.responseText);
                data = dataFromFL;
                parseDataFromFR24(dataFromFL);
                deleteMarkers();
                displayAircraftOnMap(aircratfArray);
            }
        },interval);

    });
    function displayAircraftOnMap(arrayOfAircraft) {
        arrayOfAircraft.forEach(function (aircraft) {
            if (aircraft.latitude&&aircraft.longitude){
                var aircraftLatLng = {lat: aircraft.latitude, lng: aircraft.longitude};
                var icon = {
                    path: 'img/aircraft-icon.png',
                    scale: 1,
                    rotation: aircraft.track
                };
                var marker = new google.maps.Marker({
                    position: aircraftLatLng,
                    map: map,
                    title: aircraft.callsign,
                    icon: icon
                });
                markers.push(marker);
            }
        });
        aircratfArray = [];
    }

// Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    }

// Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
    }

// Shows any markers currently in the array.
    function showMarkers() {
        setMapOnAll(map);
    }

// Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
        clearMarkers();
        markers = [];
    }

    function parseDataFromFR24(response) {
        var response = response||{};
        for (aircraft in response){
            aircratfArray.push(new Aircraft(response[aircraft]));
        }
    }
    function Aircraft(params) {
        this.modeSCode = params[0];
        this.latitude = params[1];
        this.longitude = params[2];
        this.track = params[3];
        this.calibratedAltitude = params[4];
        this.groundSpeed = params[5];
        this.radar = params[7];
        this.type = params[8];
        this.registration = params[9];
        this.departure = params[11];
        this.destination = params[12];
        this.callsign = params[13];
        this.airlineCallsign = params[16];
    }
    /******************************
     * Data operations end
     */

    /**********************
     * Map operations
     */
    var key='AIzaSyBqxMIPWQXiADaDLA0o44Lh-WezsRTqyUE';

    /**********************
     * Map operations end
     */
}
/*
"b328e34":["50836B",50.3519,25.9182,268,38000,436,"4542","F-UMBB3","B738","UR-PSN",1475514591,"KBP","CDG","PS129",0,0,"AUI129",0]
 0 - mode S code
 1 - lat
 2 - long
 3 - track
 4 - calibrated altitude
 5 - ground speed
 6 -
 7 - radar
 8 - type
 9 - registration
10 -
11 - departure
12 - destination
13 - callsign
14 -
15
16 - airline callsign
17 -
*/


