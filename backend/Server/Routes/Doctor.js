import express from "express";
import { login, register } from "../Controllers/Doctor/Auth.js";
import record from "../Controllers/Doctor/Record.js";

const doctor_router = express.Router()

doctor_router.post("/register",register)
doctor_router.post("/login",login)
doctor_router.post("/prescribe",record)


export default doctor_router