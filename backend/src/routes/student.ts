import { Router, Request, Response } from "express";
import { db } from "../firebaseAdmin";
import admin from "firebase-admin";


const router = Router();

router.get("/myLessons", async (req: Request, res: Response) => {
  try {
    const { phone } = req.query;

    if (!phone || typeof phone !== "string") {
      return res.status(400).json({ message: "Phone is required" });
    }

    const userRef = db.collection("users").doc(phone);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "Student not found" });
    }

    const lessonsSnap = await userRef.collection("lessons").get();
    const lessons = lessonsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({
      phone,
      lessons,
    });
  } catch (error: any) {
    console.error("Error fetching lessons:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});


router.post("/markLessonDone", async (req: Request, res: Response) => {
  try {
    const { phone, lessonId } = req.body;

    if (!phone || !lessonId) {
      return res.status(400).json({ message: "Phone and lessonId are required" });
    }

    const lessonRef = db
      .collection("users")
      .doc(phone)
      .collection("lessons")
      .doc(lessonId);

    const lessonDoc = await lessonRef.get();
    if (!lessonDoc.exists) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    await lessonRef.update({
      completed: true,
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "Lesson marked as completed" });
  } catch (error: any) {
    console.error("Error marking lesson done:", error);
    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

router.put("/editProfile", async (req: Request, res: Response) => {
  try {
    const { phone, name, email } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone is required" });
    }

    const userRef = db.collection("users").doc(phone);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: "Student not found" });
    }

    const updatedData: Record<string, any> = {};
    if (name) updatedData.name = name;
    if (email) updatedData.email = email;

    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ message: "No data provided to update" });
    }

    await userRef.update({
      ...updatedData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({ message: "Profile updated successfully", updatedData });
  } catch (error: any) {
    console.error("Error editing profile:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


export default router;
