function initAutocomplete() {
    const input = document.getElementById("destination");
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.setFields(["place_id", "geometry", "name"]);

    autocomplete.addListener("place_changed", function () {
        const place = autocomplete.getPlace();
        if (!place.place_id) {
            alert("No details available for this location.");
            return;
        }
        findSafeRouteUsingPlaceID(userLat, userLng, place.place_id);
    });
}

function findSafeRouteUsingPlaceID(startLat, startLng, placeId) {
    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    const request = {
        origin: { lat: startLat, lng: startLng },
        destination: { placeId: placeId }, // Using Google Maps Place ID instead of lat/lng
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

document.addEventListener("DOMContentLoaded", function () {
    initAutocomplete();
});
