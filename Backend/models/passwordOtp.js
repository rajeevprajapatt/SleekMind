import mongoose from "mongoose";
import bcrypt from 'bcrypt'

const passwordOtpSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true
  },
  otp:{
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 // OTP expires after 1 minute (60 seconds)
  },
  verifiedAt: {
    type: Date,
    default: null
  }
})

passwordOtpSchema.statics.hashOtp = async function (otp) {
    return await bcrypt.hash(otp, 10)
}

passwordOtpSchema.methods.isValidOtp = async function (otp) {
    return await bcrypt.compare(otp, this.otp)
}

const passwordOtp = mongoose.model('PasswordOtp', passwordOtpSchema);

export default passwordOtp;