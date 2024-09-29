import React, { useState, useRef } from 'react';
import axios from 'axios';

const GetAudioFile = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);

    // Handle start of recording
    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                const audioURL = URL.createObjectURL(audioBlob);
                setAudioURL(audioURL);
                audioChunks.current = [];
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setErrorMessage('Error accessing microphone. Please check your device settings.');
        }
    };

    // Handle stop of recording
    const handleStopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    // Handle file selection from directory
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        } else {
            console.error('No file selected');
            setErrorMessage('No file selected. Please choose a valid .wav file.');
        }
    };

    // Handle file upload for analysis
    const handleFileUpload = async () => {
        if (!file) return;
        setLoading(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('audio', file);

        try {
            setLoading(true);
      
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response && response.data) {
                console.log('Analysis Results:', response.data); 
            } else {
                console.error('Unexpected response format:', response);
                setErrorMessage('Unexpected response from the server. Please try again.');
            }
        } catch (error) {
            console.error('Error uploading the file:', error);
            setErrorMessage('Error uploading the file. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Public Speaking Analysis</h1>

            {/* Error Message Display */}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            {/* Recording Controls */}
            <div>
                <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>

            {/* Audio Playback and Download */}
            {audioURL && (
                <div>
                    <audio controls src={audioURL}></audio>
                    <a href={audioURL} download="recording.wav">
                        Download Recording
                    </a>
                </div>
            )}

            {/* File Selection for Analysis */}
            <div>
                <h2>Upload a .wav File for Analysis</h2>
                <input type="file" accept="audio/wav" onChange={handleFileChange} />
                <button onClick={handleFileUpload} disabled={loading || !file}>
                    {loading ? "Analyzing..." : "Upload and Analyze"}
                </button>
            </div>
        </div>
    );
};

export default GetAudioFile;
