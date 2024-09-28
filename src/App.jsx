import React from 'react';
import AudioRecorder from './components/GetAudioFile';
import './App.css';

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
      <button onClick={() => scrollToSection('section1')}>Go to Section 1</button>
      <button className= "bottombutton" onClick={() => scrollToSection('section2')}>Go back to Section 1</button>

      <div id="section1" className="section">
        <h2>Front page</h2>
        <p></p>
      </div>
      <div id="section2" className="section">
        <h2>Section 2</h2>
        <p>Features of the AI speech analyzer</p>
      </div>
    </div>
  );
}

export default App;
