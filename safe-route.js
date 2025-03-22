let userLat, userLng;
let map;
const API_KEY = "AIzaSyBBTq0DYEErpiQlfOcd5TLLxuyGYPfla-4";

document.addEventListener("DOMContentLoaded", function () {
    map = new google.maps.Map(document.getElementById("map-container"), {
        center: { lat: 10.0468, lng: 76.3287 },
        zoom: 15,
    });

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

    // Ensure the map resizes properly when the window is resized
    window.addEventListener("resize", function () {
        google.maps.event.trigger(map, "resize");
    });
});
