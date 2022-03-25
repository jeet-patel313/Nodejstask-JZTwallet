import pkgtoken from 'jsonwebtoken';
import pkg from 'bcryptjs';

const { sign } = pkgtoken;
const { compare } = pkg;

export const loginUsers = async user => {
   
    
    
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
    return token;
}