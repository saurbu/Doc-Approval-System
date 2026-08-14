import mongoose from "mongoose"
import dns from "node:dns"

// Fix for Node.js DNS resolution with MongoDB Atlas SRV URIs on Windows
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first")
}

const connectDb = async () => {
    try {
        console.log("Connecting to MongoDB URI:", process.env.MONGO_URI ? process.env.MONGO_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : "UNDEFINED")
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected successfully")
    } catch (err) {
        console.error("Database connection error:", err.message)
        throw err
    }
}

export default connectDb