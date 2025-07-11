import React from 'react';
const getAngle = (a, b, c) => {
    const ab = { x: b.x - a.x, y: b.y - a.y };
    const cb = { x: b.x - c.x, y: b.y - c.y };

    const dot = ab.x * cb.x + ab.y * cb.y;
    const magAB = Math.sqrt(ab.x ** 2 + ab.y ** 2);
    const magCB = Math.sqrt(cb.x ** 2 + cb.y ** 2);

    const cosineAngle = dot / (magAB * magCB);
    const angle = Math.acos(cosineAngle);
    return Math.round((angle * 180) / Math.PI); // Convert radians to degrees
};

const AnglesDisplay = ({ keypoints }) => {
    if (!keypoints || keypoints.length === 0) return null;

    const leftShoulder = keypoints[5];
    const leftElbow = keypoints[7];
    const leftWrist = keypoints[9];

    const rightShoulder = keypoints[6];
    const rightElbow = keypoints[8];
    const rightWrist = keypoints[10];

    const leftHip = keypoints[11];
    const leftKnee = keypoints[13];
    const leftAnkle = keypoints[15];

    const rightHip = keypoints[12];
    const rightKnee = keypoints[14];
    const rightAnkle = keypoints[16];

    const angles = [
        { label: 'Left Elbow', value: getAngle(leftShoulder, leftElbow, leftWrist) },
        { label: 'Right Elbow', value: getAngle(rightShoulder, rightElbow, rightWrist) },
        { label: 'Left Knee', value: getAngle(leftHip, leftKnee, leftAnkle) },
        { label: 'Right Knee', value: getAngle(rightHip, rightKnee, rightAnkle) },
        { label: 'Left Shoulder', value: getAngle(leftElbow, leftShoulder, leftHip) },
        { label: 'Right Shoulder', value: getAngle(rightElbow, rightShoulder, rightHip) },
        { label: 'Left Hip', value: getAngle(leftShoulder, leftHip, leftKnee) },
        { label: 'Right Hip', value: getAngle(rightShoulder, rightHip, rightKnee) }
    ];

    return (
        <div className="angles-display" style={{ marginLeft: '20px' }}>
            <h3>Joint Angles (in °)</h3>
            <ul>
                {angles.map((angle, index) => (
                    <li key={index}>
                        {angle.label}: {angle.value}°
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnglesDisplay;
