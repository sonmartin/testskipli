import { Router, Request, Response } from "express";
import { db } from "../firebaseAdmin";
import admin from "firebase-admin";

const router = Router();


router.post("/addStudent", async (req: Request, res: Response) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      return res.status(400).json({ message: "Name, phone, and email are required" });
    }

    const normalizedPhone = phone.trim();

    const userRef = db.collection("users").doc(normalizedPhone);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(400).json({ message: "Student already exists" });
    }

    await userRef.set({
      name,
      phone: normalizedPhone,
      email,
      role: "student",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      message: "Student added successfully",
      student: { name, phone: normalizedPhone, email, role: "student" },
    });
  } catch (error: any) {
    console.error("Error adding student:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;
