import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const disease = async (req, res) => {
  const { patientId, doctorId, diseaseName, diseaseDescription } = req.body;

  try {
    const disease = await prisma.disease.create({
      data: {
        name: diseaseName,
        description: diseaseDescription,
        patient: { connect: { id: patientId } },
      },
    });

    await prisma.patient.update({
      where: { id: patientId },
      data: {
        doctorId: doctorId,
        consultationStatus: 'PENDING',
      },
    });

    res.status(200).json({ message: 'Consultation request submitted.', disease });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to submit consultation.' });
  }
};



