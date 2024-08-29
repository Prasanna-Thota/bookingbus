import React, { useState, useEffect } from 'react';
import {
  Box, Grid, TextField, Typography, Button,
  Select, MenuItem, FormControl, InputLabel,
  Snackbar, Alert, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper,
  ButtonGroup
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';


const Admin = () => {
  const [busName, setBusName] = useState('');
  const [busNumber, setBusNumber] = useState('');
  const [busNumberError, setBusNumberError] = useState('');
  const [from, setFrom] = useState('');
  const [boardingPoints, setBoardingPoints] = useState('');
  const [to, setTo] = useState('');
  const [droppingPoints, setDroppingPoints] = useState('');
  const [sleeperNonSleeper, setSleeperNonSleeper] = useState('');
  const [acNonAc, setAcNonAc] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const [arrivalTime, setArrivalTime] = useState('');
  const [lowerBerthPrice, setLowerBerthPrice] = useState('');
  const [upperBerthPrice, setUpperBerthPrice] = useState('');
  const [totalSeats, setTotalSeats] = useState(48);
  const [timeDifference, setTimeDifference] = useState('');
  const [operatorName, setOperatorName] = useState('');
  const [operatorNumber, setOperatorNumber] = useState('');
  const [selectedBus, setSelectedBus] = useState(null); // State to hold selected bus detail for editing
  const [selectedDates, setSelectedDates] = useState([]);

  // Snackbar state variables
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Dummy data for bus details - replace with actual API fetch
  const [busDetails, setBusDetails] = useState([]);

  useEffect(() => {
    // Fetch bus details initially
    fetchBusDetails();
  }, []);

  useEffect(() => {
    const calculateTimeDifference = () => {
      if (departureTime && arrivalTime) {
        const depTime = new Date(`1970-01-01T${departureTime}:00`);
        let arrTime = new Date(`1970-01-01T${arrivalTime}:00`);

        if (arrTime < depTime) {
          arrTime.setDate(arrTime.getDate() + 1);
        }

        const timeDiff = Math.abs(arrTime.getTime() - depTime.getTime());
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

        setTimeDifference(`${hours}h ${minutes}m`);
      }
    };

    calculateTimeDifference();
  }, [departureTime, arrivalTime]);

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };

  const handleBusNumberChange = (event) => {
    const value = event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let formattedValue = value.replace(/(.{2})(.{2})(.{2})(.*)/, "$1 $2 $3 $4");
    setBusNumber(formattedValue);

    if (formattedValue.length === 13) {
      setBusNumberError('');
    } else {
      setBusNumberError('Bus number must be in the format 00 00 00 0000');
    }
  };

  const handleSubmit = () => {
    if (
      busName && busNumber && from && boardingPoints && to && droppingPoints &&
      sleeperNonSleeper && acNonAc && departureTime && arrivalTime && operatorName && operatorNumber &&
      lowerBerthPrice && upperBerthPrice && busNumberError === ''
    ) {
      const formData = {
        busName,
        busNumber,
        from,
        boardingPoints,
        to,
        droppingPoints,
        sleeperNonSleeper,
        acNonAc,
        departureTime,
        arrivalTime,
        duration: timeDifference,
        lowerBerthPrice,
        upperBerthPrice,
        totalSeats,
        operatorName,
        operatorNumber,
        availableDates:selectedDates || [],
      };

      if (selectedBus) {
        updateBusDetails(selectedBus.id, formData);
      } else {
        // Otherwise, create new bus details
        createBusDetails(formData);
      }
    } else {
      showSnackbar('Please fill all fields correctly', 'error');
    }
  };

  const createBusDetails = (formData) => {
    console.log(formData);

    axios.post('http://localhost:5042/api/busDetails/create', formData)
      .then(response => {
        showSnackbar('Form submitted successfully', 'success');
        fetchBusDetails(); // Fetch the updated bus details after form submission
        resetForm();
      })
      .catch(error => {
        showSnackbar('Error submitting form', 'error');
        console.error('Error submitting form', error);
      });
  };


  const updateBusDetails = (id, formData) => {
    console.log(id, formData);
    axios.put(`http://localhost:5042/api/busDetails/update/${id}`, formData)
      .then(response => {
        showSnackbar('Form updated successfully', 'success');
        fetchBusDetails(); // Fetch the updated bus details after form submission
        resetForm();
      })
      .catch(error => {
        showSnackbar('Error updating form', 'error');
        console.error('Error updating form', error);
      });
  };

  const fetchBusDetails = () => {
    axios.get('http://localhost:5042/api/busDetails/get')
      .then(response => {
        setBusDetails(response.data); // Assuming response.data is an array of bus details
      })
      .catch(error => {
        console.error('Error fetching bus details', error);
      });
  };

  const deleteBusDetails = (id) => {
    console.log(id);
    axios.delete(`http://localhost:5042/api/busDetails/delete/${id}`)
      .then(response => {
        showSnackbar('Bus details deleted successfully', 'success');
        fetchBusDetails(); // Refresh bus details after deletion
      })
      .catch(error => {
        showSnackbar('Error deleting bus details', 'error');
        console.error('Error deleting bus details', error);
      });
  };


  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
    setBusName(bus.busName);
    setBusNumber(bus.busNumber);
    setFrom(bus.from);
    setBoardingPoints(bus.boardingPoints);
    setTo(bus.to);
    setDroppingPoints(bus.droppingPoints);
    setSleeperNonSleeper(bus.sleeperNonSleeper);
    setAcNonAc(bus.acNonAc);
    setDepartureTime(bus.departureTime);
    setArrivalTime(bus.arrivalTime);
    setLowerBerthPrice(bus.lowerBerthPrice);
    setUpperBerthPrice(bus.upperBerthPrice);
    setOperatorName(bus.operatorName);
    setOperatorNumber(bus.operatorNumber);
    setSelectedDates(bus.selectedDates);
    setTimeDifference(bus.duration);
  };

  const resetForm = () => {
    setSelectedBus(null);
    setBusName('');
    setBusNumber('');
    setBusNumberError('');
    setFrom('');
    setBoardingPoints('');
    setTo('');
    setDroppingPoints('');
    setSleeperNonSleeper('');
    setAcNonAc('');
    setDepartureTime('');
    setArrivalTime('');
    setLowerBerthPrice('');
    setUpperBerthPrice('');
    setOperatorName('');
    setOperatorNumber('');
    setTimeDifference('');
  };

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

 
  return (


    <motion.div
    initial={{ opacity: 0, x: -30 }} // Initial animation properties (starting from righht)
    animate={{ opacity: 1, x: 0 }} // Animation properties when component is mounted (move to center)
    transition={{ duration: 0.6, delay: 0.3 }} // Animation duration and delay
>
    <Box p={3} marginTop={'30px'} marginBottom={'100px'}>
     
      <Typography variant="h4" gutterBottom>
        Add Buses
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Bus Name"
            variant="outlined"
            value={busName}
            onChange={handleInputChange(setBusName)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Bus Number"
            variant="outlined"
            value={busNumber}
            onChange={(e) => {
              handleBusNumberChange(e);
            }}
            placeholder="00 00 00 0000"
            error={busNumberError !== ''}
            helperText={busNumberError}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="From"
            variant="outlined"
            value={from}
            onChange={handleInputChange(setFrom)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Boarding Points"
            variant="outlined"
            value={boardingPoints}
            onChange={handleInputChange(setBoardingPoints)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="To"
            variant="outlined"
            value={to}
            onChange={handleInputChange(setTo)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Dropping Points"
            variant="outlined"
            value={droppingPoints}
            onChange={handleInputChange(setDroppingPoints)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Sleeper/Non-Sleeper</InputLabel>
            <Select
              value={sleeperNonSleeper}
              onChange={handleInputChange(setSleeperNonSleeper)}
              label="Sleeper/Non-Sleeper"
            >
              <MenuItem value="Sleeper">Sleeper</MenuItem>
              <MenuItem value="Non-Sleeper">Non-Sleeper</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>AC/Non-AC</InputLabel>
            <Select
              value={acNonAc}
              onChange={handleInputChange(setAcNonAc)}
              label="AC/Non-AC"
            >
              <MenuItem value="AC">AC</MenuItem>
              <MenuItem value="Non-AC">Non-AC</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Departure Time"
            variant="outlined"
            type="time"
            value={departureTime}
            onChange={handleInputChange(setDepartureTime)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Arrival Time"
            variant="outlined"
            type="time"
            value={arrivalTime}
            onChange={handleInputChange(setArrivalTime)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Duration"
            variant="outlined"
            value={timeDifference}
            
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Lower Berth Price"
            variant="outlined"
            type="number"
            value={lowerBerthPrice}
            onChange={handleInputChange(setLowerBerthPrice)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Upper Berth Price"
            variant="outlined"
            type="number"
            value={upperBerthPrice}
            onChange={handleInputChange(setUpperBerthPrice)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Operator Name"
            variant="outlined"
            value={operatorName}
            onChange={handleInputChange(setOperatorName)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Operator Number"
            variant="outlined"
            value={operatorNumber}
            onChange={handleInputChange(setOperatorNumber)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            fullWidth
            label="Total Seats"
            variant="outlined"
            disabled
            value={totalSeats}
          />
        </Grid>
        <Grid item xs={12} style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              {selectedBus ? 'Update Bus Details' : 'Add Bus Details'}
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={resetForm}
              style={{ marginLeft: '10px' }}
            >
              Reset
            </Button>
          </Grid>

      </Grid>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Display Bus Details Table */}
      <Box mt={4}>
        <TableContainer component={Paper}>
          <Table aria-label="bus details table">
          <TableHead>
              <TableRow>
                  <TableCell style={{ fontWeight: 'bold' }}>Bus Id</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Bus Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Bus Number</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>From</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Boarding Points</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>To</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Dropping Points</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Sleeper/Non-Sleeper</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>AC/Non-AC</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Departure Time</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Arrival Time</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Lower Berth Price</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Upper Berth Price</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Operator Name</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Operator Number</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Total Seats</TableCell>
                  <TableCell style={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
          </TableHead>

            <TableBody>
              {busDetails.map((bus, index) => (
                <TableRow key={index}>
                  <TableCell>{bus.id}</TableCell>
                  <TableCell>{bus.busName}</TableCell>
                  <TableCell>{bus.busNumber}</TableCell>
                  <TableCell>{bus.from}</TableCell>
                  <TableCell>{bus.boardingPoints}</TableCell>
                  <TableCell>{bus.to}</TableCell>
                  <TableCell>{bus.droppingPoints}</TableCell>
                  <TableCell>{bus.sleeperNonSleeper}</TableCell>
                  <TableCell>{bus.acNonAc}</TableCell>
                  <TableCell>{bus.departureTime}</TableCell>
                  <TableCell>{bus.arrivalTime}</TableCell>
                  <TableCell>{bus.lowerBerthPrice}</TableCell>
                  <TableCell>{bus.upperBerthPrice}</TableCell>
                  <TableCell>{bus.operatorName}</TableCell>
                  <TableCell>{bus.operatorNumber}</TableCell>
                  <TableCell>{bus.totalSeats}</TableCell>
                  <TableCell>
                    <ButtonGroup  variant="text">
                    <Button
                      color="primary"
                      onClick={() => handleSelectBus(bus)}
                    >
                      Edit
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => deleteBusDetails(bus.id)}
                      style={{ marginLeft: '10px' }}
                    >
                      Delete
                    </Button>
                    </ButtonGroup>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
    </motion.div>
  );
};

export default Admin;
