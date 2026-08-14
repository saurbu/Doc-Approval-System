import express from 'express'
import dotenv from 'dotenv'
dotenv.config({ override: true })
import cors from "cors";


import connectDb from './config/db.js'
import seedAdmin from './utils/seedAdmin.js'
import adminRoutes from "./routes/adminRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js"
const app = express()
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/uploads", express.static("uploads"));
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("SERVER ERROR UNHANDLED:", err.stack || err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

connectDb()
    .then(async () => {
        await seedAdmin()

        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`server is running on port ${PORT}`);

        })
    })






