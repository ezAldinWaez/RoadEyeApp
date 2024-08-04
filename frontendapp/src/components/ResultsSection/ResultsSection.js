import React from 'react';
import VideoPlayer from "../VideoPlayer"

const ResultsSection = ({ videoUrl }) => {
    return (
        <div>
            { videoUrl && <VideoPlayer videoUrl={videoUrl} /> }
        </div>
    );  
};  

export default ResultsSection;