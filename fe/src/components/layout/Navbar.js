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
  const [open, setOpen] = useState(false);
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
      {/* <a href="/" className=''>Profile</a> */}
      <a href="#!" onClick={logout} className=''>Log out</a>
    </>
  );

  const guestLinks = (
    <>
      <a href="/login" className=''>Login</a>
      <a href="/register" className=''>Register</a>
    </>
  );

  return (
    <section id='navbar'>
      <div id="myNav" className="overlay" style={{height: nav_height}}>
        <div className="overlay-content p-2 text-light">
          <ul style={{listStyle: "none"}}>
            <li>Home</li>
            <li>Roadmap</li>
            <li>About Us</li>
            <li>
              <p
                onClick={() => setOpen(!open)}
                aria-controls="example-collapse-text"
                aria-expanded={open}
              >
                Mint &#x2193;
              </p>
              <Collapse in={open}>
                <ul className='px-5' style={{"listStyle": "none", "fontSize": "16px"}}>
                  <li>Tier 1</li>
                  <li>Tier 2</li>
                  <li>Whitelist</li>
                  <li>Special Editions</li>
                </ul>
              </Collapse>
            </li>
          </ul>
        </div>
      </div>

      <div className='n-navbar'>
          <a href="/" className='mx-5 n-logo-text'>Peezee</a>
          <p className='text-light open-m-menu mx-5' onClick={toggle_nav} style={{textAlign: "right"}}>&#9776;</p>

          <div className='d-flex justify-content-between w-100 nav-menu'>
            <div className='d-flex n-menu'>
              <div className="n-dropdown">
                <button className="n-dropbtn">Products</button>
                <div className="n-dropdown-content">
                  <a href="#">Link 1</a>
                  <a href="#">Link 2</a>
                  <a href="#">Link 1</a>
                  <a href="#">Link 2</a>
                  <a href="#">Link 3</a>
                  <a href="#">Link 1</a>
                  <a href="#">Link 2</a>
                  <a href="#">Link 3</a>
                  <a href="#">Link 3</a>
                </div>
              </div> 
              <div className="n-dropdown">
                <button className="n-dropbtn">Currencies</button>
                <div className="n-dropdown-content">
                  <a href="#">Link 1</a>
                  <a href="#">Link 2</a>
                  <a href="#">Link 3</a>
                  <a href="#">Link 1</a>
                  <a href="#">Link 2</a>
                  <a href="#">Link 3</a>
                </div>
              </div> 
              <div className="n-dropdown">
                <button className="n-dropbtn">Crypto Prices</button>
                <div className="n-dropdown-content">
                  <a href="#">Link 1</a>
                  <a href="#">Link 2</a>
                  <a href="#">Link 3</a>
                </div>
              </div> 
              {isAuthenticated ? (
                <Link to="sendMoney">Send Money</Link>
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
