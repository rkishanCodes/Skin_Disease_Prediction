import express from "express";
import { login, register } from "../Controllers/Doctor/Auth.js";
import record from "../Controllers/Doctor/Record.js";
import { getAllPatients } from "../Controllers/Doctor/Patient.js";

const doctor_router = express.Router()

doctor_router.post("/register",register)
doctor_router.post("/login",login)
doctor_router.post("/prescribe",record) //  /api/v1/doctor/
doctor_router.get("/patients",getAllPatients) //  /api/v1/doctor/

export default doctor_router