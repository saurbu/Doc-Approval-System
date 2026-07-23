const adminMiddleware = (req, res, next) => {

    if(req.user.role !== "Admin"){
        return res.status(401).json({
            message: "only admin can access"
        })
    }

    next()

}

export default adminMiddleware