import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import axios from 'axios';
import { format } from 'date-fns';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { motion } from 'framer-motion';


const Users = () => {
    const [users, setUsers] = useState([]);
    const [details, setDetails] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null); // To store the selected user for dialog
    const [openDialog, setOpenDialog] = useState(false); // State to control dialog visibility

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios.get('http://localhost:5042/api/User/getallUsers')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }

    useEffect(() => {
        // Fetch booking details from API when component mounts
        axios.get('http://localhost:5042/api/User/getBookingDetails')
            .then(response => {
                console.log(response.data);
                setDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching booking details:', error);
            });
    }, []);

    // Function to handle opening the dialog and setting the selected user
    const handleOpenDialog = (user) => {
        setSelectedUser(user);
        setOpenDialog(true);
    };

    // Function to close the dialog
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    // Function to sort details in "last come, first serve" order
    const sortDetailsLastComeFirstServe = (details) => {
        return details.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    return (
        <Box maxWidth={1200} mx="auto" mt={3}>
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5">Customers</Typography>
                    </Box>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Customer Id</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>User Name</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>City</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Created Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id} onClick={() => handleOpenDialog(user)} style={{ cursor: 'pointer' }}>
                                    <TableCell>
                                        <div style={{
                                              backgroundColor: 'rgb(238,78,91)',
                                              color: 'white',
                                              borderRadius: '50%',
                                              width: '30px', // Adjust size as needed
                                              height: '30px', // Adjust size as needed
                                              display: 'flex',
                                              justifyContent: 'center',
                                              alignItems: 'center',

                                        }}>
                                            {user.id}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{user.userName}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{user.email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{user.city}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography>{format(new Date(user.createdDate), 'dd-MM-yyyy')}</Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Dialog to display user's booking details */}

            <motion.div
            initial={{ opacity: 0, y: 30 }} // Initial animation properties
            animate={{ opacity: 1, y: 0 }} // Animation properties when component is mounted
            transition={{ duration: 0.6, delay: 0.3 }} // Animation duration and delay
        > 
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>{selectedUser ? `${selectedUser.userName}'s Booking Details` : 'Booking Details'}</DialogTitle>
                <DialogContent dividers>
                    {selectedUser ? (
                        details
                            .filter(booking => booking.userName === selectedUser.userName) // Filter by userName
                            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date in descending order (last come, first serve)
                            .length > 0 ? (
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Booking ID</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>From</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>To</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Bus Name</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Bus Number</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Selected Seats</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sortDetailsLastComeFirstServe(details)
                                            .filter(booking => booking.userName === selectedUser.userName) // Filter by userName
                                            .map((booking) => (
                                                <TableRow key={booking.bid}>
                                                    <TableCell>{booking.bid}</TableCell>
                                                    <TableCell>{booking.from}</TableCell>
                                                    <TableCell><ArrowRightAltIcon fontSize="medium" sx={{ color: 'grey' }} /></TableCell>
                                                    <TableCell>{booking.to}</TableCell>
                                                    <TableCell>{new Date(booking.date).toLocaleDateString()}</TableCell>
                                                    <TableCell>{booking.busName}</TableCell>
                                                    <TableCell>{booking.busNumber}</TableCell>
                                                    <TableCell>{booking.totalWithGst}</TableCell>
                                                    <TableCell>
                                                        <Box style={{ width: '100px' }}>
                                                            {booking.selectedSeats.join(", ")}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <DialogContentText>No bookings found for {selectedUser.userName}.</DialogContentText>
                            )
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} variant='outlined' color="error">Close</Button>
                </DialogActions>
            </Dialog>
            
            </motion.div>
        </Box>
    );
}

export default Users;
