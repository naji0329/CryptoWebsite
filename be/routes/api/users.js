const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');
const normalize = require('normalize-url');
const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Verify = require('../../models/Verify');

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  '/',
  check('name', 'Name is required').notEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check(
    'password',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, phonenumber } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );

      user = new User({
        name,
        email,
        avatar,
        phonenumber,
        password
      });

      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

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

// @route    POST api/users/checkEmailExist
// @desc     Check user exist
// @access   Public
router.post(
  '/checkEmailExist',
  check('email', 'Please include a valid email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exsit' }] });
      }

      return res
        .status(200)
        .json('User not found');

    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


// @route    POST api/users/sendMoney
// @desc     Send Money to User
// @access   Public
router.post(
  '/sendMoney',
  auth,
  // check('amount', 'Amount is required').notEmpty(),
  // check('sendTo', 'Please include a valid email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sendTo, amount } = req.body;
    // console.log(sendTo);
    // console.log(amount);

    try {
      let receiveUser = await User.findOne({ email: sendTo });
      let sendUser = await User.findOne({_id: req.user.id});

      if (!receiveUser) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User not found.' }] });
      }

      await User.findOneAndUpdate(
        { email: sendTo },
        { $set: {money: parseFloat(receiveUser.money) + parseFloat(amount)} },
        // { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      const resData = await User.findOneAndUpdate(
        { _id: req.user.id },
        { $set: {money: parseFloat(sendUser.money) - parseFloat(amount)} },
        // { new: true, upsert: true, setDefaultsOnInsert: true }
      );

      console.log(resData);

      res.status(200).json(resData);
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);


// @route    POST api/users/resetPassword
// @desc     Reset Password
// @access   Public
router.post(
  '/resetPassword',
  async (req, res) => {
    try {
      let { verifyID, email, password, passwordConfirm } = req.body;
      console.log(verifyID);

      if( password != passwordConfirm ) {
        return res.status(400).json({msg: "Confirm Password doesn't match."});
      }

      // GET email from verify table
      const verify = await Verify.findById(verifyID);
      console.log(verify.email);

      if( email != verify.email ) {
        return res.status(400).json({msg: "Email doesn't match."});
      }

      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);

      const to_user = await User.findOneAndUpdate({ email: email }, {$set:{password: password}});
     
      return res.status(200).json("Success");
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);



// @route    POST api/users/resetPassword
// @desc     Reset Password
// @access   Public
router.post(
  '/changePassword', auth,
  check(
    'newPassword',
    'Please enter a password with 6 or more characters'
  ).isLength({ min: 6 }),
  async (req, res) => {
    try {
      let { oldPassword, newPassword, newPassword2 } = req.body;
      
      console.log(req.user.id, oldPassword);

      const user = await User.findById(req.user.id);

      console.log(oldPassword, user.password);

      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Old Password is not Correct.' }] });
      }

      if( newPassword != newPassword2 ) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Confirm Password doesn't match." }] });
      }

      if ( newPassword.length < 6 ) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Please enter a password with 6 or more characters'}] });
      }

      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(newPassword, salt);

      const to_user = await User.findOneAndUpdate({ _id: req.user.id }, {$set:{password: password}});
     
      return res.status(200).json("Success");
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

// @route    POST api/users/resetPassword
// @desc     Reset Password
// @access   Public
router.post(
  '/changeProfile',
  async (req, res) => {
    try {
      const email = req.body.email;

      console.log(req.body);
      const to_user = await User.findOneAndUpdate(
        { email: email }, 
        {$set: req.body}
      );
     
      return res.status(200).json("Success");
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;
