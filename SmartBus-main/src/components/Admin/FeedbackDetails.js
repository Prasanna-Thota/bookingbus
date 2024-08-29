// FeedbackDetails.js
import React, { useEffect, useState } from 'react';
import './FeedbackDetails.css';
import axios from 'axios';
import { motion } from 'framer-motion';


const FeedbackDetails = () => {

    const [feedbackData, setFeedbackData] = useState([]);

    useEffect(() => {
        // Fetch feedback data from API when component mounts
        axios.get('http://localhost:5042/api/User/getContact')
            .then(response => {
                console.log(response);
                setFeedbackData(response.data); // Assuming API returns an array of feedback objects
            })
            .catch(error => {
                console.error('Error fetching feedback:', error);
            });
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (

        <motion.div
        initial={{ opacity: 0, x: -30 }} // Initial animation properties (starting from righht)
        animate={{ opacity: 1, x: 0 }} // Animation properties when component is mounted (move to center)
        transition={{ duration: 0.6, delay: 0.3 }} // Animation duration and delay
    >
        <div className="App1">
            <header className="App-header">
                <h1>Feedback Details</h1>
                <div className="feedback-box">
                    {feedbackData.map((feedback, index) => (
                        <div key={index} className="feedback-card">
                            <img src="/images/p.png" alt="Feedback" />
                            <div className="feedback-content">
                                <h2>{feedback.name}</h2>
                                <p><strong>Email:</strong> {feedback.email}</p>
                                <p><strong>Message:</strong> {feedback.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </header>
        </div>
    </motion.div>
    );
}

export default FeedbackDetails;
