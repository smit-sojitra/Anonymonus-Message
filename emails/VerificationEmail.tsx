import React from 'react'

interface verificationEmailProps{
  userName:string;
  otp:string;
}

export default function VerificationEmail  ({userName, otp}:verificationEmailProps ) {
  return (
    <div>
      <p>Hello,{userName}</p>
      <p>This is your OTP for verification:{otp}</p>
    </div>
  )
}
