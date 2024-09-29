import React from 'react';
import AudioRecorder from './components/GetAudioFile';
import './App.css';
import imgUrl from './mic.png';

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
        <h2><img src={imgUrl} alt="Icon" class="mic-icon"></img> </h2>
      </div>
      
      <div id="section2" className="section">
        <h2>Features</h2>
      </div>
      <div id="section3" className="section">
        <h2>Transcript</h2>
      </div>
    </div>
  );
}

export default App;
