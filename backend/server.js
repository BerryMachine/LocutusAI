// backend/server.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@deepgram/sdk'); // Updated import
require('dotenv').config();
var cors = require('cors')

const app = express();
const port = process.env.PORT || 5000;

//Fix CORS
app.use(cors())

// Create a Deepgram client using the API key
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' }); // Save uploads to the 'uploads' directory


// Define the /upload endpoint for audio file uploads
app.post('/upload', upload.single('audio'), async (req, res) => {
    const audioFile = req.file; // Access the uploaded audio file
    if (!audioFile) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        // Read the uploaded file from the filesystem
        const audioFilePath = path.join(__dirname, audioFile.path);
        const audioData = fs.readFileSync(audioFilePath); // Read the file contents

        // Call the transcribeFile method with the audio payload and options
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(audioData, {
            model: 'nova',
            language: 'en',
            summarize: 'v2',
            smart_format: true,
            utterances: true,
            search: ['uh', 'um'],
            filler_words: true,
            sentiment: true,
        });        


        if (error) throw error; // Handle errors



        // Send the analysis result back to the client
        res.status(200).json({
            transcription: result.results.channels[0].alternatives[0].transcript, 
            utterances: result.results.utterances, 
            confidence: result.results.channels[0].alternatives[0].confidence, 
            sentiment: result.results.sentiments, 
            summary: result.results.summary,  // Collect summary using summarize v2 option
            fillerWords: result.results.channels[0].search,  // Collect filler words from the transcription
        });

    } catch (error) {
        console.error('Error processing the audio file:', error);
        res.status(500).send('Error processing the audio file.');
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
