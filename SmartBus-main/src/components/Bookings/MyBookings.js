import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, Accordion, AccordionSummary, AccordionDetails, CircularProgress, Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5042/api/User/getDetails/${username}`);
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, [username]);

  if (loading) {
    return (<Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      marginTop:'30px',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
    }}
  >
    <CircularProgress size={50} thickness={5} />
    <Typography variant="body1" sx={{ mt: 2,}}>
      Loading...
    </Typography>
  </Box> // Replace with loading indicator
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Bookings
      </Typography>
      {bookings.length === 0 ? (
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
          src="/images/oopsImage.svg" // Replace with the actual path to your image
          alt="Oops! No buses are found"
          style={{
            width: '150px', // Adjust the width as needed
          }}
        />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            marginTop: '20px',
            padding: '0px 10px',
            opacity:'0.8',
      
          }}
        >
            Oops! No Bookings Until
        </Typography>
        <Typography
          variant="body1"
          sx={{
            padding: '10px',
            opacity:'0.8',
      
          }}
        >
            Oops! No Bookings 
        </Typography>
      </Box>
      ) : (
        bookings.map((booking) => (
          <Accordion key={booking.bid}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="subtitle1">Booking ID: {booking.bid}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List>
                <ListItem>
                  <ListItemText primary={`Date: ${new Date(booking.date).toLocaleDateString()}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Bus Name: ${booking.busName}`} secondary={`Bus Number: ${booking.busNumber}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`From: ${booking.from}`} secondary={`To: ${booking.to}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`Total Amount: ${booking.totalAmount}`} secondary={`Total with GST: ${booking.totalWithGst}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Contact Details:" secondary={`Email: ${booking.contact.email}, Phone: ${booking.contact.phone}`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary="Passengers:" />
                  <List component="div" disablePadding>
                    {booking.passengers.map((passenger) => (
                      <ListItem key={passenger.pid}>
                        <ListItemText primary={`${passenger.name} (${passenger.gender}, ${passenger.age} years)`} />
                      </ListItem>
                    ))}
                  </List>
                </ListItem>
                <ListItem>
                  <ListItemText primary="Selected Seats:" secondary={booking.selectedSeats.join(', ')} />
                </ListItem>
              </List>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Container>
  );
};

export default MyBookings;
