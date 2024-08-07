import React from 'react';  
import './Footer.css';  

const Footer = () => {  
    return (  
        <footer className="footer">  
            <div className="footer-content">  
                <div className="footer-section">  
                    <h3>About Us</h3>  
                    <p>  
                        We are dedicated to providing accurate traffic analysis using advanced AI technology.  
                    </p>  
                </div>  
                <div className="footer-section">  
                    <h3>Quick Links</h3>  
                    <ul>  
                        <li><a href="#Intro">Home</a></li>  
                        <li><a href="#about">About</a></li>  
                        <li><a href="#contact">Contact</a></li>  
                    </ul>  
                </div>  
                <div className="footer-section">  
                    <h3>Contact Us</h3>  
                    <p>Email: 
                    <br/>
                    mohammadyl69ghannam@gmail.com</p>  
                    <p>Phone:
                    <br/>
                    +963 984 166 888</p>  
                </div>  
            </div>  
            <div className="footer-bottom">  
                <p>© {new Date().getFullYear()} RoadEye. All rights reserved.</p>  
            </div>  
        </footer>  
    );  
};  

export default Footer;