import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "employee",
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    relatedDocument: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "document",
        default: null
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    }
}, {
    timestamps: true
})

notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 })

const notificationModel = mongoose.model("notification", notificationSchema)

export default notificationModel