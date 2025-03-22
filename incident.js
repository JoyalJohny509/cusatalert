function sendWhatsAppAlert() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const incidentType = document.getElementById("incident-type").value;
            const details = document.getElementById("incident-details").value.trim();

            let message = `🚨 URGENT! Incident: ${incidentType}\n`;
            if (details) message += `Details: ${details}\n`;
            message += `Location: https://www.google.com/maps?q=${userLat},${userLng}`;

            window.open(`https://wa.me/919400572094?text=${encodeURIComponent(message)}`, "_blank");
        });
    }
}
