const employeeMiddleware = (req, res, next) => {
    if (req.user.role !== "Employee" && req.user.role !== "Manager") {
        return res.status(403).json({
            message: "Only employee or manager can access"
        })
    }
    next()
}

export default employeeMiddleware