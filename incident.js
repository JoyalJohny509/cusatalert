function sendWhatsAppAlert() {
    const phoneNumber = document.getElementById("whatsapp-number").value.trim();
    if (!phoneNumber) {
        alert("Please enter a WhatsApp number.");
        return;
    }

    const incidentType = document.getElementById("incident-type").value;
    const details = document.getElementById("incident-details").value.trim();

    let message = `🚨 URGENT! Incident: ${incidentType}\n`;
    if (details) message += `Details: ${details}\n`;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                message += `Location: https://www.google.com/maps?q=${userLat},${userLng}`;
                sendWhatsAppMessage(phoneNumber, message);
            },
            error => {
                alert("Could not access location. Sending message without location.");
                sendWhatsAppMessage(phoneNumber, message);
            }
        );
    } else {
        sendWhatsAppMessage(phoneNumber, message);
    }
}

function sendWhatsAppMessage(phoneNumber, message) {
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
}
