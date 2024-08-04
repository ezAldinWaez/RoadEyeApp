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
  const [videoUrlOrg, setVideoUrlOrg] = useState(null);
  const [videoUrlOut, setVideoUrlOut] = useState(null);

  const handleUploadSuccess = (newTaskId) => {
    console.log("Upload success, taskId:", newTaskId);
    setTaskId(newTaskId);
    setVideoUrlOrg(null);
  };

  const handleProcessingComplete = (url_org, url_out) => {
    console.log("Processing complete, video URL:", url_out);
    setVideoUrlOrg(url_org);
    setVideoUrlOut(url_out)
  };

  return (
    <div className="App">
      <Header />
      <Intro />
      <div style={{ width: "90%", margin: "0 auto" }}>
        <WorkflowSection />

        <UploadSection onUploadSuccess={handleUploadSuccess} />

        {taskId && !videoUrlOut && (
          <ProcessingSection
            taskId={taskId}
            onProcessingComplete={handleProcessingComplete}
          />
        )}

        {videoUrlOut && <ResultsSection videoUrlOrg={videoUrlOrg} videoUrlOut={videoUrlOut} />}


        {/* <FResultSection /> */}
        <About />
        <Contact />
      </div>
      <Footer />
    </div>
  );
}

export default App;
