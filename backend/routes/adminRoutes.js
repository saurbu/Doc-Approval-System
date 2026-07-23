import express from 'express'
import {adminLogin, createEmployee, employeeLogin} from '../controller/adminController.js'
import authMiddleware from "../middleware/authMiddleware.js"
import adminMiddleware from "../middleware/adminMiddleware.js"

const router = express.Router()

router.post("/login", adminLogin)
router.post("/create-employee", authMiddleware, adminMiddleware, createEmployee)
router.post("/employee-login", employeeLogin)

export default router