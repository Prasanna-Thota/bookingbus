import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import SignIn from './components/Signin/Signin';
import SignUp from './components/SignUp.js/SignUp';
import Home from './components/Home/Home';
import BusList from './components/BusList/Buslist';
import Tickets from './components/BusList/Tickets';
import BookingDetails from './components/Payment/BookingDetails';
import PassengerDetails from './components/Payment/PassengerDetails';
import Payment, { SessionExpired } from './components/Payment/payment';
import Success from './components/Payment/Success';
import MyBookings from './components/Bookings/MyBookings';
import ContactUs from './components/Contact/Contactus';
import ProtectedRouting from './components/ProtectedRouting';
import Profile from './components/Profile/profile';
import Admin from './components/Admin/Admin';
import Bookings from './components/Admin/Bookings';
import FeedbackDetails from './components/Admin/FeedbackDetails';
import BusDetailsCard from './components/Admin/BusDetailsCard';
import Dashboard from './components/Admin/DashBoard';
import Users from './components/Admin/Users';

const App = () => {
  const isLoggedIn = localStorage.getItem("username");

  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public routes */}
        {isLoggedIn == null && (
          <>
            <Route path='/' element={<Home />} />
            <Route path='/signin' element={<SignIn />} />
            <Route path='/signup' element={<SignUp />} />
          </>
        )}

        {/* Protected routes */}
        <Route element={<ProtectedRouting />}>
          {/* Redirect authenticated users from signin/signup */}
          <Route path='/signin' element={<Navigate to="/" />} />
          <Route path='/signup' element={<Navigate to="/" />} />

          {/* Routes based on user login status */}
          {isLoggedIn === "mani" ? (
            <>
              <Route path='/' element={<Dashboard/>} />
              <Route path='/addbus' element={<Admin />} />
              <Route path='/booking' element={<Bookings/>} />
              <Route path='/feedbackDetails' element={<FeedbackDetails/>} />
              <Route path='/buscard' element={<BusDetailsCard/>} />
              <Route path='/users' element={<Users/>} />
              <Route path='/profile' element={<Profile />} />
              <Route path="/buslist/:from/:to/:date" element={<Navigate to="/" />} />
              <Route path='/tickets' element={<Navigate to="/" />} />
              <Route path='/booking' element={<Navigate to="/" />} />
              <Route path='/passengerdetails' element={<Navigate to="/" />} />
              <Route path='/payment' element={<Navigate to="/" />} />
              <Route path='/success' element={<Navigate to="/" />} />
              <Route path='/bookings' element={<Navigate to="/" />} />
              
            </>
          ) : (
            <>
              <Route path='/' element={<Home />} />
              <Route path='/admin' element={<Navigate to="/" />} />
              <Route path="/buslist/:from/:to/:date" element={<BusList />} />
              <Route path='/tickets' element={<Tickets />} />
              <Route path='/booking' element={<BookingDetails />} />
              <Route path='/passengerdetails' element={<PassengerDetails />} />
              <Route path='/payment' element={<Payment />} />
              <Route path='/success' element={<Success />} />
              <Route path='/bookings' element={<MyBookings />} />
              <Route path='/contactus' element={<ContactUs />} />
              <Route path='/sessionexpired' element={<SessionExpired />} />
              <Route path='/profile' element={<Profile />} />
            </>
          )}
          
          {/* Default redirect for unmatched routes */}
          <Route path='*' element={<Navigate to="/" />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
