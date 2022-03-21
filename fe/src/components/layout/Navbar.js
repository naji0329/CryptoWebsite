import React, { Fragment, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { logout } from '../../actions/auth';

import {
  Row, Col, DropdownButton, Dropdown, Collapse
} from 'react-bootstrap';

const Navbar = ({ auth: { isAuthenticated }, logout }) => {

  const [nav_height, change_nav_height] = useState("0px");
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [open3, setOpen3] = useState(false);
  const [address, setAddress] = useState();
  const navigate = useNavigate();

  const toggle_nav = () => {
    if(nav_height == "0px") {
      change_nav_height("100%");
    } else {
      change_nav_height("0px");
    }
  }

  const menuClick = async (e, page_name) => {
    e.preventDefault();
    navigate(page_name);
  }


  const authLinks = (
    <>
      <Link to="/profile" className=''>Profile</Link>
      <Link to="#!" onClick={logout} className=''>Log out</Link>
    </>
  );

  const guestLinks = (
    <>
      <Link to="/login" className=''>Sign In</Link>
      <Link to="/register" className=''>Sign Up</Link>
    </>
  );

  return (
    <section id='navbar'>

      {/* // This is menu part for mobile */}
      <div id="myNav" className="overlay" style={{height: nav_height}}>
        <div className="overlay-content p-2 text-light">
          <ul style={{listStyle: "none"}}>
            <li>
              <p
                onClick={() => setOpen1(!open1)}
                aria-controls="example-collapse-text"
                aria-expanded={open1}
              >
                Product &#x2193;
              </p>
              <Collapse in={open1}>
                <ul className='px-3' style={{"listStyle": "none", "fontSize": "16px"}}>
                  <Link to="#">Link 1</Link>
                  <Link to="#">Link 1</Link>
                  <Link to="#">Link 1</Link>
                </ul>
              </Collapse>
            </li>
            <li>
              <p
                onClick={() => setOpen2(!open2)}
                aria-controls="example-collapse-text"
                aria-expanded={open2}
              >
                Currencies &#x2193;
              </p>
              <Collapse in={open2}>
                <ul className='px-3' style={{"listStyle": "none", "fontSize": "16px"}}>
                  <Link to="#">Link 1</Link>
                  <Link to="#">Link 1</Link>
                  <Link to="#">Link 1</Link>
                </ul>
              </Collapse>
            </li>
            <li>
              <p
                onClick={() => setOpen3(!open3)}
                aria-controls="example-collapse-text"
                aria-expanded={open3}
              >
                Crypto Prices &#x2193;
              </p>
              <Collapse in={open3}>
                <ul className='px-3' style={{"listStyle": "none", "fontSize": "16px"}}>
                  <Link to="#">Link 1</Link>
                  <Link to="#">Link 1</Link>
                  <Link to="#">Link 1</Link>
                </ul>
              </Collapse>
            </li>
            
            {isAuthenticated ? (
              <li><Link to="money/send">Send Money</Link></li>
            ) : ""}


            <li className='d-flex justify-content-center text-center' style={{"marginLeft": "-30px"}}>
              {isAuthenticated ? authLinks : guestLinks}
            </li>

          </ul>
        </div>
      </div>

      
      {/* // This is menu part for desktop */}
      <div className='n-navbar'>
          <a href="/" className='mx-5 n-logo-text'>Peezee</a>
          <p className='text-light open-m-menu mx-5' onClick={toggle_nav} style={{textAlign: "right"}}>&#9776;</p>

          <div className='d-flex justify-content-between w-100 nav-menu'>
            <div className='d-flex n-menu'>
              <div className="n-dropdown">
                <button className="n-dropbtn">Product</button>
                <div className="n-dropdown-content">
                  <Link to="#">Link 1</Link>
                  <Link to="#">Link 1</Link>
                  <Link to="#">Link 1</Link>
                </div>
              </div> 
              <div className="n-dropdown">
                <button className="n-dropbtn">Currencies</button>
                <div className="n-dropdown-content">
                  <Link to="#">Link 1</Link>
                  <Link to="#">Link 1</Link>
                  <Link to="#">Link 1</Link>
                </div>
              </div> 
              <div className="n-dropdown">
                <button className="n-dropbtn">Crypto Prices</button>
                <div className="n-dropdown-content">
                  <Link to="#">Link 1</Link>
                  <Link to="#">Link 1</Link>
                  <Link to="#">Link 1</Link>
                </div>
              </div> 
              {isAuthenticated ? (
                <Link to="money/send">Send Money</Link>
              ) : ""}
            </div>
            <div className='d-flex align-items-center mx-5'>
              {isAuthenticated ? authLinks : guestLinks}
            </div>
          </div>
      </div>
    </section>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logout })(Navbar);
