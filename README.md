# 🐾 Wildlife Monitoring System (IoT + AI)

## 🌍 Problem We Address
Human–wildlife conflict and wildlife tracking are major challenges in forest borders, farms, and protected areas. Traditional monitoring is manual, slow, and reactive. Our system provides **real-time, automated wildlife detection and alerting**, helping authorities and communities respond faster and make data-driven decisions.

---

## 💡 What Our Product Does (In Simple Terms)
We deploy **smart camera devices (ESP32-CAM)** in forest or rural areas. When an animal moves:

1. The camera captures an image automatically  
2. AI identifies **which animal it is**  
3. The system stores the data and shows it live on a dashboard  
4. If the animal is dangerous or close to people, **alerts are sent instantly** via SMS/WhatsApp  

This creates an **early-warning and monitoring system** for wildlife activity.

---

## ⭐ Key Features

### 🎥 Smart Wildlife Detection
- Motion-based image capture using PIR sensors  
- Automatic image capture without human intervention  
- Works continuously for remote wildlife areas  

### 🤖 AI-Based Animal Recognition
- Uses **YOLO object detection model**  
- Detects **8 animal types**  
- Draws bounding boxes and labels on detected animals  

### 📊 Live Monitoring Dashboard
- Real-time detection updates  
- View recent images and detection history  
- Filter data by animal type, time, or location  

### 🗺️ GPS-Based Map Tracking
- Each device has a GPS location  
- Devices and detections displayed on an interactive map  
- Heatmaps show wildlife movement patterns  

### 🔔 Instant Alerts (Critical Safety Feature)
- SMS and WhatsApp alerts for dangerous animals  
- Proximity-based alerts near human locations  
- Helps prevent human–wildlife conflict  

### 👥 Multi-User System
- **Public Users:** Receive alerts and view nearby activity  
- **Rangers/Admins:** Manage devices, analyze detections  
- Secure login using JWT authentication  

### 🔐 Secure & Scalable Backend
- Token-based authentication  
- Role-based access control  
- Secure image upload and device communication  

---

## 🧠 Why This System Is Impactful
- ⏱️ Early warning instead of late response  
- 🌱 Protects both humans and wildlife  
- 📈 Enables data-driven conservation decisions  
- 🌍 Scalable for forests, villages, farms, and reserves  

---

## 🧰 Simple Tech Stack Overview

### 🔧 Hardware
- **ESP32-CAM** – Image capture device  
- **PIR Motion Sensor** – Detects movement  

### 🧠 Artificial Intelligence
- **YOLO (Object Detection)** – Identifies animals in images  
- Trained on wildlife datasets  

### 🖥️ Backend
- **Django + Django REST Framework** – API and server logic  
- **MySQL** – Database  
- **JWT Authentication** – Secure login  
- **Twilio API** – SMS & WhatsApp alerts  

### 🌐 Frontend
- **React** – Dashboard UI  
- **Tailwind CSS** – Responsive design  
- **Leaflet Maps** – GPS tracking  
- **Recharts** – Analytics and graphs  

---

## 🏗️ System Workflow

ESP32-CAM detects motion
↓
Image captured and sent to server
↓
AI model detects animal
↓
Data stored in database
↓
Dashboard updates in real time
↓
Alerts sent if required


---

## 🐾 Animals Detected
- 🐘 Elephant  
- 🐯 Tiger  
- 🦁 Lion  
- 🐆 Leopard  
- 🐗 Boar  
- 🐻 Bear  
- 🦬 Bison  
- 👨 Human  

---

## 📊 Dashboard Capabilities
- Live wildlife monitoring  
- Detection history & analytics  
- Map-based device tracking  
- Camera health monitoring  
- Alert management  

---

## 🚀 Use Cases
- Forest department surveillance  
- Village boundary safety systems  
- Wildlife conservation projects  
- Smart agriculture protection  
- Research and analytics  

---

## 🏁 Conclusion
This project combines **IoT, AI, and Full-Stack Web Technologies** into a real-world solution that:

- Solves a serious environmental and safety problem  
- Is scalable and deployable  
- Has strong social and conservation impact  

It is not just a prototype, but a **practical smart wildlife monitoring platform**.

---

## 🙌 Acknowledgments
YOLO • Django • React • Twilio • ESP32 Community  

---

📌 *Designed for real-world wildlife protection and human safety.*