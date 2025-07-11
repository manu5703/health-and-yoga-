import React from "react";

function Schedule() {
    const sendNotifications = async () => {
        try {
            // Request permission for browser notifications
            if (Notification.permission !== "granted") {
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    alert("Notifications are blocked.");
                    return;
                }
            }

            // Fetch schedule data from backend
            const response = await fetch("http://localhost:5000/schedule");
            const data = await response.json();
            const schedule = data.schedule;

            // Display notifications one by one with delay
            schedule.forEach((item, index) => {
                setTimeout(() => {
                    new Notification(`🧘 ${item[0]}`, {
                        body: item[1],
                        icon: "https://cdn-icons-png.flaticon.com/512/2645/2645857.png",
                    });
                }, index * 1000); // delay between each notification
            });

        } catch (error) {
            console.error("Error sending notifications:", error);
        }
    };

    return (
        <div>
            <h1>🧘 Wellness Schedule</h1>
            <p>Click the button below to receive your yoga schedule notifications.</p>
            <button onClick={sendNotifications}>🔔 Send Notifications</button>
        </div>
    );
}

export default Schedule;
