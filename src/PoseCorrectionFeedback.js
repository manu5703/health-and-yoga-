import React, { useEffect } from "react";

const PoseCorrectionFeedback = ({ poseName, intensity, angles }) => {
  const getFeedback = (poseName, intensity, angles) => {
    const feedback = [];

    switch (poseName.toLowerCase()) {
      case "warrior":
        if (intensity === "Low") {
          if (angles.leftKnee < 90) feedback.push("Bend your left knee deeper for stronger stance.");
          if (angles.rightKnee < 90) feedback.push("Lower your right knee to increase engagement.");
          if (angles.leftElbow < 160) feedback.push("Straighten your left arm to increase stretch.");
          if (angles.rightElbow < 160) feedback.push("Raise and straighten your right arm for better posture.");
        } else if (intensity === "Medium") {
          feedback.push("Try to hold the posture a bit longer and engage your core.");
        } else if (intensity === "High") {
          feedback.push("Perfect Warrior Pose! Keep your breathing steady.");
        }
        break;

      case "tree":
        if (intensity === "Low") {
          feedback.push("Raise your knee higher")
        } else if (intensity === "Medium") {
          feedback.push("Engage your core for better balance. You're almost there!");
        } else if (intensity === "High") {
          feedback.push("Excellent balance and alignment in Tree Pose.");
        }
        break;

      case "chair":
        if (intensity === "Low") {
          if (angles.leftKnee < 90 || angles.rightKnee < 90)
            feedback.push("Sink your hips lower for better posture.");
          if (angles.leftShoulder < 70 || angles.rightShoulder < 70)
            feedback.push("Lift your arms higher to activate your shoulders.");
        } else if (intensity === "Medium") {
          feedback.push("Nice work! Keep your spine long and core engaged.");
        } else if (intensity === "High") {
          feedback.push("Great strength and posture in Chair Pose.");
        }
        break;

      case "triangle":
        if (intensity === "Low") {
          if (angles.leftHip < 30 || angles.rightHip < 30)
            feedback.push("Open up your hips more and elongate your side body.");
          if (angles.leftElbow < 160 || angles.rightElbow < 160)
            feedback.push("Straighten your arms to improve alignment.");
        } else if (intensity === "Medium") {
          feedback.push("Good stretch! Focus on reaching upward and downward evenly.");
        } else if (intensity === "High") {
          feedback.push("Excellent extension and alignment in Triangle Pose.");
        }
        break;

      case "cobra":
        if (intensity === "Low") {
          if (angles.leftElbow > 90 || angles.rightElbow > 90)
            feedback.push("Straighten your elbows to lift your chest higher.");
          if (angles.leftShoulder < 70 || angles.rightShoulder < 70)
            feedback.push("Roll your shoulders back and open your chest.");
        } else if (intensity === "Medium") {
          feedback.push("Nice backbend! Keep your shoulders away from ears.");
        } else if (intensity === "High") {
          feedback.push("Excellent chest opening and posture in Cobra Pose.");
        }
        break;

      default:
        feedback.push("Maintain alignment and focus on breathing.");
        break;
    }

    if (feedback.length === 0) {
      feedback.push("Posture looks great! Keep holding.");
    }

    return feedback;
  };

  const feedbackList = getFeedback(poseName, intensity, angles);

  // 🔊 Speak the feedback using Web Speech API
  useEffect(() => {
    const speakFeedback = () => {
      const utterance = new SpeechSynthesisUtterance(feedbackList.join(". "));
      utterance.rate = 1; // You can adjust speed (0.5 to 2)
      utterance.pitch = 1;
      utterance.volume = 1;
      speechSynthesis.cancel(); // Stop any previous speech
      speechSynthesis.speak(utterance);
    };

    speakFeedback();
  }, [feedbackList]);

  return (
    <div className="mt-4 p-4 bg-white rounded-xl shadow-md border border-gray-200 max-w-md text-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">🧘‍♀️ Pose Correction Feedback</h3>
      <ul className="list-disc list-inside space-y-1">
        {feedbackList.map((item, index) => (
          <li
            key={index}
            className={item.includes("Great") || item.includes("Excellent") ? "text-green-600" : "text-red-600"}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PoseCorrectionFeedback;
