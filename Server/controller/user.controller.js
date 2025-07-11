import User from "../model/user.model.js";
import sendOTP from "../config/nodemailer.js";

export const storeEmail = async (req,res)=>{
    try {
        const { email } = req.body ;
        if(!email){
            return res.status(400).json({
                message : "Plz provide the email",
                error : true ,
                success : false
            })
        }
            const exist = await User.findOne({email});

            if(exist){
                return res.status(400).json({
                    message : "Email already exists",
                    error : true ,
                    success : false
                })
            }
            
            const otp = Math.floor(100000 + Math.random() * 900000); 
            
            const newEmail = new User({
                email,
                otp
            });
            const save = await newEmail.save();

            const updateOtp = await User.findByIdAndUpdate(save._id, { otp });

            if(!updateOtp){
                return res.status(500).json({
                    message : "Failed to update OTP",
                    error : true ,
                    success : false
                })
            }
            const sentOtp = await sendOTP(email, otp);
            if(!sentOtp){
                return res.status(500).json({
                    message : "Failed to send OTP",
                    error : true ,
                    success : false
                })
            }

            res.cookie('email', email, { httpOnly: true });

            return res.status(200).json({
                message : "Email stored successfully",
                error : false ,
                success : true ,
                data : save
            })
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error" + error.message,
            error : true ,
            success : false 
        })
    }
}

export const verifyOtp = async (req,res)=>{
    try {
        const { otp } = req.body ;
        const email = req.cookies.email;
        if(!otp){
            return res.status(400).json({
                message : "Plz provide the OTP",
                error : true ,
                success : false
            })
        }
        if(!email){
            return res.status(400).json({
                message : "Plz provide the email",
                error : true ,
                success : false
            })
        }

        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({
                message : "User not found",
                error : true ,
                success : false
            })
        }
        if(user.otp !== otp){
            return res.status(400).json({
                message : "Invalid OTP",
                error : true ,
                success : false
            })
        }
        if(user.verified){
            return res.status(400).json({
                message : "User already verified",
                error : true ,
                success : false
            })
        }
        user.verified = true;
        const updatedUser = await user.save();
        if(!updatedUser){
            return res.status(500).json({
                message : "Failed to update user",
                error : true ,
                success : false
            })
        }
        res.clearCookie('email');
        return res.status(200).json({
            message : "User verified successfully",
            error : false ,
            success : true ,
            data : updatedUser
        })
    } catch (error) {
        return res.status(500).json({
            message : "Internal Server Error" + error.message,
            error : true ,
            success : false 
        })
    }
}
