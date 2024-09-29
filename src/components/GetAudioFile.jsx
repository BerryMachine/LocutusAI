import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import axios from 'axios';

function calculateSpeakScore(filler_word_count, utterances_count, word_count) {
    const max_score = 10;

    const filler_weight = 0.9;
    const utterance_weight = 0.7;

    const filler_impact = (filler_word_count / word_count) * filler_weight;
    const utterance_impact = (utterances_count / word_count) * utterance_weight;

    const score_penalty = (filler_impact + utterance_impact) * max_score;

    const speak_score = Math.max(max_score - score_penalty, 0);

    return speak_score.toFixed(2);
}

const GetAudioFile = forwardRef((props, ref) => {
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [transcription, setTranscription] = useState('');
    const [overallSpeakScore, setOverallSpeakScore] = useState(null);
    const [fillerCount, setFillerCount] = useState(null);
    const [utterancesCount, setUtterancesCount] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunks = useRef([]);

    useImperativeHandle(ref, () => ({
        handleStartRecording,
        handleStopRecording,
        handleFileChange,
        handleFileUpload,
        getAudioURL,
    }));

    const handleStartRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunks.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                const audioURL = URL.createObjectURL(audioBlob);
                setAudioURL(audioURL);
                setFile(audioBlob);

                const downloadLink = document.createElement('a');
                downloadLink.href = audioURL;
                downloadLink.download = 'recording.wav';
                downloadLink.click();
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
            setErrorMessage('Error accessing microphone. Please check your device settings.');
        }
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        } else {
            console.error('No file selected');
            setErrorMessage('No file selected. Please choose a valid .wav file.');
        }
    };

    const handleFileUpload = async () => {
        if (!file) return;
        setLoading(true);
        setErrorMessage('');

        const formData = new FormData();
        formData.append('audio', file);

        try {
            const response = await axios.post('http://localhost:5000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response && response.data) {
                console.log('Analysis Results:', response.data);

                const transcriptionText = response.data.transcription;
                const utterancesCount = response.data.utterances.length;
                let fillerCount = 0;
                const fillerWordsList = [' uh', 'Uh', ' um', 'Um', 'like', ' you know'];
                const wordCount = transcriptionText.split(" ").length;

                fillerWordsList.forEach(fillerWord => {
                    const occurrences = transcriptionText.split(fillerWord).length - 1;
                    fillerCount += occurrences;
                });

                const overallSpeakScore = calculateSpeakScore(fillerCount, utterancesCount, wordCount);

                setTranscription(transcriptionText);
                setOverallSpeakScore(overallSpeakScore);
                setFillerCount(fillerCount);
                setUtterancesCount(utterancesCount);
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

    const getAudioURL = () => audioURL;

    return (
        <div className="audio-file-container">
            <div className="button-container">
                {audioURL && (
                    <div>
                        <audio controls src={audioURL}></audio>
                        <a href={audioURL} download="recording.wav">
                            Download Recording
                        </a>
                    </div>
                )}
                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            </div>

            <div className="analysis-results">
                {transcription && (
                    <>
                        <h3>Transcription:</h3>
                        <p>{transcription}</p>

                        <h4>Analysis Summary:</h4>
                        <p>Overall Speak Score: {overallSpeakScore}</p>
                        <p>Number of Filler Words: {fillerCount}</p>
                        <p>Number of Utterances: {utterancesCount}</p>
                    </>
                )}
            </div>
        </div>
    );
});

export default GetAudioFile;
