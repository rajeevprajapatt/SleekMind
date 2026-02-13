import mongoose from "mongoose";
import User from "../models/user.js";


const connect = async () => {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch(err => {
            console.log(err);
        })

    const exists = await User.findOne({ email: "ai@yourapp.com" });
    if (!exists) {
        await User.create({
            _id: new mongoose.Types.ObjectId("000000000000000000000001"),
            fullName: "AI Assistant",
            email: "ai@yourapp.com",
            password: null,
            role: "system",
            isAI: true,
        });
    }
}

export default connect;