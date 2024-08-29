import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Grid, IconButton, Snackbar, useMediaQuery } from '@mui/material';
import { AirlineSeatReclineExtra, Person } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Tickets = () => {
  const location = useLocation();
  const { bus } = location.state || {};
  const navigate = useNavigate();

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [lowerBerthPrice, setLowerBerthPrice] = useState(0);
  const [upperBerthPrice, setUpperBerthPrice] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [blockedSeats, setBlockedSeats] = useState([]);

  useEffect(() => {
    const fetchBlockedSeats = async () => {
      try {
        console.log(bus.id,bus.busNumber,bus.date);
        const response = await axios.get('http://localhost:5042/api/busDetails/getSeats', {
          params: {
            busId: bus.id,
            busNumber: bus.busNumber,
            date: bus.date
          }
        });
        setBlockedSeats(response.data);
      } catch (error) {
        console.error('Error fetching blocked seats:', error);
        // Handle error fetching data (e.g., show a snackbar)
      }
    };

    if (bus && bus.id && bus.busNumber) {
      fetchBlockedSeats();
    }
  }, [bus]);

  useEffect(() => {
    if (bus) {
      setLowerBerthPrice(parseFloat(bus.lowerBerthPrice) || 0);
      setUpperBerthPrice(parseFloat(bus.upperBerthPrice) || 0);
    }
  }, [bus]);

  const handleSeatClick = (seat) => {
    if (blockedSeats.includes(seat)) {
      console.log(`Seat ${seat} is blocked and cannot be selected.`);
      return;
    }

    if (selectedSeats.length < 6 || selectedSeats.includes(seat)) {
      setSelectedSeats((prevSelectedSeats) =>
        prevSelectedSeats.includes(seat)
          ? prevSelectedSeats.filter((s) => s !== seat)
          : [...prevSelectedSeats, seat]
      );
    } else {
      setSnackbarOpen(true);
    }
  };

  const calculateTotalAmount = () => {
    let total = 0;
    selectedSeats.forEach((seat) => {
      if (seat.startsWith('L')) {
        total += lowerBerthPrice;
      } else if (seat.startsWith('U')) {
        total += upperBerthPrice;
      }
    });
    return total;
  };


  const handleSelectNext = () => {
    const username = localStorage.getItem('username');
    const redirectTo = {
      pathname: '/booking',
      state: {
        bus,
        selectedSeats,
        totalAmount: calculateTotalAmount(),
      },
    };

    if (username) {
      navigate(redirectTo.pathname, { state: redirectTo.state });
    } else {
      navigate('/signin', { state: { redirectTo } });
    }
  };

  const seats = [
    {
      deck: 'Lower Deck',
      rows: [
        ['D', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'],
        ['', 'L9', 'L10', 'L11', 'L12', 'L13', 'L14', 'L15', 'L16'],
        ['', ''],
        ['', 'L17', 'L18', 'L19', 'L20', 'L21', 'L22', 'L23', 'L24'],
      ],
    },
    {
      deck: 'Upper Deck',
      rows: [
        ['D', 'U1', 'U2', 'U3', 'U4', 'U5', 'U6', 'U7', 'U8'],
        ['', 'U9', 'U10', 'U11', 'U12', 'U13', 'U14', 'U15', 'U16'],
        ['', ''],
        ['', 'U17', 'U18', 'U19', 'U20', 'U21', 'U22', 'U23', 'U24'],
      ],
    },
  ];

  const rowSeats = [
    {
      deck: 'Lower Deck',
      rows: [
        ['','','','D'],
        ['L1','L9','','L17'],
        ['L2','L10','','L18'],
        ['L3','L11','','L19'],
        ['L4','L12','','L20'],
        ['L5','L13','','L21'],
        ['L6','L14','','L22'],
        ['L7','L15','','L23'],
        ['L8','L16','','L24']
      ]
    },
    {
      deck: 'Upper Deck',
      rows: [
        ['','','','D'],
        ['U1','U9','','U17'],
        ['U2','U10','','U18'],
        ['U3','U11','','U19'],
        ['U4','U12','','U20'],
        ['U5','U13','','U21'],
        ['U6','U14','','U22'],
        ['U7','U15','','U23'],
        ['U8','U16','','U24']
      ]
    },
  ];

  const isSmallScreen = useMediaQuery('(max-width:900px)');

  const renderSeats = (deck, rows) => {
    return (
      <Box key={deck} mb={2} justifyContent={'center'} marginLeft={'100px'}>
        <Typography variant="h6" gutterBottom>
          {deck}
        </Typography>
        <Grid container spacing={1}>
          {rows.map((row, rowIndex) => (
            <Grid container item spacing={1} key={rowIndex}>
              {row.map((seat, seatIndex) => (
                <Grid item key={seatIndex}>
                  {seat === 'D' ? (
                    <Box
                      sx={{
                        border: '1px solid grey',
                        borderRadius: 1,
                        width: 60,
                        height: 30,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Person />
                    </Box>
                  ) : seat.startsWith('L') || seat.startsWith('U') ? (
                    <IconButton
                      onClick={() => handleSeatClick(seat)}
                      disabled={blockedSeats.includes(seat)}
                      color={selectedSeats.includes(seat) ? 'primary' : 'default'}
                      sx={{
                        border: '1px solid',
                        borderColor: selectedSeats.includes(seat) ? 'primary.main' : 'grey.400',
                        borderRadius: 1,
                        width: 60,
                        height: 30,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                        backgroundColor: blockedSeats.includes(seat) ? 'grey.400' : 'inherit',
                      }}
                    >
                      <AirlineSeatReclineExtra />
                      {selectedSeats.includes(seat) && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            backgroundColor: 'red',
                            width: '100%',
                            height: '100%',
                            opacity: 0.5,
                            zIndex: 1,
                            borderRadius: 1,
                          }}
                        />
                      )}
                    </IconButton>
                  ) : (
                    <Box sx={{ width: 60, height: 30 }}></Box>
                  )}
                </Grid>
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  return (
    <Box p={2} minHeight="100vh" position="relative" marginLeft={'100px'} marginTop={'20px'}>
      <Box mb={2}>
        <Typography variant="h4" gutterBottom>
          Select Your Seats
        </Typography>
        <Box mb={2} display="flex" gap={1}>
          <Typography variant="h6">Seat Price:</Typography>
          <Typography variant="h6">
            Lower: <b>{lowerBerthPrice}</b>
          </Typography>
          <br />
          <Typography variant="h6">
            Upper:<b> {upperBerthPrice}</b>
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          {(isSmallScreen ? rowSeats : seats).map(({ deck, rows }) => renderSeats(deck, rows))}
        </Box>
      </Box>
      <Box mt={2} marginBottom={'90px'}>
        <Typography variant="h6" gutterBottom>
          Seat Legend
        </Typography>
        <Box display="flex" gap={2}>
          
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              sx={{
                border: '1px solid',
                borderColor: 'primary.main',
                borderRadius: 1,
                width: 40,
                height: 30,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <AirlineSeatReclineExtra />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  backgroundColor: 'red',
                  width: '100%',
                  height: '100%',
                  opacity: 0.5,
                  zIndex: 1,
                  borderRadius: 1,
                }}
              />
            </IconButton>
            <Typography variant="body2">Selected</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              sx={{
                border: '1px solid',
                borderColor: 'grey.400',
                borderRadius: 1,
                width: 40,
                height: 30,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <AirlineSeatReclineExtra disabled/>
            </IconButton>
            <Typography variant="body2">Available</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              sx={{
                border: '1px solid',
                borderRadius: 1,
                width: 40,
                height: 30,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'grey.400'
              }}
              disabled
            >
              <AirlineSeatReclineExtra/>
            </IconButton>
            <Typography variant="body2">Booked</Typography>
          </Box>
        </Box>
      </Box>
      <Box
        position="fixed"
        bottom={0}
        left={0}
        right={0}
        p={2}
        bgcolor="background.paper"
        boxShadow={3}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Box>
          <Typography variant="h6">Selected Seats:</Typography>
          <Typography>{selectedSeats.join(', ') || 'None'}</Typography>
        </Box>
        <Box>
          <Typography variant="h6">Total Price: ₹{calculateTotalAmount()}</Typography>
        </Box>
        <Button variant="contained" color="primary" onClick={handleSelectNext} disabled={selectedSeats.length === 0}>
           Proceed
        </Button>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="You can select up to 6 seats only."
      />
    </Box>
  );
};

export default Tickets;
