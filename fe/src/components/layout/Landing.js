import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { 
  Row, Col
} from 'react-bootstrap';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    // return <Navigate to="/dashboard" />;
  }

  return (
    <section className="landing">
      <div className='d-flex mt-5 p-3 align-items-center n-container'>
        <Col lg="6" md="6" sm="6" xs="12">
          <h1>The crypto destination of investors™.</h1>
          <p>Established in 2016, Bitbuy is Canada’s most secure and trusted platform for BTC, ETH and other Cryptocurrencies. Serving 350,000+ Canadians with over $4 Billion dollars traded.</p>
        </Col>
        <Col lg="6" md="6" sm="6" xs="12" className='text-align-right'>
          <img src='/img/bb-laptop-phone-40-94f206e0a7be75becc95e165a9a35f1e.png' className='w-100' alt='' />
        </Col>
      </div>

      <div className="n-bg-primary mt-5 pt-5 pb-5">
        <Row className='justify-content-center text-center n-container' >
          <Col className='text-light align-items-right'>
            <h2>350,000+</h2>
            <p>Canadians Served</p>
          </Col>
          <Col className='text-light text-left'>
            <h2>$4,000,000,000+</h2>
            <p>Cryptocurrency traded</p>
          </Col>
        </Row>
      </div>

      <div className='mt-5 mb-5 p-5 n-container text-center'>
        <h1>Canada’s secure and trusted platform</h1>
        <p>Buy and sell Bitcoin and a variety of the best cryptocurrencies with peace of mind.</p>
        <Row>
          <Col>
            <img src="/img/safe-icon402x.png" style={{"width": "150px"}} alt="" />
            <h3>Your Crypto Safe and Secure</h3>
            <p>99% of your crypto is kept secure in our Cold Storage, and covered by a comprehensive insurance policy.</p>
          </Col>
          <Col>
            <img src="/img/compliant-icon402x.png" style={{"width": "150px"}} alt="" />
            <h3>Compliant and Regulated</h3>
            <p>Approved by the Ontario Securities Commission as the first Canadian registered marketplace for crypto assets, and registered with FINTRAC as a money services business.</p>
          </Col>
          <Col>
            <img src="/img/fees-icon402x.png" style={{"width": "150px"}} alt="" />
            <h3>Transparent and Competitive</h3>
            <p>We don't hide our fees (like other platforms). We provide the best prices and transparent fee structure.</p>
          </Col>
        </Row>
      </div>
    </section>
  );
};

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);
