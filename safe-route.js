let userLat, userLng;
const API_KEY = "5b3ce3597851110001cf624837de18e6f33a451092e79a18e891b9ea";

document.addEventListener("DOMContentLoaded", function () {
    const map = L.map('map-container').setView([10.0468, 76.3287], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    navigator.geolocation.getCurrentPosition(position => {
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        L.marker([userLat, userLng]).addTo(map).bindPopup("You are here").openPopup();
    });
});

function searchPlace() {
    const placeName = document.getElementById("destination").value;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${placeName}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const destLat = data[0].lat;
                const destLng = data[0].lon;
                findSafeRoute(userLat, userLng, destLat, destLng);
            } else {
                alert("Destination not found.");
            }
        });
}

function findSafeRoute(startLat, startLng, endLat, endLng) {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${startLng},${startLat}&end=${endLng},${endLat}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const route = data.routes[0].geometry;
            const coordinates = decodePolyline(route);
            drawRoute(coordinates);
        });
}

function drawRoute(coords) {
    L.polyline(coords, { color: "blue" }).addTo(map);
}
