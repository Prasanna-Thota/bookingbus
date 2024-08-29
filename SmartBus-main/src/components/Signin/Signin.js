import React, { useState, useEffect } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, TextField } from '@mui/material';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Snackbar, SnackbarContent } from '@mui/material';

const SignIn = () => {
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [backendError, setBackendError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [resetUsername, setResetUsername] = useState('');
  const [resetUsernameError, setResetUsernameError] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success'); // or 'error'

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let timeoutId;
    if (backendError) {
      timeoutId = setTimeout(() => {
        setBackendError('');
      }, 5000); // 5000 milliseconds = 5 seconds
    }

    return () => clearTimeout(timeoutId);
  }, [backendError]);

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);

    // Username validation (only letters)
    const usernameRegex = /^[a-zA-Z\s]+$/;
    if (value.length === 0) {
      setUsernameError('');
    } else if (!usernameRegex.test(value)) {
      setUsernameError('Username must contain only letters');
    } else {
      setUsernameError('');
    }
  };

  const handleUsernameForResetChange = (e) => {
    const value = e.target.value;
    setResetUsername(value);

    // Username validation (only letters)
    const usernameRegex = /^[a-zA-Z\s]+$/;
    if (value.length === 0) {
      setResetUsernameError('');
    } else if (!usernameRegex.test(value)) {
      setResetUsernameError('Username must contain only letters');
    } else {
      setResetUsernameError('');
    }
  };

  const handleEmailForResetChange = (e) => {
    const value = e.target.value;
    setResetEmail(value);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value.length === 0) {
      setResetEmailError('');
    } else if (!emailRegex.test(value)) {
      setResetEmailError('Invalid email address');
    } else {
      setResetEmailError('');
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    // Password validation
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (username.trim() === '') {
      setUsernameError('Username cannot be empty.');
      return;
    }
    if (password.trim() === '') {
      setPasswordError('Password cannot be empty.');
      return;
    }

    try {
      const response = await axios.get('http://localhost:5042/api/User/signin', {
        params: {
          userName: username,
          password: password,
        },
      });

      console.log(response.data); // Log the response data

      localStorage.setItem('username', username);

      if (location.state && location.state.redirectTo && location.state.redirectTo.state) {
        navigate(location.state.redirectTo.pathname, { state: location.state.redirectTo.state });
      } else {
        window.location.reload();
        navigate('/', { state: { username: 'username' } });
      }

    } catch (error) {
      console.error('There was an error!', error);

      // Handle error states or display error messages as needed
      if (error.response) {
        setBackendError(error.response.data); // Set backend error message
      } else {
        setBackendError('Failed to connect to the server.'); // Generic error message
      }
    }
  };

  const handleForgetPassword = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const sendMail = (username, password, email) => {
    const emailUrl = 'http://localhost:5042/api/email/sendEmail';
    const emailPayload = {
      toEmail: email,
      subject: 'Password Reset Confirmation',
      body: `
        Dear ${username},
        
        Your password has been reset successfully. Below is your new password:
        
        Password: ${password}
        
        Please make sure to change your password after logging in for security reasons.
        
        Best regards,
        Your Company Team
      `
    };

    axios.post(emailUrl, emailPayload)
      .then(response => {
        console.log('Email sent successfully:', response.data);
        setSnackbarMessage('Password reset email sent successfully.');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error('Error sending email:', error);
        setSnackbarMessage('An error occurred while sending the reset email. Please try again.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleSendResetLink = () => {
    // Validate username and email inputs
    if (resetUsername.trim() === '') {
      setResetUsernameError('Username cannot be empty.');
      return;
    }
    if (resetEmail.trim() === '') {
      setResetEmailError('Email cannot be empty.');
      return;
    }

    axios.get(`http://localhost:5042/api/User/verifyuser/${resetUsername}/${resetEmail}`)
      .then(response => {
        if (response.data) {
          // Assuming your API returns user details or some confirmation
          console.log('User found:', response.data);

          sendMail(response.data.userName, response.data.password, response.data.email);
          // Display success message or proceed with next steps
          setOpenDialog(false);
        } else {
          // Handle case where user is not found
          setResetUsernameError('Username not found.');
        }
      })
      .catch(error => {
        console.error('Error fetching user:', error);
        // Display error message
        if (error.response && error.response.status === 404) {
          setResetUsernameError('Username not found.');
        } 
        else if(error.response.status === 400)
        {
          setResetEmailError('Invalid Email');
        }
        else {
          setResetUsernameError('An error occurred while sending the reset link. Please try again.');
        }
      });

    // Close the dialog after handling
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f0f0',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <Grid
        container
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '80%',
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
            background: `url("/images/bus1.jpg") no-repeat center center`,
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
              <p style={{ fontSize: '30px', margin: '0 0 10px', fontWeight: 'bold', color: '#333', textAlign: 'start' }}>SignIn</p>

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
              <div>
                <p style={{ margin: '30px 0 5px 0', color: '#666', float: 'left', }}>
                  <a href="#!" onClick={handleForgetPassword} style={{ color: '#1976d2', textDecoration: 'none', }}>
                    Forget Password?
                  </a>
                </p>
                <p style={{ margin: '30px 0 5px 0', color: '#666', float: 'right' }}>
                  New User? &nbsp;
                  <a href="/signup" style={{ color: '#1976d2', textDecoration: 'none', }}>
                    SignUp
                  </a>
                </p>
              </div>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  fontWeight: 'bold',
                  fontFamily: 'Poppins, sans-serif',
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#125aa9',
                  },
                }}
              >
                Submit
              </Button>
              <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="form-dialog-title"
                sx={{
                  '& .MuiDialog-paper': {
                    width: '400px',
                    height: 'auto',
                  }
                }}
              >
                <DialogTitle id="form-dialog-title">Reset Password</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="usernameForReset"
                    label="Enter Registered Username"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={resetUsername}
                    onChange={handleUsernameForResetChange}
                    helperText={resetUsernameError}
                    error={Boolean(resetUsernameError)}
                  />
                  <TextField
                    margin="dense"
                    id="emailForReset"
                    label="Enter Registered Email"
                    type="email"
                    fullWidth
                    variant="standard"
                    value={resetEmail}
                    onChange={handleEmailForResetChange}
                    helperText={resetEmailError}
                    error={Boolean(resetEmailError)}
                  />
                </DialogContent>
                <DialogActions>
                  <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={handleCloseDialog} variant="contained" color="primary" sx={{ marginLeft: '10px', marginBottom: '5px' }}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendResetLink} variant="contained" color="primary" sx={{ marginRight: '10px', marginBottom: '5px' }}>
                      Send password
                    </Button>
                  </Box>
                </DialogActions>
              </Dialog>
            </Stack>
          </form>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <SnackbarContent
          sx={{
            backgroundColor: snackbarSeverity === 'error' ? '#f44336' : '#4caf50',
          }}
          message={snackbarMessage}
        />
      </Snackbar>
    </Box>
  );
}

export default SignIn;