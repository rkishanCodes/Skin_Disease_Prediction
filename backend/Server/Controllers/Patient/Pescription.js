import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const prescription = async (req, res) => {
  const { patientId } = req.params; // Get patientId from route parameters

  try {
    // Fetch prescriptions for the patient
    const prescriptions = await prisma.record.findMany({
      where: {
        patientId: Number(patientId), // Ensure patientId is converted to a number
      },
      include: {
        patient: true,  // Include patient details
        doctor: true,   // Include doctor details
      },
    });

    if (prescriptions.length === 0) {
      return res.status(404).json({ message: "No prescriptions found for this patient." });
    }

    res.status(200).json({ prescriptions });
  } catch (err) {
    console.error("Error fetching prescriptions:", err);
    res.status(500).json({ error: "An error occurred while fetching prescriptions." });
  }
};

export default prescription;
