import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Button,
  Grid,
  Stack,
  Toolbar,
  IconButton,
  Hidden,
  Drawer,
  List,
  ListItem,
  Divider,
  Grow,
  Popper,
  ClickAwayListener,
  MenuList,
  MenuItem,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard'; // Alternative icon for Home
import BuildIcon from '@mui/icons-material/Build';
import InfoIcon from '@mui/icons-material/Info';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { NavLink, useNavigate } from 'react-router-dom'; // Import NavLink from react-router-dom
import { Link as ScrollLink, animateScroll as scroll } from 'react-scroll'; // Import ScrollLink and scroll from react-scroll
import './Navbar.css';
import { Link } from 'react-router-dom';
import { DepartureBoard, DirectionsBus, RateReview } from '@mui/icons-material';

const socialIconStyles = {
  color: '#ffffff',
  marginRight: '10px',
  '&:hover': {
    backgroundColor: 'skyblue'
  }
};

const iconButtonStyles = {
  color: '#ffffff',
  fontSize: ''
};

const buttonStyles = {
  color: 'black',
  fontSize: '15px',
  fontWeight: '540',
  '&:hover': {
    backgroundColor: 'white',
    color: '#f15a29'
  }
};

const activeButtonStyles = {
  ...buttonStyles,
  fontWeight: 'bold',
  color: 'primary.main', // or any other style you want to apply to the active link
};


const stackStyles = {
  backgroundColor: '#EE4E5B',
  color: '#ffffff',
  padding: '0px' // Remove padding
};

const iconContainerStyles = {
  display: 'flex',
  alignItems: 'center',
  marginLeft: '50px',
  padding: '0px' // Remove padding
};

const textStyles = {
  fontWeight: '500',
  fontSize: '0.8rem',
  color: '#ffffff',
  margin: '0' // Remove margin
};


