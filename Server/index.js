import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import helmet from "helmet"
import connectDB from  "./config/db.js"
import router from "./route/user.route.js"

dotenv.config()
const app = express();
const port = 8000;

// Using Middlewares 
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true ,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())
app.use(morgan())
app.use(helmet({
    crossOriginResourcePolicy : false
}))

connectDB()
app.get("/",(req,res)=>{
    res.json({
        message : "Server is running fine !"
    })
})
app.use("/api",router)

app.listen(port,()=>{
    console.log("Server is running on server : " + port)
})