import mongoose from "mongoose"

const connectDb = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected");
        
    }catch(err){
        console.log("database connection error", err);
    
    }
}

export default connectDb