import User from '../models/User.js'
import Employee from '../models/employee.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


export const adminLogin = async (req, res) => {
    try{
        const {
            email,
            password
        } = req.body

        const admin = await User.findOne({email})


        if(!admin){
            return res.status(404).json({
                message: "Admin not Found"
            })
        }

        if(admin.role !== "Admin"){
            return res.status(403).json({
                message: "Admin not Exist"
            })
        }

        const passMatch = await bcrypt.compare(password, admin.password)

        if(!passMatch){
            return res.status(401).json({
                message: "Wrong password "
            })
        }

        const token = jwt.sign({
            id: admin._id,
            role: admin.role
        }, process.env.JWT_SECRET)


        res.status(200).json({
            success: true,
            message: "Login Successful",
            token
        });
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


export const createEmployee =async (req, res) =>{


    try{

        const {
            name,
            email,
            password,
            role,
            number,
            empId,
            department,
        } = req.body
        
        
        if(role !== "Employee" && role !== "Manager"){
            return res.status(400).json({
            message: "Invalid role"
        })
        }
        
        
        const emailExist = await Employee.findOne({ email })
        
        if(emailExist){
            return res.status(400).json({
                message:"Email already exist"
            })
        }
        
        const hashPassword = await bcrypt.hash(password, 12)
        
        const newEmployee =await  Employee.create({
            name,
            email,
            password: hashPassword,
            role,
            number,
            empId,
            department,
        })
        res.status(201).json({
            success: true,
            message: `${role} created successfully`,
            employee: newEmployee
        })
    }catch(err){
        res.status(500).json({
            message: err.message
        })
        
    }

}


export const employeeLogin = async (req, res) => {
    try{
        const {
            email,
            password
        } = req.body

        const employee = await Employee.findOne({email})


        if(!employee){
            return res.status(404).json({
                message: "Invalid Employee"
            })
        }

        const passMatch = await bcrypt.compare(password, employee.password)

        if(!passMatch){
            return res.status(401).json({
                message: "Wrong password "
            })
        }

        const token = jwt.sign({
            id: employee._id,
            role: employee.role
        }, process.env.JWT_SECRET)


        res.status(200).json({
            success: true,
            message: "Login Successful",
            token
        });
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}