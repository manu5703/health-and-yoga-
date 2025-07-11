import { useState } from "react";
import scheduleData from './schedule.json';

function YogaRecommender() {
    const [profession, setProfession] = useState("");
    const [health_condition, setHealthCondition] = useState("");
    const [fitness_goal, setGoal] = useState("");
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            const response = await fetch("http://localhost:5000/get-recommendations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ profession, health_condition, fitness_goal }),
            });
            const data = await response.json();
            const processed = Array.isArray(data.recommendations)
                ? data.recommendations
                : data.recommendations
                    ? data.recommendations.split('\n\n')
                    : [];
            setRecommendations(processed);
        } catch (error) {
            console.error("Error fetching recommendations:", error);
        } finally {
            setLoading(false);
        }
    };

    const sendNotifications = async () => {
        try {
            if (Notification.permission !== "granted") {
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    alert("Notifications are blocked.");
                    return;
                }
            }

            scheduleData.forEach((item, index) => {
                setTimeout(() => {
                    new Notification(`🧘 ${item.time}`, {
                        body: item.task,
                        icon: "https://cdn-icons-png.flaticon.com/512/2645/2645857.png",
                    });
                }, index * 10000);
            });
        } catch (error) {
            console.error("Error sending notifications:", error);
        }
    };

    const getAsanaImage = (asanaName) => {
        const formatted = asanaName.toLowerCase().replace(/\s+/g, "-");
        return `https://www.sarvyoga.com/wp-content/uploads/2020/02/${formatted}.jpg`; // You can replace this with your own image source
    };

    const getAsanaLink = (asanaName) => {
        const search = encodeURIComponent(asanaName);
        return `https://www.google.com/search?q=${search}+yoga+asana`;
    };

    return (
        <div style={{ padding: "30px 50px", maxWidth: "1200px", margin: "auto", fontFamily: "'Segoe UI', sans-serif" }}>
            <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#2e8b57" }}>🌿 Yoga Recommendation System</h1>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
                <input
                    type="text"
                    placeholder="Profession"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Health Condition"
                    value={health_condition}
                    onChange={(e) => setHealthCondition(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Fitness Goal"
                    value={fitness_goal}
                    onChange={(e) => setGoal(e.target.value)}
                    style={inputStyle}
                />
                <button onClick={fetchRecommendations} style={buttonStyle}>Get Recommendations</button>
                <button onClick={sendNotifications} style={buttonStyle}>Send Notifications</button>
            </div>

            <h2>Recommendations:</h2>
            {loading ? (
                <div className="spinner-container">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div>
                    {recommendations.map((item, index) => {
                        const lines = item.split('\n');
                        const asanaBlock = [];
                        const instBlock=[]
                        let currentAsana = [];
                        lines.forEach(line => {
                            if (line.startsWith("Asana: ")) {
                                if (currentAsana.length > 0) asanaBlock.push(currentAsana);
                                currentAsana = [line];
                            }
                            else if ((line.startsWith("Your Daily Wellness") )){
                                if (currentAsana.length > 0) asanaBlock.push(currentAsana);
                                currentAsana = [line];

                            }
                            else {
                                currentAsana.push(line);
                            }
                        });
                        if (currentAsana.length > 0) asanaBlock.push(currentAsana);
                        
                        return (
<div key={index} style={{ marginBottom: "20px" }}>
    {asanaBlock.map((block, i) => {
        const asanaLine = block.find(line => line.toLowerCase().startsWith("asana"));
        const asanaName = asanaLine
            ? asanaLine.replace(/asana[:\s]*/i, "").trim()
            : `Asana ${i + 1}`;
        const imageFileName = asanaName.toLowerCase().replace(/\s+/g, "") + ".jpg"; // e.g., bhujangasana.jpg
        const imageUrl = `/asana-images/${imageFileName}`;
            
        return (
            <div key={i} style={{ display: "flex", gap: "15px", border: "1px solid #ccc", borderRadius: "10px", padding: "15px", backgroundColor: "#f9f9f9", marginBottom: "10px", alignItems: "flex-start" }}>
                <img
                    src={imageUrl}
                    alt={asanaName}
                    style={{ width: "200px", height: "150px", objectFit: "cover", borderRadius: "8px" }}
                />
                <div style={{ flex: 1 }}>
                    {block.map((line, j) => (
                        <p
                            key={j}
                            style={{
                                fontSize: "16px",
                                lineHeight: "1.6",
                                fontWeight: line.startsWith("Asana:") ? "bold" : "normal",
                                color: line.startsWith("Asana:") ? "#2e8b57" : "#333"
                            }}
                        >
                            {line}
                        </p>
                    ))}
                </div>
            </div>
        );
    })}
</div>

                        );
                    })}
                </div>
            )}

        </div>
    );
}

// --- Styling Constants ---
const inputStyle = {
    padding: "10px 15px",
    border: "1.5px solid #ccc",
    borderRadius: "10px",
    flex: "1",
    minWidth: "200px"
};

const buttonStyle = {
    backgroundColor: "#2e8b57",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 20px",
    cursor: "pointer",
    fontWeight: "bold"
};

const asanaCardStyle = {
    Width: "1000px",
    backgroundColor: "#f4fdf6",
    border: "1.5px solid #cce5cc",
    borderRadius: "14px",
    padding: "15px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
};

const scheduleCardStyle = {
    padding: "12px 18px",
    backgroundColor: "#e7f6ff",
    border: "1px solid #a3d3f5",
    borderRadius: "10px",
    minWidth: "220px",
    fontSize: "15px",
    color: "#333"
};

export default YogaRecommender;
