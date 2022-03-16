import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { loadUser } from '../../actions/auth';

import { Row, Col, Form, Button } from 'react-bootstrap';

import api from '../../utils/api';

import store from '../../store';

const Profile = ({
  loadUser,
  auth: { user },
  profile: { profile }
}) => {
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState('');
  const [phonenumber, setPhoneNumber] = useState(user.phonenumber);

  const [passFormData, setPassFormData] = useState({
    oldPassword: '',
    newPassword: '',
    newPassword2: ''
  })
  
  const { oldPassword, newPassword, newPassword2 } = passFormData;

  const onChangePassword = (e) =>
  setPassFormData({ ...passFormData, [e.target.name]: e.target.value });

  const onChangeProfile = async (e) => {
    e.preventDefault();
    const data = {
      email: user.email,
      name: name,
      phonenumber: phonenumber
    };

    const res = await api.post('/users/changeProfile', data);
    console.log(`Change Password result: ${res.data}`);

    if(res.data == "Success") {
      loadUser();
      store.dispatch(setAlert('Success to Change Profile.', 'success'));
    }
    else {
      store.dispatch(setAlert('Something wrong.', 'danger'));
    }

  };

  const onSaveChangePassword = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post('/users/changePassword', passFormData);
      console.log(`Change Password result: ${res.data}`);
  
      if(res.data == "Success") {
        store.dispatch(setAlert("Success to Change Password.", 'success'));
      }
      else {
        console.log(res);
        store.dispatch(setAlert('Something wrong.', 'danger'));
      }

    } catch (err) {
      const errors = err.response.data.errors;
  
      if (errors) {
        errors.forEach((error) => store.dispatch(setAlert(error.msg, 'danger')));
      }
  
    }


  }

  return (
    <section className="container">
      <div className='n-container p-5'>
        <h1 className="large text-primary">Profile</h1>
        <p className="lead">
          <i className="fas fa-user" /> Welcome {user && user.name}
        </p>
        <Row className="my-5">
          <Col sm="6" xs="12">
            <h2>Edit your Profile</h2>
            
            <Form style={{"textAlign": "left"}} onSubmit={onChangeProfile}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter name" 
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Phone number</Form.Label>
                <Form.Control type="number" placeholder="Enter Phone Number"  className="phonenumber_input"
                  name="phonenumber"
                  value={phonenumber}
                  onChange={(e) => setPhoneNumber(e.target.value)} required />
              </Form.Group>
              <div className='text-center'>
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </div>
            </Form>

          </Col>
          <Col sm="6"  xs="12">
            <h2>Change your Password</h2>
            <Form style={{"textAlign": "left"}} onSubmit={onSaveChangePassword}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Old Password:</Form.Label>
                <Form.Control type="password" placeholder="Enter Old Password" 
                  name="oldPassword"
                  value={oldPassword}
                  onChange={onChangePassword} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" placeholder="Enter New Passsword" 
                  name="newPassword"
                  value={newPassword}
                  onChange={onChangePassword} required />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>New Password confirm</Form.Label>
                <Form.Control type="password" placeholder="Enter New Password Confirm" 
                  name="newPassword2"
                  value={newPassword2}
                  onChange={onChangePassword} required />
              </Form.Group>
              <div className='text-center'>
                <Button variant="primary" type="submit">
                  Save
                </Button>
              </div>
            </Form>
          </Col>

        </Row>
      </div>
    </section>
  );
};

Profile.propTypes = {
  loadUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
});

export default connect(mapStateToProps, { loadUser })(
  Profile
);
