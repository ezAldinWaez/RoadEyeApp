import React from 'react';  
import './FResultSection.css';  

const FResultSection = () => {  
    const statistics = [  
        { label: "Average Traffic Volume", value: "1200 vehicles/day" },  
        { label: "Peak Hour Traffic", value: "300 vehicles/hour" },  
        { label: "Average Speed", value: "45 km/h" },  
        { label: "Accident Rate", value: "2 accidents/month" },  
    ];  

    return (  
        <section className="fresult-section">  
            <h2>Traffic Statistics</h2>  
            <div className="statistics">  
                {statistics.map((stat, index) => (  
                    <div className="stat-item" key={index}>  
                        <h3>{stat.label}</h3>  
                        <p>{stat.value}</p>  
                    </div>  
                ))}  
            </div>  
        </section>  
    );  
};  

export default FResultSection;