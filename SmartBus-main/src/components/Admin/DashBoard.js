import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Box,
    Card,
    CardContent,
    Grid,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Divider
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DirectionsBus from '@mui/icons-material/DirectionsBus';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import axios from 'axios';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts';
import { subDays } from 'date-fns';

const Dashboard = () => {
    const [busDetails, setBusDetails] = useState([]);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [users, setUsers] = useState([]);
    const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [gstAmount, setGstAmount] = useState(0);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        fetchBusDetails();
        fetchBookingDetails();
        fetchUsers();
    }, []);

    useEffect(() => {
        // Calculate total income whenever bookingDetails changes
        const total = bookingDetails.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.totalWithGst;
        }, 0);
        setTotalAmount(total);

        const gst = bookingDetails.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.gstAmount;
        }, 0);
        setGstAmount(gst);

        const totalAmount1 = total - gst;
        setTotal(totalAmount1);

    }, [bookingDetails]);

    const fetchBusDetails = () => {
        axios.get('http://localhost:5042/api/busDetails/get')
            .then(response => {
                setBusDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching bus details', error);
            });
    }

    const fetchBookingDetails = () => {
        axios.get('http://localhost:5042/api/User/getBookingDetails')
            .then(response => {
                setBookingDetails(response.data);
            })
            .catch(error => {
                console.error('Error fetching booking details:', error);
            });
    }

    const fetchUsers = () => {
        axios.get('http://localhost:5042/api/User/getallUsers')
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    }

    const stats = [
        { icon: <GroupIcon sx={{ fontSize: 40, color: 'rgb(238,78,91)' }} />, label: 'Customers', value: users.length, link: '/users' },
        { icon: <ShoppingCartIcon sx={{ fontSize: 40, color: 'rgb(238,78,91)' }} />, label: 'Total orders', value: bookingDetails.length, link: '/booking' },
        { icon: <DirectionsBus sx={{ fontSize: 40, color: 'rgb(238,78,91)' }} />, label: 'Buses', value: busDetails.length, link: '/buscard' },
        { icon: <CurrencyRupeeIcon sx={{ fontSize: 40, color: 'rgb(238,78,91)' }} />, label: 'Total Income', value: totalAmount, link: '/', dialog: true },
    ];

    // Pie Chart data
    const pieChartData = [
        { id: 0, value: users.length, label: 'Customers', color:'rgb(238,78,91)'},
        { id: 1, value: bookingDetails.length, label: 'Bookings',color:'rgb(46,150,255)'},
        { id: 2, value: busDetails.length, label: 'Buses', },
    ];

    // Fetching and setting data for Bar Chart
    const [chartData, setChartData] = useState([]);
    const [formattedDates, setFormattedDates] = useState([]);
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                // Get today's date
                const today = new Date();

                // Generate an array of dates for the past 5 days including today
                const dates = [];
                for (let i = 0; i < 5; i++) {
                    dates.push(subDays(today, i));
                }

                // Format the dates as strings in 'yyyy-MM-dd' format
                const formatted = dates.map(date => format(date, 'yyyy-MM-dd'));
                setFormattedDates(formatted.reverse()); // Reverse to display from oldest to newest

                // Fetch order data for each date
                const response = await axios.post('http://localhost:5042/api/busDetails/getDates', formatted);

                // Extract order counts from responses
                const data = response.data.map(item => item.orderCount); // Adjust according to your API response structure

                setChartData(data);
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchOrderData();
    }, []);

    // Function to get recent items based on createdDate
    const getRecentItems = (items, count) => {
        return items.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)).slice(0, count);
    };

    const recentBookingDetails = getRecentItems(bookingDetails, 5);
    const recentUsers = getRecentItems(users, 5);

    // Functions to handle dialog open/close
    const handleOpenIncomeDialog = () => {
        setOpenIncomeDialog(true);
    };

    const handleCloseIncomeDialog = () => {
        setOpenIncomeDialog(false);
    };


    const colorMap = {
        type: 'ordinal',
        colors: ['rgb(238,78,91)', 'rgb(238,78,91)', 'rgb(238,78,91)', 'rgb(238,78,91)', 'rgb(238,78,91)'],
    };

    const pieColorMap = {
        type: 'ordinal',
        colors: ['rgb(238,78,91)', 'rgb(144,238,144)', 'rgb(65,105,225)'],
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }} // Initial animation properties
            animate={{ opacity: 1, y: 0 }} // Animation properties when component is mounted
            transition={{ duration: 0.6, delay: 0.3 }} // Animation duration and delay
        >
            <Box p={3}>
                <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
                <Grid container spacing={3}>
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card>
                                <CardContent>
                                    {stat.dialog ? (
                                        <Box display="flex" alignItems="center" onClick={handleOpenIncomeDialog} style={{ cursor: 'pointer' }}>
                                            {stat.icon}
                                            <Box ml={2}>
                                                <Typography variant="h6">{stat.value}</Typography>
                                                <Typography color="textSecondary">{stat.label}</Typography>
                                            </Box>
                                        </Box>
                                    ) : (
                                        <Link to={stat.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Box display="flex" alignItems="center">
                                                {stat.icon}
                                                <Box ml={2}>
                                                    <Typography variant="h6">{stat.value}</Typography>
                                                    <Typography color="textSecondary">{stat.label}</Typography>
                                                </Box>
                                            </Box>
                                        </Link>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={openIncomeDialog} onClose={handleCloseIncomeDialog} maxWidth="sm" fullWidth>
                    <DialogTitle>Total Income Details</DialogTitle>
                    <DialogContent dividers>
                        <DialogContentText>
                            <Typography sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                                Total Amount:
                                <Typography sx={{ textAlign: 'right' }}>
                                    <CurrencyRupeeIcon sx={{ fontSize: 17 }} />{total}
                                </Typography>
                            </Typography>
                            <Divider />
                            <Typography sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 2 }}>
                                Total GST:
                                <Typography sx={{ textAlign: 'right' }}>
                                    + <CurrencyRupeeIcon sx={{ fontSize: 17 }} /> {gstAmount}
                                </Typography>
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" sx={{ color: 'black' }}>Total Income:</Typography>
                                <Typography variant="h6" sx={{ textAlign: 'right', color: 'black' }}> <CurrencyRupeeIcon sx={{ fontSize: 18 }} /> {totalAmount}</Typography>
                            </Box>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseIncomeDialog} variant='outlined' color="error">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>

                <Box mt={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="h6">Bookings Bar Graph</Typography>
                                    </Box>
                                    <Box sx={{ height: 300, overflowX: 'auto' }}>
                                        <BarChart
                                            xAxis={[
                                                {
                                                    id: 'barCategories',
                                                    data: formattedDates,
                                                    scaleType: 'band',
                                                    colorMap: colorMap,
                                                },
                                            ]}
                                            series={[
                                                {
                                                    data: chartData,
                                                },
                                            ]}
                                            width={700}
                                            height={300}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="h6">Pie Chart</Typography>
                                    </Box>
                                    <Box sx={{ height: 300 }}>
                                        <PieChart colorMap={pieColorMap}

                                            series={[
                                                {
                                                    data: pieChartData,
                                                    highlightScope: { faded: 'global', highlighted: 'item' },
                                                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                                                },
                                            ]}
                                            height={240}
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>

                <Box mt={4}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="h6">Recent Bookings</Typography>
                                    </Box>
                                    <Box sx={{ overflowX: 'auto' }}> {/* Add overflowX for horizontal scroll */}
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>From</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}></TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>To</TableCell>
                                                    <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {recentBookingDetails.map((d) => (
                                                    <TableRow key={d.bid}>
                                                        <TableCell>{d.userName}</TableCell>
                                                        <TableCell>{d.from}</TableCell>
                                                        <TableCell><ArrowRightAltIcon fontSize="medium" sx={{ color: 'grey' }} /></TableCell>
                                                        <TableCell>{d.to}</TableCell>
                                                        <TableCell>{d.totalWithGst}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between">
                                        <Typography variant="h6">Customers</Typography>
                                    </Box>
                                    <Table>
                                        <TableBody>
                                            {recentUsers.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell>
                                                        <Avatar sx={{ bgcolor: 'rgb(238,78,91)' }}>
                                                            <PersonIcon fontSize='small' />
                                                        </Avatar>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography>{user.userName}</Typography>
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
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </motion.div>
    );
};

export default Dashboard;
