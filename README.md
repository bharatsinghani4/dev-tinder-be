# Dev Tinder Backend

RESTful and WebSocket API server for the Dev Tinder application, implementing user authentication, profiles, matchmaking, real-time chat, and payments.

## Table of Contents

- [Features](#features)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
- [Credits](#credits)  

## Features

### User Authentication & Profiles  
- **Signup/Login/Logout** endpoints with JWT stored in HTTP-only cookies  
- **Password hashing** with bcrypt and input validation (email, password strength)  
- **Profile management**: get, update, and delete user profile  
- **Middleware** to protect routes and validate JWT  

### Matchmaking & Networking  
- **Send Connection Request** API with compound index to prevent duplicates  
- **Review Requests**: accept, reject, or ignore incoming connection requests  
- **Connections Feed**: paginated feed of matched users using efficient Sets and population  
- **ConnectionRequest schema** enforcing valid statuses and preventing self-requests  

### Real-time Chat  
- **WebSocket server** with Socket.io  
- **Secret room ID** generation via SHA-256 hash of participant IDs  
- **Message persistence** in MongoDB with `Chat` model and nested message schema  
- **Authorization**: only friends (accepted connections) can exchange messages  

### Payments & Premium  
- **Razorpay integration** for premium subscription payments  
- **Payment creation** and webhook handling  
- **User premium status** update upon successful payment  

### Utilities & Configuration  
- **Environment variables** via dotenv  
- **CORS** support for Vite frontend (`http://localhost:5173`)  
- **Cookie-parser** for JWT handling  
- **Custom validation** utilities for request data  

## Tech Stack

- **Node.js** & **Express** 5.x  
- **MongoDB** & **Mongoose**  
- **Socket.io** 4.8.1  
- **JWT** (jsonwebtoken) for authentication  
- **bcrypt** for password hashing  
- **Razorpay** for payments  
- **validator** for input validation  
- **dotenv**, **cors**, **cookie-parser**

## Getting Started

1. **Clone the repository**

   ```
   git clone https://github.com/bharatsinghani4/dev-tinder-be.git
   cd dev-tinder-be
   ```

2. **Install dependencies**

   ```
   npm install
   ```

3. **Configure environment**

   Create a `.env` file in the project root with:
   ```
   PORT=4000
   MONGODB_URI=
   JWT_SECRET=
   RAZORPAY_KEY_ID=
   RAZORPAY_KEY_SECRET=
   ```

4. **Start the server**

   ```
   npm run dev
   ```

5. **Production**

   ```
   npm start
   ```

## Credits

Backend by **Bharat Singhani**, implementing secure authentication, matchmaking, real-time chat, and payment workflows for Dev Tinder.  
