import React, { useState } from 'react';  
import emailjs from 'emailjs-com';  // Import EmailJS  
import './Contact.css';  

const ContactSection = () => {  
    const [name, setName] = useState('');  
    const [email, setEmail] = useState('');  
    const [message, setMessage] = useState('');  
    const [success, setSuccess] = useState(false);  
    const [error, setError] = useState(false);  

    // Initialize EmailJS with Public Key  
    emailjs.init('BTq3qeetewBboOdDv'); // Replace with your actual public key  

    const handleSubmit = (e) => {  
        e.preventDefault();  

        const templateParams = {  
            from_name: name,  
            from_email: email,  
            message,  
        };  

        emailjs.send('service_5ha474o', 'template_dyp6fxm', templateParams) // Replace with actual Service ID and Template ID  
            .then((res) => {  
                console.log('SUCCESS!', res.status);  
                setSuccess(true);  
                setError(false);  
                setName('');  
                setEmail('');  
                setMessage('');  
            })  
            .catch((err) => {  
                console.error('FAILED...', err);  
                setError(true);  
                setSuccess(false);  
            });  
    };  

    return (  
        <section className="contact-section" id="contact">  
            <h2>Contact Us</h2>  
            <div className='content'>
                <img src={'/images/contact.webp'} alt='contact'/>
                <form onSubmit={handleSubmit}>  
                    <input  
                        type="text"  
                        placeholder="Your Name"  
                        value={name}  
                        onChange={(e) => setName(e.target.value)}  
                        required  
                    />  
                    <input  
                        type="email"  
                        placeholder="Your Email"  
                        value={email}  
                        onChange={(e) => setEmail(e.target.value)}  
                        required  
                    />  
                    <textarea  
                        placeholder="Your Message"  
                        value={message}  
                        onChange={(e) => setMessage(e.target.value)}  
                        required  
                    />  
                    <button type="submit">Send Message</button>  
                </form>  
            </div>

            {success && <p className="success-message" style={{color: 'green'}}>Message sent successfully!</p>}  
            {error && <p className="error-message" style={{color: 'red'}}>There was an error sending your message.</p>}  
        </section>  
    );  
};  

export default ContactSection;