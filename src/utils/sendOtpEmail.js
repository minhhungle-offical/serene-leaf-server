import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendOtpEmail = async (to, otp) => {
  const mailOptions = {
    from: `"Serene Leaf 👻" <${process.env.EMAIL}>`,
    to,
    subject: "Mã xác thực OTP của bạn",
    html: `
      <div style="font-family:sans-serif">
        <h2>🔐 Mã OTP của bạn</h2>
        <p>Xin chào, đây là mã xác thực của bạn:</p>
        <h1 style="color:#007BFF;">${otp}</h1>
        <p>Mã có hiệu lực trong vòng 10 phút.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
