import express, { json } from "express"
import dotenv from "dotenv"
import cors from "cors"
import patient_router from "./Routes/Patient.js";
import doctor_router from "./Routes/Doctor.js";

dotenv.config()
const app = express();
app.use(cors())
app.use(json())
const port = process.env.PORT || 8000;

app.use("/api/v1/patinet/auth/",patient_router)
app.use("/api/v1/patient/",patient_router)
app.use("/api/v1/doctor/auth/",doctor_router)
app.use("/api/v1/doctor/",doctor_router)

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})