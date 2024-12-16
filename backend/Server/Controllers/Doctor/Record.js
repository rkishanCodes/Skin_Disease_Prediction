import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const record = async (req, res) => {
    const { doctorId, diseaseId, prescription } = req.body;

    try {
      const record = await prisma.record.create({
        data: {
          doctorId,
          diseaseId,
          prescription,
        },
      });
      res.status(201).json({ message: 'Prescription added successfully', record });
    } catch (error) {
      res.status(400).json({ error: 'Failed to add prescription' });
    }
}

export default record