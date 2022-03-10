import React, { Fragment, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Row, Col, DropdownButton, Dropdown, Collapse
} from 'react-bootstrap';

const Footer = () => {
  return (
    <section id='footer'>
      <div className='n-bg-primary'>
        <Row className='n-container p-4 align-items-center'>
          <Col lg="6" sm="6" xs="12" className='text-light' style={{"font-size": "13px"}}>
            <p>Copyright © 2021 Bitbuy Technologies Inc. (version: 3.8.4)</p>
            <p>A division of First Ledger Corporation. 341-110 Cumberland St. Toronto, ON, Canada,</p>
            <p>FINTRAC Registered</p>
          </Col>
          <Col lg="6" sm="6" xs="12" className="text-right" style={{"text-align": "right"}}>
            <img src='/img/link.png' style={{"width": "30px"}} />
            <img src='/img/dis.png' style={{"width": "30px"}} />
            <img src='/img/twi.png' style={{"width": "30px"}} />
            <img src='/img/face.png' style={{"width": "28px"}} />
          </Col>
        </Row>
      </div>
    </section>
  );
};

export default connect()(Footer);
