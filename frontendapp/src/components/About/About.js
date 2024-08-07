import React from 'react';  
import './About.css';  

const AboutSection = () => {  
    return (  
        <section className="about-section" id='about'>  
            <h2>About Us</h2> 
            <div >
                <p>  
                    At RoadEye, we are dedicated to revolutionizing traffic analysis
                    through advanced technology. Our team of experts combines machine
                    insights for traffic management and urban planning.  
                    learning and computer vision to deliver accurate and actionable
                 
                    Our mission is to contribute to smarter cities and enhance mobility by leveraging data  
                    in innovative ways. With our solutions, you can better understand traffic patterns,  
                    reduce congestion, and make informed decisions for urban planning, We believe in making
                    roads safer and more efficient for everyone..  
                </p>
                <div style={{width:'50%'}}>
                    <img src={'/assets/logo.png'} style={{margin:'auto'}}/>
                </div>
            </div>
        </section>  
    );  
};  

export default AboutSection;