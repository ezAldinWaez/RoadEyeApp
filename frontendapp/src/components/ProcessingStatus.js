import React, { useEffect, useState } from 'react';
import { LinearProgress, Typography } from '@mui/material';

const ProcessingStatus = ({ taskId, onProcessingComplete }) => {
  const [status, setStatus] = useState({ progress: 0, details: 'Initializing...' });

  useEffect(() => {
    let socket;
    let retryCount = 0;
    const maxRetries = 5;

    const connectWebSocket = () => {
      console.log('Attempting to connect WebSocket for taskId:', taskId);
      socket = new WebSocket(`ws://localhost:8000/ws/video/${taskId}/`);

      socket.onopen = () => {
        console.log('WebSocket connected successfully');
        retryCount = 0;
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
          setTimeout(connectWebSocket, 3000);
        }
      };

      socket.onclose = (event) => {
        console.log('WebSocket closed:', event);
        if (!event.wasClean && retryCount < maxRetries) {
          retryCount++;
          console.log(`Connection closed. Retrying (${retryCount}/${maxRetries})...`);
          setTimeout(connectWebSocket, 3000);
        }
      };

      socket.onmessage = (event) => {
        console.log('Received WebSocket message:', event.data);
        const data = JSON.parse(event.data);
        setStatus(data.message);

        if (data.message.progress === 100 && data.message.video_url) {
          console.log('Processing complete, calling onProcessingComplete with URL:', data.message.video_url);
          onProcessingComplete(data.message.video_url);
        }
      };
    };

    connectWebSocket();

    return () => {
      console.log('Closing WebSocket');
      if (socket) {
        socket.close();
      }
    };
  }, [taskId, onProcessingComplete]);

  return (
    <div>
      <Typography variant="h6">Processing Video</Typography>
      <LinearProgress variant="determinate" value={status.progress} />
      <Typography>{status.details}</Typography>
    </div>
  );
};

export default ProcessingStatus;