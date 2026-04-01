import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ VERY IMPORTANT (SERVE FRONTEND FILES)
app.use(express.static(path.resolve()));

// 🔥 API
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/ai-places", async (req, res) => {
  const { place } = req.body;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "user",
          content: `Suggest 5 tourist places in ${place}`
        }
      ]
    });

    res.json({
      result: response.choices[0].message.content
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DEFAULT ROUTE (LOAD HTML)
app.get("/", (req, res) => {
  res.sendFile(path.resolve("index.html"));
});

app.listen(5000, () => console.log("Server running on port 5000"));