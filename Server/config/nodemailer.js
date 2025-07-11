import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: process.env.GOOGLE_CLIENT_ID,     
    pass: process.env.GOOGLE_APP_PASS, 
  },
  });

  async function sendOTP(toEmail,otp) {
  
    const mailOptions = {
      from: 'sharmakiana394@gmail.com',
      to: toEmail,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}. It will expire in 5 minutes.`,
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log(`OTP sent to ${toEmail}: ${otp}`);
      return otp; // Save this OTP in DB or memory with expiry time
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  export default sendOTP;