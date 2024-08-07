import React from 'react';  
import './WorkflowSection.css';  

const WorkflowSection = () => {  
    return (  
        <section className="WorkflowSection">  
            <h2>How It Works</h2>  
            <div className="steps">  
                <div className="step">  
                    <div className="step-number">1</div>  
                    <h3>Data Collection</h3>  
                    <p>
                    Upload your video footage directly to our platform. We support various formats for a seamless experience. Once uploaded, our algorithms begin processing the data to extract valuable information.
                    </p>  
                </div>  
                <div className="step">  
                    <div className="step-number">2</div>  
                    <h3>Analysis</h3>  
                    <p>
                    Our AI-driven tools detect and track vehicles in real-time. We provide insights into vehicle counts, types, speeds, and movement patterns, helping you understand traffic dynamics effectively.
                    </p>  
                </div>  
                <div className="step">  
                    <div className="step-number">3</div>  
                    <h3>Insights</h3>  
                    <p>
                    Receive comprehensive reports and visualizations highlighting key metrics. Our insights assist in traffic management, urban planning, and enhancing road safety for better community outcomes.
                    </p>  
                </div>  
            </div>  
        </section>  
    );  
};  

export default WorkflowSection;