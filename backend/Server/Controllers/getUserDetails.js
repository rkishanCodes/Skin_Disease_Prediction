import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserDetails = async (req, res) => {
  try {
    const { id, role } = req.user; // Extract decoded user details

    let user;

    // Fetch details based on the user's role
    if (role === "doctor") {
      user = await prisma.doctor.findUnique({ where: { id } });
    } else if (role === "patient") {
      user = await prisma.patient.findUnique({ where: { id } });
    } else {
      return res.status(400).json({ error: "Invalid role" });
    }

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove sensitive data (like password)
    const { password, ...userDetails } = user;

    res.status(200).json({ user: userDetails });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ error: "Server error" });
  }
};
