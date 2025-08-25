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

router.put("/editStudent/:phone", async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;
    const { name, email, role, newPhone } = req.body; 

    const userRef = db.collection("users").doc(phone);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "Student not found" });
    }

    const updateData: any = {
      ...(name && { name }),
      ...(email && { email }),
      ...(role && { role }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (newPhone && newPhone !== phone) {
      const newUserRef = db.collection("users").doc(newPhone);

      await newUserRef.set({
        ...userDoc.data(),
        ...updateData,
        phone: newPhone,
      });

      await userRef.delete();

      return res.status(200).json({
        message: "Student phone updated successfully",
        student: { phone: newPhone, name, email, role },
      });
    }

    await userRef.update(updateData);

    return res.status(200).json({
      message: "Student updated successfully",
      student: { phone, name, email, role },
    });
  } catch (error: any) {
    console.error("Error editing student:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});


router.delete("/deleteStudent/:phone", async (req: Request, res: Response) => {
  try {
    const { phone } = req.params;

    const userRef = db.collection("users").doc(phone);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "Student not found" });
    }

    await userRef.delete();

    return res.status(200).json({ message: "Student deleted successfully", phone });
  } catch (error: any) {
    console.error("Error deleting student:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.get("/students", async (req: Request, res: Response) => {
  try {
    const snapshot = await db.collection("users").get();

    if (snapshot.empty) {
      return res.status(200).json({ users: [] });
    }

    const users = snapshot.docs.map((doc) => ({
      phone: doc.id, 
      ...doc.data(),
    }));

    return res.status(200).json({ users });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});


router.post("/assignLesson", async (req: Request, res: Response) => {
  try {
    const { studentPhone, title, description } = req.body;

    if (!studentPhone || !title || !description) {
      return res
        .status(400)
        .json({ message: "studentPhone, title, and description are required" });
    }

    const studentRef = db.collection("users").doc(studentPhone);
    const studentDoc = await studentRef.get();

    if (!studentDoc.exists) {
      return res.status(404).json({ message: "Student not found" });
    }

    const lessonRef = await studentRef.collection("lessons").add({
      title,
      description,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      message: "Lesson assigned successfully",
      lessonId: lessonRef.id,
      data: { title, description },
    });
  } catch (error: any) {
    console.error("Error assigning lesson:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
});



export default router;
