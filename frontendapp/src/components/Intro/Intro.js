import React, { useRef, useEffect } from 'react';  
import './Intro.css';  

function Intro() {  
    const videoRef = useRef(null);  

    useEffect(() => {  
        if (videoRef.current) {  
            videoRef.current.playbackRate = 0.1;
        }  
    }, []);  

    return (  
        <div className='Intro' id='Intro'>  
            <video   
                ref={videoRef}   
                autoPlay   
                loop   
                muted   
                className='Intro-video'   
                src={'/assets/video.mp4'}   
            />  
            <div className='text'>
                <h1>Car Detection Made Easy</h1>
                <h3>Upload your video and let our AI analyze traffic patterns and vehicle counts.</h3>
            </div>
        </div>  
    );  
}  

export default Intro;