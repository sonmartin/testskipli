import { Router, Request, Response } from "express";
import { db } from "../firebaseAdmin";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
// import { sendSMS } from "../services/twilioService";

const router = Router();

const normalizePhone = (raw?: string) => (raw || "").trim();

const resolveRole = async (phone: string): Promise<"instructor" | "student"> => {
  const userDoc = await db.collection("users").doc(phone).get();
  if (!userDoc.exists) return "instructor";
  const data = userDoc.data() as { role?: string } | undefined;
  return data?.role === "student" ? "student" : "instructor";
};

const ensureUserExists = async (phone: string, role: "instructor" | "student") => {
  const ref = db.collection("users").doc(phone);
  const snap = await ref.get();
  if (!snap.exists && role === "instructor") {
    await ref.set({
      phone,
      role: "instructor",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  }
};

router.post("/createAccessCode", async (req: Request, res: Response) => {
  try {
    const phone = normalizePhone(req.body?.phone);
    if (!phone) return res.status(400).json({ message: "Phone is required" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    await db.collection("accessCodes").doc(phone).set({
      phone,
      code,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    });

    // await sendSMS(phone, `Your verification code is: ${code}`);

    const isDev = process.env.NODE_ENV !== "production" || process.env.DEBUG_RETURN_CODE === "true";
    return res.status(200).json({
      message: "Access code created",
      ...(isDev ? { code } : {}),
    });
  } catch (error: any) {
    console.error("Error creating access code:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

router.post("/validateAccessCode", async (req: Request, res: Response) => {
  try {
    const phone = normalizePhone(req.body?.phone);
    const codeInput: string | undefined = req.body?.code;

    if (!phone || !codeInput) {
      return res.status(400).json({ message: "Phone and code are required" });
    }

    const doc = await db.collection("accessCodes").doc(phone).get();
    if (!doc.exists) return res.status(404).json({ message: "No code found for this phone" });

    const data = doc.data() as {
      code: string;
      expiresAt?: admin.firestore.Timestamp | Date | { toDate?: () => Date };
    } | undefined;
    if (!data) return res.status(404).json({ message: "Invalid data" });

  
    let expiresAtDate: Date;
    const rawExpires: any = data.expiresAt;
    if (rawExpires?.toDate && typeof rawExpires.toDate === "function") {
      expiresAtDate = rawExpires.toDate();
    } else if (rawExpires instanceof Date) {
      expiresAtDate = rawExpires;
    } else {
      expiresAtDate = new Date(rawExpires);
    }

    const now = new Date();
    if (isNaN(expiresAtDate.getTime()) || now > expiresAtDate) {
      await db.collection("accessCodes").doc(phone).delete().catch(() => {});
      return res.status(400).json({ message: "Code expired" });
    }

  
    if (data.code !== codeInput) return res.status(400).json({ message: "Invalid code" });

  
    await db.collection("accessCodes").doc(phone).delete();


    const role = await resolveRole(phone);

 
    await ensureUserExists(phone, role);

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(
      { sub: phone, phone, role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Code verified successfully",
      token,
      role,  
      phone,
    });
  } catch (error: any) {
    console.error("Error verifying access code:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

export default router;
