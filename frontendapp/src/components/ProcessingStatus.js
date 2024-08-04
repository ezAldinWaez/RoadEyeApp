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
        console.log(socket);
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

// import React, { useEffect, useState } from 'react';  
// import { LinearProgress, Typography } from '@mui/material';  

// const ProcessingStatus = ({ taskId, onProcessingComplete }) => {  
//   const [status, setStatus] = useState({ progress: 0, details: 'Initializing...' });  

//   useEffect(() => {  
//     let socket;  
//     let retryCount = 0;  
//     const maxRetries = 5;  

//     const connectWebSocket = () => {  
//       console.log('Attempting to connect WebSocket for taskId:', taskId);  
//       socket = new WebSocket(`ws://localhost:8000/ws/video/${taskId}/`);

//       socket.onopen = () => {  
//         console.log('WebSocket connected successfully');  
//         retryCount = 0;  
//       };  

//       socket.onerror = (error) => {  
//         console.error('WebSocket error:', error);  
//         if (retryCount < maxRetries) {  
//           retryCount++;  
//           console.log(`Retrying connection (${retryCount}/${maxRetries})...`);  
//           setTimeout(connectWebSocket, 3000);  
//         }  
//       };  

//       socket.onclose = (event) => {  
//         console.log('WebSocket closed:', event, status, 'hellllooo');  
//         if (!event.wasClean && retryCount < maxRetries) {  
//           retryCount++;  
//           console.log(`Connection closed. Retrying (${retryCount}/${maxRetries})...`);  
//           setTimeout(connectWebSocket, 3000);  
//         }  
//       };  

//       socket.onmessage = (event) => {  
//         console.log('Received WebSocket message:', event.data);  
//         const data = JSON.parse(event.data);  
//         setStatus(data.message);  

//         if (data.message.progress === 100 && data.message.video_url) {  
//           console.log('Processing complete, calling onProcessingComplete with URL:', data.message.video_url);  
//           onProcessingComplete(data.message.video_url);  
//         }  
//       };  
//     };  

//     connectWebSocket();  

//     return () => {  
//       console.log('Closing WebSocket');  
//       if (socket) {  
//         socket.close();  
//       }  
//     };  
//   }, [taskId, onProcessingComplete]);  

//   return (  
//     <div>  
//       <Typography variant="h6">Processing Video</Typography>  
//       <LinearProgress variant="determinate" value={status.progress} />  
//       <Typography>{status.details}</Typography>  
//     </div>  
//   );  
// };  

// export default ProcessingStatus;

// import React, { useEffect, useState } from 'react';  
// import { LinearProgress, Typography } from '@mui/material';  

// const ProcessingStatus = ({ taskId, onProcessingComplete }) => {  
//   const [status, setStatus] = useState({ progress: 0, details: 'Initializing...' });  
//   const [isMounted, setIsMounted] = useState(true); // Track if the component is mounted  

//   useEffect(() => {  
//     let socket;  
//     let retryCount = 0;  
//     const maxRetries = 5;  

//     // Connect WebSocket function  
//     const connectWebSocket = () => {  
//       console.log('Attempting to connect WebSocket for taskId:', taskId);  
//       socket = new WebSocket(`ws://localhost:8000/ws/video/${taskId}/`);  

//       socket.onopen = () => {  
//         console.log('WebSocket connected successfully');  
//         retryCount = 0;  
//       };  

//       socket.onerror = (error) => {  
//         console.error('WebSocket error:', error);
//         console.log(status)  
//         if (retryCount <= maxRetries) {  
//           retryCount++;  
//           console.log(`Retrying connection (${retryCount}/${maxRetries})...`);  
//           setTimeout(connectWebSocket, 3000);  
//         }  
//       };  

//       socket.onclose = (event) => {  
//         console.log('WebSocket closed:', event);  
//         if (!event.wasClean && retryCount < maxRetries) {  
//           retryCount++;  
//           console.log(`Connection closed. Retrying (${retryCount}/${maxRetries})...`);  
//           setTimeout(connectWebSocket, 3000);  
//         }  
//       };  

