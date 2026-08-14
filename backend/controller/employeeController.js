import Employee from '../models/employee.js'
import Document from '../models/Document.js'
import Notification from '../models/Notification.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../config/cloudinary.js'

// ---------- PROFILE ----------

export const getProfile = async (req, res) => {
    try {
        const employee = await Employee.findById(req.user.id).select("-password")

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            })
        }

        res.status(200).json({
            success: true,
            employee
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { name, number, department } = req.body

        const employee = await Employee.findById(req.user.id)

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            })
        }

        // employees can only edit safe fields — not email, role, empId, isActive
        if (name) employee.name = name.trim()
        if (number) employee.number = number
        if (department) employee.department = department

        await employee.save()

        const { password, ...safeEmployee } = employee.toObject()

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            employee: safeEmployee
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current and new password are required"
            })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters"
            })
        }

        const employee = await Employee.findById(req.user.id)

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            })
        }

        const isMatch = await bcrypt.compare(currentPassword, employee.password)

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect"
            })
        }

        employee.password = await bcrypt.hash(newPassword, 12)
        await employee.save()

        res.status(200).json({
            success: true,
            message: "Password changed successfully"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// ---------- DOCUMENTS ----------

export const submitDocument = async (req, res) => {
    try {
        const { title, description, fileUrl, fileName } = req.body

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required"
            })
        }

        let finalFileUrl = fileUrl;
        let finalFileName = fileName;

        if (!finalFileUrl) {
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "File is required"
                })
            }

            // Try Cloudinary upload with local fallback
            try {
                const cloudResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: "doc-approval-system",
                    resource_type: "auto"
                });
                finalFileUrl = cloudResult.secure_url;
                
                // Clean up local temp file after successful Cloudinary upload (Production Best Practice)
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (cloudErr) {
                console.warn("Cloudinary upload failed, falling back to local server storage:", cloudErr.message);
                // Fallback to local server static URL
                finalFileUrl = `http://localhost:3000/uploads/${req.file.filename}`;
            }

            finalFileName = req.file.originalname;
        }

        const document = await Document.create({
            employee: req.user.id,
            title: title.trim(),
            description: description?.trim() || "",
            fileUrl: finalFileUrl,
            fileName: finalFileName || "uploaded_document"
        })

        res.status(201).json({
            success: true,
            message: "Document submitted successfully",
            document
        })
    } catch (err) {
        console.error("SUBMIT DOCUMENT ERROR DETAILS:", err);
        res.status(500).json({
            success: false,
            message: err.message || "Failed to upload document"
        })
    }
}

export const myDocuments = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 10
        const skip = (page - 1) * limit

        const filter = { employee: req.user.id }
        if (req.query.status) filter.status = req.query.status   // optional filter

        const totalDocuments = await Document.countDocuments(filter)
        const documents = await Document.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        res.status(200).json({
            success: true,
            count: documents.length,
            documents,
            currentPage: page,
            totalPages: Math.ceil(totalDocuments / limit),
            totalDocuments
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const documentStatus = async (req, res) => {
    try {
        const { id } = req.params

        const document = await Document.findOne({
            _id: id,
            employee: req.user.id       // ensures employees can't peek others' docs
        })

        if (!document) {
            return res.status(404).json({
                success: false,
                message: "Document not found"
            })
        }

        res.status(200).json({
            success: true,
            document
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

// ---------- NOTIFICATIONS ----------

export const myNotifications = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 15
        const skip = (page - 1) * limit

        const filter = { recipient: req.user.id }
        if (req.query.unreadOnly === "true") filter.isRead = false

        const totalNotifications = await Notification.countDocuments(filter)
        const notifications = await Notification.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)

        const unreadCount = await Notification.countDocuments({
            recipient: req.user.id,
            isRead: false
        })

        res.status(200).json({
            success: true,
            count: notifications.length,
            notifications,
            unreadCount,
            currentPage: page,
            totalPages: Math.ceil(totalNotifications / limit),
            totalNotifications
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params

        const notification = await Notification.findOneAndUpdate(
            { _id: id, recipient: req.user.id },
            { isRead: true },
            { new: true }
        )

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: "Notification not found"
            })
        }

        res.status(200).json({
            success: true,
            message: "Marked as read",
            notification
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const markAllNotificationsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { isRead: true }
        )

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}