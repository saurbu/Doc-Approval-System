import express from 'express'
import {
    getProfile,
    updateProfile,
    changePassword,
    submitDocument,
    myDocuments,
    documentStatus,
    myNotifications,
    markNotificationRead,
    markAllNotificationsRead
} from '../controller/employeeController.js'
import authMiddleware from "../middleware/authMiddleware.js"
import employeeMiddleware from "../middleware/employeeMiddleware.js"
import upload from "../middleware/upload.js"

const router = express.Router()

// every route here requires a valid logged-in employee/manager
router.use(authMiddleware, employeeMiddleware)

// profile
router.get("/profile", getProfile)
router.put("/profile", updateProfile)
router.put("/change-password", changePassword)

// documents
router.post("/documents", upload.single("file"), submitDocument)
router.get("/documents", myDocuments)
router.get("/documents/:id", documentStatus)

// notifications
router.get("/notifications", myNotifications)
router.patch("/notifications/:id/read", markNotificationRead)
router.patch("/notifications/read-all", markAllNotificationsRead)

export default router