require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB Atlas"))
    .catch(err => console.error("MongoDB connection error:", err));


// Root Route (Fix for "Cannot GET /")
app.get("/", (req, res) => {
    res.send("Welcome to the Registration API");
});

// Define User Schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true, maxlength: 50 },
    lastName: { type: String, required: true, maxlength: 50 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 8 },
    dateOfBirth: { type: Date, required: true }
});

const User = mongoose.model("User", userSchema);

// API Route for Registration
app.post("/register", async (req, res) => {
    const { firstName, lastName, email, password, dateOfBirth } = req.body;

    // Basic Validation
    if (!firstName || !lastName || !email || !password || !dateOfBirth) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const newUser = new User({ firstName, lastName, email, password, dateOfBirth });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error saving user" });
    }
});


app.get("/users", async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from MongoDB
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Error fetching users" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
