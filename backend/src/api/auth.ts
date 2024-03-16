import { Request, Response } from "express";
import { getDb } from "../lib/db";
import { ulid } from "ulid";
import bcrypt from "bcrypt";

export async function loginService(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Check if both email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Find the user by email
    const user = await (await getDb()).collection("users").findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = "token_" + ulid();
    await (await getDb()).collection("tokens").insertOne({
      token,
      userId: user.userId,
      createdAt: +new Date(),
      role: ["developer"],
    });
    res.status(200).json({
      message: "Login successful",
      user: { email: user.email, name: user.name, userId: user.userId },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function signupService(req: Request, res: Response) {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const existingUser = await (await getDb())
    .collection("users")
    .findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userId = "user_" + ulid();
  await (await getDb()).collection("users").insertOne({
    email,
    password: hashedPassword,
    createdAt: +new Date(),
    name,
    userId,
  });
  res.status(201).json({ message: "User registered successfully" });
}
