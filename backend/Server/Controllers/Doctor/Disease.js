import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAllPatientsWithDiseases = async (req, res) => {
    try {
      const patients = await prisma.patient.findMany({
        where: { diseases: { some: {} } },
        include: { diseases: true },
      });
  
      res.status(200).json({ patients });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch patients with diseases." });
    }
  };
  