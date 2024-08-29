import React, { useState, useEffect, } from 'react';
import axios from 'axios';
import { Box, Button, Stack, TextField, Grid, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [city, setCity] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [termsError, setTermsError] = useState('');
  const [backendError, setBackendError] = useState(""); // State for backend errors
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId;
    if (backendError) {
        timeoutId = setTimeout(() => {
            setBackendError("");
        }, 5000); // 5000 milliseconds = 5 seconds
    }

    return () => clearTimeout(timeoutId);
}, [backendError]);


  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    const usernameRegex = /^[a-zA-Z\s]+$/;
    if (value.length === 0) {
      setUsernameError('');
    } else if (!usernameRegex.test(value)) {
      setUsernameError('Username must contain only letters');
    } else {
      setUsernameError('');
    }
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.length === 0) {
      setEmailError('');
    } else if (!emailRegex.test(value)) {
      setEmailError('Enter a valid email address.');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length === 0) {
      setPasswordError('');
    } else if (value.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
      setPasswordError('Password must be alphanumeric.');
    } else if (!/[A-Z]/.test(value)) {
      setPasswordError('Password must include at least one uppercase letter.');
    } else if (!/[a-z]/.test(value)) {
      setPasswordError('Password must include at least one lowercase letter.');
    } else if (!/\d/.test(value)) {
      setPasswordError('Password must include at least one digit.');
    } else if (!/[!@#$%^&*()_+{}[\]:;<>,.?~-]/.test(value)) {
      setPasswordError('Password must include at least one special character.');
    } else if (/\s/.test(value)) {
      setPasswordError('Password must not contain spaces.');
    } else {
      setPasswordError('');
    }
  };

 const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value.length === 0) {
      setConfirmPasswordError('');
    } else if (value !== password) {
      setConfirmPasswordError('Passwords do not match.');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleTermsChange = (e) => {
    setTermsChecked(e.target.checked);
    if (!e.target.checked) {
      setTermsError('Please accept the terms and conditions.');
    } else {
      setTermsError('');
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (username.trim() === '') {
      setUsernameError('Username cannot be empty.');
      return;
    }
    if (email.trim() === '') {
      setEmailError('Email cannot be empty.');
      return;
    }
    if (password.trim() === '') {
      setPasswordError('Password cannot be empty.');
      return;
    }
    if (confirmPassword.trim() === '') {
      setConfirmPasswordError('Confirm Password cannot be empty.');
      return;
    }
    if (city.trim() === '') {
      // Optional: Add validation for city field if required
    }
    if (!termsChecked) {
      setTermsError('Please accept the terms and conditions.');
      return;
    }
    try {
      const userDetails = {
        UserName: username,
        Email: email,
        Password: password,
        City: city,
        TermsAccepted: termsChecked ? 'yes' : 'no'
      };
  
      const response = await axios.post('http://localhost:5042/api/User/signup', userDetails);
      
      console.log('User created successfully:', response.data);
      navigate("/signin");
      
      // Reset form fields and state if needed
    } catch (error) {
      console.error("There was an error!", error);
      // Handle error states or display error messages as needed
      if (error.response) {
          setBackendError(error.response.data); // Set backend error message
      } else {
          setBackendError("Failed to connect to the server."); // Generic error message
      }
    }
  };
  

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '120vh',
        backgroundColor: '#f0f0f0',
        fontFamily: 'Poppins, sans-serif',
        overflowY: 'auto', // Add scroll overflow for small screens

      }}
    >
      <Grid
        container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '70%',
          boxShadow: 3,
          borderRadius: 2,
          overflow: 'hidden',
          height: '90%',
          backgroundColor: 'white',
          overflowY: 'auto', // Add scroll overflow for small screens
        }}
      >
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            background: `url("/images/bus.jpg") no-repeat center center`,
            backgroundSize: 'contain', // Adjust image size responsively
            padding: '40px',
            height: { xs: '50vh', md: '100%' },
            flex: '1', // Take full height on small screens
          }}
        />
        <Grid
          item
          xs={12}
          md={6}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px 20px',
            textAlign: 'center',
          }}
        >
          

          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '350px' }}>
            <Stack spacing={1.5} sx={{ width: '100%' }}>
              <p style={{ fontSize: '30px', margin: '0 0 10px', fontWeight: 'bold', color: '#333', textAlign: 'start' }}>SignUp</p>
              {backendError && (
                <Alert severity="error">
                  {backendError}
                </Alert>
              )}
              <TextField
                name="username"
                label="Username*"
                variant="standard"
                value={username}
                onChange={handleUsernameChange}
                helperText={usernameError}
                error={Boolean(usernameError)}
                sx={{ width: '100%' }}
              />
              <TextField
                name="email"
                label="Email*"
                variant="standard"
                value={email}
                onChange={handleEmailChange}
                helperText={emailError}
                error={Boolean(emailError)}
                sx={{ width: '100%' }}
              />
              <TextField
                name="password"
                label="Password*"
                type="password"
                variant="standard"
                value={password}
                onChange={handlePasswordChange}
                helperText={passwordError}
                error={Boolean(passwordError)}
                sx={{ width: '100%' }}
              />
              <TextField
                name="confirmPassword"
                label="Confirm Password*"
                type="password"
                variant="standard"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                helperText={confirmPasswordError}
                error={Boolean(confirmPasswordError)}
                sx={{ width: '100%' }}
              />
              <TextField
                name="city"
                label="City*"
                variant="standard"
                value={city}
                onChange={handleCityChange}
                sx={{ width: '100%' }}
              />
             <FormControlLabel
                control={<Checkbox checked={termsChecked} onChange={handleTermsChange} />}
                label={
                    <span>
                    I agree to the terms and conditions
                    {termsError && <span style={{ color: 'red' }}>*</span>}
                    </span>
                }
                sx={{ textAlign: 'start' }}
                />
                {termsError && (
                <p style={{ color: '#d32f2f', fontSize: '12px', textAlign: 'start', margin: '0', marginTop: '8px', fontFamily:'Roboto, Helvetica, Arial, sans-serif' }}>{termsError}</p>
                )}

              <p style={{ margin: '20px 0 5px 0', color: '#666' }}>Already have an account? <a href="/signin" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>SignIn</a></p>
              
              <Button
                type="submit"
                variant="contained"
                size='large'
                borderRadius='0'
              >
                Submit
              </Button>

            </Stack>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
}

export default SignUp;
