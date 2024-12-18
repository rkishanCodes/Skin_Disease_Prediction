import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const record = async (req, res) => {
  const { doctorId, patientId, diseaseId, prescription } = req.body; // Include diseaseId in the request body

  // Validate that the necessary fields are present
  if (!doctorId || !patientId || !diseaseId || !prescription) {
    return res.status(400).json({ error: "All fields (doctorId, patientId, diseaseId, prescription) are required" });
  }

  try {
    // Ensure that the doctor exists
    const doctorExists = await prisma.doctor.findUnique({ where: { id: doctorId } });
    if (!doctorExists) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Ensure that the patient exists and is associated with the specified disease
    const patientExists = await prisma.patient.findUnique({
      where: { id: patientId },
      include: { diseases: true }, 
    });

    if (!patientExists) {
      return res.status(404).json({ error: "Patient not found" });
    }

    const diseaseExists = patientExists.diseases.some((disease) => disease.id === diseaseId);
    if (!diseaseExists) {
      return res.status(404).json({ error: "Disease not found for this patient" });
    }

    const newRecord = await prisma.record.create({
      data: {
        doctorId,
        patientId,
        prescription,
        diseaseId, 
      },
    });

    await prisma.patient.update({
      where: { id: patientId },
      data: { consultationStatus: "COMPLETED" },
    });

    res.status(201).json({ message: "Prescription added successfully", record: newRecord });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Failed to add prescription" });
  }
};

export default record;
