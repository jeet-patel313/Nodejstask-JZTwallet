import User from '../models/User.js';
import pkg from 'bcryptjs';
import { sendRegisterEmail } from './sendRegisterEmail.js';

const { genSalt, hash } = pkg;


export const regAdmin = async (body) => {  
    //hash the password
    const salt = await genSalt(10);
    const hashedPassword = await hash(body.password, salt);

    //create a new user
    const user = new User({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        isAdmin: true
    });

    //saving user in DB
    try {
        const savedUser = await user.save();

        //sending signup email
        const registerEmail = sendRegisterEmail(body); 
        return savedUser;
    }
    catch (err) {
        return err;
    }
}