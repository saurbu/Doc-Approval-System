import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const seedAdmin = async ()=>{
    try{
        const adminExist = await User.findOne({role: "Admin"})

        if(adminExist){
            console.log("admin alredy exist")
            return
            
        }

        const adminName = process.env.ADMIN_NAME || "Admin"
        const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com"
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123"

        const hashedPassword = await bcrypt.hash(adminPassword, 12)

        await User.create({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            role: "Admin",
            isActive: true
        })

        console.log("Admin Created");
        
    }catch(err){
        console.log(`Admin Login Error: ${err}`);
    }

    try {
        const EmployeeModel = (await import('../models/employee.js')).default;
        const empExist = await EmployeeModel.findOne({ empId: "EMP-1001" });
        if (!empExist) {
            const hashedPwd = await bcrypt.hash("Saurav@123", 12);
            await EmployeeModel.create({
                name: "Saurav Sharma",
                email: "saurav@gmail.com",
                password: hashedPwd,
                role: "Employee",
                number: "9876543219",
                empId: "EMP-1001",
                department: "MERN",
                isActive: true
            });
            console.log("Initial Employee EMP-1001 created");
        }

        const mgrExist = await EmployeeModel.findOne({ empId: "EMP-1002" });
        if (!mgrExist) {
            const hashedPwd = await bcrypt.hash("Saurav@123", 12);
            await EmployeeModel.create({
                name: "Sharma Saurav",
                email: "sharma@gmail.com",
                password: hashedPwd,
                role: "Manager",
                number: "9876543218",
                empId: "EMP-1002",
                department: "WEB",
                isActive: true
            });
            console.log("Initial Manager EMP-1002 created");
        }

        const demoEmpExist = await EmployeeModel.findOne({ email: "sondipkumar@gmail.com" });
        if (!demoEmpExist) {
            const hashedPwd = await bcrypt.hash("Hablu@1son", 12);
            await EmployeeModel.create({
                name: "Sondip Kumar",
                email: "sondipkumar@gmail.com",
                password: hashedPwd,
                role: "Employee",
                number: "9876543210",
                empId: "EMP-9999",
                department: "Engineering",
                isActive: true
            });
            console.log("Demo Employee sondipkumar@gmail.com created");
        }

        await EmployeeModel.deleteOne({ email: "sondipkumarsk@gmail.com" });
    } catch (err) {
        console.log(`Employee Seeding Error: ${err}`);
    }
}



export default seedAdmin