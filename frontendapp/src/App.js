import React from 'react';   
import './App.css';  
import {   
    Chart1,   
    Chart2,   
    Uploadf,   
    Header,   
    Footer,   
    FSection,   
    SSection,   
    About,   
    Contact,   
    FResultSection   
    // SResultSection, // Uncomment if needed   
} from './components'; 

function App() {
  return (
    <div className="App">
      <Header/>
      <FSection/>
      <div style={{width: '90%', margin: '0 auto'}}>
        <SSection/>
        <Uploadf/>
        <div className='Charts_section' style={{padding: '50px 20px', }}>
          <Chart1></Chart1>
          <Chart1></Chart1>
          <Chart1></Chart1>
          <Chart2></Chart2>
        </div>
        <FResultSection/>
        <About/>
        <Contact/>
      </div>
      <Footer/>
    </div>
  );
}

export default App;