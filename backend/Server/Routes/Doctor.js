import express from "express";
import { login, register } from "../Controllers/Doctor/Auth.js";
import record from "../Controllers/Doctor/Record.js";
import { getAllPatients } from "../Controllers/Doctor/Patient.js";
import { getDoctorPatients } from "../Controllers/Doctor/GetDoctorPatients .js";
import { getDoctorStats } from "../Controllers/Doctor/Stats.js";
import { getAllPatientsWithDiseases } from "../Controllers/Doctor/Disease.js";

const doctor_router = express.Router()

doctor_router.post("/register",register)
doctor_router.post("/login",login)
doctor_router.post("/prescribe",record) //  /api/v1/doctor/
doctor_router.get("/patients",getAllPatients) //  /api/v1/doctor/
doctor_router.get("/:doctorId/patients",getDoctorPatients) // /api/v1/doctor/
doctor_router.get("/:doctorId/stats",getDoctorStats) // /api/v1/doctor/
doctor_router.get("/patients/diseases",getAllPatientsWithDiseases) // /api/v1/doctor/

export default doctor_router