const publicKey = "BJ1fhSbUDgbhbv6j8HnKW-4ou9oZ7AwB0G7D4Yv4gWQNcOR0jiBpFLwlfjtxQ0jrKmJIGH2KaZezhi7ncRi51tE";
const backenURL = "https://push-notification-backend-020x.onrender.com";

const urlBase64ToUint8Array = base64String => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

const saveSubscription = async (subscription) => {
    const response = await fetch(`${backenURL}/save-subscription`, {
        method: 'post',
        headers: { 'Content-type': "application/json" },
        body: JSON.stringify(subscription)
    });
    return response.json();
}

self.addEventListener("activate", async (e) => {
    const subscription = await self.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey)
    });
    await saveSubscription(subscription);
})

self.addEventListener("push", (event) => {
    const data = event.data.json();  // Parse the JSON payload
    const { title, body, icon } = data;  // Extract title, body, and icon

    // Show the notification with the appropriate data
    event.waitUntil(
        self.registration.showNotification(title, {
            body: body,
            icon: icon,  // Path to the icon image
            // Optionally, you can add additional notification options here
            badge: '/assets/images/badge.png',  // Path to a badge (if needed)
            tag: 'push-notification',  // Optional: Adds a unique identifier for the notification
            actions: [
                {
                    action: 'open',
                    title: 'Open',
                },
                {
                    action: 'close',
                    title: 'Close',
                },
            ],
        })
    );
});

