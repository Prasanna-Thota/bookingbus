import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  TextField,
  Snackbar,
  CardActions,
  Grid,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DatePicker from 'react-multi-date-picker';
import { format } from 'date-fns';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

const BusDetailsCard = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [busDetails, setBusDetails] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // Severity: 'info', 'success', 'warning', 'error'
  const [displayedBuses, setDisplayedBuses] = useState(4); // Number of buses initially displayed

  useEffect(() => {
    fetchBusDetails();
  }, []);

  const fetchBusDetails = () => {
    axios.get('http://localhost:5042/api/busDetails/get')
      .then(response => {
        setBusDetails(response.data);
      })
      .catch(error => {
        console.error('Error fetching bus details', error);
      });
  };

  const handleOpenDialog = (bus) => {
    setSelectedBus(bus);
    setOpenDialog(true);
    setSelectedDates(bus.availableDates ? [...bus.availableDates.map(date => new Date(date))] : []);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSave = (bus) => {
    // Ensure selectedDates contains valid Date objects
    const updatedBus = {
      ...bus,
      availableDates: selectedDates,
    };
  
    axios.put(`http://localhost:5042/api/busDetails/update/${bus.id}`, updatedBus)
      .then(response => {
        console.log(response.data);
        showSnackbar('Dates updated successfully', 'success');
        fetchBusDetails();
        handleCloseDialog();
      })
      .catch(error => {
        showSnackbar('Error updating dates', 'error');
        console.error('Error updating dates', error);
      });
  };

  const handleDeleteBus = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5042/api/busDetails/Delete/${id}`);
      console.log(response.data);
      showSnackbar('Item deleted successfully', 'success');
      fetchBusDetails();
    } catch (error) {
      showSnackbar('Error deleting item', 'error');
      console.error('Error deleting item:', error);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleViewMore = () => {
    setDisplayedBuses(prevCount => prevCount + 4); // Increase the displayed count by 4
  };

  return (
    <motion.div
    initial={{ opacity: 0, x: 30 }} // Initial animation properties (starting from righht)
    animate={{ opacity: 1, x: 0 }} // Animation properties when component is mounted (move to center)
    transition={{ duration: 0.6, delay: 0.3 }} // Animation duration and delay
>
    <Grid container spacing={2} marginTop={'40px'} sx={{ maxWidth: '100%', margin: '0 auto', padding: '20px', marginBottom:'50px'}}>
      {busDetails.slice(0, displayedBuses).map((bus) => (
        <Grid item key={bus.id} xs={12} sm={6} md={4} lg={3}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="120"
              image="/images/busimg.jpg"
              alt="bus image"
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" component="div" >
                {bus.busName}
              </Typography>
              <Typography variant="body1"  gutterBottom>
                Bus Number: {bus.busNumber}
              </Typography>
              <Typography variant="body2" gutterBottom color='primary'>
                Available Dates: {bus.availableDates && bus.availableDates.length > 0 
                  ? bus.availableDates.sort((a, b) => new Date(a) - new Date(b)).map(date => format(new Date(date), 'dd-MMM-yyyy')).join(', ')
                  : 'None'}
              </Typography>
              
              <Typography variant="body2">
                <LocationOnIcon fontSize="small" /> From: {bus.from} -- To: {bus.to}
              </Typography>
              <Typography variant="body2" display="flex" alignItems="center">
              <ArrowForwardIcon sx={{ marginRight: '4px' }} />
              Boarding Points: {bus.from}, {bus.boardingPoints}
            </Typography>
            <Typography variant="body2" display="flex" alignItems="center">
              <ArrowBackIcon sx={{ marginRight: '4px' }} />
              Dropping Points: {bus.to}, {bus.droppingPoints}
            </Typography>
              <Typography variant="body2" >
                <ScheduleIcon fontSize="small" /> Departure Time: {bus.departureTime}
              </Typography>
              <Typography variant="body2" >
                <ScheduleIcon fontSize="small" /> Arrival Time: {bus.arrivalTime}
              </Typography>
            </CardContent>
            <CardActions>
              <IconButton aria-label="delete" onClick={() => handleDeleteBus(bus.id)}>
                <DeleteIcon />
              </IconButton>
              <Button variant='contained' onClick={() => handleOpenDialog(bus)}>Update Dates</Button>
            </CardActions>
          </Card>
        </Grid>
      ))}
      
      {busDetails.length > displayedBuses && (
        <Grid item xs={12}>
          <Box textAlign="center" mt={2}>
            <Button variant="contained" startIcon={<KeyboardDoubleArrowDownIcon fontSize='small'/>} onClick={handleViewMore}>View More Buses</Button>
          </Box>
        </Grid>
      )}

      <Dialog
        open={openDialog}
        fullWidth
        maxWidth="md"
        style={{ maxHeight: '80vh', minHeight: '50vh' }}
      >
        <DialogTitle>Select Travel Dates</DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            Select travel dates for bus {selectedBus?.busNumber}:
          </DialogContentText>
          <Box display="flex" flexDirection="column" alignItems="center" marginBottom='280px'>
            <DatePicker
              multiple
              value={selectedDates}
              onChange={(dates) => setSelectedDates(dates.map(date => format(new Date(date), 'yyyy-MM-dd')))}
              renderInput={(params) => <TextField {...params} variant="outlined" />}
              format="YYYY-MM-DD"
              includeDates={selectedBus && selectedBus.availableDates ? selectedBus.availableDates.map(date => new Date(date)) : []}
              style={{ width: '100%' }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={() => handleSave(selectedBus)}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Grid>

</motion.div>
);
};

export default BusDetailsCard;
