import User from "../models/user.js";
import ChatMessage from "../models/chat-message.js";
import * as messageService from "../services/message-service.js";

export const getAllChatMessages = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const allMessages = await messageService.allProjectMessages(projectId);
        return res.status(201).json(allMessages);

    } catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
}

export const getFileTree = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const fileTree = await ChatMessage.findOne({ _id: projectId });
        if (!fileTree) {
            return res.status(404).json({ error: "File tree not found" });
        }
        return res.status(200).json(fileTree.message.fileTree);
    }
    catch (error) {
        console.log(error);
        return res.status(400).send(error);
    }
}

export const getMessage = async (req, res) => {
    const { fileId, fileName, content } = req.body;

    // console.log("content : ", content);

    try {
        const doc = await ChatMessage.findById(fileId);
        if (!doc) return res.status(404).json({ error: "Message not found" });

        // Update content safely (even if filename has dots)
        if (
            doc.message &&
            doc.message.fileTree &&
            doc.message.fileTree[fileName]
        ) {
            console.log("coming content : ", content);
            doc.message.fileTree[fileName].content = content;
        } else {
            return res.status(404).json({ error: "File not found in fileTree" });
        }

        doc.markModified('message.fileTree');
        await doc.save();
        return res.status(200).json(doc);
    } catch (error) {
        console.error("❌ Error updating file:", error);
        return res.status(500).json({ error: error.message });
    }
}


