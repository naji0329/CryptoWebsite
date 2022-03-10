import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

import {
  Form, Button
} from 'react-bootstrap';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phonenumber: '',
    password: '',
    password2: ''
  });

  const { name, email, phonenumber, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setAlert('Passwords do not match', 'danger');
    } else {
      register({ name, email, password, phonenumber });
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <section className="container">
      <div className='mt-5 mb-5 sign-form-div' style={{"maxWidth": "400px", "width": "90%", "margin": "auto"}}>
        <img src='/img/lock.png' style={{"width": "200px"}} />
        <h1 className="large">Secure Sign Up</h1>
        <p className="lead">
          <i className="fas fa-user" /> Create Your Account
        </p>
        <Form style={{"textAlign": "left"}} onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Enter name" 
              name="name"
              value={name}
              onChange={onChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" 
              name="email"
              value={email}
              onChange={onChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Phone number</Form.Label>
            <Form.Control type="text" placeholder="Enter Phone Number" 
              name="phonenumber"
              value={phonenumber}
              onChange={onChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" 
              name="password"
              value={password}
              onChange={onChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password Confirm</Form.Label>
            <Form.Control type="password" placeholder="Password Confirm" 
              name="password2"
              value={password2}
              onChange={onChange} />
          </Form.Group>
          <div className='text-center'>
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </div>
        </Form>

        <p className="my-1">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </section>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { setAlert, register })(Register);
