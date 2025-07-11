import React from 'react';
import { poseInstructions } from './utils/data';
import { poseImages } from './utils/pose_images';

export default function Instructions({ currentPose }) {
  const currentInstructions = poseInstructions[currentPose];

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '16px',
        maxWidth: '1100px',
        margin: '20px auto',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <h2 style={{ marginBottom: '24px', textAlign: 'center' }}>
        Instructions for: {currentPose}
      </h2>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        {/* Instructions List */}
        <ul style={{ flex: 1, listStyle: 'disc', paddingLeft: '20px' }}>
          {Array.isArray(currentInstructions) && currentInstructions.length > 0 ? (
            currentInstructions.map((instruction, index) => (
              <li
                key={index}
                style={{
                  marginBottom: '10px',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#333',
                }}
              >
                {instruction}
              </li>
            ))
          ) : (
            <li style={{ color: '#888', fontStyle: 'italic' }}>
              No instructions available for this pose.
            </li>
          )}
        </ul>

        {/* Pose Image */}
        {poseImages[currentPose] && (
          <img
            src={poseImages[currentPose]}
            alt={`Pose for ${currentPose}`}
            style={{
              flex: '0 0 45%',
              borderRadius: '12px',
              maxHeight: '300px',
              objectFit: 'cover',
              width: '30%',
            }}
          />
        )}
      </div>
    </div>
  );
}
