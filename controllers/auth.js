import User from '../models/User.js';
import pkgtoken from 'jsonwebtoken';
import pkg from 'bcryptjs';
import { registerValidation, loginValidation } from '../validation.js';
import { createTransport, getTestMessageUrl } from 'nodemailer';

const { sign } = pkgtoken;
const { genSalt, hash, compare } = pkg;

//register user
export async function registerUser(req, res) {
  //validation before user creation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if user is already in the DB
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');

  //hash the password
  const salt = await genSalt(10);
  const hashedPassword = await hash(req.body.password, salt);

  //create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    //nodemailer register email
    try {
      // create reusable transporter object using the default SMTP transport
      let transporter = createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER, // generated ethereal user
          pass: process.env.GMAIL_PASS, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"JZTwallet" <idjot911@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'Confirm your JZTwallet', // Subject line
        text: 'You have signed up for JZTwallet, Kindly confirm your account', // plain text body
        html: `
            <h2>Hello ${req.body.name}, 
            <h3>You have successfully signed up for JZTwallet from ${req.body.email}</h3>
            <h3>You have a signup bonus of $100 in your current JZTwallet.</h3>
            Use JZTwallet for more rewards!!
            `, // html body
      });

      console.log('Message sent: %s', info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log('Preview URL: %s', getTestMessageUrl(info));
    } catch (e) {
      console.log(e);
    }
    //nodemailer register email
    res.send(savedUser);
    //    res.send({user: user._id});
  } catch (err) {
    res.status(400).send(err);
  }
}

//register admin user
export async function registerAdmin(req, res) {
  //validation before user creation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //checking if user is already in the DB
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send('Email already exists');

  //hash the password
  const salt = await genSalt(10);
  const hashedPassword = await hash(req.body.password, salt);

  //create a new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    isAdmin: true,
  });
  try {
    const savedUser = await user.save();
    //sendmail
    try {
      let transporter = createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER, // generated ethereal user
          pass: process.env.GMAIL_PASS, // generated ethereal password
        },
      });

      let info = await transporter.sendMail({
        from: '"JZTwallet" <idjot911@gmail.com>', // sender address
        to: req.body.email, // list of receivers
        subject: 'Confirm your JZTwallet', // Subject line
        text: 'You have signed up for JZTwallet, Kindly confirm your account', // plain text body
        html: `
            <h2>Hello ${req.body.name}, 
            <h3>You have successfully signed up for JZTwallet from ${req.body.email}</h3>
            <h3>You have a signup bonus of $100 in your current JZTwallet.</h3>
            Use JZTwallet for more rewards!!
            `, // html body
      });

      console.log('Message sent: %s', info.messageId);

      console.log('Preview URL: %s', getTestMessageUrl(info));
    } catch (e) {
      console.log(e);
    }

    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
}

//login user
export async function loginUser(req, res) {
  //validation before user creation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await User.findOne({ email: req.body.email });

  //checking if the email exists in the DB
  if (!user) return res.status(400).send('Email or password is incorrect!');
  //password is correct
  const validPass = await compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid Password');

  //create and assign a token with half hour expiration time
  const token = sign(
    {
      _id: user._id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.TOKEN_SECRET,
    {
      expiresIn: '0.5h',
    }
  );
  res.header('auth-token', token).send(token);
}