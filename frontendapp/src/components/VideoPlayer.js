// import React, { useEffect, useRef } from 'react';
// import { Typography } from '@mui/material';

// const VideoPlayer = ({ videoUrl }) => {
//   const videoRef = useRef(null);

//   useEffect(() => {
//     console.log('VideoPlayer mounted with URL:', videoUrl);
//   }, [videoUrl]);

//   const handleCanPlay = () => {
//     console.log('Video can play. Duration:', videoRef.current.duration);
//   };

//   const handleError = (e) => {
//     console.error('Video error:', e);
//   };

//   return (
//     <div>
//       <Typography variant="h6">Processed Video</Typography>
//       <video 
//         ref={videoRef}
//         controls 
//         width="100%" 
//         onCanPlay={handleCanPlay}
//         onError={handleError}
//       >
//         <source src={videoUrl} type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       <Typography>Video URL: {videoUrl}</Typography>
//     </div>
//   );
// };

// export default VideoPlayer;

import React, { useEffect, useRef } from 'react';  
import { Typography } from '@mui/material';  

const VideoPlayer = ({ videoUrl }) => {  
  const videoRef = useRef(null);  

  useEffect(() => {  
    console.log('VideoPlayer mounted with URL:', videoUrl);  
  }, [videoUrl]);  

  const handleCanPlay = () => {  
    console.log('Video can play. Duration:', videoRef.current.duration);  
  };  

  const handleError = (e) => {  
    console.error('Video error:', e);  
  };  

  return (  
    <div>  
      <Typography variant="h6">Processed Video</Typography>  
      <video   
        ref={videoRef}  
        controls   
        width="100%"   
        onCanPlay={handleCanPlay}  
        onError={handleError}  
      >  
        <source src={videoUrl} type="video/mp4" />  
        Your browser does not support the video tag.  
      </video>  
      <Typography>Video URL: {videoUrl}</Typography>  
    </div>  
  );  
};

export default VideoPlayer;