import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Container, FormControl, FormControlLabel, FormGroup, MenuItem, Radio, RadioGroup, Select, TextField, Typography, Checkbox, Grid } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import { useLocation, useNavigate } from 'react-router-dom';

const PassengerDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bus, selectedSeats, totalAmount } = location.state || {};

  const initialPassengerDetails = useMemo(() => Array(selectedSeats?.length || 0).fill({ name: '', gender: '', age: '' }), [selectedSeats]);
  const initialErrors = useMemo(() => ({
    passenger: initialPassengerDetails.map(() => ({ name: '', gender: '', age: '' })),
    contact: { email: '', phone: '' }
  }), [initialPassengerDetails]);

  const [passengerDetails, setPassengerDetails] = useState(initialPassengerDetails);
  const [contactDetails, setContactDetails] = useState({ email: '', phone: '' });
  const [errors, setErrors] = useState(initialErrors);
  const [gstNumber, setGstNumber] = useState('');
  const [gstChecked, setGstChecked] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountPercentage, setDiscountPercentage] = useState(0);

  useEffect(() => {
    setPassengerDetails(initialPassengerDetails);
    setErrors(initialErrors);
  }, [selectedSeats, initialPassengerDetails, initialErrors]);

  const handleInputChange = (index, field, value) => {
    if (field === 'email' || field === 'phone') {
      setContactDetails({ ...contactDetails, [field]: value });
      setErrors({ ...errors, contact: { ...errors.contact, [field]: '' } });
    } else {
      const updatedPassengers = [...passengerDetails];
      updatedPassengers[index] = { ...updatedPassengers[index], [field]: value };
      setPassengerDetails(updatedPassengers);

      const updatedErrors = { ...errors };
      updatedErrors.passenger[index] = { ...updatedErrors.passenger[index], [field]: '' };
      setErrors(updatedErrors);
    }
  };

  const handleApplyCoupon = () => {
    let appliedDiscount = 0;

    switch (couponCode.toUpperCase()) {
      case 'NEXGILE10':
        appliedDiscount = 10;
        setAppliedCoupon('NEXGILE10');
        break;
      case 'NEXGILE20':
        appliedDiscount = 20;
        setAppliedCoupon('NEXGILE20');
        break;
      default:
        alert('Invalid coupon code');
        return;
    }

    setDiscountPercentage(appliedDiscount);
  };



  const handleCouponCodeChange = (e) => {
    const value = e.target.value;
    setCouponCode(value);
    if (!value) {
      setAppliedCoupon(null);
      setDiscountPercentage(0);
    }
  };


