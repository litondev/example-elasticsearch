import mongoose from "mongoose";

try{
    await mongoose.connect(`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`,{         
        authSource : "admin",        
        user : process.env.DB_USERNAME,
        pass : process.env.DB_PASSWORD,        
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log("Success Conn");
}catch(err){
    console.log("Failed Conn: " + err.message);
}
