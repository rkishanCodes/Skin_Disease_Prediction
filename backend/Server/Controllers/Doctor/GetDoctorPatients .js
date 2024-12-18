import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const getDoctorPatients = async (req, res) => {
  const { doctorId } = req.params;

  try {
    const patients = await prisma.patient.findMany({
      where: { doctorId: parseInt(doctorId) },
      include: { diseases: true },
    });

    res.status(200).json({ patients });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patients." });
  }
};
