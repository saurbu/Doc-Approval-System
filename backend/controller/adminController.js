import User from '../models/User.js'
import Employee from '../models/employee.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import sendMail from "../utils/sendMail.js";

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


const capitalizeName = (name) => {
    return name
        .trim()
        .replace(/\s+/g, " ")
        .toLowerCase()
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

export const generateEmployeeId = async (req,res)=>{
    try{

        const lastEmployee = await Employee.findOne()
        .sort({createdAt:-1});


        let newId = "EMP-1001";


        if(lastEmployee){

            const lastNumber = Number(
                lastEmployee.empId.replace("EMP-","")
            );


            newId = `EMP-${lastNumber + 1}`;
        }


        res.status(200).json({
            empId:newId
        })


    }catch(err){

        res.status(500).json({
            message:err.message
        })

    }
}


export const createEmployee =async (req, res) =>{


    try{

        const {
            name,
            email,
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
        const empExist = await Employee.findOne({ empId })
        
        if(empExist){
            return res.status(400).json({
                message:"Employee Id already exist"
            })
        }
        const fName = name.trim().split(" ")[0]
        const sEmail = email.split("@")[0].substring(0, 3);
        const password = `${fName}@1${sEmail}`
        const hashPassword = await bcrypt.hash(password, 12)
        
        const newEmployee =await  Employee.create({
            name: capitalizeName(name),
            email,
            password: hashPassword,
            role,
            number,
            empId,
            department,
        })
        
        await sendMail(
            newEmployee.email,
            "Employee Account Created",
            
            `
            <h2>Welcome ${newEmployee.name}</h2>
            
            <p>Your account has been created.</p>
            
            <h3>Login Credentials</h3>
            
            <p>Employee ID : ${newEmployee.empId}</p>
            
            <p>Password : ${password}</p>
            
            <a href="http://localhost:5173/">
            Login Here
            </a>
            `
            
        );
        res.status(201).json({
            success: true,
            message: `${role} created successfully`,
            generatedPassword: password,
            employee: newEmployee
        })
    }catch (err) {
        console.error(err);

        return res.status(500).json({
            message: err.message,
        });
    }

}


export const employeeLogin = async (req, res) => {
    try{
        const {
            email,
            empId,
            password
        } = req.body

        const searchCriteria = [];
        if (email && email.trim()) {
            searchCriteria.push({ email: email.trim().toLowerCase() });
        }
        if (empId && empId.trim()) {
            searchCriteria.push({ empId: empId.trim() });
            searchCriteria.push({ empId: empId.trim().toUpperCase() });
        }

        const employee = await Employee.findOne(
            searchCriteria.length ? { $or: searchCriteria } : { email: "" }
        );


        if(!employee){
            return res.status(404).json({
                success: false,
                message: "Employee not found with provided Email or Employee ID"
            })
        }

        if (!employee.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account has been deactivated. Please contact the administrator."
            });
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
            token,
            role: employee.role
        });
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}


export const allEmployees = async (req, res) =>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        const skip = (page - 1) * limit;

        const totalEmployees = await Employee.countDocuments();
        const employees = await Employee.find().select("-password").skip(skip).limit(limit)

        res.status(200).json({
            success: true,
            count: employees.length,
            employees,
            currentPage: page,
            totalPages: Math.ceil(totalEmployees / limit),
            totalEmployees
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}

export const employeeStats = async(req,res)=>{
    try{

        const totalEmployees = await Employee.countDocuments();

        const activeEmployees = await Employee.countDocuments({
            isActive:true
        });


        res.status(200).json({
            totalEmployees,
            activeEmployees
        })

    }catch(err){
        res.status(500).json({
            message:err.message
        })
    }
}


export const idEmployee = async (req, res) =>{
    try{

        const { empId } = req.params
        const employee = await Employee.findOne({ empId }).select("-password");

        if(!employee){
            return res.status(404).json({
            success: false,
            message: "Employee not found"
        })
        }


        res.status(200).json({
            success: true,
            employee
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


export const searchEmployee = async (req, res) =>{
    try{

        const { name } = req.params
        const employees = await Employee.find({ 
            name: {
                $regex: name,
                $options: "i"
            }
         }).select("-password");

        if(employees.length === 0){
            return res.status(404).json({
            success: false,
            message: "Employee not found"
        })
        }


        res.status(200).json({
            success: true,
            employees
        })
    }catch(err){
        res.status(500).json({
            success: false,
            message: err.message
        })
    }
}


export const updateEmployee = async (req, res) =>{

    try{
        const { empId} = req.params
        let {
            name,
            email,
            role,
            number,
            department
        } = req.body
    
        const employee = await Employee.findOne({ empId })
    
        if(!employee){
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            })
        }
    
        if(name) employee.name = capitalizeName(name)
        if(email) employee.email = email
        if(number) employee.number = number
        if(role){
            if(role !== "Employee" && role !== "Manager"){
                return res.status(401).json({
                    success: false,
                    message: "Invalid role"
                })
            }
            employee.role = role
        } 
        if(number) employee.number = number

        await employee.save()

        res.status(200).json({
            success: true,
            message: "Details updated successfully",
            employee
        })


    }catch(err){
        res.status(401).json({
            success: false,
            message: err.message
        })

    }
    
}


export const updateEmployeeStatus = async (req, res) =>{

    try{
        const { empId } = req.params

        const employee = await Employee.findOne({ empId })
    
        if(!employee){
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            })
        }
    
        employee.isActive = !employee.isActive

        await employee.save()

        res.status(200).json({
            success: true,
            message: employee.isActive ? "Employee Activated" : " Employee Deactivated",
            employee
        })


    }catch(err){
        res.status(401).json({
            success: false,
            message: err.message
        })

    }
    
}


