import mongoose from "mongoose";

const connect = () => {
    mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch(err => {
            console.log(err);
        })
}

export default connect;