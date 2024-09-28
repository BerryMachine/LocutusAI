// src/components/GetAudioFile.jsx

import React, { useState } from 'react';
import axios from 'axios';

const GetAudioFile = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) return;
        setLoading(true);
        
        const formData = new FormData();
        formData.append('audio', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Upload response:', response.data);
            // Here you can analyze the response further if needed
        } catch (error) {
            console.error('Error uploading the file:', error);
        } finally {
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

export default GetAudioFile;

