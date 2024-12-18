import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const getDoctorStats = async (req, res) => {
    const { doctorId } = req.params;
  
    try {
      const consultedPatients = await prisma.patient.count({
        where: { doctorId: parseInt(doctorId) },
      });
  
      const pendingConsults = await prisma.patient.count({
        where: { doctorId: parseInt(doctorId), diseases: { none: {} } },
      });
  
      res.status(200).json({
        consultedPatients,
        pendingConsults,
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats." });
    }
  };
  