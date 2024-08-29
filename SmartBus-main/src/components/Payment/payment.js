import React, { useEffect, useState, useCallback } from 'react';
import { Box, Container, Typography, Paper, Divider, Grid, Button, IconButton, Collapse } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import EventIcon from '@mui/icons-material/Event';
import PlaceIcon from '@mui/icons-material/Place';
import PersonIcon from '@mui/icons-material/Person';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const Payment = () => {
  const location = useLocation();
  const { bus, selectedSeats, totalAmount, bookingData } = location.state || {};

  const [timer, setTimer] = useState(1 * 60); // Timer in seconds, initial value set to 8 minutes
  const [showAllPassengers, setShowAllPassengers] = useState(false);
  const navigate = useNavigate();

  const handleTimeout = useCallback(() => {
    console.log('Payment session timed out.');
    navigate('/sessionexpired'); // Redirect to home page or timeout page
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(interval); // Stop the timer when it reaches zero
          handleTimeout(); // Handle timeout action
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [handleTimeout]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleShowMoreClick = () => {
    setShowAllPassengers(!showAllPassengers);
  };

  const handlePayment = async () => {
    try {
      const apiUrl = 'http://localhost:5042/api/busDetails/bookingDetails';

      const username = localStorage.getItem('username');

      const payload = {
        UserName: username,
        BusNumber: bus?.busNumber || '',
        Id: bus?.id || 0,
        BusName: bus?.busName || '',
        Date: bus?.date || '',
        From: bus?.from || '',
        To: bus?.to || '',
        Contact: {
          Email: bookingData?.contact?.email || '',
          Phone: bookingData?.contact?.phone || ''
        },
        Passengers: bookingData?.passengers || [],
        TotalAmount: bookingData?.totalAmount || 0,
        TotalWithGst: bookingData?.totalWithGst || 0,
        GstAmount: bookingData?.gstAmount || 0,
        GstNumber: bookingData?.gstNumber || '',
        SelectedSeats: selectedSeats || []
      };

      const response = await axios.post(apiUrl, payload);
      console.log('Booking details saved:', response.data);

      sendEmail();
    } catch (error) {
      console.error('Error processing payment:', error);
    }
  };

  const sendEmail = async () => {
    try {
      const emailUrl = 'http://localhost:5042/api/email/sendEmail';
      const emailPayload = {
        toEmail: bookingData?.contact?.email || '',
        subject: 'Smart Bus Travel Details',
        body: `
          Booking Details:
          Bus Number: ${bus?.busNumber}
          Bus Name: ${bus?.busName}
          Date: ${bus?.date}
          From: ${bus?.from}
          To: ${bus?.to}
          Total Amount: ${bookingData?.totalWithGst}
          Passengers:
          ${bookingData?.passengers.map((passenger) => `${passenger.name} (${passenger.age}, ${passenger.gender})`).join('\n')}
        `
      };
      console.log(emailPayload);

      const emailResponse = await axios.post(emailUrl, emailPayload);
      console.log('Email sent successfully:', emailResponse.data);

      navigate('/success');
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" bgcolor="#ff6f61" color="white" p={2}>
          <Typography variant="h6">{bus?.from} → {bus?.to}</Typography>
          <Typography variant="subtitle1">Please pay within: <strong>{formatTime(timer)}</strong></Typography>
        </Box>
        <Divider />
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
          <Paper elevation={3}>
            <Box padding={2}>
              {/* Travel Details */}
              <Box>
                <Typography variant="h6" style={{ color: 'red', fontWeight: 'bold' }}>
                  {bus?.busName}
                </Typography>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <EventIcon />
                  </Grid>
                  <Grid item>
                    <Typography>Departure</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{bus.date} {bus.departureTime}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>Seats</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>
                      {selectedSeats.map((seat, index) => (
                        <span key={index}>{seat}{index < selectedSeats.length - 1 ? ', ' : ''}</span>
                      ))}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <PlaceIcon />
                  </Grid>
                  <Grid item>
                    <Typography>Boarding Point</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{bus.from}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{bus.boardingPoints}</Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <PlaceIcon />
                  </Grid>
                  <Grid item>
                    <Typography>Dropping Point</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{bus.to}</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>{bus.droppingPoints}</Typography>
                  </Grid>
                </Grid>
              </Box>

              <Divider style={{ margin: '10px 0' }} />

              {/* Passenger Details */}
              <Box padding={1} style={{ backgroundColor: '#ffe0e0', borderRadius: '4px' }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <PersonIcon />
                  </Grid>
                  {bookingData.passengers.slice(0, 1).map((passenger, index) => (
                    <Grid item key={index}>
                      <Typography>
                        {passenger.name} ({passenger.age}, {passenger.gender})
                      </Typography>
                    </Grid>
                  ))}
                  {bookingData.passengers.length > 1 && (
                    <Grid item>
                      <IconButton size="small" onClick={handleShowMoreClick}>
                        <ExpandMoreIcon />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>

                <Collapse in={showAllPassengers}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <PersonIcon />
                    </Grid>
                    <Box mt={1} marginLeft={1}>
                      {bookingData.passengers.slice(1).map((passenger, index) => (
                        <Grid container spacing={1} alignItems="center" key={index}>
                          <Grid item>
                            <Typography>
                              {passenger.name} ({passenger.age}, {passenger.gender})
                            </Typography>
                          </Grid>
                        </Grid>
                      ))}
                    </Box>
                  </Grid>
                </Collapse>
              </Box>

              <Divider style={{ margin: '10px 0' }} />

              {/* Fare Breakup */}
              <Box padding={1}>
                <Typography variant="h6" style={{ color: 'red', fontWeight: 'bold' }}>
                  FARE BREAKUP
                </Typography>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography>Base Fare</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>INR {totalAmount} </Typography>
                  </Grid>
                </Grid>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography>GST</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>+ INR {bookingData.gstAmount}</Typography>
                  </Grid>
                </Grid>
              
              {bookingData.discountPercentage !== 0 ? (
                <Grid container justifyContent="space-between">
                <Grid item>
                  <Typography>Discount ({bookingData.discountPercentage})</Typography>
                </Grid>
                <Grid item>
                  <Typography>- INR {bookingData.discountAmount}</Typography>
                </Grid>
              </Grid>
              ): ''
              }
                

                <Divider style={{ margin: '10px 0' }} />
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography>Onward Fare</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>INR {bookingData.totalWithGst}</Typography>
                  </Grid>
                </Grid>
                <Divider style={{ margin: '10px 0' }} />
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography>Total Payable</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>INR {bookingData.totalWithGst}</Typography>
                  </Grid>
                </Grid>
              </Box>

              {/* Payment Button */}
              <Box mt={2} display="flex" justifyContent="center">
                <Button variant="contained" color="primary" onClick={handlePayment} disabled={timer === 0}>
                  Pay Now
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Paper>
    </Container>
  );
};

export default Payment;





export const SessionExpired = () => {
  const navigate = useNavigate();

  // Handle redirection or any other action on timeout
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/'); // Redirect to home or login page after timeout
    }, 20000); // Timeout duration in milliseconds (e.g., 5000 for 5 seconds)

    return () => clearTimeout(timeout); // Clean up timeout on component unmount
  }, [navigate]);

  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" >
        Session Expired
      </Typography>
      <Box sx={{ my: 3 }}>
        <img src="/images/sessionExpire.png" alt="Session Expired" style={{ width: '12%',}} />
      </Box>

      <Typography variant="body1" gutterBottom>
        Your session has expired. Redirecting to homepage...
      </Typography>
      <Button variant="contained" color="primary" sx={{marginTop:'10px'}} onClick={() => navigate('/')}>
        Go Home
      </Button>
    </Container>
  );
};