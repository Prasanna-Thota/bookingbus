import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import {
  Typography,
  IconButton,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import './Footer.css'; // Ensure your Footer.css file is properly linked with styles

export const Footer = () => {
  return (
    <>
      <div className="footer-container">
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <img src="/images/logo.png" alt="redBus Logo" className="footer-logo"/>
              <p className='matter'>SmartBus is the world's largest online bus ticket booking service trusted by over 25 million happy customers globally. SmartBus offers bus ticket booking through its website, iOS and Android mobile apps for all major routes.</p>
            </div>
            
            <div className="footer-section">
              <Typography variant="h6">About SmartBus</Typography>
              <ul>
                <li><Link to="#">About us</Link></li>
                <li><Link to="#">Investor Relations</Link></li>
                <li><Link to="#">Contact us</Link></li>
                <li><Link to="#">Mobile version</Link></li>
                <li><Link to="#">SmartBus on mobile</Link></li>
                <li><Link to="#">Sitemap</Link></li>
                <li><Link to="#">Offers</Link></li>
                <li><Link to="#">Careers</Link></li>
                <li><Link to="#">Values</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <Typography variant="h6">Info</Typography>
              <ul>
                <li><Link to="#">T&C</Link></li>
                <li><Link to="#">Privacy policy</Link></li>
                <li><Link to="#">FAQ</Link></li>
                <li><Link to="#">Blog</Link></li>
                <li><Link to="#">Bus operator registration</Link></li>
                <li><Link to="#">Agent registration</Link></li>
                <li><Link to="#">Insurance partner</Link></li>
                <li><Link to="#">User agreement</Link></li>
                <li><Link to="#">Primo Bus</Link></li>
                <li><Link to="#">Bus Timetable</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <Typography variant="h6">Global Sites</Typography>
              <ul>
                <li><Link to="#">India</Link></li>
                <li><Link to="#">Singapore</Link></li>
                <li><Link to="#">Malaysia</Link></li>
                <li><Link to="#">Indonesia</Link></li>
                <li><Link to="#">Peru</Link></li>
                <li><Link to="#">Colombia</Link></li>
                <li><Link to="#">Cambodia</Link></li>
                <li><Link to="#">Vietnam</Link></li>
              </ul>
            </div>
            
            <div className="footer-section">
              <Typography variant="h6">Our Partners</Typography>
              <ul>
                <li><Link to="#">Goibibo Bus</Link></li>
                <li><Link to="#">Goibibo Hotels</Link></li>
                <li><Link to="#">Makemytrip Hotels</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p>&copy; 2024 Smartbus India Pvt Ltd. All rights reserved</p>
            <div className="social-icons">
            <IconButton component="a" href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" sx={{ color: '#3b5998' }}><FacebookIcon fontSize="medium" /></IconButton>
            <IconButton component="a" href="https://www.twitter.com/" target="_blank" rel="noopener noreferrer" sx={{ color: '#00acee' }}><TwitterIcon fontSize="medium" /></IconButton>
            <IconButton component="a" href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" sx={{ color: '#e4405f' }}><InstagramIcon fontSize="medium" /></IconButton>
            <IconButton component="a" href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer" sx={{ color: '#0077b5' }}><LinkedInIcon fontSize="medium" /></IconButton>

            </div>
          </div>
        </footer>
      </div>
    </>  
  );
};