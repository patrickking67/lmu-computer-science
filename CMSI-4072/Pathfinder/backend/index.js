require("dotenv").config();
const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' })); // Allow larger payloads for resume text
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "Backend is running!" });
});

// Verify Firebase Token Middleware
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: "Unauthorized: No token provided" });
  
  try {
    const decodedToken = await admin.auth().verifyIdToken(token.replace('Bearer ', ''));
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ error: "Invalid Token" });
  }
};

// Protected route example
app.get("/profile", verifyToken, (req, res) => {
  res.json({ message: "Welcome, " + req.user.email });
});

// User data endpoint
app.get("/api/user-data", verifyToken, async (req, res) => {
  try {
    const userRef = admin.firestore().collection('users').doc(req.user.uid);
    const userData = await userRef.get();
    
    if (!userData.exists) {
      return res.status(404).json({ error: "User data not found" });
    }
    
    res.json(userData.data());
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).json({ error: "Failed to fetch user data" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));