import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();
export const register = async(req,res) =>{
    const {email,username,password} = req.body
    const hashedPassword = await bcrypt.hash(password,10);
    try {
        const doctor = await prisma.doctor.create({
          data: {
            email,
            password: hashedPassword,
            username
          },
        });
        res.status(201).json({ message: 'Doctor registered successfully', doctor });
      } catch (error) {
        res.status(400).json({ error: 'Email already exists or invalid data' });
      }
}

export const login = async(req,res) =>{
    const {email, password} = req.body;
    try {
        const doctor = await prisma.doctor.findUnique({ where: { email } });
        if (!doctor) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, doctor.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({id:doctor.id},process.env.JWT_SECRET_KEY,{expiresIn: "1h"})
        res.json({ message: 'Doctor logged in successfully',doctor_username:doctor.username, token});
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}