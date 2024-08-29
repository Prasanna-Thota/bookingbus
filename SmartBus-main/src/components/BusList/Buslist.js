import React, { useState, useEffect } from 'react';
import { Box, Button, Card, CardContent, Typography, Grid, Stack, CircularProgress } from '@mui/material';
import { Star } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const generateRandomRating = () => {
  return (Math.random() * (4.9 - 3.5) + 3.5).toFixed(1);
};

const BusList = () => {
  const { from, to, date } = useParams();
  const navigate = useNavigate();

  const [filteredBuses, setFilteredBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:5042/api/busDetails/busdata/${from}/${to}/${date}`);
        const busesWithRatings = response.data.map(bus => ({
          ...bus,
          rating: generateRandomRating(),
          lowerPrice: Math.min(bus.lowerBerthPrice, bus.upperBerthPrice),
          date: date // Assigning the 'date' parameter from useParams
        }));
  
        // Fetch available seats data based on booking details
        const busesWithAvailability = await Promise.all(
          busesWithRatings.map(async (bus) => {
            const availabilityResponse = await axios.get(`http://localhost:5042/api/busDetails/getSeatsCount/${bus.id}/${bus.busNumber}/${date}`);
            const bookedSeats = availabilityResponse.data; // Assuming the API returns directly the booked seats count
            const availableSeats = bus.totalSeats - bookedSeats; // Calculate available seats
            return {
              ...bus,
              availableSeats: availableSeats >= 0 ? availableSeats : 0 // Ensure available seats are non-negative
            };
          })
        );
  
        setFilteredBuses(busesWithAvailability);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBusData();
  }, [from, to, date]); // Dependencies array for useEffect

  const getNextDayDate = (date) => {
    const currentDate = new Date(date);
    currentDate.setDate(currentDate.getDate() + 1);
    const options = { day: 'numeric', month: 'short' };
    return currentDate.toLocaleDateString('en-US', options);
  };

  const handleViewSeats = (bus) => {
    console.log(bus);
    navigate('/tickets', { state: { bus } });
  };

  return (
    <Stack sx={{ marginBottom: "100px" }}>
      <Box
        p={2}
        sx={{
          marginX: 'auto',
          marginTop: '20px',
          width: '90%',
          maxWidth: '1200px',
        }}
      >
        {loading ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            <CircularProgress size={50} thickness={5} />
            <Typography variant="body1" sx={{ mt: 2 }}>
              Loading...
            </Typography>
          </Box>
        ) : error ? (
          <Typography>Error: {error}</Typography>
        ) : filteredBuses.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '20px',
            }}
          >
            <img
              src="/images/oopsImage.svg"
              alt="Oops! No buses are found"
              style={{
                width: '150px',
              }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                marginTop: '20px',
                padding: '0px 10px',
                opacity: '0.8',
              }}
            >
              Oops! No buses found.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                padding: '10px',
                opacity: '0.8',
              }}
            >
              No buses available for the selected route and date.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredBuses.map((bus, index) => (
              <Grid item xs={12} key={index}>
                <Card sx={{ minWidth: '300px' }}>
                  <CardContent>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Typography variant="h5" sx={{ p: 1 }}>{bus.busName}</Typography>
                        <Typography variant="body2" sx={{ p: 1 }}>{bus.busNumber}</Typography>
                        <Typography variant="body2" sx={{ p: 1 }}>{bus.acNonAc} / {bus.sleeperNonSleeper}</Typography>
                      </Grid>
                      <Grid item xs={12} md={4} >
                        <Box display="flex" flexDirection="row" alignItems="center" >
                          <Box display="flex" flexDirection="column" marginRight={2} sx={{ p: 1 }}>
                            <Typography variant="body2">DepartureTime:</Typography>
                            <Typography variant="h5" sx={{ marginBottom: '10px' }}>{bus.departureTime}</Typography>
                            <Typography color="error" gutterBottom>{`${new Date(date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`}</Typography>
                            <Typography variant="body2">BoardingPoint:</Typography>
                            <Typography variant="body1">{bus.from}</Typography>
                            <Typography variant="body2">{bus.boardingPoints}</Typography>
                          </Box>
                          <Typography variant="body2" marginRight={2} marginBottom={'90px'} sx={{ p: 1, marginTop: '0px' }}>{bus.duration}</Typography>
                          <Box display="flex" flexDirection="column" marginLeft={2} sx={{ p: 1 }}>
                            <Typography variant="body2">ArrivalTime:</Typography>
                            <Typography variant="h5" sx={{ marginBottom: '10px' }}>{bus.arrivalTime}</Typography>
                            <Typography color={'error'} sx={{ p: 0}} gutterBottom>{getNextDayDate(date)}</Typography>
                            <Typography variant="body2">DroppingPoint:</Typography>
                            <Typography variant="body1">{bus.to}</Typography>
                            <Typography variant='body2'>{bus.droppingPoints}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Typography variant="h6" sx={{ p: 1 ,md:{marginLeft:'40px'}}}>Starts from <br />INR: <b>{bus.lowerPrice}</b></Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', p: 1 }}>
                          <Star color="primary" />
                          <Typography variant="body2" ml={1}>
                            {bus.rating}
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={3} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <Typography variant="body2" sx={{ p: 1,alignSelf: 'flex-end', mt: { xs: 2, md: 0 }
                         }}>{bus.availableSeats} Seats available</Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleViewSeats(bus)}
                          disabled={bus.availableSeats === 0} // Disable button if no available seats
                          sx={{ alignSelf: 'flex-end', mt: { xs: 2, md: 0 }, marginRight:'10px' }}
                        >
                          View Seats
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Stack>
  );
};

export default BusList;
