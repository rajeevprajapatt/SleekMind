import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    name: String,
    path: String,
    content: String,
    type: {
        type: String,
        enum: ["file", "folder"]
    }
}, { _id: false });

const chatSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        text: {
            type: String,
            required: true
        },
        folderName: String,
        files: [fileSchema],
        buildCommand: Object,
        startCommand: Object
    }
}, { timestamps: true });

// const chatSchema = new mongoose.Schema({
//     projectId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Project',
//         required: true
//     },
//     sender: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     },
//     message: {
//         type: Object,
//         required: true
//     }
// }, { timestamps: true })

const ChatMessage = mongoose.model('ChatMessage', chatSchema)

export default ChatMessage;