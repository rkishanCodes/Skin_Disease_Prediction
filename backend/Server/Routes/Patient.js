import express from 'express';
import { patient_login, patient_register } from '../Controllers/Patient/Auth.js';
import { disease } from '../Controllers/Patient/Disease.js';
import pescription from '../Controllers/Patient/Pescription.js';
import { verifyToken } from '../middlewares/verifyToken.js';
import { getUserDetails } from '../Controllers/getUserDetails.js';

const patient_router = express.Router()

patient_router.post("/register",patient_register);
patient_router.post("/login",patient_login)
patient_router.post("/disease",disease) // /api/v1/patient/
patient_router.get("/pescription/:patientId", pescription)

patient_router.get("/details", verifyToken, getUserDetails);


export default patient_router;