const handleProceedToBook = () => {
  let valid = true;

  const updatedErrors = {
    passenger: passengerDetails.map(() => ({ name: '', gender: '', age: '' })),
    contact: { email: '', phone: '' }
  };

  passengerDetails.forEach((passenger, index) => {
    if (!passenger.name.trim()) {
      updatedErrors.passenger[index].name = 'Name is required';
      valid = false;
    }
    if (!passenger.gender) {
      updatedErrors.passenger[index].gender = 'Gender is required';
      valid = false;
    }
    if (!passenger.age.trim() || isNaN(passenger.age)) {
      updatedErrors.passenger[index].age = 'Age must be a number';
      valid = false;
    }
  });

  if (!contactDetails.email.trim()) {
    updatedErrors.contact.email = 'Email is required';
    valid = false;
  } else if (!isValidEmail(contactDetails.email)) {
    updatedErrors.contact.email = 'Invalid email format';
    valid = false;
  }

  if (!contactDetails.phone.trim()) {
    updatedErrors.contact.phone = 'Phone is required';
    valid = false;
  } else if (!isValidPhoneNumber(contactDetails.phone)) {
    updatedErrors.contact.phone = 'Invalid phone number';
    valid = false;
  }

  if (!valid) {
    setErrors(updatedErrors);
  } else {

    const bookingData = {
      passengers: passengerDetails,
      contact: contactDetails,
      gstNumber: gstChecked ? gstNumber : null,
      totalAmount: totalAmount,
      gstAmount: gstAmount,
      discountAmount: discountAmount,
      totalWithGst: totalWithGst,
      discountPercentage: discountPercentage,
      appliedCoupon: appliedCoupon
    };

    navigate('/payment', { state: { bus, selectedSeats, totalAmount, bookingData } });
  }
};


  const calculateTotalWithGst = () => {
    const gstAmount = (totalAmount * 0.05).toFixed(2);
    const discountAmount = ((totalAmount * discountPercentage) / 100).toFixed(2);
    const discountedAmount = totalAmount - discountAmount;
    const totalWithGst = (discountedAmount + parseFloat(gstAmount)).toFixed(2);
    return { gstAmount, discountAmount, totalWithGst };
  };
  
  const { gstAmount, discountAmount, totalWithGst } = calculateTotalWithGst();


  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    return /^[0-9]{10}$/.test(phone);
  };

  if (!Array.isArray(selectedSeats) || selectedSeats.length === 0) {
    return (
      <Container maxWidth="sm">
        <Box p={2}>
          <TextField
            label="No Seats Selected"
            fullWidth
            disabled
            InputProps={{ readOnly: true }}
          />
        </Box>
      </Container>
    );
  }



  return (
    <Container maxWidth="sm" style={{ paddingTop: '30px', paddingBottom: '56px', marginTop: "20px" }}>
      {selectedSeats.map((seat, index) => (
        <Box key={index} mb={2} p={2} border="1px solid #ddd" borderRadius="8px">
          <Typography variant="h6" gutterBottom>
            Passenger {index + 1} | <strong>Seat {seat}</strong>
          </Typography>
          <Grid container spacing={1}> {/* Reduced spacing from 2 to 1 */}
            <Grid item xs={12}>
              <TextField
                label={`Passenger ${index + 1} Name`}
                fullWidth
                size="small" 
                value={passengerDetails[index]?.name || ''}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                error={!!errors.passenger[index]?.name}
                helperText={errors.passenger[index]?.name}
              />
            </Grid>
            <Grid item xs={6}>
              <RadioGroup
                row
                aria-label={`Passenger ${index + 1} Gender`}
                value={passengerDetails[index]?.gender || ''}
                onChange={(e) => handleInputChange(index, 'gender', e.target.value)}
              >
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
              </RadioGroup>
              {errors.passenger[index]?.gender && (
                <Typography variant="body2" color="error">{errors.passenger[index]?.gender}</Typography>
              )}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={`Age`}
                fullWidth
                size="small"
                value={passengerDetails[index]?.age || ''}
                onChange={(e) => handleInputChange(index, 'age', e.target.value)}
                error={!!errors.passenger[index]?.age}
                helperText={errors.passenger[index]?.age}
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Box mt={2} p={2} border="1px solid #ddd" borderRadius="8px" marginBottom={"100px"}>
        <Box display="flex" alignItems="center" mb={2}>
          <EmailIcon color="primary" />
          <Typography variant="h6" ml={1}>
            Contact Details
          </Typography>
        </Box>
        <Typography variant="body2" color="textSecondary" mb={1}>
          Your ticket will be sent to these details
        </Typography>
        <Box mt={2}>
          <TextField
            label="Email ID"
            fullWidth
            size="small" 
            value={contactDetails.email}
            onChange={(e) => handleInputChange(null, 'email', e.target.value)}
            error={!!errors.contact.email}
            helperText={errors.contact.email}
          />
        </Box>
        <Box mt={2} display="flex" alignItems="center">
          <FormControl sx={{ width: '100px', mr: 2 }}>
            <Select
              value="+91"
              onChange={(e) => handleInputChange(null, 'countryCode', e.target.value)}
            >
              <MenuItem value="+91">+ 91</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Phone"
            fullWidth
            size="small" 
            value={contactDetails.phone}
            onChange={(e) => handleInputChange(null, 'phone', e.target.value)}
            error={!!errors.contact.phone}
            helperText={errors.contact.phone}
          />
        </Box>
        <Box mt={2} >
          <FormGroup>
            <FormControlLabel
              control={<Checkbox checked={gstChecked} onChange={() => setGstChecked(!gstChecked)} color="primary" />}
              label="I have a GST number (optional)?"
            />
          </FormGroup>
          {gstChecked && (
            <Box mt={2}>
              <TextField
                label="GST Number"
                fullWidth
                size="small" 
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value)}
              />
            </Box>
          )}
        </Box>
        <Box mt={2} p={2} border="1px solid #ddd" borderRadius="8px">
        <Typography variant="h6" gutterBottom>
          Apply Coupon Code
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              label="Coupon Code"
              fullWidth
              size="small" 
              value={couponCode}
              onChange={handleCouponCodeChange}              />
          </Grid>
          <Grid item xs={4}>
            <Button variant="contained"
            color="primary"
            onClick={handleApplyCoupon}
            disabled={!couponCode}>
              Apply
            </Button>
          </Grid>
        </Grid>
        {appliedCoupon && (
          <Typography variant="body2" color="textSecondary" mt={1}>
            Coupon code "{appliedCoupon}" applied successfully!
          </Typography>
        )}
      </Box>
      </Box>
      <Box
        mt={2}
        p={2}
        border="1px solid #ddd"
        borderRadius="8px"
        position="fixed"
        bottom={0}
        bgcolor="white"
        boxShadow={4}
        sx={{
          width: {
            xs: '83%', // full width on extra-small screens
            sm: '520px', // 520px width on small screens and larger
          },
          maxWidth: '100%',
        }}
      >

        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body1">
              Total Amount: INR {totalWithGst}
            </Typography>
            <Typography variant="body2">
              (Including GST 5%)
            </Typography>
            {appliedCoupon && (
               <Typography variant="body2">
                     Applied Discount ({appliedCoupon}): {discountPercentage}%
                </Typography>
            )}
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={handleProceedToBook}
            >
              PROCEED TO PAY
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default PassengerDetails;
