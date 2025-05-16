const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { recipesRouter } = require("./routes/recipes");

const app = express();

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', // local dev (Vite)
    'http://localhost:3000', // optional: React CRA
    'https://fabulous-druid-f92988.netlify.app' // Netlify deployed frontend
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // if you're using cookies/auth headers
}));

app.use(express.json());

app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

// MongoDB connection
mongoose.connect("mongodb+srv://sudha_j:sudha%40123@cluster0.6rphf5t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("Connected to MongoDB 🚀"))
  .catch((err) => console.error("MongoDB Connection Error ❌:", err));

app.listen(3001, () => console.log("Server started on port 3001"));
