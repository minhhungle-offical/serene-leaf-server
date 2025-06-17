import otpGenerator from "otp-generator";

export function generateOTP() {
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  return otp; // Ví dụ: '395842'
}
