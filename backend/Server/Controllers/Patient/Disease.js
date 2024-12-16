import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const disease = async (req, res) => {
  const { patientId, name, description } = req.body;

  try {
    const disease = await prisma.disease.create({
      data: {
        name,
        description,
        patientId,
      },
    });
    res.status(201).json({ message: "Disease added successfully", disease });
  } catch (error) {
    res.status(400).json({ error: "Failed to add disease" });
  }
};

export default disease;
