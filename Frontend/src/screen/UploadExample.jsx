import React from 'react'
import {
    ImageKitAbortError,
    ImageKitInvalidRequestError,
    ImageKitServerError,
    ImageKitUploadNetworkError,
    upload,
} from "@imagekit/react";
import { useRef, useState } from "react";

import axios from "../config/axios";

const UploadExample = () => {

    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);

    const abortController = new AbortController();

    const authenticator = async () => {
        try {
            const response = await axios.get("/imagekitAuth");

            const data = await response.data;
            const { signature, token, expire, publicKey } = data;
            return { signature, token, expire, publicKey };
        } catch (error) {
            console.error("Authentication error:", error);
            throw new Error("Authentication request failed");
        }
    }

    const handleUpload = async () => {
        const file = fileInputRef.current.files[0];

        let authParams;
        try {
            authParams = await authenticator();
        } catch (error) {
            console.error("Failed to authenticate for upload:", error);
            return;
        }
        const { signature, expire, token, publicKey } = authParams;

        try {
            const uploadResponse = await upload({
                expire,
                token,
                signature,
                publicKey,
                file,
                fileName: file.name,
                onProgress: (progress) => {
                    setProgress((event.loaded / event.total) * 100);
                },
                abortSignal: abortController.signal,
            });
            console.log("Upload response:", uploadResponse);
        } catch (error) {
            if (error instanceof ImageKitAbortError) {
                console.error("Upload aborted:", error.reason);
            } else if (error instanceof ImageKitInvalidRequestError) {
                console.error("Invalid request:", error.message);
            } else if (error instanceof ImageKitUploadNetworkError) {
                console.error("Network error:", error.message);
            } else if (error instanceof ImageKitServerError) {
                console.error("Server error:", error.message);
            } else {
                // Handle any other errors that may occur.
                console.error("Upload error:", error);
            }
        }
    }

    return (
        <div>
            {/* File input element using React ref */}
            <input type="file" ref={fileInputRef} />
            {/* Button to trigger the upload process  */}
            <button type="button" onClick={handleUpload}>
                Upload file
            </button>
            <br />
            {/* Display the current upload progress */}
            Upload progress: <progress value={progress} max={100}></progress>

        </div>
    )
}

export default UploadExample
