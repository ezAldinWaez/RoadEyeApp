import React, { useState } from 'react';
import { Container, Paper, Typography } from '@mui/material';
import VideoUpload from './components/VideoUpload';
import ProcessingStatus from './components/ProcessingStatus';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const [taskId, setTaskId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);

  const handleUploadSuccess = (newTaskId) => {
    console.log('Upload success, taskId:', newTaskId);
    setTaskId(newTaskId);
    setVideoUrl(null);
  };

  const handleProcessingComplete = (url) => {
    console.log('Processing complete, video URL:', url);
    setVideoUrl(url);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
        <Typography variant="h4" gutterBottom>
          Video Processor
        </Typography>
        <VideoUpload onUploadSuccess={handleUploadSuccess} />
        {taskId && !videoUrl && (
          <ProcessingStatus 
            taskId={taskId} 
            onProcessingComplete={handleProcessingComplete} 
          />
        )}
        {videoUrl && <VideoPlayer videoUrl={videoUrl} />}
      </Paper>
    </Container>
  );
}

export default App;