// backend/server.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@deepgram/sdk'); // Updated import
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

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
            model: "nova-2", // Specify the model to use
            sentiment: true,  // Optionally enable sentiment analysis
            // You can enable other options like intents, summarize, or topics here
        });

        if (error) throw error; // Handle errors

        // Print the results for debugging
        console.dir(result, { depth: null });

        // Send the analysis result back to the client
        res.json({
            transcription: result.channel.alternatives[0].transcript,
            utterances: result.channel.utterances,
            confidence: result.channel.alternatives[0].confidence,
            sentiment: result.channel.sentiment,
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
