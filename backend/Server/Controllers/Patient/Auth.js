import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export const patient_register = async (req, res) => {
  const { email, password, username, age, gender } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const patient = await prisma.patient.create({
      data: {
        email,
        password: hashedPassword,
        username,
        age,
        gender,
      },
    });
    res
      .status(201)
      .json({ message: "Patient registered successfully", patient });
  } catch (error) {
    res.status(400).json({ error: "Email already exists or invalid data" });
  }
};

export const patient_login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const patient = await prisma.patient.findUnique({ where: { email } });
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    const isPasswordValid = await bcrypt.compare(password, patient.password);
    if (!isPasswordValid)
      return res.status(401).json({ error: "Invalid password" });

    const token = jwt.sign(
      { id: patient.id, role: "patient" },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );
    res.json({ message: "Login successful", patient_name:patient.username ,token });
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
};
