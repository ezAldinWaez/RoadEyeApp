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
                        <li><a href="#FSection">Home</a></li>  
                        <li><a href="#about">About</a></li>  
                        <li><a href="#contact">Contact</a></li>  
                    </ul>  
                </div>  
                <div className="footer-section">  
                    <h3>Contact Us</h3>  
                    <p>Email: support@yourwebsite.com</p>  
                    <p>Phone: (123) 456-7890</p>  
                </div>  
            </div>  
            <div className="footer-bottom">  
                <p>© {new Date().getFullYear()} Your Company Name. All rights reserved.</p>  
            </div>  
        </footer>  
    );  
};  

export default Footer;