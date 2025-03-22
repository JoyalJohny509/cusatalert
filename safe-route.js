let userLat, userLng;
const API_KEY = "AIzaSyBBTq0DYEErpiQlfOcd5TLLxuyGYPfla-4";

document.addEventListener("DOMContentLoaded", function () {
    const map = L.map('map-container').setView([10.0468, 76.3287], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    navigator.geolocation.getCurrentPosition(position => {
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;
        L.marker([userLat, userLng]).addTo(map).bindPopup("You are here").openPopup();
    }, error => {
        console.error("Geolocation error:", error);
        alert("Failed to get location. Please enable location services.");
    });
});

function searchPlace() {
    const placeName = document.getElementById("destination").value;

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(placeName)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const destLat = data[0].lat;
                const destLng = data[0].lon;
                findSafeRoute(userLat, userLng, destLat, destLng);
            } else {
                alert("Destination not found.");
            }
        })
        .catch(error => console.error("Error fetching location:", error));
}

function findSafeRoute(startLat, startLng, endLat, endLng) {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${API_KEY}&start=${startLng},${startLat}&end=${endLng},${endLat}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.routes && data.routes.length > 0) {
                const route = data.routes[0].geometry;
                const coordinates = decodePolyline(route);
                drawRoute(coordinates);
            } else {
                alert("No route found. Try a different destination.");
            }
        })
        .catch(error => console.error("Error fetching route:", error));
}

function drawRoute(coords) {
    L.polyline(coords, { color: "blue" }).addTo(map);
}

function decodePolyline(polyline) {
    let points = [];
    let index = 0, lat = 0, lng = 0;

    while (index < polyline.length) {
        let shift = 0, result = 0;
        let byte;
        do {
            byte = polyline.charCodeAt(index++) - 63;
            result |= (byte & 0x1F) << shift;
            shift += 5;
        } while (byte >= 0x20);
        let deltaLat = (result & 1) ? ~(result >> 1) : (result >> 1);
        lat += deltaLat;

        shift = 0;
        result = 0;
        do {
            byte = polyline.charCodeAt(index++) - 63;
            result |= (byte & 0x1F) << shift;
            shift += 5;
        } while (byte >= 0x20);
        let deltaLng = (result & 1) ? ~(result >> 1) : (result >> 1);
        lng += deltaLng;

        points.push([lat / 1e5, lng / 1e5]);
    }
    return points;
}
