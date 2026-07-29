import mongoose from "mongoose";

const empSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email:{
        type:String,
        required: true,
        unique: true,
        lowercase: true, 
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum:["Employee", "Manager"],
        required: true,
    },
    number:{
        type: String,
        required:true
    },
    empId:{
        type: String,
        required:true,
        unique: true
    },
    department:{
        type: String,
        required:true
    },
    isActive: {
        type: Boolean,
        default: true
    }
},{
    timestamps:true
})

const empModel = mongoose.model("employee", empSchema)

export default empModel

// {
//     "name":"Saurav Sharma",
//     "email":"Saurav@gmail.com",
//     "password":"Saurav@123",
//     "role":"Employee",
//     "number":"9876543219",
//     "empId":"EMP-1001",
//     "department":"MERN"
// }

// {
//     "name":"Sharma Saurav",
//     "email":"Sharma@gmail.com",
//     "password":"Saurav@123",
//     "role":"Manager",
//     "number":"9876543218",
//     "empId":"EMP-1002",
//     "department":"WEB"
// }