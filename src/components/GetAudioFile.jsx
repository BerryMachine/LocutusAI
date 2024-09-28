import React, { useState, useRef } from 'react';

const GetAudioFile = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);

    // Media Player Start 
    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = (event) => {
                // Checking if there is audio data
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            // Stopping the media player converts the recording into .wav
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
        }
    };

    // Stops recording
    const handleStopRecording = () => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
    };

    // Downloads the .wav file
    return (
        <div>
            <h1>Public Speaking Analysis</h1>
            <div>
                <button onClick={isRecording ? handleStopRecording : handleStartRecording}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                </button>
            </div>
            {audioURL && (
                <div>
                    <audio controls src={audioURL}></audio>
                    <a href={audioURL} download="recording.wav">
                        Download Recording
                    </a>
                </div>
            )}
        </div>
    );
};

export default GetAudioFile;
