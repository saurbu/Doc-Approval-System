import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import connectDb from './config/db.js'
import seedAdmin from './utils/seedAdmin.js'
import {adminLogin} from './controller/adminController.js'

const app = express()
app.use(express.json())

app.use('/api/admin', adminLogin)
connectDb()
.then( async () => {
    await seedAdmin() 

    const PORT = process.env.PORT || 3000
    app.listen(PORT, ()=>{
        console.log(`server is running on port ${PORT}`);
        
    })
})





