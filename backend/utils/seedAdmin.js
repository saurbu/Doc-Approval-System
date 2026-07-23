import bcrypt from 'bcryptjs'
import User from '../models/User.js'

const seedAdmin = async ()=>{
    try{
        const adminExist = await User.findOne({role: "Admin"})

        if(adminExist){
            console.log("admin alredy exist")
            return
            
        }

        const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12)

        await User.create({
            name: process.env.ADMIN_NAME,
            email: process.env.ADMIN_EMAIL,
            password: hashedPassword,
            role: "Admin",
            isActive: true
        })

        console.log("Admin Created");
        
    }catch(err){
        console.log(`Admin Login Error: ${err}`);
        
    }
}



export default seedAdmin