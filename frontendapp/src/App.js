import React, { useState } from "react";
import "./App.css";
import {
  Header,
  Footer,
  Intro,
  WorkflowSection,
  About,
  Contact,
  ProcessingSection,
  ResultsSection,
  UploadSection,  
} from "./components";

function App() {
  const [taskId, setTaskId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleUploadSuccess = (newTaskId) => {
    console.log("Upload success, taskId:", newTaskId);
    setTaskId(newTaskId);
    setVideoUrl(null);
  };

  const handleProcessingComplete = (url) => {
    console.log("Processing complete, video URL:", url);
    setVideoUrl(url);
  };

  return (
    <div className="App">
      <Header />
      <Intro />
      <div style={{ width: "90%", margin: "0 auto" }}>
        <WorkflowSection />

        <UploadSection onUploadSuccess={handleUploadSuccess} />

        {taskId && !videoUrl && (
          <ProcessingSection
            taskId={taskId}
            onProcessingComplete={handleProcessingComplete}
          />
        )}

        {videoUrl && <ResultsSection videoUrl={videoUrl} />}


        {/* <FResultSection /> */}
        <About />
        <Contact />
      </div>
      <Footer />
    </div>
  );
}

export default App;
