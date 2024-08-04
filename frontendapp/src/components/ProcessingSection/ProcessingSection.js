import React, { useEffect, useState, useCallback } from "react";
import { LinearProgress } from "@mui/material";
import { Chart1 } from "..";

const ProcessingSection = ({ taskId, onProcessingComplete }) => {
  const [status, setStatus] = useState({
    progress: 0,
    details: "Initializing...",
  });
  const [array] = useState([]);

  // Ensure onProcessingComplete is stable
  const handleProcessingComplete = useCallback(
    (url_org, url_out) => {
      onProcessingComplete(url_org, url_out);
    },
    [onProcessingComplete]
  );

  useEffect(() => {
    let socket;
    let retryCount = 0;
    const maxRetries = 5;

    const connectWebSocket = () => {
      console.log("Attempting to connect WebSocket for taskId:", taskId);
      socket = new WebSocket(`ws://localhost:8000/ws/video/${taskId}/`);

      socket.onopen = () => {
        console.log("WebSocket connected successfully");
        retryCount = 0;
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying connection (${retryCount}/${maxRetries})...`);
          setTimeout(connectWebSocket, 1000);
        }
      };

      socket.onclose = (event) => {
        console.log("WebSocket closed:", event);
        if (!event.wasClean && retryCount < maxRetries) {
          retryCount++;
          console.log(
            `Connection closed. Retrying (${retryCount}/${maxRetries})...`
          );
          setTimeout(connectWebSocket, 1000);
        }
      };

      socket.onmessage = (event) => {
        console.log("Received WebSocket message:", event.data);
        const data = JSON.parse(event.data);
        setStatus(data.message);

        let willAppend = true;
        for (let i = 0; i < array.length; i++)                                                                      
          if (data.message.video_url_out || array[i].frame_num === data.message.details.frame_num) {
            willAppend = false;
            break;
          }
        if (willAppend) array.push(data.message.details);

        if (data.message.progress === 100 && data.message.video_url_out) {
          console.log(
            "Processing complete, calling onProcessingComplete with URL:",
            data.message.video_url_out
          );
          handleProcessingComplete(data.message.video_url_org, data.message.video_url_out);
        }
      };
    };

    connectWebSocket();

    return () => {
      console.log("Closing WebSocket");
      if (socket) {
        socket.close();
      }
    };
  }, [taskId, handleProcessingComplete]);

  console.log(array);

  return (
    <div>
      <h2 style={{
        textAlign: 'center',
        color: 'var(--main-color)',
        marginBottom: '20px',
        fontSize: '2.5em',
      }}>Processing Video</h2>
      {/* <Typography variant="h6">Processing Video</Typography> */}
      <LinearProgress variant="determinate" value={status.progress} />
      <div className="Charts_section" style={{display: 'flex'}}>
        <Chart1 data={array.slice(-12)} />
      </div>
    </div>
  );
};

export default ProcessingSection;
