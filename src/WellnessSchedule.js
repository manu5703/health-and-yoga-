// src/components/WellnessSchedule.jsx
import React, { useEffect, useState } from "react";

const WellnessSchedule = () => {
  const [schedule, setSchedule] = useState([]);

  // ✅ Optional: Text-to-Speech
  const speakTask = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };

  useEffect(() => {
    fetch("/wellness_schedule.json")
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data);
        // 🗣️ Optional: Speak the first task
        if (data.length > 0) {
          speakTask(`Your first task is: ${data[0].task}`);
        }
      })
      .catch((err) => console.error("Error loading schedule:", err));
  }, []);

  return (
    <div className="p-4 rounded-xl shadow-lg bg-white max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-center">🗓️ Daily Wellness Schedule</h2>
      {schedule.length === 0 ? (
        <p>Loading...</p>
      ) : (
        schedule.map((item, index) => (
          <div
            key={index}
            className="mb-2 text-lg cursor-pointer hover:text-blue-600"
            onClick={() => speakTask(`${item.time}, ${item.task}`)} // 🗣️ Click to speak
          >
            ⏰ <strong>{item.time}</strong> ➝ {item.task}
          </div>
        ))
      )}
    </div>
  );
};

export default WellnessSchedule;
