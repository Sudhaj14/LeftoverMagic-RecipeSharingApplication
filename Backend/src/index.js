const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { userRouter } = require("./routes/user");
const { recipesRouter } = require("./routes/recipes");

const app = express();

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend.vercel.app'],
}));


app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

mongoose.connect("mongodb+srv://sudha_j:sudha%40123@cluster0.6rphf5t.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log("Connected to MongoDB 🚀"))
  .catch((err) => console.error("MongoDB Connection Error ❌:", err));


app.listen(3001, () => console.log("Server started"));