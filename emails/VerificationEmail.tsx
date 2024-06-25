import React from 'react'

interface verificationEmailProps{
  userName:string;
  otp:string;
}

export default function VerificationEmail  ({userName, otp}:verificationEmailProps ) {
  return (
    <div>
      <p>Dear User,${userName}</p>
				<p>Thank you for registering with StudyNotion. To complete your registration, please use the following OTP
					(One-Time Password) to verify your account:</p>
				<h2 className=" font-bold">${otp}</h2>
				<p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
				Once your account is verified, you will have access to our platform and its features.</p>
    </div>
  )
}
