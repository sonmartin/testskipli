import { Router } from "express";
import { db } from "../firebaseAdmin";

const router = Router();

router.get("/messages/:roomId", async (req, res) => {
  try {
    const { roomId } = req.params;
    const limit = Number(req.query.limit) || 100;

    if (!roomId) return res.status(400).json({ message: "roomId required" });

    const snap = await db
      .collection("chats")
      .doc(roomId)
      .collection("messages")
      .orderBy("createdAt", "asc")
      .limit(limit)
      .get();

    const messages = snap.docs.map((d) => {
      const data = d.data();
      const createdAt = data.createdAt && data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt || null;
      return { id: d.id, ...data, createdAt };
    });

    return res.json({ roomId, messages });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
});

export default router;
