import express from 'express';
import { patient_login, patient_register } from '../Controllers/Patient/Auth.js';
import disease from '../Controllers/Patient/Disease.js';

const patient_router = express.Router()

patient_router.post("/register",patient_register);
patient_router.post("/login",patient_login)
patient_router.post("/disease",disease)


export default patient_router;