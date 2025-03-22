let userLat, userLng;
let map;
const API_KEY = "AIzaSyBBTq0DYEErpiQlfOcd5TLLxuyGYPfla-4";
const directionsService = new google.maps.DirectionsService();
const directionsRenderer = new google.maps.DirectionsRenderer();

document.addEventListener("DOMContentLoaded", function () {
    map = new google.maps.Map(document.getElementById("map-container"), {
        center: { lat: 10.0468, lng: 76.3287 },
        zoom: 15,
    });

    directionsRenderer.setMap(map);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;

            const userMarker = new google.maps.Marker({
                position: { lat: userLat, lng: userLng },
                map: map,
                title: "You are here",
            });

            map.setCenter({ lat: userLat, lng: userLng });
        }, error => {
            console.error("Geolocation error:", error);
            alert("Failed to get location. Please enable location services.");
        });
    }
});

function searchPlace() {
    const placeName = document.getElementById("destination").value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: placeName }, function (results, status) {
        if (status === "OK" && results[0]) {
            const destLat = results[0].geometry.location.lat();
            const destLng = results[0].geometry.location.lng();
            findSafeRoute(userLat, userLng, destLat, destLng);
        } else {
            alert("Destination not found.");
        }
    });
}

function findSafeRoute(startLat, startLng, endLat, endLng) {
    const request = {
        origin: { lat: startLat, lng: startLng },
        destination: { lat: endLat, lng: endLng },
        travelMode: google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
        } else {
            alert("No route found. Try a different destination.");
        }
    });
}
