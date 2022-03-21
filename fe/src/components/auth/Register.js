import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link, Navigate } from 'react-router-dom';
import { setAlert } from '../../actions/alert';
import { register } from '../../actions/auth';
import PropTypes from 'prop-types';

import {
  Form, Button, Modal
} from 'react-bootstrap';

import api from '../../utils/api';

const Register = ({ setAlert, register, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phonenumber: '',
    password: '',
    password2: ''
  });
  const [modalShow, setModalShow] = useState(false);
  const [confirmCode, setConfirmCode] = useState("");
  const [randIndex, setRandIndex] = useState();
  const { name, email, phonenumber, password, password2 } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if ( password !== password2 ) { setAlert('Passwords do not match', 'danger'); return ; } 
    if ( password.length < 6 ) { setAlert('Please enter a password with 6 or more characters.', 'danger'); return ;  }


    try {
      // Check user exist
      const exi = await api.post('/users/checkEmailExist', {email: email});
      console.log(exi);


      setConfirmCode("");
      setModalShow(true);
      // Send Verificaiton Code with Randome Code
      const rand = await api.post('/auth/sendVerifyCode', {email: email, phonenumber: phonenumber});
      setRandIndex(rand.data);
      console.log(rand.data);

    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach((error) => setAlert(error.msg, 'danger'));
      }
    }
  };

  const confirmVerifyCode = async () => {
    console.log(`confrim verify code ${randIndex}, ${confirmCode}`);
    const res = await api.post('/auth/confirmVerifyCode', {id: randIndex, code: confirmCode});
    console.log(`confirm verify code result: ${res.data}`);

    if(res.data == "Success") {
      setModalShow(false);
      setAlert('Success to verify.', 'success');
      register({ name, email, password, phonenumber });
    }
    else {
      setAlert('Verification Code is not correct.', 'danger');
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <section className="container" id="register">
      <div className='mt-5 mb-5 sign-form-div' style={{"maxWidth": "400px", "width": "90%", "margin": "auto"}}>
        <img src='/img/lock.png' style={{"width": "200px"}} alt="" />
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
              onChange={onChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" 
              name="email"
              value={email}
              onChange={onChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Phone number</Form.Label>
            <Form.Control type="number" placeholder="Enter Phone Number" className="phonenumber_input"
              name="phonenumber"
              value={phonenumber}
              onChange={onChange} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" 
              name="password"
              value={password}
              onChange={onChange} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password Confirm</Form.Label>
            <Form.Control type="password" placeholder="Password Confirm" 
              name="password2"
              value={password2}
              onChange={onChange} required />
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
      
      <div className='n-modal' style={{"display": modalShow ? "flex" : "none"}}>
        <div className='n-modal-body'>
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Phone Verification
            </Modal.Title>
            <span style={{fontSize: "30px", "cursor": "porinter"}} onClick={() => setModalShow(false)}>&times;</span>
          </Modal.Header>
          <Modal.Body>
            <p>We sent verification code to your phone and your mail, Please input code to verify you.</p>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control type="text" placeholder="Enter Verification Code" 
                name="confirmCode"
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)} />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => { confirmVerifyCode(); }}>Confirm</Button>
          </Modal.Footer>
        </div>
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
