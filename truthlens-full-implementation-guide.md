# 🛡️ TruthLens — AI Video Authenticity Detector

## 🚀 Project Overview

TruthLens is an AI-powered web platform designed to detect whether a video is AI-generated (deepfake) or authentic. With the rapid rise of synthetic media, the system aims to reduce misinformation by providing automated video verification.

This hackathon implementation focuses on a modular and scalable microservice architecture using modern web technologies and deep learning.

---

# 🎯 Problem Statement

In recent years, AI-generated videos (deepfakes) have increased significantly across social media platforms. These videos can spread misinformation, manipulate public perception, and damage reputations.

Although governments recommend watermarking AI-generated content, most platforms still lack an automated detection mechanism. Common users cannot easily identify whether a video is real or AI-generated.

Therefore, there is a strong need for an intelligent and accessible AI video authenticity detection system.

---

# 💡 Proposed Solution

TruthLens provides a simple web-based pipeline where users can upload a video and instantly receive an authenticity assessment.

The system works by extracting frames from the uploaded video, analyzing facial and visual artifacts using a pretrained deep learning model, and returning a confidence score indicating whether the video is AI-generated or authentic.

TruthLens acts as an AI forensic layer for modern digital media.

---

# 🧩 System Architecture Overview

The platform follows a three-layer microservice architecture:

Frontend (HTML/CSS/JS)  
→ Node.js + Express API  
→ Python Flask AI Service  
→ EfficientNet Deepfake Model  

This modular approach ensures scalability, maintainability, and real-world deployability.

---

# 🚀 PART 1 — FRONTEND

## 🎯 Frontend Objective

The frontend provides a clean and user-friendly interface that allows users to upload videos and view detection results in real time.

---

## 🖥️ Frontend Responsibilities

The frontend layer is responsible for:

- Providing video upload interface  
- Sending video to backend API  
- Displaying detection results  
- Showing confidence percentage  
- Providing responsive user experience  

The frontend is intentionally kept lightweight to ensure fast loading and smooth user interaction.

---

## 🎨 Frontend Technology Stack

The frontend is built using:

- HTML for structure  
- CSS for styling  
- JavaScript for API communication  

This stack was chosen for simplicity, speed of development, and hackathon suitability.

---

## 🌐 Frontend Deployment Strategy

The frontend is deployed on a static hosting platform such as Vercel or Netlify.

This provides:

- Free hosting  
- Fast global CDN  
- Easy GitHub integration  
- Quick deployment  

For this project, Vercel is the recommended hosting platform.

---

# ⚙️ PART 2 — NODE.JS BACKEND

## 🎯 Backend Objective

The Node.js backend acts as the central API gateway between the frontend and the AI model service.

It manages incoming requests, handles file uploads, and forwards the video to the Python AI microservice.

---

## 🔧 Backend Responsibilities

The Node.js + Express layer handles:

- Receiving uploaded video files  
- Managing API routing  
- Handling CORS  
- Forwarding requests to Python AI service  
- Returning processed results to frontend  
- Basic error handling  

This layer ensures clean separation between UI and AI processing.

---

## 🧱 Why Node.js + Express

Node.js was selected because:

- Fast and lightweight  
- Excellent for API handling  
- Familiar full-stack ecosystem  
- Easy integration with frontend  
- Hackathon-friendly setup  

Express provides a minimal and efficient routing framework.

---

## ☁️ Backend Deployment Strategy

The Node.js backend is deployed using Render’s free web service tier.

Benefits include:

- Free hosting  
- Easy GitHub integration  
- Automatic builds  
- Suitable for Express APIs  

---

# 🤖 PART 3 — PYTHON AI SERVICE

## 🎯 AI Service Objective

The Python microservice performs the core deepfake detection logic.

It receives the video from the Node backend, processes the frames, runs the deep learning model, and returns a confidence score.

---

## 🧠 AI Service Responsibilities

The Python + Flask service handles:

- Video decoding  
- Frame extraction using OpenCV  
- Face region processing  
- Deepfake model inference  
- Confidence score calculation  
- Returning prediction response  

This service is isolated to allow independent scaling in the future.

---

## 🤖 Model Used

The system uses a pretrained EfficientNet-B0 based deepfake detection model.

### Why EfficientNet

- Lightweight architecture  
- Good accuracy for demo  
- Fast inference  
- Widely used in research  
- No training required initially  

This makes it ideal for hackathon prototyping.

---

## ☁️ AI Service Deployment

The Python AI service is deployed on Render or HuggingFace Spaces (free tier).

Recommended choice for simplicity: Render.

---

# 🔄 End-to-End Workflow

The complete system workflow is as follows:

1. User uploads video through frontend  
2. Frontend sends request to Node.js API  
3. Node.js receives and forwards video  
4. Python service extracts frames  
5. EfficientNet model analyzes frames  
6. Confidence score is computed  
7. Result returned to Node.js  
8. Node.js sends response to frontend  
9. Frontend displays final verdict  

---

# ⭐ Key Features

- Simple video upload interface  
- Automated AI detection  
- Confidence score output  
- Microservice architecture  
- Scalable design  
- Hackathon optimized  
- No database required for prototype  

---

# 🚫 Why No Database (Hackathon Decision)

For the hackathon version:

- Processing is real-time  
- No user authentication required  
- No history storage needed  
- Faster deployment  

However, database integration is planned for future versions.

---

# 🔮 Future Enhancements

Future versions of TruthLens may include:

- User authentication system  
- Detection history dashboard  
- MongoDB integration  
- Browser extension  
- Social media API integration  
- Real-time video monitoring  
- Mobile application  
- Government analytics dashboard  
- Custom model training for higher accuracy  

---

# ⚠️ Current Limitations

- Demo-level accuracy  
- Depends on visible face frames  
- Cold start delay on free hosting  
- Not fully real-time  
- Performance varies with video quality  

---

# 🏁 Conclusion

Deepfake content is a growing threat to digital trust. TruthLens provides an automated AI-powered verification pipeline that helps identify synthetic videos quickly and efficiently.

By combining modern web technologies with deep learning, the system establishes a scalable foundation for safer digital media ecosystems.

**🛡️ Trust in digital media starts with verification.**

---

# 🙏 Acknowledgement

Developed by  
**Rishi Aravindha & Team**  
Hackathon 2026

---

# 📬 Contact

Web Developer | AI Enthusiast  
Building secure and intelligent web solutions