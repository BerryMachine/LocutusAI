import React from 'react';
import AudioRecorder from './components/GetAudioFile';
import './App.css';
import imgUrl from './mic.png';
import imgUrl2 from './brain.png';
import test from './public-speaking.png';
import section1lotus from './lotus.png';
function App() {
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({behavior: 'smooth'});
    }
  }
  return (
    <div className="App">
      <h1>LocutusAI</h1>
      <AudioRecorder />

    <div className='fixedButtons'>
      <button onClick={() => scrollToSection('section1')}>1</button>
      <button onClick={()=> scrollToSection('section2')}>2</button>
      <button onClick={()=> scrollToSection('section3')}>3</button>
      
    </div>
    <button className = "bottomButton" onClick={() => scrollToSection('section1')}>Back</button>

      <div id="section1" className="section">

       <h1> <img src={section1lotus} alt="Icon" class="lotus" style={{ width: '650px', height: 'auto' }} /> </h1>
      </div>
      
      <div id="section2" className="section">
      <div className="card-container">
          <div className="card">
          <h2><img src={test} alt="Icon" class="public-speaking.png"></img> </h2>
            <h3>Speech Enhancement & Text Conversion </h3>
            <p>Enhance your spoken content with real-time feedback. Convert your speech into text while improving clarity, removing filler words, and refining enunciation for a seamless transition from spoken to written form.</p>
          </div>
          <div className="card">
          <h2><img src={imgUrl} alt="Icon" class="mic-icon"></img> </h2>
            <h3>Master Public Speakings</h3>
            <p>Develop your public speaking skills with AI-driven analysis. Receive insights on pacing, tone, and clarity, tailored to help you deliver impactful speeches with confidence.</p>
          </div>
          <div className="card">
          <h2><img src={imgUrl2} alt="Icon" class="brain.png"></img> </h2>
            <h3>AI-Driven Communication Coach</h3>
            <p>Leverage cutting-edge AI technology to analyze your speech patterns, providing personalized feedback to enhance your speaking abilities. Gain insights into areas of improvement with a focus on clarity, speed, and overall delivery..</p>
          </div>
        </div>
        
        <h2> </h2>
      </div>
      
      <div id="section2" className="section">
        
      </div>

      <div id="section3" className="section">
        <h2>Transcript</h2>
      </div>
    </div>
  );
}






export default App;
