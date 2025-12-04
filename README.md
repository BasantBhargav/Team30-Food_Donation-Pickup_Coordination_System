# Team30-Food_Donation-Pickup_Coordination_System
# 🍲 FoodConnect - Food Donation & Pickup Coordination System

A full-stack web application that connects food donors with volunteers to reduce food waste and help those in need.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Team](#-team)

---

## ✨ Features

### For Donors
- 📝 Post food donations with details (type, quantity, expiry time)
- 📷 Upload food photos
- 📍 Set pickup address
- 🔐 OTP-based verification for secure handover
- 📊 Track donation status (Available → Claimed → Completed)

### For Volunteers
- 🔍 Browse available donations nearby
- 🙋 Claim donations for pickup
- ✅ Verify pickup using OTP
- 📈 View pickup history

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, Vite, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas |
| **Authentication** | JWT (JSON Web Tokens) |

---

## 🚀 Installation

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/food-donation.git
cd food-donation
```

2. **Install Backend Dependencies**
```bash
cd server
npm install
```

3. **Configure Environment Variables**

Create `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://your-connection-string
JWT_SECRET=your-secret-key
```

4. **Install Frontend Dependencies**
```bash
cd ../client
npm install
```

5. **Run the Application**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

6. **Open Browser**
```
http://localhost:5173
```

---

## 📖 Usage

### Donor Flow
1. Register/Login as **Donor**
2. Fill donation form (Food Type, Quantity, Best Before, Address)
3. Upload food photo (optional)
4. Click **Request Pickup**
5. When volunteer claims, share the **OTP** with them
6. Volunteer verifies OTP → Donation completed!

### Volunteer Flow
1. Register/Login as **Volunteer**
2. Browse **Available** donations
3. Click **Claim** on a donation
4. Go to **My Claims** tab
5. Enter **4-digit OTP** from donor
6. Click **Verify** → Pickup confirmed!

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/user` | Get current user |

### Donations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/donations` | Get available donations |
| GET | `/api/donations/my` | Get donor's donations |
| GET | `/api/donations/claimed` | Get volunteer's claims |
| POST | `/api/donations` | Create donation |
| PUT | `/api/donations/:id/claim` | Claim donation |
| POST | `/api/donations/:id/verify` | Verify OTP |
| DELETE | `/api/donations/:id` | Delete donation |

---

## 📁 Project Structure

```
food-donation/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app
│   │   └── index.css       # Styles
│   └── package.json
│
├── server/                 # Express Backend
│   ├── config/             # DB configuration
│   ├── middleware/         # Auth middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── index.js            # Server entry
│   └── package.json
│
└── README.md
```

---

## 👥 Team

| Name | Role | Contribution |
|------|------|--------------|
| Member 1 | Frontend Lead | Login, UI/UX Design |
| Member 2 | Backend Lead | API, Database |
| Member 3 | Full Stack | Donor Dashboard |
| Member 4 | Full Stack | Volunteer Dashboard |

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

- Built for reducing food waste and helping communities
- Icons from Emoji
- UI inspiration from modern web design trends

---

**Made with ❤️ by Team FoodConnect**
