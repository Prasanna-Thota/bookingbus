import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Box, Avatar, Typography, InputAdornment, IconButton, Snackbar, Alert } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import {  useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({
    userName: '',
    email: '',
    password: '',
    city: '',
  });

  const [initialProfile, setInitialProfile] = useState({});
  const [isChanged, setIsChanged] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // 'success', 'error', 'warning', 'info'
  const navigate =useNavigate();
  
  const username = localStorage.getItem('username');

  useEffect(() => {
    axios.get(`http://localhost:5042/api/User/getUser/${username}`) 
      .then(response => {
        console.log(response.data);
        setProfile(response.data);
        setInitialProfile(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the profile data!", error);
      });
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => {
      const updatedProfile = { ...prevProfile, [name]: value };
      setIsChanged(JSON.stringify(updatedProfile) !== JSON.stringify(initialProfile));
      return updatedProfile;
    });
  };

  const handleSave = () => {
    axios.put(`http://localhost:5042/api/User/updateUser/${username}`, profile)
      .then(response => {
        console.log("Profile updated successfully:", response.data);
        setInitialProfile(profile); // Update the initial profile to the current profile
        setIsChanged(false); // Reset the isChanged state
        setSnackbarMessage('Profile updated successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
      })
      .catch(error => {
        console.error("There was an error updating the profile data!", error);
        setSnackbarMessage('There was an error updating the profile data');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCancel =() => {
    navigate("/");
  }

  return (
    <Box sx={{ 
      flexGrow: 1, 
      padding: 3, 
      marginTop: '30px', 
      marginBottom: '30px',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxShadow: 3,
      borderRadius: 2,
      backgroundColor: '#fff',
    }}>
      <Grid container spacing={2} alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item xs={8}>
          <Typography variant="h5" component="h1" gutterBottom>
            Edit Profile
          </Typography>
        </Grid>
        <Grid item xs={4} display="flex" justifyContent="flex-end">
          <Avatar
            alt="Profile Image"
            src="/images/p.png" // Replace with the actual path to your image
            sx={{ width: 64, height: 64 }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Username"
            name="userName" // Corrected the name to "userName"
            value={profile.userName}
            onChange={handleChange}
            variant="outlined"
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <Avatar sx={{ bgcolor: 'green', width: 24, height: 24 }}>✓</Avatar>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={profile.password}
            onChange={handleChange}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={profile.city}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="flex-end">
          <Button variant="outlined" color="error" sx={{ marginRight: 2 }} onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="contained" color="warning" disabled={!isChanged} onClick={handleSave}>
            Save
          </Button>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
