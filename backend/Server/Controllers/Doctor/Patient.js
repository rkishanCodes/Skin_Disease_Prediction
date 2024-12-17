import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get All Patients and Their Diseases
export const getAllPatients = async (req, res) => {
  try {
    const patients = await prisma.patient.findMany({
      include: {
        diseases: true,
      },
    });

    res.json({ patients });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching patients" });
  }
};

