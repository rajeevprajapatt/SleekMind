import mongoose, { mongo } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, "Email should be at least 6 characters long"],
        maxLength: [50, "Email should be at most 50 characters long"],
    },
    password: {
        type: String,
        select: false
    }
})

userSchema.statics.hashPassword = async (password) => {
    return await bcrypt.hash(password, 10);
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJwt = function () {
    return jwt.sign({
        email: this.email
    }, process.env.SECRET_KEY, {
        expiresIn: "80h"
    })
}

const User = mongoose.model("User", userSchema);

export default User;