function Navbar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAppBarFixed, setIsAppBarFixed] = useState(false);
  const anchorRef = React.useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  }



  const username = localStorage.getItem("username");

  function handleLogout() {
    localStorage.removeItem("username");
    window.location.reload();
  }

  function handleBookings() {
    toggleSidebar();
    navigate("/bookings")
  }

  function handleProfile() {
    navigate('/profile');
  }
  function handleprofile2(){
    navigate('/profile')
  }

  useEffect(() => {
    function handleScroll() {
      const offset = window.scrollY;
      if (offset > 0 && !isAppBarFixed) {
        setIsAppBarFixed(true);
      } else if (offset === 0 && isAppBarFixed) {
        setIsAppBarFixed(false);
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isAppBarFixed]);

  const sidebarContent = (
    <div style={{ width: 250 }}>



      <List>
        <ListItem>
          <img src='/images/logo.png' alt="Company Logo" style={{ maxWidth: '100%', height: 'auto' }} />
        </ListItem>

        <Divider />
        
        {username !=="mani" ?(<>
          <ListItem>
          <NavLink
            to="/"
            exact
            style={{ width: '100%' }}
            onClick={() => {
              toggleSidebar();
              scroll.scrollToTop();
            }}
          >
            <Button
              sx={{ ...buttonStyles, justifyContent: 'start' }}
              startIcon={<DashboardIcon />}
            >
              Home
            </Button>
          </NavLink>
        </ListItem>
        <ListItem>
          <ScrollLink
            to="offers"
            spy={true}
            smooth={true}
            offset={-240} // Adjust offset if needed to ensure correct scrolling position
            duration={500}
            activeClass="active-link"
            onClick={toggleSidebar}
          >
            <Button sx={{ ...buttonStyles, width: '100%', justifyContent: 'start' }} startIcon={<BuildIcon />}>Offers</Button>
          </ScrollLink>
        </ListItem>
        <ListItem>
          <ScrollLink
            to="aboutus"
            spy={true}
            smooth={true}
            offset={-120} // Adjust offset if needed to ensure correct scrolling position
            duration={500}
            activeClass="active-link"
            onClick={toggleSidebar}
          >
            <Button sx={{ ...buttonStyles, width: '100%', justifyContent: 'start' }} startIcon={<InfoIcon />}>About Us</Button>
          </ScrollLink>
        </ListItem>
        </>): (<>
          <ListItem>
          <Button
              component={NavLink} to="/"
              sx={buttonStyles}
              startIcon={<DashboardIcon />}
              exact 
            >
              Home
            </Button>
        </ListItem>
        <ListItem>
        <Button
            component={NavLink} to="/addbus"
            sx={buttonStyles}
            startIcon={<DirectionsBus />}
            exact 
          >
            Add Bus
          </Button>
        </ListItem>
        <ListItem>
          <Button
              component={NavLink} to="/buscard"
              sx={buttonStyles}               
              startIcon={<DepartureBoard />}
                exact 
                  >
              Buses
              </Button>
        </ListItem>
        <ListItem>
                 <Button
                 component={NavLink} to="/feedbackDetails"
                 sx={buttonStyles}
                 startIcon={<RateReview />}
                 exact 
               >
                 Feedbacks
               </Button>
              
        </ListItem>
        </>)}
        
        <Divider />
        <ListItem>
            <Button
              component={Link}
              to="/contactus"
              sx={{ ...buttonStyles, width: '100%', justifyContent: 'start' }}
              startIcon={<SupportAgentIcon />}
              onClick={toggleSidebar}
            >
              Help
            </Button>
          </ListItem>
        <ListItem>
          {!username ? (
            <NavLink 
            to="/signin" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Button
                component={NavLink}
                to="/signin"
                variant='contained'
                color='primary'
                
              >
                Sign In
              </Button>
            </NavLink>
          ):(
          <Accordion sx={{ width: '100%', boxShadow: 'none' }}>
            <AccordionSummary
              expandIcon={<KeyboardArrowDownIcon />}
              aria-controls="account-menu"
              id="account-menu"
              sx={{
                padding: 0,
                '&.Mui-expanded': {
                  minHeight: 'auto',
                },
              }}
            >
              <AccountCircleIcon />
              <Typography sx={{ ml: 1, fontWeight: '500' }}>{username.toUpperCase()}</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ padding: 0 }}>
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                    <MenuItem sx={{ ...buttonStyles }} onClick={handleProfile }>Profile</MenuItem>
                    <MenuItem sx={{ ...buttonStyles }} onClick={handleBookings}>My Bookings</MenuItem>
                    <MenuItem sx={{ ...buttonStyles }} onClick={handleLogout}>Logout</MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </AccordionDetails>
          </Accordion>
          )}
        </ListItem>
        <Divider />
        <ListItem>
          <IconButton sx={{ color: '#3b5998' }}>
            <FacebookIcon fontSize="medium" />
          </IconButton>
          <IconButton sx={{ color: '#00acee' }}>
            <TwitterIcon fontSize="medium" />
          </IconButton>
          <IconButton sx={{ color: '#e4405f' }}>
            <InstagramIcon fontSize="medium" />
          </IconButton>
          <IconButton sx={{ color: '#0077b5' }}>
            <LinkedInIcon fontSize="medium" />
          </IconButton>
        </ListItem>
      </List>
    </div>
  );

  const handleNavigationAndScroll = (path, sectionId, offset) => {
    navigate(path);
    setTimeout(() => {
      scroll.scrollTo(document.getElementById(sectionId).offsetTop + offset, {
        duration: 500,
        smooth: true,
      });
    }, 100); // Adjust timeout if needed
  };



  return (
    <div>
      <Hidden mdUp>
        <Drawer anchor="left" open={sidebarOpen} onClose={toggleSidebar}>
          {sidebarContent}
        </Drawer>
      </Hidden>

      <Hidden mdDown>
        <Stack direction='row' sx={stackStyles}>
          <div style={iconContainerStyles}>
            <IconButton sx={{ ...iconButtonStyles, fontSize: 'small' }}>
              <EmailIcon fontSize='100' />
            </IconButton>
            <a href="mailto:info@smartbus.com" style={{ ...textStyles, textDecoration: 'none', background:'none'}}>info@smartbus.com</a>
          </div>

          <div style={iconContainerStyles}>
            <IconButton sx={{ ...iconButtonStyles, fontSize: 'small' }}>
              <PhoneIcon fontSize='100' />
            </IconButton>
            <p style={textStyles}>+91 123456789</p>
          </div>

          <div style={iconContainerStyles}>
            <IconButton sx={{ ...iconButtonStyles, fontSize: 'small' }}>
              <PhoneIcon fontSize='100' />
            </IconButton>
            <p style={textStyles}>+1 98765432112</p>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', marginRight: '50px' }}>
          <IconButton sx={socialIconStyles} component="a" href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FacebookIcon fontSize='small' />
          </IconButton>
          <IconButton sx={socialIconStyles} component="a" href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
            <TwitterIcon fontSize='small' />
          </IconButton>
          <IconButton sx={socialIconStyles} component="a" href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <InstagramIcon fontSize='small' />
          </IconButton>
          <IconButton sx={socialIconStyles} component="a" href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
            <LinkedInIcon fontSize='small' />
          </IconButton>

          </div>
        </Stack>
      </Hidden>


      <AppBar position={isAppBarFixed ? 'fixed' : 'static'} color='inherit' sx={{ backgroundColor: '#fff', boxShadow: '3', transition: 'all 0.3s ease', '&.MuiAppBar-fixed': { backgroundColor: '#fff', } }}>
        <Toolbar>
          
          <Grid container alignItems="center" justifyContent="space-between">
            <Hidden mdUp>
              <Grid item>
                <IconButton onClick={toggleSidebar} sx={{ color: 'black' }}>
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item>
            <Link 
                  to="/" 
                  onClick={() => window.scrollTo(0, 0)} 
                  style={{ textDecoration: 'none', background: 'none' }}
                >
                  <img 
                    src="/images/logo.png" 
                    alt="Company Logo" 
                    width="200px" 
                    height="23px" 
                    style={{ backgroundColor: '#fff' }} 
                  />
                </Link>
            </Grid>
            <Hidden mdDown>
              
              
              <Grid item>

        {username !=="mani" ? (
                  <Stack spacing={3} direction="row">
                  <NavLink
                    to="/"
                    style={({ isActive }) => ({
                      textDecoration: 'none',
                      background: 'none',
                      color: isActive ? 'blue' : 'inherit',
                    })}
                  >
                    <Button
                      onClick={() => scroll.scrollToTop()}
                      sx={({ isActive }) => (isActive ? activeButtonStyles : buttonStyles)}
                      startIcon={<DashboardIcon />}
                    >
                      Home
                    </Button>
                  </NavLink>
            
                  <Button
                    onClick={() => handleNavigationAndScroll('/', 'offers', -240)}
                    sx={buttonStyles}
                    startIcon={<BuildIcon />}
                  >
                    Offers
                  </Button>
            
                  <Button
                    onClick={() => handleNavigationAndScroll('/', 'aboutus', -120)}
                    sx={buttonStyles}
                    startIcon={<InfoIcon />}
                  >
                    About Us
                  </Button>
                </Stack>
              ):
              
              (<>
                  <Stack spacing={3} direction="row">
                          <Button
                          component={NavLink} to="/"
                          sx={buttonStyles}
                          startIcon={<DashboardIcon />}
                        >
                          Home
                        </Button>
                          <Button
                          component={NavLink} to="/addbus"
                          sx={buttonStyles}
                          startIcon={<DirectionsBus />}
                        >
                          Add Bus
                        </Button>
                    <Button
                      component={NavLink} to="/buscard"
                      sx={buttonStyles}
                      startIcon={<DepartureBoard />}
                    >
                    Buses
                    </Button>

                 <Button
                 component={NavLink} to="/feedbackDetails"
                 sx={buttonStyles}
                 startIcon={<RateReview />}
                  
               >
                 Feedbacks
               </Button>
               </Stack>
               </>)}
                
              </Grid>


            </Hidden>
            <Hidden mdDown>
              <Grid item marginRight='40px'>
                <Stack direction='row' spacing={2} alignItems="center">
                  
                  <Button component={Link} to="/contactus" startIcon={<SupportAgentIcon />} sx={buttonStyles}>Help</Button>
                  {username ? (
                    <Button
                      ref={anchorRef}
                      onClick={handleToggle}
                      startIcon={<AccountCircleIcon />}
                      endIcon={<KeyboardArrowDownIcon />}
                      sx={{
                        ...buttonStyles,
                        backgroundColor: 'transparent',
                        color: '#000',
                        '&:hover': {
                          backgroundColor: 'white',
                          color: '#f15a29',
                        }
                      }}
                    >
                      {username}
                    </Button>
                  ) : (
                    <NavLink 
                    to="/signin" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Button
                        component={NavLink}
                        to="/signin"
                        variant='contained'
                        color='primary'
                        
                      >
                        Sign In
                      </Button>
                    </NavLink>
                  )}    
                  <Popper
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin: placement === 'bottom-start' ? 'left top' : 'left bottom',
                        }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={handleClose}>
                            <MenuList
                              autoFocusItem={open}
                              id="menu-list-grow"
                              onKeyDown={handleListKeyDown}
                            >
                              <MenuItem sx={{ ...buttonStyles }} onClick={handleprofile2}>Profile</MenuItem>
                              <MenuItem sx={{ ...buttonStyles }} onClick={handleBookings}>My Bookings</MenuItem>
                              <MenuItem sx={{ ...buttonStyles }} onClick={handleLogout}>Logout</MenuItem>
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </Stack>
              </Grid>
            </Hidden>
          </Grid>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar;
