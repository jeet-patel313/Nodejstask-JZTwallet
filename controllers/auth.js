import pkgtoken from 'jsonwebtoken';
import pkg from 'bcryptjs';
import { registerValidation, loginValidation } from '../validation.js';
import { regUser } from '../services/registerUser.js';
import { checkUser } from '../services/checkUser.js';
import { regAdmin } from '../services/registerAdmin.js';
import { loginUsers } from '../services/login.js';

const { sign } = pkgtoken;
const { compare } = pkg;

//register user
export const registerUser = async (req, res) => {
  //validation before user creation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  
  //check if user already exists or not
  const emailExist = await checkUser(req.body.email);
  if (emailExist) return res.status(400).send('Email already exists');

  //if user does not already exists in DB create one
  const newUser = await regUser(req.body);

  return res.status(200).send(newUser);
}

//register admin user
export const registerAdmin = async (req, res) => {
  //validation before user creation
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if user already exists or not
  const emailExist = await checkUser(req.body.email);
  if (emailExist) return res.status(400).send('Email already exists');

  //if user does not already exists in DB create one
  const newUser = await regAdmin(req.body);

  return res.status(200).send(newUser);
}

//login user
export const loginUser = async (req, res) => {
  //validation before user creation
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const user = await checkUser(req.body.email);

  //checking if the email exists in the DB
  if (!user) return res.status(400).send('Email or password is incorrect!');

  //password is correct
  const validPass = await compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send('Invalid Password');

  const token = await loginUsers(user);
  res.header('auth-token', token).send(token);
}