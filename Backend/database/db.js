import mongoose from "mongoose";


// const connect = () => {
//     mongoose.connect(process.env.MONGODB_URI)
//         .then(() => {
//             console.log("MongoDB connected successfully");
//         })
//         .catch(err => {
//             console.log(err);
//         })
// }

const connect = () => {
    mongoose.connect('mongodb://0.0.0.0/SleekMind')
        .then(() => {
            console.log("MongoDB connected successfully");
        })
        .catch(err => {
            console.log(err);
        })
}

export default connect;