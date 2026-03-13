# 🚀 LiveLens

### Real-Time Photo Sharing & Emoji Reaction System 📸⚡

![GitHub Repo stars](https://img.shields.io/github/stars/himangshukamila/LiveLens?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/himangshukamila/LiveLens?style=for-the-badge)
![GitHub issues](https://img.shields.io/github/issues/himangshukamila/LiveLens?style=for-the-badge)
![License](https://img.shields.io/github/license/himangshukamila/LiveLens?style=for-the-badge)
![Node](https://img.shields.io/badge/Node.js-18+-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge)
![Socket.io](https://img.shields.io/badge/Socket.io-Realtime-black?style=for-the-badge)

---

# 🌟 Overview

**LiveLens** is a **real-time photo sharing system** where one device captures an image and another device instantly receives it.

Users can also send **emoji reactions in real time**, which appear immediately on the receiving screen.

This project demonstrates:

* 📸 Real-time photo transmission
* ⚡ WebSocket communication
* 😀 Live emoji reactions
* 🌐 Multi-device interaction

---

# 🎯 How It Works

The system contains **two devices and one server**.

### 📱 Device 1 — Camera Device

* Captures a photo using the camera
* Sends the photo to the backend server
* Sends emoji reactions

### 🖥 Device 2 — Display Device

* Receives the image instantly
* Displays the photo
* Shows emoji reactions live

### 🧠 Backend Server

* Handles real-time communication
* Transfers images between devices
* Broadcasts emoji reactions using WebSockets

---

# 🏗 Project Structure

```
LiveLens
│
├── camera
│   Device 1
│   Capture photo and send emoji reactions
│
├── imagePreview
│   Device 2
│   Receive and display images and reactions
│
├── backend
│   Node.js + Express + Socket.io server
│
└── README.md
```

---

# ⚙️ Tech Stack

### Frontend

* React
* HTML5 Camera API
* Socket.io Client

### Backend

* Node.js
* Express.js
* Socket.io

### Communication

* WebSockets (real-time)

---

# 🚀 Installation & Setup

## 1️⃣ Clone the Repository

```
git clone https://github.com/himangshukamila/LiveLens.git
```

```
cd LiveLens
```

---

# 🖥 Backend Setup

Go to the backend folder:

```
cd backend
```

Install dependencies:

```
npm install
```

Start the server:

```
node server.js
```

Server runs on:

```
http://localhost:5000
```

---

# 📱 Device 1 Setup (Camera)

Open another terminal:

```
cd camera
```

Install dependencies:

```
npm install
```

Start the app:

```
npm run dev
```

---

# 🖥 Device 2 Setup (Image Preview)

Open another terminal:

```
cd imagePreview
```

Install dependencies:

```
npm install
```

Start the app:

```
npm run dev
```

---

# 🌐 Running on Multiple Devices

To run across devices on the same network:

1. Find your local IP address

```
ipconfig
```

Example:

```
192.168.0.194
```

2. Update the socket connection URL in frontend:

```
http://192.168.0.194:5000
```

3. Open Device 1 and Device 2 in different devices or browsers.

---

# 🎮 How to Use

### Step 1

Device 1 opens the **camera page**.

### Step 2

User captures a photo.

### Step 3

Photo is sent to the backend server.

### Step 4

Device 2 instantly receives and displays the image.

### Step 5

Device 1 clicks emoji reactions.

### Step 6

Emoji appears in **real time on Device 2**.

---

# 📸 Demo Flow

```
Device 1
Capture Image 📸
     ↓
Send to Server ⚡
     ↓
Device 2 Displays Image 🖥
     ↓
Emoji Reaction 😀🔥❤️
     ↓
Appears Instantly
```

---

# ✨ Features

✔ Real-time image sharing
✔ Live emoji reactions
✔ Multi-device support
✔ WebSocket communication
✔ Lightweight architecture

---

# 📈 Future Improvements

* 🎥 Live camera streaming
* 👥 Multi-user rooms
* 🔔 Notification system
* ☁ Cloud image storage
* 📱 Mobile PWA support

---

# 🤝 Contributing

Pull requests are welcome!

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

# 📜 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Anshh Kumar**

GitHub
https://github.com/himangshukamila

---

⭐ If you like this project, consider **starring the repository!**
