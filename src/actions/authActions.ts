"use server";

import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Session from "@/models/Session";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";

const secretKey = process.env.JWT_SECRET || "default_super_secret_key_change_me_in_prod";
const key = new TextEncoder().encode(secretKey);

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "Please fill all fields" };
  }

  try {
    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "User already exists with this email" };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    // Generate Database Session automatically on register
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    await Session.create({
      userId: newUser._id,
      sessionId,
      expiresAt,
    });

    // Create JWT containing the sessionId
    const token = await new SignJWT({ userId: newUser._id, sessionId, role: newUser.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(key);

    // Set HTTP-only Cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return { success: "Registration successful!" };
  } catch (error: any) {
    console.error("Register Error:", error);
    return { error: error.message || "Failed to register" };
  }
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Please enter email and password" };
  }

  try {
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return { error: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { error: "Invalid credentials" };
    }

    // Generate Database Session
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    await Session.create({
      userId: user._id,
      sessionId,
      expiresAt,
    });

    // Create JWT containing the sessionId
    const token = await new SignJWT({ userId: user._id, sessionId, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("24h")
      .sign(key);

    // Set HTTP-only Cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return { success: "Logged in successfully" };
  } catch (error: any) {
    console.error("Login Error:", error);
    return { error: "Failed to log in" };
  }
}

export async function logoutUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, key);
      if (payload.sessionId) {
        await connectDB();
        await Session.deleteOne({ sessionId: payload.sessionId });
      }
    } catch (e) {
      // Ignore token decode errors on logout
    }
  }

  cookieStore.delete("auth_token");
}

/**
 * Helper to verify that the session actually exists in MongoDB.
 * Call this in Server Components or Server Actions for absolute security.
 */
export async function verifySessionDB() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, key);
    if (!payload.sessionId) return false;

    await connectDB();
    const session = await Session.findOne({ sessionId: payload.sessionId });
    
    if (!session) return false;

    // Check if session is expired in DB manually just in case TTL index delayed
    if (session.expiresAt < new Date()) {
      await Session.deleteOne({ sessionId: payload.sessionId });
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
