import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { setAlert } from '../../actions/alert';

import {
  Form, Button
} from 'react-bootstrap';
import api from '../../utils/api';

const Forgot = ({ isAuthenticated }) => {

  const navigate = useNavigate();
  const [confirmEmail, setEmail] = useState();
  const [step, setStep] = useState(1);
  const [confirmCode, setConfirmCode] = useState("");
  const [randIndex, setRandIndex] = useState();

  const [formData, setFormData] = useState({
    email: confirmEmail,
    password: '',
    password2: ''
  });

  const { email,  password, password2 } = formData;
  

  if (isAuthenticated) {
    navigate('/');
  }

  const onSendVerifyCode = async (e) => {
    e.preventDefault();
    setConfirmCode("");
    // Send Verificaiton Code with Randome Code
    const rand = await api.post('/auth/sendVerifyCode', {email: confirmEmail});
    setRandIndex(rand.data);

    setStep(2);
  }

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onConfirmVerifyCode = async (e) => {
    e.preventDefault();
    console.log(`confrim verify code ${randIndex}, ${confirmCode}`);
    const res = await api.post('/auth/confirmVerifyCode', {id: randIndex, code: confirmCode});
    console.log(`confirm verify code result: ${res.data}`);

    if(res.data == "Success") {
      setAlert('Success to verify.', 'success');
      setFormData({ ...formData, ['email']: confirmEmail });
      setStep(3);
    }
    else {
      setAlert('Verification Code is not correct.', 'danger');
    }    
  }

  const onResetPassword = async (e) => {
    e.preventDefault();
    console.log(formData);
    if ( password !== password2 ) { setAlert('Passwords do not match', 'danger'); return ; } 
    if ( password.length < 6 ) { setAlert('Please enter a password with 6 or more characters.', 'danger'); return ;  }

    const res = await api.post('/users/resetPassword', 
      {verifyID: randIndex, email: email, password: password, passwordConfirm: password2});
    console.log(`Change Password result: ${res.data}`);

    if(res.data == "Success") {
      setAlert('Success to Change Password.', 'success');
      navigate('/login');
    }
    else {
      setAlert('Something wrong.', 'danger');
    }
  }

  const sendVerifyCode = (
    <>
      <h1 className="large">Forgot Password</h1>
      <p className="">
        <i className="fas fa-user" /> Enter the email for your account and we’ll send you a link to reset your password. 
      </p>
      <Form style={{"textAlign": "left"}} className="mt-3" onSubmit={onSendVerifyCode}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control type="email" placeholder="Enter email" 
            name="confirmEmail"
            value={confirmEmail}
            onChange={(e) => setEmail(e.target.value) } />
        </Form.Group>
        <div className='text-center'>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </>
  )

  const confirmVerifyCode = (
    <>
      <h1 className="large">Confirm Verify Code</h1>
      <p className="">
        <i className="fas fa-user" /> Enter the verify code.
      </p>
      <Form style={{"textAlign": "left"}} className="mt-3" onSubmit={onConfirmVerifyCode}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control type="text" placeholder="Enter Verification Code" 
            name="confirmCode"
            value={confirmCode}
            onChange={(e) => setConfirmCode(e.target.value) } />
        </Form.Group>
        <div className='text-center'>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </>
  )

  const resetPassword = (
    <>
      <h1 className="large">Reset Password</h1>
      <p className="">
        <i className="fas fa-user" /> Enter the new password 
      </p>
      <Form style={{"textAlign": "left"}} className="mt-3" onSubmit={onResetPassword}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
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
        </Form.Group>
        <div className='text-center'>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    </>
  )


  return (
    <section className="container py-5">
      <div className='mt-5 mb-5 sign-form-div' style={{"maxWidth": "400px", "width": "90%", "margin": "auto"}}>
        <img src='/img/lock.png' style={{"width": "200px"}} />
        { step == "1" ? sendVerifyCode : "" }
        { step == "2" ? confirmVerifyCode : "" }
        { step == "3" ? resetPassword : "" }
      </div>
    </section>
  );
};

Forgot.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, { })(Forgot);
