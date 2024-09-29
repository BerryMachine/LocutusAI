import React, { useState } from 'react';
import axios from 'axios'; // Axios sends the audio file to the back end for analysis.

const AudioRecorder = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert("Please upload a file first.");
            return;
        }
        
        const formData = new FormData();
        formData.append("audio", file);

        try {
            setLoading(true);
            const response = await axios.post("http://localhost:5173/upload", formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            console.log("Analysis Results:", response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error uploading the file:", error);
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Public Speaking Analysis</h1>
            <input type="file" accept="audio/wav" onChange={handleFileChange} />
            <button onClick={handleFileUpload} disabled={loading}>
                {loading ? "Analyzing..." : "Upload and Analyze"}
            </button>
        </div>
    );
};

export default AudioRecorder;
