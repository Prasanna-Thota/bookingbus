import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Divider } from '@mui/material';

const BookingDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { bus, selectedSeats, totalAmount } = location.state || {};

  if (!bus || !selectedSeats || totalAmount === undefined) {
    return (
      <Box p={2}>
        <Typography variant="h5" gutterBottom>
          Payment
        </Typography>
        <Typography variant="body1" color="error">
          Missing required information. Please go back and select your seats again.
        </Typography>
      </Box>
    );
  }

  const handleProceedToBook = () => {

    navigate('/passengerdetails', { state: { bus, selectedSeats, totalAmount } });
    
  };

  return (
    <Box
      sx={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        width: '100%',
        maxWidth: '400px', // Adjust max-width as needed for responsiveness
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#fff',
        margin: 'auto', // Center align horizontally
        marginTop: '50px', // Adjust top margin for vertical centering
        boxSizing: 'border-box', // Ensure padding and border are included in width
      }}
    >
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="h6" fontWeight="bold">
          Boarding & Dropping
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="body1" fontWeight="bold">
          {bus.from}{' '}
          <Typography component="span" color="textSecondary">
            {bus.departureTime}
          </Typography>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {bus.boardingPoints}
        </Typography>
      </Box>

      <Box mb={2}>
        <Typography variant="body1" fontWeight="bold">
          {bus.to}{' '}
          <Typography component="span" color="error">
            {bus.arrivalTime} ({(new Date(bus.date).getDate() + 1)
              .toString()
              .padStart(2, '0')}{' '}
            -{' '}
            {new Date(bus.date).toLocaleString('default', { month: 'long' })})
          </Typography>
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {bus.droppingPoints}
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box mb={2} display="flex" alignItems="center">
        <Typography variant="h6" color="textSecondary" fontWeight="bold">
          Seat No.
        </Typography>
        <Box display="flex" ml={1}>
          {selectedSeats.map((seat, index) => (
            <Typography
              key={index}
              variant="body1"
              fontWeight="bold"
              ml={index !== 0 ? 1 : 0} // Add margin-left to all items except the first one
            >
              {seat}
            </Typography>
          ))}
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box mb={2}>
        <Typography variant="body2" color="textSecondary">
          Fare Details
        </Typography>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight="bold">
            Amount
          </Typography>
          <Typography variant="h6" fontWeight="bold" color="error">
            INR {totalAmount}
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary">
          Taxes will be calculated during payment
        </Typography>
      </Box>

      <Button variant="contained" color="error" fullWidth onClick={handleProceedToBook}>
        PROCEED TO BOOK
      </Button>
    </Box>
  );
};

export default BookingDetails;
