import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Button,
  Box,
  Container,
  Grid,
  Stack,
  Autocomplete,
  IconButton,
  TextField
} from '@mui/material';
import { SwapHoriz } from '@mui/icons-material';
import TrendingOffers from './TrendingOffers';
import { Footer } from '../Footer/footer';
import AboutUs from './AboutUs';

const sectionStyles = {
  minHeight: '520px',
  background: `url('./images/head.webp')`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '20px',
};

const Home = () => {
  const [fromOptions, setFromOptions] = useState([]);
  const [toOptions, setToOptions] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [fromError, setFromError] = useState(false);
  const [toError, setToError] = useState(false);
  const [dateError, setDateError] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5042/api/busDetails/fromandto');
      const data = response.data;

      const fromSet = new Set(data.map(item => item.from));
      const toSet = new Set(data.map(item => item.to));

      setFromOptions(Array.from(fromSet));
      setToOptions(Array.from(toSet));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFromChange = (event, value) => {
    setSelectedFrom(value);
    setFromError(false);
  };

  const handleToChange = (event, value) => {
    setSelectedTo(value);
    setToError(false);
  };

  const handleDateChange = (event) => {
    const selected = new Date(event.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of the day

    if (selected >= today) {
      setSelectedDate(event.target.value);
      setDateError(false);
    } else {
      setDateError(true);
    }
  };

  const handleSearchBuses = () => {
    let isValid = true;

    if (!selectedFrom) {
      setFromError(true);
      isValid = false;
    } else {
      setFromError(false);
    }

    if (!selectedTo) {
      setToError(true);
      isValid = false;
    } else {
      setToError(false);
    }

    if (!selectedDate || dateError) {
      setDateError(true);
      isValid = false;
    } else {
      setDateError(false);
    }

    if (isValid) {
      navigate(`/buslist/${selectedFrom}/${selectedTo}/${selectedDate}`);
    }
  };

  const handleSwap = () => {
    const temp = selectedFrom;
    setSelectedFrom(selectedTo);
    setSelectedTo(temp);
  };

  const filteredToOptions = toOptions.filter(option => option !== selectedFrom);

  // Calculate minimum date for date input
  const minDate = new Date().toISOString().split('T')[0];

  return (
    <Stack spacing={4}>
      <Box sx={sectionStyles} id='/'>
        <Typography variant="h4" gutterBottom sx={{ color: 'white', marginBottom: '100px' }}>
          India's No. 1 Online Bus Ticket Booking Site
        </Typography>
        <Container maxWidth="xl" sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              bgcolor: 'white',
              borderRadius: 2,
              p: 3,
              boxShadow: 3,
              marginBottom: '180px',
              marginLeft: 'auto',
              marginRight: 'auto',
              width: '80%',
            }}
          >
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  id="from-autocomplete"
                  options={fromOptions}
                  value={selectedFrom}
                  onChange={handleFromChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="From"
                      variant="outlined"
                      fullWidth
                      error={fromError}
                      helperText={fromError ? 'Please select a From location' : ''}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={1} md={0.6} sx={{ textAlign: 'center' }}>
                <IconButton onClick={handleSwap}>
                  <SwapHoriz />
                </IconButton>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  id="to-autocomplete"
                  options={filteredToOptions}
                  value={selectedTo}
                  onChange={handleToChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="To"
                      variant="outlined"
                      fullWidth
                      error={toError}
                      helperText={toError ? 'Please select a To location' : ''}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Date"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  inputProps={{ min: minDate }} // Set minimum date
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                  error={dateError}
                  helperText={dateError ? 'Please select a Date Today or Future' : ''}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ height: '56px' }}
                  onClick={handleSearchBuses}
                >
                  SEARCH BUSES
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      <Box id="offers" sx={{ position: 'relative', zIndex: 1 }}>
        <TrendingOffers />
      </Box>
      <Box id="aboutus">
        <AboutUs />
      </Box>
      <Footer />
    </Stack>
  );
}

export default Home;
