import React from 'react';  
import './SSection.css';  

const SSection = () => {  
    return (  
        <section className="SSection">  
            <h2>How It Works</h2>  
            <div className="steps">  
                <div className="step">  
                    <div className="step-number">1</div>  
                    <h3>Data Collection</h3>  
                    <p>We gather real-time video feed from traffic cameras to analyze vehicle counts.</p>  
                </div>  
                <div className="step">  
                    <div className="step-number">2</div>  
                    <h3>Processing</h3>  
                    <p>Our AI algorithms process the video feed to accurately detect and classify vehicles.</p>  
                </div>  
                <div className="step">  
                    <div className="step-number">3</div>  
                    <h3>Analysis</h3>  
                    <p>We analyze traffic patterns and produce reports to assist in traffic management.</p>  
                </div>  
                <div className="step">  
                    <div className="step-number">4</div>  
                    <h3>Insights</h3>  
                    <p>Gain valuable insights from our comprehensive data reports and visualizations.</p>  
                </div>  
            </div>  
        </section>  
    );  
};  

export default SSection;