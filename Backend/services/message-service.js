import mongoose from "mongoose";
import ChatMessage from "../models/chat-message.js";

export const allProjectMessages = async (projectId) => {
    console.log(projectId);
    if (!projectId) {
        throw new Error("Project Id is required");
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid Project");
    }

    const allMessages = await ChatMessage.find({ projectId: projectId }).populate("sender");

    return allMessages;
}

// export const addMessageToProject = async()