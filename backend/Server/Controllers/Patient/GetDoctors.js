import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getDoctor = async (req,res)=>{
    try {
        const doctor = await prisma.doctor.findMany({});
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
 
} 

export default getDoctor;