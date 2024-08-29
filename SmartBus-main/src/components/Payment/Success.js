import React, { useEffect } from 'react';
import { Container, Paper, Typography, Box, Slide } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { useNavigate } from 'react-router-dom'; // Import useHistory hook

const Success = () => {

  const navigate = useNavigate();

  useEffect(() => {
    const redirectHome = setTimeout(() => {
      navigate('/'); // Redirect to home page
    }, 5000); // 5000 milliseconds = 5 seconds
  
    return () => clearTimeout(redirectHome); // Clear timeout on component unmount
  }, [navigate]); // Include navigate in the dependency array
  

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Slide direction="up" in={true} mountOnEnter unmountOnExit>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center', transition: 'width 0.3s ease-in-out' }}>
          <Box sx={{ mb: 3 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'green' }} />
          </Box>
          <Typography variant="h5" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1">
            Your booking has been successfully processed. Thank you for choosing our service.
          </Typography>
        </Paper>
      </Slide>
    </Container>
  );
};

export default Success;
