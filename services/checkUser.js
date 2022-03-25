import User from '../models/User.js';

export const checkUser = async (email, req, res) => {
    const checkUser = await User.findOne({ email: email });
    return checkUser;
}