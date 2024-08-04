import React from 'react';
import VideoPlayer from "../VideoPlayer"

const ResultsSection = ({ videoUrlOrg, videoUrlOut }) => {
    return (
        <div>
            { videoUrlOut && <VideoPlayer videoUrlOrg={videoUrlOrg} videoUrlOut={videoUrlOut} /> }
        </div>
    );  
};  

export default ResultsSection;