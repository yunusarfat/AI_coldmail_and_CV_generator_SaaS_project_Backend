// import nodemailer from "nodemailer";
// export const transporter=nodemailer.createTransport(
//     {
//         service:"gmail",
//         auth:{
//             user:process.env.EMAIL_USER,
//             pass:process.env.EMAIL_PASS,
//         }
//     }
// )



import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4, // 👈 force IPv4, skip broken IPv6 route
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
   tls: {
    rejectUnauthorized: false, // 👈 Prevents Render from dropping the connection during the TLS handshake
    ciphers: 'SSLv3'
  }

} as nodemailer.TransportOptions); // 👈 Added type casting here
