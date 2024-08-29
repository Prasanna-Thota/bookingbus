import React, { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './Navbar.css';

function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuItemClick = () => {
    setIsMenuOpen(false);
    // Handle menu item click actions here
  };

  return (
    <div>
      <div className="app-bar">
        <div className="toolbar">
          <div className="logo">
            <img src='/images/logo.jfif' alt="Company Logo" width='140px' />
          </div>
          <div className="nav-items">
            <button className="nav-button" onClick={handleMenuClick}>
              Services <KeyboardArrowDownIcon fontSize='small' />
            </button>
            <button className="nav-button">Technology Stack</button>
            <button className="nav-button">Industries</button>
            <button className="nav-button">Company</button>
            <button className="nav-button">Resources</button>
            <button className="nav-button">Contact Us</button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="menu">
          <ul className="menu-list">
            <li className="menu-item" onClick={handleMenuItemClick}>Product Development</li>
            <li className="menu-item" onClick={handleMenuItemClick}>Custom Application Development</li>
            <li className="menu-item" onClick={handleMenuItemClick}>Web Services Development</li>
            <li className="menu-item" onClick={handleMenuItemClick}>Application Migration</li>
            <li className="menu-item" onClick={handleMenuItemClick}>Application Integration</li>
            <li className="menu-item" onClick={handleMenuItemClick}>Engineering Services</li>
            <li className="menu-item" onClick={handleMenuItemClick}>IoT Services</li>
            <li className="menu-item" onClick={handleMenuItemClick}>Quality Assurance</li>
            <li className="menu-item" onClick={handleMenuItemClick}>DevOps Services</li>
            <li className="menu-item" onClick={handleMenuItemClick}>Cloud Management</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Nav;
