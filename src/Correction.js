import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef, useState, useEffect } from 'react';
import '@tensorflow/tfjs-backend-webgl';
import Webcam from 'react-webcam';

import { count } from './utils/music';
import Instructions from './Instructions';
import IntensityDropDown from './IntensityDropDown';
import { poseImages } from './utils/pose_images';
import { POINTS, keypointConnections } from './utils/data';
import { drawPoint, drawSegment } from './utils/helper';
import AnglesDisplay from './AnglesDisplay';
import PoseCorrectionFeedback from "./PoseCorrectionFeedback";

import './Instructions.css';
import './Yoga.css'
let skeletonColor = 'rgb(255,255,255)';
let poseList = ['Chair', 'Cobra', 'Dog', 'No_Pose', 'Shoulderstand', 'Traingle', 'Tree', 'Warrior', 'Arkana_Dhanurasana', 'Bharadwajasana', 'Dhanurasana', 'Pawanmukhtasana', 'viparita_virabhadrasana'];

let interval;
let flag = false;

function Yoga() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const [startingTime, setStartingTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [poseTime, setPoseTime] = useState(0);
  const [bestPerform, setBestPerform] = useState(0);
  const [isStartPose, setIsStartPose] = useState(false);
  const [detectedIntensity, setDetectedIntensity] = useState('');
  const [currentPose, setCurrentPose] = useState('Tree');
  const [currentIntensity, setCurrentIntensity] = useState('Medium');
  const [poseAngles, setPoseAngles] = useState({});


  useEffect(() => {
    const timeDiff = (currentTime - startingTime) / 1000;
    if (flag) setPoseTime(timeDiff);
    if (timeDiff > bestPerform) setBestPerform(timeDiff);
  }, [currentTime]);

  useEffect(() => {
    setCurrentTime(0);
    setPoseTime(0);
    setBestPerform(0);
  }, [currentPose]);

  const CLASS_NO = {
    Chair: 0, Cobra: 1, Dog: 2, No_Pose: 3, Shoulderstand: 4,
    Traingle: 5, Tree: 6, Warrior: 7, Arkana_Dhanurasana: 8,
    Bharadwajasana: 9, Dhanurasana: 10, Pawanmukhtasana: 11, viparita_virabhadrasana: 12
  };

  const get_center_point = (landmarks, left, right) => {
    const leftPoint = tf.gather(landmarks, left, 1);
    const rightPoint = tf.gather(landmarks, right, 1);
    return tf.add(tf.mul(leftPoint, 0.5), tf.mul(rightPoint, 0.5));
  };

  const get_pose_size = (landmarks, multiplier = 2.5) => {
    const hipsCenter = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    const shouldersCenter = get_center_point(landmarks, POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER);
    const torsoSize = tf.norm(tf.sub(shouldersCenter, hipsCenter));
    let poseCenter = tf.expandDims(hipsCenter, 1);
    poseCenter = tf.broadcastTo(poseCenter, [1, 17, 2]);
    const d = tf.gather(tf.sub(landmarks, poseCenter), 0, 0);
    const maxDist = tf.max(tf.norm(d, 'euclidean', 0));
    return tf.maximum(tf.mul(torsoSize, multiplier), maxDist);
  };

  const normalize_pose_landmarks = (landmarks) => {
    let center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP);
    center = tf.expandDims(center, 1);
    center = tf.broadcastTo(center, [1, 17, 2]);
    landmarks = tf.sub(landmarks, center);
    const poseSize = get_pose_size(landmarks);
    return tf.div(landmarks, poseSize);
  };

  const landmarks_to_embedding = (landmarks) => {
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0));
    return tf.reshape(landmarks, [1, 34]);
  };

  const calculateAngle = (a, b, c) => {
    const ab = [b.x - a.x, b.y - a.y];
    const cb = [b.x - c.x, b.y - c.y];
    const dot = ab[0] * cb[0] + ab[1] * cb[1];
    const magAB = Math.sqrt(ab[0] ** 2 + ab[1] ** 2);
    const magCB = Math.sqrt(cb[0] ** 2 + cb[1] ** 2);
    const angle = Math.acos(dot / (magAB * magCB));
    return (angle * 180.0) / Math.PI;
  };
  


  const classifyIntensity = (pose, keypoints) => {
    const getPoint = (name) => keypoints[POINTS[name]];

    const left_knee = calculateAngle(getPoint('LEFT_HIP'), getPoint('LEFT_KNEE'), getPoint('LEFT_ANKLE'));
    const right_knee = calculateAngle(getPoint('RIGHT_HIP'), getPoint('RIGHT_KNEE'), getPoint('RIGHT_ANKLE'));
    const left_hip = calculateAngle(getPoint('LEFT_SHOULDER'), getPoint('LEFT_HIP'), getPoint('LEFT_KNEE'));
    const right_hip = calculateAngle(getPoint('RIGHT_SHOULDER'), getPoint('RIGHT_HIP'), getPoint('RIGHT_KNEE'));
    const left_shoulder = calculateAngle(getPoint('LEFT_ELBOW'), getPoint('LEFT_SHOULDER'), getPoint('LEFT_HIP'));
    const right_shoulder = calculateAngle(getPoint('RIGHT_ELBOW'), getPoint('RIGHT_SHOULDER'), getPoint('RIGHT_HIP'));
    const spine = calculateAngle(getPoint('LEFT_SHOULDER'), getPoint('LEFT_HIP'), getPoint('LEFT_KNEE'));
    const rightElbow = calculateAngle(getPoint('RIGHT_WRIST'), getPoint('RIGHT_ELBOW'), getPoint('RIGHT_SHOULDER'));
    const leftElbow = calculateAngle(getPoint('LEFT_WRIST'), getPoint('LEFT_ELBOW'), getPoint('LEFT_SHOULDER'));

    setPoseAngles({
      leftElbow:leftElbow,
      rightElbow:rightElbow,
      leftShoulder: left_shoulder,
      rightShoulder: right_shoulder,
      leftKnee: left_knee,
      rightKnee: right_knee,
      leftHip: left_hip,
      rightHip: right_hip,
    });

    switch (pose.toLowerCase()) {
      case 'chair':
        if (left_knee <= 100 || right_knee <= 100) return 'High';
        else if (left_knee <= 120 || right_knee <= 120) return 'Medium';
        else return 'Low';

      case 'shoulderstand':
        if (Math.min(left_knee, right_knee) < 60) return 'High';
        else if (Math.min(left_knee, right_knee) < 90) return 'Medium';
        else return 'Low';

      case 'arkana_dhanurasana':
        if (Math.min(left_knee, right_knee) < 50) return 'Low';
        else if (Math.min(left_knee, right_knee) < 80) return 'Medium';
        else return 'High';

      case 'viparita_virabhadrasana':
        if (Math.min(left_hip, right_hip) < 90) return 'High';
        else if (Math.min(left_hip, right_hip) <= 105) return 'Medium';
        else return 'Low';

      case 'pawanmukhtasana':
        if (spine < 95 && left_knee < 100 && right_knee < 100) return 'High';
        else if (spine < 100 && (left_knee < 100 || right_knee < 100)) return 'Medium';
        else return 'Low';

      case 'dhanurasana':
        if (Math.max(left_hip, right_hip) > 140) return 'Low';
        else if (Math.max(left_hip, right_hip) >= 120) return 'Medium';
        else return 'High';

      case 'bharadwajasana':
        if (spine < 100) return 'High';
        else if (spine <= 120) return 'Medium';
        else return 'Low';

      case 'tree':
        if (Math.min(left_knee, right_knee) > 70) return 'Low';
        else if (Math.min(left_knee, right_knee) <= 50 && (left_shoulder < 90 || right_shoulder < 90)) return 'Medium';
        else if (Math.min(left_knee, right_knee) <= 50 && (left_shoulder >= 90 || right_shoulder >= 90)) return 'High';
        else return 'Medium';

      default:
        return 'Unknown';
    }
  };

  const runMovenet = async () => {
    await tf.setBackend('webgl');
    await tf.ready();
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
      modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
    });
    const poseClassifier = await tf.loadLayersModel('/model/model.json');
    const countAudio = new Audio(count);
    countAudio.loop = true;

    interval = setInterval(() => detectPose(detector, poseClassifier, countAudio), 100);
  };

  const detectPose = async (detector, poseClassifier, countAudio) => {
    if (webcamRef.current?.video?.readyState === 4) {
      const video = webcamRef.current.video;
      const pose = await detector.estimatePoses(video);
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      try {
        const keypoints = pose[0]?.keypoints || [];
        let notDetected = 0;

        const input = keypoints.map((keypoint) => {
          if (keypoint.score > 0.4 && keypoint.name !== 'left_eye' && keypoint.name !== 'right_eye') {
            drawPoint(ctx, keypoint.x, keypoint.y, 8, skeletonColor);
            const connections = keypointConnections[keypoint.name];
            connections?.forEach((connection) => {
              const conName = connection.toUpperCase();
              drawSegment(ctx, [keypoint.x, keypoint.y], [keypoints[POINTS[conName]]?.x, keypoints[POINTS[conName]]?.y], skeletonColor);
            });
          } else {
            notDetected += 1;
          }
          return [keypoint.x, keypoint.y];
        });

        if (notDetected > 4) {
          skeletonColor = 'rgb(255,255,255)';
          return;
        }

        const processedInput = landmarks_to_embedding(input);
        const classification = poseClassifier.predict(processedInput);
        classification.array().then((data) => {
          const classNo = CLASS_NO[currentPose];
          const confidence = data[0][classNo];
          const intensity = classifyIntensity(currentPose, keypoints);
          

          let threshold = intensity === 'High' ? 0.99 : intensity === 'Medium' ? 0.85 : 0.75;

          if (confidence > threshold) {
            if (!flag) {
              countAudio.play();
              setStartingTime(new Date().getTime());
              flag = true;
            }
            setCurrentTime(new Date().getTime());
            skeletonColor = 'rgb(0,255,0)';
            setDetectedIntensity(intensity);
          } else {
            flag = false;
            skeletonColor = 'rgb(255,255,255)';
            countAudio.pause();
            countAudio.currentTime = 0;
          }
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const startYoga = () => {
    setIsStartPose(true);
    runMovenet();
  };

  const stopPose = () => {
    setIsStartPose(false);
    clearInterval(interval);
  };

  return isStartPose ? (
    <div className="yoga-container">
      <div className="main-flex-wrapper">
        {/* Left - Canvas/Webcam */}
        <div className="canvas-wrapper">
          <Webcam ref={webcamRef} className="react-webcam" />
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            id="pose-canvas"
            style={{ width: '640px', height: '480px' }}
          />
        </div>
  
        {/* Right - Feedback & Info */}
        <div className="right-content">

  
          <div className="performance-container">
            <h4>Pose Time: {poseTime.toFixed(2)} s</h4>
            <h4>Best: {bestPerform.toFixed(2)} s</h4>
            <h4>Expected Intensity: {currentIntensity}</h4>
            <h4
              className="detected-intensity"
              style={{
                color:
                  detectedIntensity === 'High'
                    ? 'green'
                    : detectedIntensity === 'Medium'
                    ? 'orange'
                    : 'red',
              }}
            >
              Detected Intensity: {detectedIntensity}
              <PoseCorrectionFeedback
            poseName={currentPose}
            intensity={detectedIntensity}
            angles={poseAngles}
          />
            </h4>
  
            <div className="dropdown-group">
              <IntensityDropDown
                label="Select Expected Intensity"
                options={['Low', 'Medium', 'High']}
                selected={currentIntensity}
                onChange={(val) => setCurrentIntensity(val)}
              />
            </div>
          </div>
  
          <button onClick={stopPose} className="btn btn-stop">
            Stop
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="instructions-container">
      <Instructions currentPose={currentPose} />
  
      <div className="dropdown-group">
        <IntensityDropDown
          label="Choose Yoga Pose"
          options={poseList}
          selected={currentPose}
          onChange={(val) => setCurrentPose(val)}
        />
        <IntensityDropDown
          label="Select Expected Intensity"
          options={['Low', 'Medium', 'High']}
          selected={currentIntensity}
          onChange={(val) => setCurrentIntensity(val)}
        />
      </div>
  
      <button onClick={startYoga} className="btn btn-start">
        Start
      </button>
    </div>
  );
  
  
  
  
}


export default Yoga;
