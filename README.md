# 🧘‍♀️ Personalized Yoga & Health Recommendation + Real-Time Posture Correction

![Python](https://img.shields.io/badge/Made%20with-Python-blue?style=for-the-badge&logo=python)
![OpenCV](https://img.shields.io/badge/Library-OpenCV-yellow?style=for-the-badge&logo=opencv)
![Transformers](https://img.shields.io/badge/NLP-Transformers-green?style=for-the-badge)
![Posture Detection](https://img.shields.io/badge/Posture-MoveNet%20Thunder-orange?style=for-the-badge)

---

## 📌 Abstract

> With rising misinformation around yoga and health online, many follow unsafe advice or attempt extreme postures, leading to injury or poor results.  
>  
> Our system offers:
-  Transformer-based health & yoga recommendations (F1 Score: **0.92**)
-  Real-time posture correction using MoveNet (Test Accuracy: **99.53%**)

It provides **personalized yoga suggestions** based on a user's job, condition, and goals, and delivers **audio-guided real-time correction**, ensuring safe, efficient practice.

---

## 🧭 UML Architecture

<img width="500" alt="UML Diagram" src="https://github.com/user-attachments/assets/f6b4f275-7ecf-4139-941e-2966266d9761" />

---

## 🧠 Recommendation System

### 🔍 Transformers Tested

<img width="852" alt="Transformers Results" src="https://github.com/user-attachments/assets/5eb92332-d5b0-4e52-b6f3-8a6f6ffc4d04" />

### 🗃️ Databases Evaluated

<img width="844" alt="Database Results" src="https://github.com/user-attachments/assets/3b3036a0-54fd-4d78-89a0-ac19b65ff042" />

### 🤖 Health Bot Interface

<img width="844" alt="image" src="https://github.com/user-attachments/assets/d42f29ba-094e-4f98-91dc-392153424350" />


### 💬 Sample Questions & Answers

| **Question**                         | **Answer**                                                                 |
|--------------------------------------|-----------------------------------------------------------------------------|
| What is the best way to sleep?       | Sleeping on your back or left side promotes spinal alignment and digestion. |
| Diet for better sleep                | Eat foods high in tryptophan like bananas, milk, yogurt, and oats.          |
| Tips for doctor to follow            | Hand sanitization reminder: sanitize regularly to prevent infections.       |
| Yogasanas to increase height         | Tadasana, Pashchimottanasana, Bhujangasana                                  |

### 🧘 Yoga Recommendation Screenshot

<img width="866" alt="Yoga Recommendation" src="https://github.com/user-attachments/assets/07d6c4c0-95d3-4d49-b93c-18619be5a7e3" />

---

## 🧍‍♂️ Posture Correction System

### ✅ Accuracy Metrics

<img width="865" alt="Correction Accuracy" src="https://github.com/user-attachments/assets/7a761dfe-6f91-4399-ba57-b9677102a61d" />

### 📸 Real-Time Correction Feedback

<img width="868" alt="Pose Correction 1" src="https://github.com/user-attachments/assets/6aac2a6f-0180-4f4d-8647-cf72973c54ae" />

<img width="881" alt="Pose Correction 2" src="https://github.com/user-attachments/assets/ee1ed0b6-cf93-469f-a62f-9e51ed8114cb" />

---

## ⚙️ Tech Stack

| **Category**                | **Tools / Libraries / Models**                                                                                                                                                                     |
|-----------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|  **Languages & Libraries** | Python, NumPy, Pandas, `re`, Pickle, Keras                                                                                                                                                         |
|  **NLP & Embeddings**     | [Sentence Transformers](https://www.sbert.net/), [intfloat/e5-base](https://huggingface.co/intfloat/e5-base) for contextual sentence embeddings                                                   |
|  **Classification**       | [facebook/bart-large-mnli](https://huggingface.co/facebook/bart-large-mnli) for zero-shot classification into categories like general health, yoga asanas, diet, or activity recommendations     |
|  **Semantic Search**      | [FAISS](https://github.com/facebookresearch/faiss) for efficient similarity search across vector representations                                                                                   |
|  **Deep Learning Models** | Custom-trained Keras model for personalized yoga pose recommendations and real-time posture correction                                                                                              |
|  **Pose Detection**       | [MoveNet Thunder](https://www.tensorflow.org/lite/models/pose_estimation/overview) for real-time human keypoint tracking                                                                           |


---

## 🚀 Future Enhancements

-  Integration with wearables (smartwatches, fitness bands)
-  Multilingual voice support
-  Progress tracking dashboard
-  Mental wellness and meditation recommendations

---

## 📄 License

This project is licensed under the MIT License.

---

