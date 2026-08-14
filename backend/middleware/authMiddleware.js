import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) =>{
    try{
        const token = req.headers.authorization?.split(" ")[1]

        if(!token){
            return res.status(401).json({
                message: "No Token"
            })
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decode

        next()
    } catch (err) {
        console.log("Token error: ", err);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}


export default authMiddleware