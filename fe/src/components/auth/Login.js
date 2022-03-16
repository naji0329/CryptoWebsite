import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { login } from '../../actions/auth';

import {
  Form, Button
} from 'react-bootstrap';

const Login = ({ login, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const { email, password } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <section className="container">
      <div className='mt-5 mb-5 sign-form-div' style={{"maxWidth": "400px", "width": "90%", "margin": "auto"}}>
        <img src='/img/lock.png' style={{"width": "200px"}} />
        <h1 className="large">Secure Sign In</h1>
        <p className="lead">
          <i className="fas fa-user" /> Sign Into Your Account
        </p>
        <Form style={{"textAlign": "left"}} onSubmit={onSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" 
              name="email"
              value={email}
              onChange={onChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" 
              name="password"
              value={password}
              onChange={onChange} />
          </Form.Group>
          <div className='text-center'>
            <Button variant="primary" type="submit">
              Sign In
            </Button>
          </div>
        </Form>

        <p className="my-1">
          Don't have an account? <Link to="/register"style={{color: "blue", "cursor": "pointer"}} > Sign Up</Link>
        </p>
        <p className="my-1">
          Did you forgot Password? <Link to="/forgot"style={{color: "blue", "cursor": "pointer"}} > Reset Password</Link>
        </p>
      </div>
    </section>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { login })(Login);
