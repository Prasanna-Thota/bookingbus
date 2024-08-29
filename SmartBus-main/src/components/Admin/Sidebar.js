import { Link, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import  Admin  from "./Admin";
import {  useState } from "react";
import FeedbackDetails from "./FeedbackDetails";
import  Bookings  from "./Bookings";

 const Sidebar = () => {
  const [selectedComponent, setSelectedComponent] = useState('');
const navigate = useNavigate();

  // Function to handle component selection
  const handleComponentChange = (componentId) => {
    setSelectedComponent(componentId);
  };



  // Function to render selected component
  const renderSelectedComponent = () => {
    switch (selectedComponent) {
      case 'home':
        return <Admin />;
      case 'admin':
        return <Bookings/>;
      case 'feedback':
        return <FeedbackDetails/>;
      case 'logout':
        return <div>Logout Component</div>;
      case 'Demo':
        return <div style={{ marginLeft:'500px'}}>Admin DashBoard</div>;
      default:
        return null;
    }
  };

    const handleLogout = () => {
        localStorage.removeItem("username");
        window.location.reload();
        navigate("/signin");
  }

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="#" className="logo">
              <img src="/images/symbol.jpg" alt="Logo" className="logo-image" />
              <img src="/images/logo.png" alt="Logo Hover" className="hover-image" />
            </Link>
          </li>
          <li>
            <Link to="#" className={`nav-link ${selectedComponent === 'home' ? 'active' : ''}`} onClick={() => handleComponentChange('home')}>
              <i className="fas fa-home"></i>
              <span className="nav-item">Home</span>
            </Link>
          </li>
          <li>
            <Link to="#" className={`nav-link ${selectedComponent === 'admin' ? 'active' : ''}`} onClick={() => handleComponentChange('admin')}>
              <i className="fas fa-user"></i>
              <span className="nav-item">Admin</span>
            </Link>
          </li>
          <li>
            <Link to="#" className={`nav-link ${selectedComponent === 'feedback' ? 'active' : ''}`} onClick={() => handleComponentChange('feedback')}>
              <i className="fas fa-question-circle"></i>
              <span className="nav-item">Feedback</span>
            </Link>
          </li>
          <li>
            <Link to="#" className="nav-link logout" onClick={() => handleLogout()}>
              <i className="fas fa-sign-out-alt"></i>
              <span className="nav-item">Log out</span>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="main-content">
        {renderSelectedComponent()}
      </div>
    </div>
  );
};

export default Sidebar;