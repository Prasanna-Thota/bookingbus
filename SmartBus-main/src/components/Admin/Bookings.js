import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import './Bookings.css'; // Assuming you have a CSS file for styling

const Bookings = () => {
  const [details, setDetails] = useState([]);
  const [sortedDetails, setSortedDetails] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [displayLimit, setDisplayLimit] = useState(10);
  const [currentDisplayCount, setCurrentDisplayCount] = useState(10);

  useEffect(() => {
    // Fetch booking details from API when component mounts
    axios.get('http://localhost:5042/api/User/getBookingDetails')
      .then(response => {
        setDetails(response.data);
        setSortedDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching booking details:', error);
      });
  }, []);

  useEffect(() => {
    // Update sortedDetails based on displayLimit
    setSortedDetails(details.slice(0, displayLimit));
  }, [details, displayLimit]);

  const sortByDateAndId = () => {
    // Sort details by date (descending) and then by id within the same date (descending)
    const sorted = [...details].sort((a, b) => {
      if (a.date > b.date) return -1;
      if (a.date < b.date) return 1;
      return b.bid - a.bid; // Assuming bid is your booking id
    });
    setDetails(sorted);
  };

  const handleAccordionChange = (panelId) => (event, isExpanded) => {
    setExpandedId(isExpanded ? panelId : null);
  };

  const handleViewMore = () => {
    setCurrentDisplayCount(currentDisplayCount + 10);
    setDisplayLimit(currentDisplayCount + 10);
  };

  return (
    <Box className="bookings-container">
      <Typography variant="h4" className="bookings-heading" gutterBottom>
        Booking Details
      </Typography>
      <Button variant="contained" color="primary" className="sort-button" onClick={sortByDateAndId}>
        Sort
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>User Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Booking ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Bus ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Bus Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Bus Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>From</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>To</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total with GST</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>GST Amount</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Passengers</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Selected Seats</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDetails.map((booking, index) => (
              <TableRow key={index}>
                <TableCell>{booking.userName}</TableCell>
                <TableCell>{booking.bid}</TableCell>
                <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                <TableCell>{booking.id}</TableCell>
                <TableCell>{booking.busName}</TableCell>
                <TableCell>{booking.busNumber}</TableCell>
                <TableCell>{booking.from}</TableCell>
                <TableCell>{booking.to}</TableCell>
                <TableCell>{booking.totalAmount}</TableCell>
                <TableCell>{booking.totalWithGst}</TableCell>
                <TableCell>{booking.gstAmount}</TableCell>
                <TableCell>
                  <Accordion
                    expanded={expandedId === `passengers-${booking.bid}`}
                    onChange={handleAccordionChange(`passengers-${booking.bid}`)}
                    style={{ width: '230px' }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`passengers-${booking.bid}-content`}
                      id={`passengers-${booking.bid}-header`}
                    >
                      <Typography>Passengers</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List className="passengers-list">
                        {booking.passengers.map((passenger, idx) => (
                          <ListItem key={idx}>
                            <ListItemText primary={`${passenger.name} - ${passenger.gender}, Age: ${passenger.age}`} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </TableCell>
                <TableCell>
                  <Box className="seats-list-horizontal" style={{ width: '100px' }}>
                    {booking.selectedSeats.join(", ")}
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {details.length > currentDisplayCount && (
        <Box mt={2} textAlign="center">
          <Button variant="contained" color="primary" startIcon={<KeyboardDoubleArrowDownIcon fontSize='small'/>} onClick={handleViewMore}>
            View More
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Bookings;
