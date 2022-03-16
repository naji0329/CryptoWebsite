import React, { Fragment, useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert';
import { sendMoney } from '../../actions/auth';

import PropTypes from 'prop-types';


import {
  Row, Col,  Form, Button
} from 'react-bootstrap';

const Send = ({
    auth: { user }, 
    sendMoney
}) => {
    const [formData, setFormData] = useState({
        sendTo: '',
        amount: '',
    });
    
    const { sendTo, amount } = formData;

    const onChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
        e.preventDefault();
        if (parseFloat(amount) > parseFloat(user.money) ) {
            alert("Insufficient funds.");
            setAlert('Insufficient funds.', 'danger');
        } else {
            sendMoney(sendTo, amount);
        }
    };

  return (
    <section id='sendMoney'>
        <Row className='my-5 p-5 n-container'>
            <Col lg="4" md="4" sm="4" xs="12"></Col>
            <Col lg="4" md="4" sm="4" xs="12" className='sendMoneyForm'>
                <h1>Send Money</h1>
                <p style={{textAlign: "right", fontSize: "13px"}}>Your Balance: {user.money}</p>
                <Form style={{"textAlign": "left"}} onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Send to:</Form.Label>
                        <Form.Control type="email" placeholder="Enter Email" 
                        name="sendTo"
                        value={sendTo}
                        onChange={onChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Amount:</Form.Label>
                        <Form.Control type="text" placeholder="Enter Amount" 
                        name="amount"
                        value={amount}
                        onChange={onChange} />
                    </Form.Group>
                    <div className='text-center'>
                        <Button variant="primary" type="submit">
                        Send Money
                        </Button>
                    </div>
                </Form>
            </Col>
            <Col lg="4" md="4" sm="4" xs="12"></Col>
        </Row>
    </section>
  );
};

Send.propTypes = {
    sendMoney: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, { sendMoney })(Send);
