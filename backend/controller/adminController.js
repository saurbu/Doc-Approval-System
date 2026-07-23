import User from '../models/User.js'
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

