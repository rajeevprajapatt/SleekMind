import mongoose from "mongoose";

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
        type: Object,
        required: true
    }
}, { timestamps: true })

const ChatMessage = mongoose.model('ChatMessage', chatSchema)

export default ChatMessage;