//       socket.onmessage = (event) => {  
//         console.log('Received WebSocket message:', event.data);  
//         try {  
//           const data = JSON.parse(event.data);  
//           // Only update state if the component is still mounted  
//           if (isMounted) {  
//             setStatus(data.message);  
//             if (data.message.progress === 100 && data.message.video_url) {  
//               console.log('Processing complete, calling onProcessingComplete with URL:', data.message.video_url);  
//               onProcessingComplete(data.message.video_url);  
//             }  
//           }  
//         } catch (err) {  
//           console.error('Error parsing WebSocket message:', err);  
//         }  
//       };  
//     };  

//     connectWebSocket();  

//     // Set isMounted to true when the component mounts  
//     setIsMounted(true);  

//     return () => {  
//       // Cleanup function that runs on component unmount  
//       console.log('Closing WebSocket');  
//       setIsMounted(false); // Update the mounted state to false  
//       if (socket) {  
//         socket.close();  
//       }  
//     };  
//   }, [taskId, onProcessingComplete]);  

//   return (  
//     <div>  
//       <Typography variant="h6">Processing Video</Typography>  
//       <LinearProgress variant="determinate" value={status.progress} />  
//       <Typography>{status.details}</Typography>  
//     </div>  
//   );  
// };  

// export default ProcessingStatus;

// import React, { useEffect, useState, useRef } from 'react';
// import { LinearProgress, Typography } from '@mui/material';

// const ProcessingStatus = ({ taskId, onProcessingComplete }) => {
//   const [status, setStatus] = useState({ progress: 0, details: 'Initializing...' });
//   const socketRef = useRef(null);
//   const retryCountRef = useRef(0);
//   const maxRetries = 5;
//   const isUnmountedRef = useRef(false);

//   useEffect(() => {
//     const connectWebSocket = () => {
//       if (isUnmountedRef.current) return;
//       console.log('Attempting to connect WebSocket for taskId:', taskId);
//       socketRef.current = new WebSocket(`ws://localhost:8000/ws/video/${taskId}/`);

//       socketRef.current.onopen = () => {
//         console.log('WebSocket connected successfully');
//         retryCountRef.current = 0;
//       };

//       socketRef.current.onerror = (error) => {
//         console.error('WebSocket error:', error);
//         if (retryCountRef.current < maxRetries) {
//           retryCountRef.current++;
//           console.log(`Retrying connection (${retryCountRef.current}/${maxRetries})...`);
//           setTimeout(connectWebSocket, 3000);
//         }
//       };

//       socketRef.current.onclose = (event) => {
//         console.log('WebSocket closed:', event);
//         if (!event.wasClean && retryCountRef.current < maxRetries && !isUnmountedRef.current) {
//           retryCountRef.current++;
//           console.log(`Connection closed. Retrying (${retryCountRef.current}/${maxRetries})...`);
//           setTimeout(connectWebSocket, 3000);
//         }
//       };

//       socketRef.current.onmessage = (event) => {
//         console.log('Received WebSocket message:', event.data);
//         try {
//           const data = JSON.parse(event.data);
//           if (!isUnmountedRef.current) {
//             setStatus(data.message);
//             if (data.message.progress === 100 && data.message.video_url) {
//               console.log('Processing complete, calling onProcessingComplete with URL:', data.message.video_url);
//               onProcessingComplete(data.message.video_url);
//             }
//           }
//         } catch (err) {
//           console.error('Error parsing WebSocket message:', err);
//         }
//       };
//     };

//     connectWebSocket();

//     return () => {
//       isUnmountedRef.current = true;
//       if (socketRef.current) {
//         console.log('Closing WebSocket', status);
//         socketRef.current.close();
//       }
//     };
//   }, [taskId, onProcessingComplete]);

//   return (
//     <div>
//       <Typography variant="h6">Processing Video</Typography>
//       <LinearProgress variant="determinate" value={status.progress} />
//       <Typography>{status.details}</Typography>
//     </div>
//   );
// };

// export default ProcessingStatus;
