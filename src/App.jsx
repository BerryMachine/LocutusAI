import React, {useRef} from 'react';
import AudioRecorder from './components/GetAudioFile';
import './App.css';
import imgUrl from './mic.png';
import imgUrl2 from './brain.png';
import test from './public-speaking.png';
import section1lotus from './lotus.png';
import lotus from './finalS1.png';
function App() {

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({behavior: 'smooth'});
    }
  }

  const startRecordingButton = () => {
    alert("Start Recording clicked");
  };

  const downloadFileButton = () => {
    alert("download file clicked");
  };

  const chooseFileButton = () => {
    alert("choose file clicked");
  };

  const uploadButton = () => {
    alert("upload clicked");
  };

  const fileInputRef = useRef(null);

  // Function to handle the custom button click
  const handleCustomButtonClick = () => {
    fileInputRef.current.click(); // Trigger the hidden file input
  };

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      alert(`Selected file: ${file.name}`);
    }
  };


  return (
    <div className="App">
      <h1>LocutusAI</h1>
      <AudioRecorder />

    <div className='fixedButtons'>
      <button onClick={() => scrollToSection('section1')}>1</button>
      <button onClick={()=> scrollToSection('section2')}>2</button>
      <button onClick={()=> scrollToSection('section3')}>3</button>

      {/* <button onClick={()=> recordVoice()} */}
    </div>
    <button className = "bottomButton" onClick={() => scrollToSection('section1')}>Back</button>

      <div id="section1" className="section">
        <h1> <img src={lotus} alt="Icon" class="finalS1.png" style={{ width: '800px', height: 'auto' }} /> </h1> 

      </div>
      
      <div id="section2" className="section">
      <div className="card-container">
          <div className="card">
          <h2><img src={test} alt="Icon" class="/public-speaking.png"></img> </h2>
            <h3>Speech Enhancement & Text Conversion </h3>
            <p>Enhance your spoken content with real-time feedback. Convert your speech into text while improving clarity, removing filler words, and refining enunciation for a seamless transition from spoken to written form.</p>
          </div>
          <div className="card">
          <h2><img src={imgUrl} alt="Icon" class="mic-icon"></img> </h2>
            <h3>Master Public Speakings</h3>
            <p>Develop your public speaking skills with AI-driven analysis. Receive insights on pacing, tone, and clarity, tailored to help you deliver impactful speeches with confidence.</p>
          </div>
          <div className="card">
          <h2><img src={imgUrl2} alt="Icon" class="/brain.png"></img> </h2>
            <h3>AI-Driven Communication Coach</h3>
            <p>Leverage cutting-edge AI technology to analyze your speech patterns, providing personalized feedback to enhance your speaking abilities. Gain insights into areas of improvement with a focus on clarity, speed, and overall delivery..</p>
          </div>
        </div>
      </div>

      <div id="section3" className="section">
        <div className="button-container">
          <button className="buttonSection" onClick={startRecordingButton}>Start Recording</button>
          <button className="buttonSection" onClick={downloadFileButton}>Download Recording</button>
          <button className="buttonSection" onClick={handleCustomButtonClick}>Choose File</button>
          <button className="buttonSection" onClick={uploadButton}>Upload and Analyze</button>

          {/* Hidden File Input */}
          <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }} // Hide the file input
              onChange={handleFileChange}
            />
        </div>
        
      </div>
    </div>
  );
}


export default App;
