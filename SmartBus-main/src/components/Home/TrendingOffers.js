import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box, Paper, IconButton, Snackbar, Alert } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FileCopyOutlinedIcon from '@mui/icons-material/FileCopyOutlined';
import './TrendingOffers.css';

const offers = [
  { code: 'NEXGILE10', description: 'Get 10% off on your booking!' },
  { code: 'NEXGILE20', description: 'Get 20% off on your booking!' },
  { code: 'OFFER3', description: 'Weekend special: 15% off!' },
  { code: 'OFFER4', description: 'Book now and save 10%!' },
  { code: 'OFFER5', description: 'Exclusive offer: 25% off!' },
];

const TrendingOffers = () => {
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const intervalRef = useRef(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    // Function to auto scroll every 10 seconds
    const autoScroll = () => {
      intervalRef.current = setInterval(() => {
        setCurrentOfferIndex((prevIndex) => (prevIndex === offers.length - 1 ? 0 : prevIndex + 1));
      }, 10000); // Change the interval time as needed (in milliseconds)
    };

    // Start auto scrolling
    autoScroll();

    // Clean up function to clear interval on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handlePrev = () => {
    setCurrentOfferIndex((prevIndex) => (prevIndex === 0 ? offers.length - 2 : prevIndex - 2));
  };

  const handleNext = () => {
    setCurrentOfferIndex((prevIndex) => (prevIndex === offers.length - 2 ? 0 : prevIndex + 2));
  };

  const showPrevButton = currentOfferIndex !== 0;
  const showNextButton = currentOfferIndex !== offers.length -1 ;

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setSnackbarMessage(`Copied: ${code}`);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className='tf'>
      <Box sx={{ width: '100%', textAlign: 'center', margin: '40px 0' }}>
        <Box className="offer-container">
          <Typography variant="h5" gutterBottom textAlign='start' marginLeft='15px' fontWeight={'500'} fontSize={'32px'}> 
            Trending Offers
          </Typography>
          <Box className="carousel-container">
            <Box
              style={{
                display: 'flex',
                transition: 'transform 0.5s ease', // Smooth transition for sliding effect
                transform: `translateX(-${currentOfferIndex * (100 / offers.length)}%)`, // Adjust based on current index
              }}
            >
              {offers.map((offer, index) => (
                <Paper
                  key={index}
                  className={`offer-paper offer-bg-${index % 5}`} // Adjust to % 7 for all 7 offers
                  elevation={1}
                  onClick={() => handleCopyCode(offer.code)}
                  sx={{ borderRadius:'30px'}} >
                  <Typography variant="h6" gutterBottom>
                    {offer.code}
                    <IconButton
                      aria-label="copy"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyCode(offer.code);
                      }}
                      style={{ position: 'absolute', color: 'white' }}
                    >
                      <FileCopyOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Typography>
                  <Typography variant="body2">{offer.description}</Typography>
                </Paper>
              ))}
            </Box>
            {showPrevButton && (
              <IconButton
                style={{ position: 'absolute', left: 0, top: '50%', marginLeft:'3px', transform: 'translateY(-50%)', zIndex: 5, backgroundColor:'white'}}
                onClick={handlePrev}
                variant='filled' 
              >
                <ArrowBackIosIcon />
              </IconButton>
            )}
            {showNextButton && (
              <IconButton
                style={{ position: 'absolute', right: 0, top: '50%', marginRight:'3px', transform: 'translateY(-50%)', zIndex: 1 , backgroundColor:'white'}}
                onClick={handleNext}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default TrendingOffers;
