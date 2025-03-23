let userLat, userLng;
let map, directionsService, directionsRenderer;
const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

document.addEventListener("DOMContentLoaded", function () {
    map = new google.maps.Map(document.getElementById("map-container"), {
        center: { lat: 10.0468, lng: 76.3287 },
        zoom: 15,
    });

    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();
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

// Function to find a route and apply safety filters
function searchPlace() {
    let destinationInput = document.getElementById("destination").value;
    if (!destinationInput) {
        alert("Please enter a destination.");
        return;
    }

    let placesService = new google.maps.places.PlacesService(map);
    let request = {
        query: destinationInput,
        fields: ["geometry"]
    };

    placesService.findPlaceFromQuery(request, function (results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            let destination = results[0].geometry.location;
            getSafeRoute(destination);
        } else {
            alert("Place not found. Try a different search.");
        }
    });
}

// Function to get a safe route
function getSafeRoute(destination) {
    let request = {
        origin: { lat: userLat, lng: userLng },
        destination: destination,
        travelMode: google.maps.TravelMode.WALKING,
        provideRouteAlternatives: true
    };

    directionsService.route(request, function (result, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            let safestRoute = selectSafestRoute(result.routes);
            directionsRenderer.setDirections({ routes: [safestRoute] });
        } else {
            alert("Could not find a route.");
        }
    });
}

// Function to select the safest route
function selectSafestRoute(routes) {
    let safetyScores = [];

    routes.forEach(route => {
        let score = calculateSafetyScore(route);
        safetyScores.push({ route, score });
    });

    safetyScores.sort((a, b) => b.score - a.score);
    return safetyScores[0].route; // Return the safest route
}

// Function to calculate safety score
function calculateSafetyScore(route) {
    let score = 0;

    // Check for proximity to police stations and hospitals
    let safetyLocations = ["police station", "hospital"];
    safetyLocations.forEach(location => {
        score += getNearbySafetyPoints(route, location);
    });

    // Avoid high-crime areas (Placeholder - Use actual crime data API if available)
    let highCrimeZones = [
        { lat: 10.0500, lng: 76.3250 }, // Example unsafe area
    ];
    route.legs[0].steps.forEach(step => {
        highCrimeZones.forEach(zone => {
            let distance = google.maps.geometry.spherical.computeDistanceBetween(
                step.start_location, new google.maps.LatLng(zone.lat, zone.lng)
            );
            if (distance < 200) { // Penalize routes that pass through unsafe areas
                score -= 5;
            }
        });
    });

    return score;
}

// Function to find safety points near a route
function getNearbySafetyPoints(route, placeType) {
    let count = 0;
    let placesService = new google.maps.places.PlacesService(map);

    route.legs[0].steps.forEach(step => {
        let request = {
            location: step.start_location,
            radius: 300, // Search within 300 meters
            type: [placeType]
        };

        placesService.nearbySearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                count += results.length;
            }
        });
    });

    return count;
}
