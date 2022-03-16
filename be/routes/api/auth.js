const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Verify = require('../../models/Verify');

// @route    GET api/auth
// @desc     Get user by token
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/auth/sendVerifyCode
// @desc     Send Verify Code to Phone number
// @access   Public
router.post('/sendVerifyCode',
async (req, res) => {
  try {

    const _toPhonenumber = req.body.phonenumber;
    const _toEmail = req.body.email;

    const code = Math.floor(100000 + Math.random() * (999999 - 100000));
    // Save code with rand
    const row = new Verify({
      email: _toEmail,
      comment: `Register Code ${code}`,
      phonenumber: _toPhonenumber,
      code: code
    });
    const verifyRow = await row.save();

    const mes = `Your verification code is ${code}`;

    // Send Code to phone number
    const accountSid = config.get('accountSid');
    const authToken = config.get('authToken');
    const client = require('twilio')(accountSid, authToken);
    if(_toPhonenumber) {
      client.messages
        .create({
          body: mes,
          from: '+13166009354',
          to: _toPhonenumber
        })
        .then(message => console.log(message.sid));
        
      const MessagingResponse = require('twilio').twiml.MessagingResponse;
      const twiml = new MessagingResponse();
      twiml.message('The Robots are coming! Head for the hills!');
      console.log(twiml.toString());
    }

    if(_toEmail) {
      // Send Code to Email
      var nodemailer = require('nodemailer');

      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'yehvensimon@gmail.com',
          pass: 'yehvensimonProject'
        }
      });

      var mailOptions = {
        from: 'yehvensimon@gmail.com',
        to: _toEmail,
        subject: mes,
        text: mes
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      console.log("Success to send Verify code");
    }

    console.log(code);
    res.status(200).json(verifyRow._id);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/auth/confirmVerifyCode
// @desc     Confirm Verify Code to Phone number
// @access   Public
router.post('/confirmVerifyCode',
async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body.code);
    const code = req.body.code;
    const _id = req.body.id;

    const data  = await Verify.findById(_id);
    console.log(data);
    if(data) {
      if (data.code == code) {
        console.log(data);
        return res.status(200).json("Success");
      }
      return res.status(400).json("Wrong Code");
    }
    return res.status(400).json("Wrong Code");

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post(
  '/',
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: '5 days' },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
