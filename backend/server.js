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

function calculateSpeakScore(filler_word_count, utterances_count, word_count) {
    const max_score = 10;
    
    // Factor for filler words and utterances
    const filler_weight = 0.9;   // Heavier penalty on filler words
    const utterance_weight = 0.7;  // Lighter penalty on utterances

    // Calculate the impact of filler words and utterances proportionally to the word count
    const filler_impact = (filler_word_count / word_count) * filler_weight;
    const utterance_impact = (utterances_count / word_count) * utterance_weight;

    // Reduce score based on both impacts
    const score_penalty = (filler_impact + utterance_impact) * max_score;

    // Calculate final speak score, ensuring it doesn't drop below 0
    const speak_score = Math.max(max_score - score_penalty, 0);

    return speak_score.toFixed(2);
}



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

        // SCORE SYSTEM
        var overall_speak_score;
        var utterances_count;
        var match_sentiment; // maybe add later
        var filler_count = 0;
        const filler_words_list = [' uh', 'Uh', ' um', 'Um', 'like', ' you know'];
        const transcription = result.results.channels[0].alternatives[0].transcript;
        const word_count = transcription.split(" ").length;


        utterances_count = result.results.utterances.length;

        filler_words_list.forEach(filler_word => {
            const occurrences = transcription.split(filler_word).length - 1;
            filler_count += occurrences;
        });

        overall_speak_score = calculateSpeakScore(filler_count, utterances_count, word_count);

        console.log("how", utterances_count, filler_count, overall_speak_score);
        console.log(result.results.channels[0].alternatives[0].transcript);


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