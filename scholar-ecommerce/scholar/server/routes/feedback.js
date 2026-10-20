import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const feedbackPath = path.join(__dirname, "..", "data", "feedback.json");

const router = Router();

async function loadFeedback() {
  try {
    const raw = await readFile(feedbackPath, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveFeedback(entries) {
  await writeFile(feedbackPath, JSON.stringify(entries, null, 2));
}

// POST /api/feedback  { name, email, rating, message }
router.post("/", async (req, res) => {
  try {
    const { name, email, rating, message } = req.body;

    if (!name || !message) {
      return res.status(400).json({ error: "Name and feedback message are required" });
    }

    const entry = {
      id: nanoid(10),
      name,
      email: email || null,
      rating: Number(rating) || null,
      message,
      createdAt: new Date().toISOString(),
    };

    const entries = await loadFeedback();
    entries.push(entry);
    await saveFeedback(entries);

    res.json({ feedback: entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save feedback" });
  }
});

// GET /api/feedback  (simple listing, e.g. for an admin view later)
router.get("/", async (req, res) => {
  const entries = await loadFeedback();
  res.json(entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

export default router;
