import express from 'express'
import {adminLogin, allEmployees, createEmployee, employeeLogin, idEmployee, searchEmployee, updateEmployee, updateEmployeeStatus} from '../controller/adminController.js'
import authMiddleware from "../middleware/authMiddleware.js"
import adminMiddleware from "../middleware/adminMiddleware.js"

const router = express.Router()

router.post("/login", adminLogin)
router.post("/create-employee", authMiddleware, adminMiddleware, createEmployee)
router.post("/employee-login", employeeLogin)
router.get("/employees", authMiddleware, adminMiddleware, allEmployees)
router.get("/employee/:empId", authMiddleware, adminMiddleware, idEmployee)
router.get("/employee/search/:name", authMiddleware, adminMiddleware, searchEmployee)
router.put("/employee/:empId", authMiddleware, adminMiddleware, updateEmployee)
router.patch("/employee/:empId/status", authMiddleware, adminMiddleware, updateEmployeeStatus)


export default router