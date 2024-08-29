import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Grid, Snackbar } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt, faPhoneAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import '@fontsource/poppins';
import axios from 'axios';

const ContactUs = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!name || !email || !message) {
      setError('Please fill out all fields');
      return;
    }

    const formData = {
      name,
      email,
      message
    };

    try {
      const response = await axios.post('http://localhost:5042/api/User/contact', formData);
      console.log(response.data);
      setSnackbarMessage('Message sent successfully');
      setSnackbarOpen(true);
      resetData();
      // handle successful submission (e.g., show a success message)
    } catch (error) {
      console.error('There was an error sending the message!', error);
      setSnackbarMessage('Error sending message');
      setSnackbarOpen(true);
      // handle error (e.g., show an error message)
    }
  };

  const handleChangeName = (e) => {
    setName(e.target.value);
    setError('');
  };

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setError('');
  };

  const handleChangeMessage = (e) => {
    setMessage(e.target.value);
    setError('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };


  const resetData = () => {
    setName("");
    setEmail("");
    setMessage("");
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#c8e8e9',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <Container
        sx={{
          width: { xs: '90%', md: '85%' },
          backgroundColor: '#fff',
          borderRadius: '6px',
          p: { xs: 3, md: 5 },
          boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
          margin: '10px 10px',
        }}
      >
        <Grid container spacing={5}>
          <Grid item xs={12} md={4} sx={{ textAlign: { xs: 'center', md: 'left' } }}>
            <Box sx={{ mb: 3 }}>
              <FontAwesomeIcon icon={faMapMarkerAlt} size="2x" color="#ee4e5b" />
              <Typography variant="h6" fontWeight="500">Address</Typography>
              <Typography variant="body2" color="textSecondary">Madhapur, Ayyapa Society</Typography>
              <Typography variant="body2" color="textSecondary">Hyderabad</Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <FontAwesomeIcon icon={faPhoneAlt} size="2x" color="#ee4e5b" />
              <Typography variant="h6" fontWeight="500">Phone</Typography>
              <Typography variant="body2" color="textSecondary">+91 9908875799</Typography>
              <Typography variant="body2" color="textSecondary">+91 1234567890</Typography>
            </Box>
            <Box>
              <FontAwesomeIcon icon={faEnvelope} size="2x" color="#ee4e5b" />
              <Typography variant="h6" fontWeight="500">Email</Typography>
              <Typography variant="body2" color="textSecondary">smartbus@gmail.com</Typography>
              <Typography variant="body2" color="textSecondary">info.smartbus@gmail.com</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight="600" color="#ee4e5b">Send us a message</Typography>
            <Typography variant="body1" color="textSecondary" mb={3}>
              If you have any issues facing in the booking application, you can send me a message from here. It's my pleasure to help you.
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="Enter your name"
                name="name"
                value={name}
                onChange={handleChangeName}
                sx={{ backgroundColor: '#F0F1F8', borderRadius: 1 }}
              />
              <TextField
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="Enter your email"
                name="email"
                value={email}
                onChange={handleChangeEmail}
                sx={{ backgroundColor: '#F0F1F8', borderRadius: 1 }}
              />
              <TextField
                fullWidth
                margin="normal"
                variant="outlined"
                placeholder="Enter your message"
                name="message"
                value={message}
                onChange={handleChangeMessage}
                multiline
                minRows={4}
                sx={{ backgroundColor: '#F0F1F8', borderRadius: 1 }}
              />
              {error && (
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              )}
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2, backgroundColor: '#ee4e5b', '&:hover': { backgroundColor: '#5029bc' } }}
              >
                Send Now
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar to display success/error message */}
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </Box>
  );
};

export default ContactUs;
