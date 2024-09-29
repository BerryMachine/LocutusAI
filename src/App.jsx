import React, { useRef } from 'react';
import './App.css';
import imgUrl from './mic.png';
import imgUrl2 from './brain.png';
import test from './public-speaking.png';
import lotus from './finalS1.png';
import GetAudioFile from './components/GetAudioFile';

function App() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const audioFileRef = useRef(null);

  const startRecordingButton = () => {
    if (audioFileRef.current) {
      audioFileRef.current.handleStartRecording();
    }
  };

  const stopRecordingButton = () => {
    if (audioFileRef.current) {
      audioFileRef.current.handleStopRecording();
    }
  };

  const uploadButton = () => {
    if (audioFileRef.current) {
      audioFileRef.current.handleFileUpload();
    }
  };

  const fileInputRef = useRef(null);

  const handleCustomButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="App">
      {/* <h1>LocutusAI</h1> */}

      <div className="fixedButtons">
        <button onClick={() => scrollToSection('section1')}>1</button>
        <button onClick={() => scrollToSection('section2')}>2</button>
        <button onClick={() => scrollToSection('section3')}>3</button>
      </div>

      <button className="bottomButton" onClick={() => scrollToSection('section1')}>Back</button>

      <div id="section1" className="section">
        <h1>
          <img src={lotus} alt="Icon" className="no" style={{ width: '1400px', height: 'auto' }} />
        </h1>
      </div>

      <div id="section2" className="section">
        <div className="card-container">
          <div className="card">
            <h2><img src={test} alt="Icon" className="public-speaking.png"></img></h2>
            <h3>Speech Enhancement & Text Conversion</h3>
            <p>Enhance your spoken content with real-time feedback. Convert your speech into text while improving clarity, removing filler words, and refining enunciation for a seamless transition from spoken to written form.</p>
          </div>
          <div className="card">
            <h2><img src={imgUrl} alt="Icon" className="mic-icon"></img></h2>
            <h3>Master Public Speaking</h3>
            <p>Develop your public speaking skills with AI-driven analysis. Receive insights on pacing, tone, and clarity, tailored to help you deliver impactful speeches with confidence.</p>
          </div>
          <div className="card">
            <h2><img src={imgUrl2} alt="Icon" className="brain.png"></img></h2>
            <h3>AI-Driven Communication Coach</h3>
            <p>Leverage cutting-edge AI technology to analyze your speech patterns, providing personalized feedback to enhance your speaking abilities. Gain insights into areas of improvement with a focus on clarity, speed, and overall delivery.</p>
          </div>
        </div>
      </div>

      <div id="section3" className="section">
        <div className="button-container">
          <button className="buttonSection" onClick={startRecordingButton}>Start Recording</button>
          <button className="buttonSection" onClick={stopRecordingButton}>Stop Recording</button>
          <button className="buttonSection" onClick={handleCustomButtonClick}>Choose File</button>
          <button className="buttonSection" onClick={uploadButton}>Upload and Analyze</button>
          <GetAudioFile ref={audioFileRef} />

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={(e) => audioFileRef.current && audioFileRef.current.handleFileChange(e)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
